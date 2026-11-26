// Counts reps with the phone camera. Everything happens on the phone: the picture is never saved or sent.
// A pose model (MediaPipe, loaded only when a camera challenge starts) finds 33 body points in each frame.
// Each exercise turns those points into one angle, and a rep counts each time the angle goes from the
// start position to the end position and back. Going only halfway does not count.

const MP_VER = '0.10.14';
const MP_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VER}`;
const MODEL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

// Lines between body points, for the skeleton drawn over the camera.
export const BONES = [[11, 12], [11, 13], [13, 15], [12, 14], [14, 16], [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [24, 26], [26, 28]];
const SIDE = { l: { s: 11, e: 13, w: 15, h: 23, k: 25, a: 27 }, r: { s: 12, e: 14, w: 16, h: 24, k: 26, a: 28 } };

const vis = (lm, i) => (lm[i] ? lm[i].visibility ?? 1 : 0);
// Angle at point b, in degrees. ar = width / height of the picture, so angles are not squashed.
function angle(lm, a, b, c, ar) {
  const ax = (lm[a].x - lm[b].x) * ar, ay = lm[a].y - lm[b].y, cx = (lm[c].x - lm[b].x) * ar, cy = lm[c].y - lm[b].y;
  let d = Math.abs((Math.atan2(ay, ax) - Math.atan2(cy, cx)) * 180 / Math.PI);
  return d > 180 ? 360 - d : d;
}
// How steep the line from a to b is: 0 = flat on the floor, 90 = straight up.
function tilt(lm, a, b, ar) { return Math.atan2(Math.abs(lm[b].y - lm[a].y), Math.abs(lm[b].x - lm[a].x) * ar) * 180 / Math.PI; }
const seen = (lm, J, keys, min = 0.5) => keys.every((k) => vis(lm, J[k]) >= min);
// The side of the body the camera sees best (from the side, one arm or leg hides the other).
function best(lm, keys) {
  const sum = (J) => keys.reduce((s, k) => s + vis(lm, J[k]), 0);
  return sum(SIDE.l) >= sum(SIDE.r) ? SIDE.l : SIDE.r;
}
// Both sides that are visible (seen from the front, average them).
const both = (lm, keys) => [SIDE.l, SIDE.r].filter((J) => seen(lm, J, keys));
const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

// One rule per kind of movement. read() gives v (the angle that moves), ok (body in position) and a hint.
// start(v): top or rest position. mid(v): the end of the rep. part(v): moved, but not far enough.
const elbowSide = (extra) => (lm, ar) => {
  const J = best(lm, ['s', 'e', 'w', 'h']);
  if (!seen(lm, J, ['s', 'e', 'w'])) return null;
  return { v: angle(lm, J.s, J.e, J.w, ar), ...(extra ? extra(lm, J, ar) : { ok: true }) };
};
const RULES = {
  // Push-ups: elbow bends below 100 and straightens past 150, body roughly flat.
  pushup: {
    view: 'side', half: 'hDeeper',
    read: elbowSide((lm, J, ar) => {
      if (!seen(lm, J, ['h'], 0.4)) return { ok: false, hint: 'hWhole' };
      const flat = tilt(lm, J.s, J.h, ar) < 45;
      const line = vis(lm, J.a) > 0.4 ? angle(lm, J.s, J.h, J.a, ar) : 180;
      return { ok: flat, hint: !flat ? 'hPushPos' : line < 140 ? 'hHips' : null };
    }),
    start: (v) => v > 148, mid: (v) => v < 100, part: (v) => v < 132,
  },
  // Pike push-ups: same elbow, hips up high.
  pike: {
    view: 'side', half: 'hDeeper',
    read: elbowSide((lm, J) => ({ ok: lm[J.h].y < lm[J.s].y + 0.02, hint: lm[J.h].y < lm[J.s].y + 0.02 ? null : 'hHipsUp' })),
    start: (v) => v > 145, mid: (v) => v < 105, part: (v) => v < 130,
  },
  // Dips: elbows to 90 and back up.
  dip: { view: 'side', half: 'hDeeper', read: elbowSide(), start: (v) => v > 148, mid: (v) => v < 102, part: (v) => v < 130 },
  // Squats: knee below about 105 degrees (thighs close to parallel) and back to standing.
  squat: {
    view: 'side', half: 'hDeeper',
    read(lm, ar) {
      const J = best(lm, ['h', 'k', 'a']);
      if (!seen(lm, J, ['h', 'k', 'a'])) return null;
      return { v: angle(lm, J.h, J.k, J.a, ar), ok: true };
    },
    start: (v) => v > 158, mid: (v) => v < 108, part: (v) => v < 140,
  },
  // Lunges: the more bent knee of the two.
  lunge: {
    view: 'side', half: 'hDeeper',
    read(lm, ar) {
      const sides = both(lm, ['h', 'k', 'a']);
      if (!sides.length) return null;
      return { v: Math.min(...sides.map((J) => angle(lm, J.h, J.k, J.a, ar))), ok: true };
    },
    start: (v) => v > 152, mid: (v) => v < 112, part: (v) => v < 138,
  },
  // Crunches: shoulders lift off the floor (the shoulder-hip line rises).
  crunch: {
    view: 'side', half: 'hHigher',
    read(lm, ar) {
      const J = best(lm, ['s', 'h']);
      if (!seen(lm, J, ['s', 'h'])) return null;
      return { v: tilt(lm, J.h, J.s, ar), ok: true };
    },
    start: (v) => v < 12, mid: (v) => v > 25, part: (v) => v > 17,
  },
  // Glute bridge: hips go up until the body is straight from shoulders to knees.
  bridge: {
    view: 'side', half: 'hHigher',
    read(lm, ar) {
      const J = best(lm, ['s', 'h', 'k']);
      if (!seen(lm, J, ['s', 'h', 'k'])) return null;
      return { v: angle(lm, J.s, J.h, J.k, ar), ok: true };
    },
    start: (v) => v < 150, mid: (v) => v > 166, part: (v) => v > 157,
  },
  // Leg raises (lying or hanging): legs come up toward the body.
  legraise: {
    view: 'side', half: 'hHigher',
    read(lm, ar) {
      const J = best(lm, ['s', 'h', 'k']);
      if (!seen(lm, J, ['s', 'h', 'k'])) return null;
      return { v: angle(lm, J.s, J.h, J.k, ar), ok: true };
    },
    start: (v) => v > 150, mid: (v) => v < 112, part: (v) => v < 132,
  },
  // Pull-ups and chin-ups (from the front): nose over the hands, then arms straight again.
  pullup: {
    view: 'front', half: 'hHigher',
    read(lm, ar) {
      const sides = both(lm, ['s', 'e', 'w']);
      if (!sides.length || vis(lm, 0) < 0.5) return null;
      const el = avg(sides.map((J) => angle(lm, J.s, J.e, J.w, ar)));
      // Up = the nose reaches the height of the hands (the chin is then over the bar).
      const up = lm[0].y < avg(sides.map((J) => lm[J.w].y)) + 0.015;
      return { v: el, up, ok: true };
    },
    phase: (m) => (m.up ? 'mid' : m.v > 145 ? 'start' : m.v < 125 ? 'part' : null),
  },
  // Curls (from the side): the elbow closes until the weight reaches the shoulder.
  curl: { view: 'side', half: 'hHigher', read: elbowSide(), start: (v) => v > 140, mid: (v) => v < 72, part: (v) => v < 110 },
  // Shoulder press (from the front): hands over the head with straight arms, back down to the shoulders.
  press: {
    view: 'front', half: 'hHigher',
    read(lm, ar) {
      const sides = both(lm, ['s', 'e', 'w']);
      if (!sides.length || vis(lm, 0) < 0.5) return null;
      const el = avg(sides.map((J) => angle(lm, J.s, J.e, J.w, ar)));
      const over = avg(sides.map((J) => lm[J.w].y)) < lm[0].y;
      return { v: el, over, ok: true };
    },
    phase: (m) => (m.over && m.v > 150 ? 'mid' : m.v < 105 ? 'start' : m.over || m.v > 128 ? 'part' : null),
  },
  // Lateral raises (from the front): arms up to shoulder height.
  raise: {
    view: 'front', half: 'hHigher',
    read(lm, ar) {
      const sides = both(lm, ['h', 's', 'e']);
      if (!sides.length) return null;
      return { v: avg(sides.map((J) => angle(lm, J.h, J.s, J.e, ar))), ok: true };
    },
    start: (v) => v < 32, mid: (v) => v > 72, part: (v) => v > 50,
  },
  // Bench press, incline press and skull crushers (lying, seen from the side): the elbow bends and straightens.
  bench: { view: 'side', half: 'hDeeper', read: elbowSide(), start: (v) => v > 150, mid: (v) => v < 100, part: (v) => v < 130 },
  // Deadlifts: the hips fold (shoulder-hip-knee closes) and open again until standing tall.
  hinge: {
    view: 'side', half: 'hDeeper',
    read(lm, ar) {
      const J = best(lm, ['s', 'h', 'k']);
      if (!seen(lm, J, ['s', 'h', 'k'])) return null;
      return { v: angle(lm, J.s, J.h, J.k, ar), ok: true };
    },
    start: (v) => v > 155, mid: (v) => v < 115, part: (v) => v < 138,
  },
  // Bent-over row: torso leaning forward, the elbow pulls the weight to the body.
  row: {
    view: 'side', half: 'hHigher',
    read: elbowSide((lm, J, ar) => { const bent = tilt(lm, J.h, J.s, ar) < 55; return { ok: bent, hint: bent ? null : 'hBendOver' }; }),
    start: (v) => v > 145, mid: (v) => v < 100, part: (v) => v < 125,
  },
  // Seated cable row: the same pull, sitting up.
  pull: { view: 'side', half: 'hHigher', read: elbowSide(), start: (v) => v > 145, mid: (v) => v < 100, part: (v) => v < 125 },
  // Triceps pushdown: starts bent, ends with the arm straight.
  pushdown: { view: 'side', half: 'hFull', read: elbowSide(), start: (v) => v < 112, mid: (v) => v > 155, part: (v) => v > 135 },
  // Leg press: knees come toward the chest and push back out.
  legpress: {
    view: 'side', half: 'hDeeper',
    read(lm, ar) {
      const J = best(lm, ['h', 'k', 'a']);
      if (!seen(lm, J, ['h', 'k', 'a'])) return null;
      return { v: angle(lm, J.h, J.k, J.a, ar), ok: true };
    },
    start: (v) => v > 148, mid: (v) => v < 100, part: (v) => v < 128,
  },
  // Leg extension (seated): from bent knees to straight legs.
  legext: {
    view: 'side', half: 'hFull',
    read(lm, ar) {
      const J = best(lm, ['h', 'k', 'a']);
      if (!seen(lm, J, ['h', 'k', 'a'])) return null;
      return { v: angle(lm, J.h, J.k, J.a, ar), ok: true };
    },
    start: (v) => v < 105, mid: (v) => v > 155, part: (v) => v > 135,
  },
  // Lat pulldown (from the front): the bar comes down past the chin and goes back up with straight arms.
  pulldown: {
    view: 'front', half: 'hDeeper',
    read(lm, ar) {
      const sides = both(lm, ['s', 'e', 'w']);
      if (!sides.length || vis(lm, 0) < 0.5) return null;
      const el = avg(sides.map((J) => angle(lm, J.s, J.e, J.w, ar)));
      const wy = avg(sides.map((J) => lm[J.w].y));
      return { v: el, down: wy > lm[0].y + 0.02, up: wy < lm[0].y - 0.05, ok: true };
    },
    phase: (m) => (m.down && m.v < 110 ? 'mid' : m.up && m.v > 140 ? 'start' : m.v < 125 ? 'part' : null),
  },
  // Planks: time only counts while the body stays straight and close to the floor.
  plank: {
    view: 'side', hold: true,
    read(lm, ar) {
      const J = best(lm, ['s', 'h', 'a']);
      if (!seen(lm, J, ['s', 'h'])) return null;
      if (vis(lm, J.a) < 0.35) return { v: 0, ok: false, hint: 'hWhole' };
      const line = angle(lm, J.s, J.h, J.a, ar), low = tilt(lm, J.s, J.a, ar) < 40;
      return { v: line, ok: low && line > 148, hint: !low ? 'hPlankPos' : line <= 148 ? 'hHips' : null };
    },
  },
};

// Camera challenges. mode: 'time' = most reps in secs, 'max' = most reps without stopping, 'hold' = longest hold.
// w: true when both people should use the same weight (it is shown next to the score).
export const CHALLENGES = [
  { id: 'pu60', ex: 'push-up', rule: 'pushup', mode: 'time', secs: 60, place: 'home' },
  { id: 'pumax', ex: 'push-up', rule: 'pushup', mode: 'max', place: 'home' },
  { id: 'sq60', ex: 'bw-squat', rule: 'squat', mode: 'time', secs: 60, place: 'home' },
  { id: 'lu60', ex: 'lunge', rule: 'lunge', mode: 'time', secs: 60, place: 'home' },
  { id: 'cr60', ex: 'crunch', rule: 'crunch', mode: 'time', secs: 60, place: 'home' },
  { id: 'gb60', ex: 'glute-bridge', rule: 'bridge', mode: 'time', secs: 60, place: 'home' },
  { id: 'dimax', ex: 'diamond-push-up', rule: 'pushup', mode: 'max', place: 'home' },
  { id: 'pkmax', ex: 'pike-push-up', rule: 'pike', mode: 'max', place: 'home' },
  { id: 'cdmax', ex: 'chair-dip', rule: 'dip', mode: 'max', place: 'home' },
  { id: 'lrmax', ex: 'leg-raise', rule: 'legraise', mode: 'max', place: 'home' },
  { id: 'plank', ex: 'plank', rule: 'plank', mode: 'hold', place: 'home' },
  // heavy: barbell lifts where the sheet reminds to use safeties or a spotter.
  { id: 'bp', ex: 'bench-press', rule: 'bench', mode: 'max', place: 'gym', w: true, heavy: true },
  { id: 'sqb', ex: 'squat', rule: 'squat', mode: 'max', place: 'gym', w: true, heavy: true },
  { id: 'dl', ex: 'deadlift', rule: 'hinge', mode: 'max', place: 'gym', w: true, heavy: true },
  { id: 'pull', ex: 'pull-up', rule: 'pullup', mode: 'max', place: 'gym' },
  { id: 'chin', ex: 'chin-up', rule: 'pullup', mode: 'max', place: 'gym' },
  { id: 'dip', ex: 'parallel-dip', rule: 'dip', mode: 'max', place: 'gym' },
  { id: 'ibp', ex: 'incline-bench-press', rule: 'bench', mode: 'max', place: 'gym', w: true, heavy: true },
  { id: 'ohp', ex: 'overhead-press', rule: 'press', mode: 'max', place: 'gym', w: true },
  { id: 'row60', ex: 'barbell-row', rule: 'row', mode: 'time', secs: 60, place: 'gym', w: true },
  { id: 'lpd60', ex: 'lat-pulldown', rule: 'pulldown', mode: 'time', secs: 60, place: 'gym', w: true },
  { id: 'crow60', ex: 'cable-row', rule: 'pull', mode: 'time', secs: 60, place: 'gym', w: true },
  { id: 'lp', ex: 'leg-press', rule: 'legpress', mode: 'max', place: 'gym', w: true },
  { id: 'ht', ex: 'hip-thrust', rule: 'bridge', mode: 'max', place: 'gym', w: true },
  { id: 'rdl60', ex: 'romanian-deadlift', rule: 'hinge', mode: 'time', secs: 60, place: 'gym', w: true },
  { id: 'bss60', ex: 'bulgarian-split-squat', rule: 'lunge', mode: 'time', secs: 60, place: 'gym', w: true },
  { id: 'gs60', ex: 'goblet-squat', rule: 'squat', mode: 'time', secs: 60, place: 'gym', w: true },
  { id: 'cu60', ex: 'barbell-curl', rule: 'curl', mode: 'time', secs: 60, place: 'gym', w: true },
  { id: 'sp60', ex: 'db-shoulder-press', rule: 'press', mode: 'time', secs: 60, place: 'gym', w: true },
  { id: 'lat60', ex: 'lateral-raise', rule: 'raise', mode: 'time', secs: 60, place: 'gym', w: true },
  { id: 'tp60', ex: 'triceps-pushdown', rule: 'pushdown', mode: 'time', secs: 60, place: 'gym', w: true },
  { id: 'sk60', ex: 'skull-crusher', rule: 'bench', mode: 'time', secs: 60, place: 'gym', w: true },
  { id: 'le60', ex: 'leg-extension', rule: 'legext', mode: 'time', secs: 60, place: 'gym', w: true },
  { id: 'hlr', ex: 'hanging-leg-raise', rule: 'legraise', mode: 'max', place: 'gym' },
];
export const challengeById = (id) => CHALLENGES.find((c) => c.id === id);
export const ruleOf = (c) => RULES[c.rule];

// Turns a stream of body points into a count. update() is called for every camera frame.
export class Counter {
  constructor(rule) { this.rule = rule; this.reset(); this.ready = false; this.ema = null; }
  reset() { this.n = 0; this.deep = false; this.down = false; }
  update(lm, ar) {
    const r = this.rule, m = lm ? r.read(lm, ar) : null;
    if (!m) { this.ema = null; return { seen: false, n: this.n }; }
    // Light smoothing: the pose model already smooths the points between frames.
    this.ema = this.ema == null ? m.v : this.ema * 0.3 + m.v * 0.7;
    const out = { seen: true, ok: m.ok, hint: m.hint || null, n: this.n, v: this.ema, ev: null };
    if (r.hold || !m.ok) return out;
    const ph = r.phase ? r.phase({ ...m, v: this.ema }) : r.start(this.ema) ? 'start' : r.mid(this.ema) ? 'mid' : r.part(this.ema) ? 'part' : null;
    if (ph === 'start') {
      if (this.ready && this.deep) { this.n++; out.ev = 'rep'; } else if (this.ready && this.down) out.ev = 'half';
      this.deep = false; this.down = false; this.ready = true;
    } else if (this.ready && ph === 'mid') this.deep = true;
    else if (this.ready && ph === 'part') this.down = true;
    out.n = this.n;
    out.ready = this.ready;
    out.ph = ph;
    return out;
  }
}

// ---------- The pose model ----------
let landmarker = null, loading = null;
export function loadPose() {
  if (landmarker) return Promise.resolve(landmarker);
  if (!loading) {
    loading = (async () => {
      const { FilesetResolver, PoseLandmarker } = await import(`${MP_BASE}/vision_bundle.mjs`);
      const files = await FilesetResolver.forVisionTasks(`${MP_BASE}/wasm`);
      const make = (delegate) => PoseLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: MODEL, delegate }, runningMode: 'VIDEO', numPoses: 1,
        minPoseDetectionConfidence: 0.5, minPosePresenceConfidence: 0.5, minTrackingConfidence: 0.5,
      });
      try { landmarker = await make('GPU'); } catch (e) { landmarker = await make('CPU'); }
      return landmarker;
    })();
    loading.catch(() => { loading = null; });
  }
  return loading;
}
let lastTs = 0;
export function detect(video) {
  if (!landmarker || !video.videoWidth) return null;
  const ts = Math.max(lastTs + 1, performance.now());
  lastTs = ts;
  const res = landmarker.detectForVideo(video, ts);
  return res && res.landmarks && res.landmarks[0] ? res.landmarks[0] : null;
}

// ---------- Camera ----------
export async function openCamera(video, facing = 'user') {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('nocam');
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
  video.srcObject = stream;
  video.muted = true;
  video.playsInline = true;
  await video.play();
  return stream;
}
export function stopCamera(stream) { try { if (stream) stream.getTracks().forEach((tr) => tr.stop()); } catch (e) { /* already stopped */ } }

// Skeleton over the camera picture: bones in white, joints in red; faded when the body is not in position.
export function drawPose(cv, lm, good) {
  const g = cv.getContext('2d');
  g.clearRect(0, 0, cv.width, cv.height);
  drawPoseOn(g, lm, cv.width, cv.height, good);
}
// The same skeleton on any canvas (also used for the recorded video).
export function drawPoseOn(g, lm, w, h, good) {
  if (!lm) return;
  g.lineWidth = Math.max(3, w / 160);
  g.lineCap = 'round';
  g.strokeStyle = good ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.35)';
  for (const [a, b] of BONES) {
    if (vis(lm, a) < 0.4 || vis(lm, b) < 0.4) continue;
    g.beginPath(); g.moveTo(lm[a].x * w, lm[a].y * h); g.lineTo(lm[b].x * w, lm[b].y * h); g.stroke();
  }
  g.fillStyle = good ? '#E2463B' : 'rgba(226,70,59,.4)';
  for (const i of [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]) {
    if (vis(lm, i) < 0.4) continue;
    g.beginPath(); g.arc(lm[i].x * w, lm[i].y * h, Math.max(4, w / 110), 0, Math.PI * 2); g.fill();
  }
}
