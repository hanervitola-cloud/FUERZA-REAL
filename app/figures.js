// Small animated figures that show how each exercise (and each boxing/MMA move) is done.
// Poses are described by the hip position, the torso angle and where the hands and feet go;
// knees and elbows are worked out so arms and legs keep their length while they move.
// Side view, facing right. Angles in degrees, SVG style: 0 = right, 90 = down, -90 = up.

const LEN = { thigh: 34, shin: 32, foot: 10, torso: 40, neck: 13, upper: 24, fore: 22 };
const WIDTH = { thigh: 10, shin: 8.5, foot: 6, torso: 13, upper: 8.5, fore: 7.5 };
const FLOOR = 137;

const rad = (d) => (d * Math.PI) / 180;
const add = (p, ang, len) => [p[0] + Math.cos(rad(ang)) * len, p[1] + Math.sin(rad(ang)) * len];
const lerp = (a, b, u) => a + (b - a) * u;
const mix = (a, b, u) => (Array.isArray(a) ? [lerp(a[0], b[0], u), lerp(a[1], b[1], u)] : lerp(a, b, u));

// Two-bone reach: where the middle joint goes so the end reaches the target (bend picks the side).
function reach(base, target, l1, l2, bend) {
  let d = Math.hypot(target[0] - base[0], target[1] - base[1]);
  d = Math.min(Math.max(d, Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.01);
  const a = Math.atan2(target[1] - base[1], target[0] - base[0]);
  const b = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  const j = [base[0] + Math.cos(a + bend * b) * l1, base[1] + Math.sin(a + bend * b) * l1];
  const c = Math.atan2(target[1] - j[1], target[0] - j[0]);
  return [j, [j[0] + Math.cos(c) * l2, j[1] + Math.sin(c) * l2]];
}

function solveSide(f, pat) {
  const P = { p: f.p };
  P.s = add(f.p, f.torso, LEN.torso);
  P.h = add(P.s, f.torso + (f.neck || 0), LEN.neck);
  P.c = mix(P.s, P.p, 0.38);
  P.m = mix(P.s, P.p, 0.62);
  [P.k, P.a] = reach(P.p, f.a, LEN.thigh, LEN.shin, pat.kb ?? -1);
  P.t = add(P.a, f.foot ?? 0, LEN.foot);
  const w = f.wr ? [P.s[0] + f.wr[0], P.s[1] + f.wr[1]] : f.w;
  [P.e, P.w] = reach(P.s, w, LEN.upper, LEN.fore, pat.eb ?? 1);
  if (f.a2) { [P.k2, P.a2] = reach(P.p, f.a2, LEN.thigh, LEN.shin, pat.kb2 ?? pat.kb ?? -1); P.t2 = add(P.a2, f.foot2 ?? f.foot ?? 0, LEN.foot); }
  if (f.w2 || f.w2r) {
    const w2 = f.w2r ? [P.s[0] + f.w2r[0], P.s[1] + f.w2r[1]] : f.w2;
    [P.e2, P.w2] = reach(P.s, w2, LEN.upper, LEN.fore, pat.eb2 ?? pat.eb ?? 1);
  }
  return P;
}

// Front view (for raises out to the side): both arms mirror each other.
function solveFront(f, pat) {
  const P = { p: f.p };
  const tl = pat.torsoLen || LEN.torso;
  P.s = [f.p[0], f.p[1] - tl];
  P.h = [P.s[0], P.s[1] - (pat.neckLen || LEN.neck)];
  P.sL = [P.s[0] - 13, P.s[1] + 2]; P.sR = [P.s[0] + 13, P.s[1] + 2];
  P.pL = [f.p[0] - 7, f.p[1]]; P.pR = [f.p[0] + 7, f.p[1]];
  [P.kL, P.aL] = reach(P.pL, [f.p[0] - 11, FLOOR - 3], LEN.thigh, LEN.shin, 1);
  [P.kR, P.aR] = reach(P.pR, [f.p[0] + 11, FLOOR - 3], LEN.thigh, LEN.shin, -1);
  P.tL = [P.aL[0] - 8, P.aL[1]]; P.tR = [P.aR[0] + 8, P.aR[1]];
  [P.eL, P.wL] = reach(P.sL, [P.sL[0] - f.wr[0], P.sL[1] + f.wr[1]], LEN.upper, LEN.fore, -1);
  [P.eR, P.wR] = reach(P.sR, [P.sR[0] + f.wr[0], P.sR[1] + f.wr[1]], LEN.upper, LEN.fore, 1);
  return P;
}

const EQ = {
  bar: '<circle r="12" class="fg-plate"/><circle r="3" class="fg-hub"/>',
  db: '<rect x="-9" y="-6" width="5" height="12" rx="1.5" class="fg-db"/><rect x="4" y="-6" width="5" height="12" rx="1.5" class="fg-db"/><rect x="-4" y="-1.5" width="8" height="3" class="fg-db"/>',
  bag: '<rect x="-7" y="-1" width="14" height="17" rx="4" class="fg-bag"/><path d="M-4 -1v-4h8v4" class="fg-strap"/>',
  grip: '<circle r="3.6" class="fg-hub"/>',
  plat: '<rect x="2" y="-17" width="6" height="30" rx="2" class="fg-prop" transform="rotate(17)"/>',
};
const PROPS = {
  floor: `<line x1="6" y1="${FLOOR}" x2="194" y2="${FLOOR}" class="fg-floor"/>`,
  bag: '<path d="M170 0v10" class="fg-propline"/><rect x="157" y="10" width="26" height="98" rx="11" class="fg-bag2"/><path d="M157 34h26M157 84h26" class="fg-bagline"/>',
  bench: '<rect x="28" y="100" width="110" height="7" rx="2" class="fg-prop"/><path d="M42 107v30M124 107v30" class="fg-propline"/>',
  lowbench: '<rect x="14" y="100" width="44" height="7" rx="2" class="fg-prop"/><path d="M22 107v30M50 107v30" class="fg-propline"/>',
  chair: '<rect x="30" y="96" width="40" height="6" rx="2" class="fg-prop"/><path d="M36 102v35M64 102v35M34 96V60" class="fg-propline"/>',
  seat: '<rect x="66" y="94" width="44" height="7" rx="2" class="fg-prop"/><path d="M88 101v36M118 84v10" class="fg-propline"/><circle cx="121" cy="84" r="5" class="fg-prop"/>',
  pullbar: '<path d="M62 12h76M66 12v125M134 12v125" class="fg-propline"/>',
  tower: '<path d="M172 6v131M150 6h22" class="fg-propline"/><circle cx="150" cy="8" r="3" class="fg-hub"/>',
  topcable: '<path d="M60 4h70" class="fg-propline"/><circle cx="96" cy="6" r="3" class="fg-hub"/>',
  lpseat: '<path d="M52 80L100 106" class="fg-propline" style="stroke-width:7"/><path d="M78 96v41M60 86v51" class="fg-propline"/>',
};

// Every pose: p = hip, torso = angle hip -> shoulder, a/a2 = feet, w/w2 = hands (wr = hand relative to shoulder).
const P = {
  squat: { A: { p: [100, 70], torso: -88, a: [100, 134], wr: [3, 45] }, B: { p: [79, 104], torso: -52, a: [100, 134], wr: [46, 2] }, hi: ['thigh', 'glute'] },
  backsquat: { A: { p: [100, 70], torso: -88, a: [100, 134], wr: [-4, 3] }, B: { p: [79, 104], torso: -52, a: [100, 134], wr: [-4, 3] }, eq: 'bar', at: 's', off: [-11, 4], hi: ['thigh', 'glute'] },
  goblet: { A: { p: [100, 70], torso: -88, a: [100, 134], wr: [12, 12] }, B: { p: [79, 104], torso: -52, a: [100, 134], wr: [16, 6] }, eq: 'db', hi: ['thigh', 'glute'], eb: -1 },
  legpress: { A: { p: [96, 96], torso: -150, a: [132, 70], wr: [8, 30], foot: -60 }, B: { p: [96, 96], torso: -150, a: [112, 64], wr: [8, 30], foot: -60 }, props: ['floor', 'lpseat'], eq: 'plat', at: 'a', off: [4, -4], hi: ['thigh', 'glute'], kb: 1 },
  lunge: { A: { p: [98, 72], torso: -90, a: [124, 134], a2: [70, 128], foot2: 40, wr: [2, 42] }, B: { p: [97, 103], torso: -90, a: [124, 134], a2: [70, 128], foot2: 40, wr: [2, 42] }, hi: ['thigh', 'glute'], kb2: -1 },
  hinge: { A: { p: [98, 70], torso: -88, a: [100, 134], wr: [3, 42] }, B: { p: [78, 74], torso: -14, a: [100, 134], wr: [0, 44] }, eq: 'bar', hi: ['thigh', 'glute'] },
  bridge: { A: { p: [96, 129], torso: 180, a: [130, 132], wr: [30, 3], foot: 0 }, B: { p: [97, 104], torso: 152, neck: 28, a: [130, 132], wr: [30, 8], foot: 0 }, hi: ['glute', 'thigh'], kb: -1 },
  hipthrust: { A: { p: [96, 126], torso: 218, neck: -38, a: [134, 132], wr: [26, 14] }, B: { p: [100, 99], torso: 181, a: [134, 132], wr: [30, 0] }, props: ['floor', 'lowbench'], eq: 'bar', at: 'p', off: [0, -9], hi: ['glute', 'thigh'] },
  calf: { A: { p: [100, 70], torso: -90, a: [100, 131], wr: [3, 45], foot: 25 }, B: { p: [100, 62], torso: -90, a: [100, 123], wr: [3, 45], foot: 60 }, props: ['floor'], step: true, hi: ['shin'] },
  bench: { A: { p: [110, 94], torso: 180, a: [150, 134], wr: [0, -45] }, B: { p: [110, 94], torso: 180, a: [150, 134], wr: [6, -4] }, props: ['floor', 'bench'], eq: 'bar', hi: ['chest', 'upper'] },
  pushup: { A: { p: [106, 103], torso: -22, a: [45, 128], foot: 60, w: [143, 134] }, B: { p: [111, 122], torso: -5, a: [45, 128], foot: 60, w: [143, 134] }, hi: ['chest', 'upper'], eb: 1 },
  pike: { A: { p: [92, 66], torso: 45, a: [58, 130], foot: 45, w: [146, 134] }, B: { p: [96, 72], torso: 64, a: [58, 130], foot: 45, w: [146, 134] }, hi: ['upper'], eb: -1 },
  dip: { A: { p: [80, 90], torso: -90, a: [128, 134], w: [66, 96] }, B: { p: [82, 113], torso: -86, a: [128, 134], w: [66, 96] }, props: ['floor', 'chair'], hi: ['upper'], eb: -1 },
  ohp: { A: { p: [100, 70], torso: -90, a: [100, 134], wr: [8, -4] }, B: { p: [100, 70], torso: -90, a: [100, 134], wr: [3, -45] }, eq: 'bar', hi: ['upper'], eb: 1 },
  lateral: { front: true, A: { p: [100, 70], wr: [5, 45] }, B: { p: [100, 70], wr: [44, 4] }, eq: 'db', hi: ['upper'] },
  reardelt: { front: true, torsoLen: 22, neckLen: 12, A: { p: [100, 84], wr: [3, 45] }, B: { p: [100, 84], wr: [44, 6] }, eq: 'db', hi: ['upper'] },
  pushdown: { A: { p: [100, 70], torso: -84, a: [100, 134], wr: [20, 12] }, B: { p: [100, 70], torso: -84, a: [100, 134], wr: [6, 45] }, props: ['floor', 'tower'], cable: [150, 8], eq: 'grip', hi: ['upper'], eb: 1 },
  ohtri: { A: { p: [100, 70], torso: -90, a: [100, 134], wr: [2, -46] }, B: { p: [100, 70], torso: -90, a: [100, 134], wr: [-10, -12] }, eq: 'db', hi: ['upper'], eb: 1 },
  pulldown: { A: { p: [92, 92], torso: -96, a: [126, 134], wr: [6, -45] }, B: { p: [92, 92], torso: -100, a: [126, 134], wr: [12, 4] }, props: ['floor', 'seat', 'topcable'], cable: [96, 6], eq: 'grip', hi: ['upper', 'back'], eb: -1 },
  pullup: { A: { p: [100, 101], torso: -90, a: [82, 140], w: [100, 14] }, B: { p: [100, 74], torso: -90, a: [82, 113], w: [100, 14] }, props: ['pullbar'], hi: ['upper', 'back'], kb: 1, eb: -1, nofloor: true },
  row: { A: { p: [84, 73], torso: -18, a: [100, 134], wr: [0, 45] }, B: { p: [84, 73], torso: -18, a: [100, 134], wr: [-14, 20] }, eq: 'bar', hi: ['upper', 'back'], eb: 1 },
  curl: { A: { p: [100, 70], torso: -90, a: [100, 134], wr: [4, 45] }, B: { p: [100, 70], torso: -90, a: [100, 134], wr: [15, 4] }, eq: 'bar', hi: ['upper'], eb: 1 },
  plank: { A: { p: [100, 111], torso: -8, a: [40, 128], foot: 60, w: [162, 134] }, B: { p: [100, 109], torso: -8, a: [40, 128], foot: 60, w: [162, 134] }, hi: ['core'], eb: 1, dur: 3.4 },
  crunch: { A: { p: [102, 129], torso: 180, a: [138, 132], wr: [-6, -8] }, B: { p: [102, 129], torso: 202, neck: -6, a: [138, 132], wr: [-6, -10] }, hi: ['core'], kb: -1 },
  legraise: { A: { p: [100, 129], torso: 180, a: [164, 124], wr: [30, 3], foot: -10 }, B: { p: [100, 129], torso: 180, a: [108, 64], wr: [30, 3], foot: -80 }, hi: ['core', 'thigh'], kb: 1 },
  superman: { A: { p: [96, 128], torso: 0, a: [31, 129], wr: [46, 1], foot: 180 }, B: { p: [96, 127], torso: -12, a: [34, 118], wr: [44, -12], foot: 180 }, hi: ['back', 'glute'], kb: 1 },
  // Boxing and MMA (lead hand = w, rear hand = w2, front foot = a, back foot = a2)
  stance: { A: { p: [96, 72], torso: -82, a: [120, 134], a2: [72, 134], foot2: -15, wr: [14, -10], w2r: [6, -6] }, B: { p: [96, 76], torso: -82, a: [120, 134], a2: [72, 134], foot2: -15, wr: [14, -10], w2r: [6, -6] }, hi: [], dur: 1.2, kb2: 1, eb: 1 },
  jab: { A: { p: [96, 72], torso: -82, a: [120, 134], a2: [72, 134], foot2: -15, wr: [14, -10], w2r: [6, -6] }, B: { p: [99, 72], torso: -78, a: [120, 134], a2: [72, 134], foot2: -15, wr: [45, -4], w2r: [6, -6] }, hi: ['upper', 'fore'], dur: 1.3, kb2: 1, eb: 1 },
  cross: { A: { p: [96, 72], torso: -82, a: [120, 134], a2: [72, 134], foot2: -15, wr: [14, -10], w2r: [6, -6] }, B: { p: [102, 73], torso: -72, a: [120, 134], a2: [72, 132], foot2: -55, wr: [10, -10], w2r: [45, -3] }, hi: [], hi2: ['upper', 'fore'], dur: 1.4, kb2: 1, eb: 1 },
  hook: { A: { p: [96, 72], torso: -82, a: [120, 134], a2: [72, 134], foot2: -15, wr: [14, -10], w2r: [6, -6] }, B: { p: [97, 74], torso: -80, a: [120, 134], a2: [72, 134], foot2: -15, wr: [28, -2], w2r: [6, -6] }, hi: ['upper', 'fore'], dur: 1.3, kb2: 1, eb: -1 },
  uppercut: { A: { p: [96, 78], torso: -78, a: [120, 134], a2: [72, 134], foot2: -15, wr: [14, -10], w2r: [16, 14] }, B: { p: [99, 71], torso: -84, a: [120, 134], a2: [72, 133], foot2: -40, wr: [14, -10], w2r: [24, -26] }, hi: [], hi2: ['upper', 'fore'], dur: 1.4, kb2: 1, eb: 1, eb2: 1 },
  slip: { A: { p: [96, 72], torso: -82, a: [120, 134], a2: [72, 134], foot2: -15, wr: [14, -10], w2r: [6, -6] }, B: { p: [94, 80], torso: -66, neck: 8, a: [120, 134], a2: [72, 134], foot2: -15, wr: [14, -10], w2r: [6, -6] }, hi: ['core'], dur: 1.4, kb2: 1, eb: 1 },
  teep: { A: { p: [96, 72], torso: -82, a: [120, 134], a2: [72, 134], foot2: -15, wr: [14, -10], w2r: [6, -6] }, B: { p: [90, 72], torso: -100, a: [154, 74], foot: -80, a2: [76, 134], foot2: -15, wr: [12, -12], w2r: [4, -8] }, hi: ['thigh', 'shin'], dur: 1.5, kb: 1, kb2: 1, eb: 1 },
  lowkick: { A: { p: [96, 72], torso: -82, a: [120, 134], a2: [72, 134], foot2: -15, wr: [14, -10], w2r: [6, -6] }, B: { p: [100, 72], torso: -100, a: [118, 134], a2: [146, 100], foot2: 10, wr: [12, -12], w2r: [-14, 20] }, hi: [], hi2: ['thigh', 'shin'], dur: 1.5, kb2: -1, eb: 1, eb2: -1 },
  sprawl: { A: { p: [96, 72], torso: -82, a: [120, 134], a2: [72, 134], foot2: -15, wr: [14, -10], w2r: [6, -6] }, B: { p: [92, 120], torso: -4, a: [30, 132], a2: [26, 128], foot: 170, foot2: 170, wr: [10, 12], w2r: [4, 12] }, hi: ['glute', 'core'], dur: 1.8, kb: 1, kb2: 1, eb: 1 },
  shoot: { A: { p: [96, 72], torso: -82, a: [120, 134], a2: [72, 134], foot2: -15, wr: [14, -10], w2r: [6, -6] }, B: { p: [106, 98], torso: -30, a: [140, 134], a2: [76, 134], foot2: -30, wr: [30, 10], w2r: [26, 14] }, hi: ['thigh'], dur: 1.8, kb2: 1, eb: 1 },
};

// The path drawn for each movement (which joint to follow), and strikes that hit a bag.
const TRACE = { squat: 'p', backsquat: 'p', goblet: 'p', legpress: 'a', lunge: 'p', hinge: 'w', bridge: 'p', hipthrust: 'p', calf: 'h', bench: 'w', pushup: 's', pike: 'h', dip: 's', ohp: 'w', lateral: 'wR', reardelt: 'wR', pushdown: 'w', ohtri: 'w', pulldown: 'w', pullup: 's', row: 'w', curl: 'w', crunch: 's', legraise: 'a',
  jab: 'w', cross: 'w2', hook: 'w', uppercut: 'w2', slip: 'h', teep: 'a', lowkick: 'a2', sprawl: 'p', shoot: 'p' };
const HIT = { jab: 'w', cross: 'w2', hook: 'w', uppercut: 'w2', teep: 'a', lowkick: 'a2' };
const BAG = new Set(['jab', 'cross', 'teep', 'lowkick']);
for (const [k, v] of Object.entries(TRACE)) P[k].trace = v;
for (const [k, v] of Object.entries(HIT)) P[k].hit = v;
for (const k of BAG) P[k].bag = true;

// Which movement each exercise uses, and what is in the hands.
const EXERCISE = {
  'bench-press': ['bench'], 'db-bench-press': ['bench', 'db'], 'push-up': ['pushup'], 'diamond-push-up': ['pushup'], 'pike-push-up': ['pike'], 'chair-dip': ['dip'],
  'overhead-press': ['ohp'], 'db-shoulder-press': ['ohp', 'db'], 'lateral-raise': ['lateral'], 'rear-delt-fly': ['reardelt'],
  'triceps-pushdown': ['pushdown'], 'oh-triceps-extension': ['ohtri'],
  'lat-pulldown': ['pulldown'], 'inverted-row': ['pullup'], 'barbell-row': ['row'], 'db-row': ['row', 'db'],
  'barbell-curl': ['curl'], 'hammer-curl': ['curl', 'db'], 'db-curl': ['curl', 'db'], 'backpack-curl': ['curl', 'bag'],
  squat: ['backsquat'], 'goblet-squat': ['goblet'], 'bw-squat': ['squat'], 'leg-press': ['legpress'], lunge: ['lunge'], 'split-squat': ['lunge'],
  'romanian-deadlift': ['hinge'], 'db-rdl': ['hinge', 'db'], 'hip-thrust': ['hipthrust'], 'glute-bridge': ['bridge'], 'calf-raise': ['calf'],
  plank: ['plank'], crunch: ['crunch'], 'leg-raise': ['legraise'], superman: ['superman'],
};
const LESSON = { stance: 'stance', footwork: 'stance', jab: 'jab', cross: 'cross', hook: 'hook', uppercut: 'uppercut', slip: 'slip', block: 'stance', 'mma-stance': 'stance', sprawl: 'sprawl', 'double-leg': 'shoot', teep: 'teep', 'low-kick': 'lowkick' };

// The figure is drawn like the channel's character: muscular limbs, ink outline, red shorts and sash.
const mixp = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
const off = (p, n, k) => [p[0] + n[0] * k, p[1] + n[1] * k];
const axis = (P) => { const dx = P.s[0] - P.p[0], dy = P.s[1] - P.p[1], l = Math.hypot(dx, dy) || 1; return { d: [dx / l, dy / l], n: [-dy / l, dx / l] }; };
const seg = (a, b, u0 = 0, u1 = 1) => (P) => [mixp(P[a], P[b], u0), mixp(P[a], P[b], u1)];
const dot = (a) => (P) => [P[a], P[a]];

function leg(hip, k, a, t, far) {
  const sk = far ? 'skin2' : 'skin';
  return [
    { g: seg(k, a), w: 9.5, c: sk, part: 'shin' },
    { g: seg(k, a, 0.1, 0.52), w: 12.5, c: sk, part: 'shin' },
    { g: seg(a, t), w: 7, c: 'shoe' },
    { g: seg(hip, k), w: 13, c: sk, part: 'thigh' },
    { g: seg(hip, k, 0.05, 0.6), w: 17.5, c: far ? 'short2' : 'short', part: 'thigh' },
  ];
}
function arm(s, e, w, far) {
  const sk = far ? 'skin2' : 'skin';
  return [
    { g: seg(s, e), w: 10, c: sk, part: 'upper' },
    { g: seg(s, e, 0, 0.16), w: 15.5, c: sk, part: 'upper' },
    { g: seg(s, e, 0.2, 0.72), w: 13.5, c: sk, part: 'upper' },
    { g: seg(e, w), w: 8.2, c: sk, part: 'fore' },
    { g: seg(e, w, 0.06, 0.5), w: 10.5, c: sk, part: 'fore' },
    { g: dot(w), w: 9.5, c: sk, part: 'fore' },
  ];
}
const T = (fn) => (P) => { const { d, n } = axis(P); return fn(P, d, n); };
const TORSO_SIDE = [
  { g: seg('p', 's'), w: 16, c: 'skin', part: 'core' },
  { g: T((P, d, n) => [off(mixp(P.s, P.p, 0.58), n, -1.5), off(P.s, n, -3)]), w: 19, c: 'skin', part: 'back' },
  { g: T((P, d, n) => [off(off(P.s, d, -1), n, 3), off(mixp(P.s, P.p, 0.38), n, 3)]), w: 23, c: 'skin', part: 'chest' },
  { g: T((P, d, n) => [off(mixp(P.s, P.p, 0.76), n, -2.5), off(P.p, n, -3)]), w: 17, c: 'short', part: 'glute' },
  { g: seg('s', 'p', 0.74, 1), w: 19, c: 'short', part: 'glute' },
  { g: T((P, d, n) => { const m = mixp(P.s, P.p, 0.74); return [off(m, n, -9.5), off(m, n, 9.5)]; }), w: 5, c: 'band' },
  { g: T((P, d, n) => [off(off(P.s, n, -6), d, -1), off(mixp(P.s, P.p, 0.64), n, 8)]), w: 5, c: 'sash' },
  { g: (P) => [P.s, mixp(P.s, P.h, 0.55)], w: 8.5, c: 'skin' },
];
const TORSO_FRONT = [
  { g: seg('s', 'p'), w: 24, c: 'skin', part: 'core' },
  { g: seg('s', 'p', 0.06, 0.38), w: 32, c: 'skin', part: 'chest' },
  { g: (P) => [P.sL, P.sR], w: 13, c: 'skin', part: 'upper' },
  { g: seg('s', 'p', 0.8, 1), w: 24, c: 'short', part: 'glute' },
  { g: (P) => [P.pL, P.pR], w: 16, c: 'short', part: 'glute' },
  { g: (P) => { const m = mixp(P.s, P.p, 0.8); return [[m[0] - 12, m[1]], [m[0] + 12, m[1]]]; }, w: 4.5, c: 'band' },
  { g: (P) => [[P.sR[0] - 2, P.sR[1] + 2], mixp(P.pL, P.s, 0.18)], w: 5, c: 'sash' },
  { g: (P) => [P.s, mixp(P.s, P.h, 0.55)], w: 9, c: 'skin' },
];
const HEAD = [{ g: dot('h'), w: 19, c: 'skin', part: 'head' }];
// Side view: one eye and a heavy brow on the face side; front view: two eyes under an angry V.
const FACE_SIDE = [
  { g: T((P, d, n) => [off(off(P.h, n, 1.2), d, 3.6), off(off(P.h, n, 8.2), d, 1.4)]), w: 2.8, c: 'brow' },
  { g: T((P, d, n) => { const e = off(off(P.h, n, 5.2), d, 0.4); return [e, e]; }), w: 2.6, c: 'eye' },
  { g: T((P, d, n) => [off(off(P.h, n, 7.6), d, -4.2), off(off(P.h, n, 3.4), d, -5.4)]), w: 1.6, c: 'brow' },
];
const FACE_FRONT = [
  { g: (P) => [[P.h[0] - 7.5, P.h[1] - 2.6], [P.h[0] - 1.6, P.h[1] - 0.2]], w: 2.6, c: 'brow' },
  { g: (P) => [[P.h[0] + 7.5, P.h[1] - 2.6], [P.h[0] + 1.6, P.h[1] - 0.2]], w: 2.6, c: 'brow' },
  { g: (P) => [[P.h[0] - 4, P.h[1] + 1.8], [P.h[0] - 4, P.h[1] + 1.8]], w: 2.4, c: 'eye' },
  { g: (P) => [[P.h[0] + 4, P.h[1] + 1.8], [P.h[0] + 4, P.h[1] + 1.8]], w: 2.4, c: 'eye' },
];

function groupsFor(pat, P0) {
  if (pat.front) return [[leg('pL', 'kL', 'aL', 'tL'), 'hi'], [leg('pR', 'kR', 'aR', 'tR'), 'hi'], [TORSO_FRONT, 'hi'], [HEAD, 'hi'], [FACE_FRONT, 'hi', true], [arm('sL', 'eL', 'wL'), 'hi'], [arm('sR', 'eR', 'wR'), 'hi']];
  const g = [];
  if (P0.a2) g.push([leg('p', 'k2', 'a2', 't2', true), 'hi2']);
  if (P0.w2) g.push([arm('s', 'e2', 'w2', true), 'hi2']);
  g.push([TORSO_SIDE, 'hi'], [HEAD, 'hi'], [FACE_SIDE, 'hi', true], [leg('p', 'k', 'a', 't'), 'hi'], [arm('s', 'e', 'w'), 'hi']);
  return g;
}

const r1 = (n) => Math.round(n * 10) / 10;
const ease = (u) => (1 - Math.cos(Math.PI * u)) / 2;

function poseAt(pat, u) {
  const f = {};
  for (const k of Object.keys(pat.A)) {
    const a = pat.A[k], b = pat.B[k] ?? a;
    f[k] = typeof a === 'number' || Array.isArray(a) ? mix(a, b, u) : a;
  }
  return pat.front ? solveFront(f, pat) : solveSide(f, pat);
}

// Holds a moment at each end, then moves with an easy start and stop.
function timeline(pat) {
  const steps = 10, hold = 3, go = [...Array(steps - 1).keys()].map((i) => ease((i + 1) / steps));
  const A = poseAt(pat, 0), B = poseAt(pat, 1);
  const mid = go.map((u) => poseAt(pat, u));
  const out = [...Array(hold).fill(A), ...mid, ...Array(hold).fill(B), ...[...mid].reverse(), A];
  out.B = B;
  return out;
}

function build(pat, eqName, anim, dur, still = 1, ghost = null) {
  const frames = anim ? timeline(pat) : [poseAt(pat, still)];
  const D = `${dur}s`;
  const av = (attr, vals) => (anim ? `<animate attributeName="${attr}" values="${vals.join(';')}" dur="${D}" repeatCount="indefinite"/>` : '');
  const line = (it, width, cls) => {
    const pts = frames.map((f) => it.g(f));
    const [[x1, y1], [x2, y2]] = pts[0];
    return `<line class="${cls}" stroke-width="${width}" x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}">${av('x1', pts.map((q) => r1(q[0][0])))}${av('y1', pts.map((q) => r1(q[0][1])))}${av('x2', pts.map((q) => r1(q[1][0])))}${av('y2', pts.map((q) => r1(q[1][1])))}</line>`;
  };
  const sets = { hi: new Set(pat.hi || []), hi2: new Set(pat.hi2 || []) };
  let out = '';
  for (const pr of pat.props || (pat.nofloor ? [] : ['floor'])) out += PROPS[pr];
  if (pat.step) out += '<rect x="104" y="131" width="22" height="6" rx="1.5" class="fg-prop"/>';
  if (pat.bag) out += PROPS.bag;
  // Dashed path of the moving hand, foot or hip, with an arrow at the end.
  if (pat.trace) {
    const pts = [...Array(13).keys()].map((i) => poseAt(pat, i / 12)[pat.trace]).filter(Boolean);
    if (pts.length > 1 && Math.hypot(pts[12][0] - pts[0][0], pts[12][1] - pts[0][1]) > 6) {
      const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
      const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
      out += `<path class="fg-trace" d="M${pts.map((q) => `${r1(q[0])} ${r1(q[1])}`).join('L')}"/><path class="fg-arrow" d="M0 0L-7 -4L-7 4Z" transform="translate(${r1(b[0])} ${r1(b[1])}) rotate(${r1(ang)})"/>`;
    }
  }
  // A faint copy of another moment of the move (used to show where it starts).
  if (ghost != null) {
    const g0 = poseAt(pat, ghost);
    for (const [items, , noInk] of groupsFor(pat, g0)) if (!noInk) for (const it of items) {
      const [[x1, y1], [x2, y2]] = it.g(g0);
      out += `<line class="fg-ghost" stroke-width="${it.w}" x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}"/>`;
    }
  }
  if (pat.cable) out += `<line class="fg-cable" x1="${pat.cable[0]}" y1="${pat.cable[1]}" x2="${r1(frames[0].w[0])}" y2="${r1(frames[0].w[1])}">${av('x2', frames.map((f) => r1(f.w[0])))}${av('y2', frames.map((f) => r1(f.w[1])))}</line>`;
  for (const [items, which, noInk] of groupsFor(pat, frames[0])) {
    const hiSet = sets[which];
    for (const it of items) if (it.part && hiSet.has(it.part)) out += line(it, it.w + 8, 'fg-glow');
    if (!noInk) for (const it of items) out += line(it, it.w + 3.2, 'fg-ink');
    for (const it of items) out += line(it, it.w, `fg-${it.c}`);
  }
  if (pat.hit) {
    const end = anim ? frames.B : frames[0];
    const at = end[pat.hit];
    if (at && (anim || still === 1)) {
      const vis = anim ? `<animate attributeName="opacity" values="${frames.map((f) => (f === frames.B ? 1 : 0)).join(';')}" dur="${D}" calcMode="discrete" repeatCount="indefinite"/>` : '';
      out += `<g class="fg-hit" transform="translate(${r1(at[0] + 7)} ${r1(at[1])})" ${anim ? 'opacity="0"' : ''}>${vis}<path d="M0 -12L3 -3L12 0L3 3L0 12L-3 3L-12 0L-3 -3Z"/><circle r="15" class="fg-hit-ring"/></g>`;
    }
  }
  const eq = eqName || pat.eq;
  if (eq && EQ[eq]) {
    const spots = pat.front ? ['wL', 'wR'] : [pat.at || 'w'];
    const o = pat.off || [0, 0];
    for (const at of spots) {
      const pos = frames.map((f) => `${r1(f[at][0] + o[0])},${r1(f[at][1] + o[1])}`);
      out += `<g transform="translate(${pos[0].replace(',', ' ')})">${anim ? `<animateTransform attributeName="transform" type="translate" values="${pos.join(';')}" dur="${D}" repeatCount="indefinite"/>` : ''}${EQ[eq]}</g>`;
    }
  }
  return out;
}

function figure(patName, eqName, { anim = true, cls = '', still = 1, ghost = null, speed = 1 } = {}) {
  const pat = P[patName];
  if (!pat) return '';
  return `<svg class="fig ${cls}" viewBox="0 0 200 150" role="img" aria-hidden="true">${build(pat, eqName, anim, (pat.dur || 3.2) * speed, still, ghost)}</svg>`;
}

export const hasFigure = (id) => !!EXERCISE[id];
export function exFigure(id, opts) {
  const m = EXERCISE[id];
  return m ? figure(m[0], m[1], opts) : '';
}
export function lessonFigure(id, opts) {
  return LESSON[id] ? figure(LESSON[id], null, opts) : '';
}
export const PATTERN_NAMES = Object.keys(P);
export const patternFigure = figure;
