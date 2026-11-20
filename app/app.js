// Earned Strength app prototype. Everything is stored on the phone (localStorage).
import { RANKS, RANK_EXAMPLES, EXERCISES, PROGRAMS, GOALS, LEVELS, EQUIPMENT, MYTHS, ARTICLES, VIDEOS, ACTIVITY, STANDARDS, GROUPS, placeOf, PLACE_OK, COMPOUND } from './data.js';
import {
  t, setLang, getLang, detectLang, defaultUnits, locale, muscleName, exText, programName, dayName, dayFocus,
  optText, rankLine, rankExample, mythText, articleCat, articleTitle, videoTopic, activityText,
} from './i18n.js';

const KEY = 'es-app-v1';
const DAY = 864e5;
const LB = 2.20462;
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

const I = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  train: '<svg viewBox="0 0 24 24"><path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11"/></svg>',
  rank: '<svg viewBox="0 0 24 24"><path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
  learn: '<svg viewBox="0 0 24 24"><path d="M2 6.5 12 3l10 3.5L12 10z"/><path d="M6 8.5V14c0 1.5 2.7 3 6 3s6-1.5 6-3V8.5"/><path d="M22 6.5V12"/></svg>',
  me: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
  info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>',
  timer: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>',
  calc: '<svg viewBox="0 0 24 24"><rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8.5 6.5h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h3.5"/></svg>',
  flame: '<svg viewBox="0 0 24 24"><path d="M12 2c1 3.5 5 5.5 5 11a5 5 0 0 1-10 0c0-2.5 1-4 2.5-5.5C9.5 9.5 10 11 11 11.5 11 8 11.5 5 12 2z"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>',
  share: '<svg viewBox="0 0 24 24"><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.8" fill="currentColor" stroke="none"/></svg>',
  plates: '<svg viewBox="0 0 24 24"><path d="M2 12h20"/><rect x="5" y="5" width="3" height="14" rx="1"/><rect x="16" y="5" width="3" height="14" rx="1"/><rect x="9" y="8" width="2" height="8" rx=".8"/><rect x="13" y="8" width="2" height="8" rx=".8"/></svg>',
  gauge: '<svg viewBox="0 0 24 24"><path d="M3.5 17a8.5 8.5 0 1 1 17 0"/><path d="m12 17 4.5-6"/><path d="M3.5 20h17"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  repeat: '<svg viewBox="0 0 24 24"><path d="m17 2 3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4"/></svg>',
  minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
};
const LOGO = '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="#16181B" stroke="#C8443B" stroke-width="5"/><polygon points="60,22 93,41 93,79 60,98 27,79 27,41" fill="none" stroke="#C8443B" stroke-width="3"/><text x="60" y="74" text-anchor="middle" font-family="Bebas Neue, Arial Black, sans-serif" font-size="40" fill="#F4EEE4">ES</text></svg>';

// ---------- State ----------
const blank = () => ({ v: 1, lang: null, profile: null, workouts: [], active: null, quiz: { idx: 0, right: 0, total: 0 }, daily: {}, rest: 90 });
let S = load();
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.v === 1) return { ...blank(), ...s };
  } catch (e) { /* storage blocked: start fresh */ }
  return blank();
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
}
setLang(S.lang || detectLang());

// ---------- Units and dates ----------
const unit = () => (S.profile && S.profile.units) || 'lb';
const toDisp = (kg) => (unit() === 'lb' ? kg * LB : kg);
const toKg = (v) => (unit() === 'lb' ? v / LB : v);
const toKgFrom = (u, v) => (u === 'lb' ? v / LB : v);
const fmtW = (kg) => String(Math.round(toDisp(kg) * 2) / 2);
const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : 0; };
const fmtN = (n) => Math.round(n).toLocaleString(locale());
function weekStart(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
}
const prevWeek = (ws) => weekStart(ws - 3 * DAY);
const dayKey = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
const fmtDate = (ts) => new Date(ts).toLocaleDateString(locale(), { weekday: 'short', month: 'short', day: 'numeric' });

// ---------- Program, score, streak ----------
const program = () => PROGRAMS[(S.profile && S.profile.equipment) || 'gym'];
const progName = () => programName((S.profile && S.profile.equipment) || 'gym', program());
const setsFor = (n) => (S.profile && S.profile.level === 'comeback' ? Math.max(2, n - 1) : n);
const exName = (id) => exText(id, EXERCISES[id]).name;
function nextDay() {
  const p = program();
  const last = [...S.workouts].reverse().find((w) => p.days.some((d) => d.id === w.dayId) && w.equip === S.profile.equipment);
  const i = last ? (p.days.findIndex((d) => d.id === last.dayId) + 1) % p.days.length : 0;
  return p.days[i];
}
const e1rm = (w, r) => (r <= 1 ? w : w * (1 + r / 30));
function weekCounts(list = S.workouts) {
  const c = {};
  for (const w of list) { const k = weekStart(w.date); c[k] = (c[k] || 0) + 1; }
  return c;
}
function streakWeeks() {
  const goal = S.profile.days, c = weekCounts();
  let ws = weekStart(Date.now()), n = 0;
  if ((c[ws] || 0) >= goal) n++;
  ws = prevWeek(ws);
  while ((c[ws] || 0) >= goal) { n++; ws = prevWeek(ws); }
  return n;
}
// Lifts are compared to bodyweight^(2/3), scaled so it equals bodyweight at 80 kg: heavier people
// naturally lift less per kilo, so this keeps light and heavy lifters on an even field.
const bodyBase = (bw) => Math.cbrt(80) * Math.pow(bw, 2 / 3);
// Strength drops with age; past 35 every result counts a little more (about 1.2% a year, up to 35%).
const ageFactor = (age) => (age > 35 ? Math.min(1.35, 1 + 0.012 * (age - 35)) : 1);
function computeScore(workouts = S.workouts) {
  const bw = (S.profile && S.profile.bw) || 0;
  const af = ageFactor((S.profile && S.profile.age) || 30);
  const best = {};
  for (const w of workouts) {
    for (const ex of w.exercises) {
      const st = STANDARDS[ex.id];
      if (!st) continue;
      const [group, type, lo, hi] = st;
      for (const s of ex.sets) {
        let val;
        if (type === 'ratio') { if (!bw || !s.w) continue; val = e1rm(s.w, s.r) / bodyBase(bw); }
        else val = s.r;
        best[group] = Math.max(best[group] || 0, clamp(((val * af - lo) / (hi - lo)) * 100, 0, 100));
      }
    }
  }
  // Every muscle group the plan trains counts the same.
  const groups = GROUPS.filter((g) => program().days.some((d) => d.items.some(([id]) => STANDARDS[id] && STANDARDS[id][0] === g)));
  const strength = groups.reduce((a, g) => a + (best[g] || 0), 0) / Math.max(1, groups.length);
  const goalWeeks = Object.values(weekCounts(workouts)).filter((n) => n >= ((S.profile && S.profile.days) || 3)).length;
  const consistency = Math.min(100, (goalWeeks / 16) * 100);
  const total = workouts.length ? Math.round(0.75 * strength + 0.25 * consistency) : 0;
  return { total, strength: Math.round(strength), consistency: Math.round(consistency), goalWeeks, groups: groups.map((g) => [g, Math.round(best[g] || 0)]) };
}
const rankIndex = (s) => { let i = 0; while (i + 1 < RANKS.length && s >= RANKS[i + 1].at) i++; return i; };
// "What do I lift today?" (double progression): if every set last time reached the top of the
// rep range, go up a little; otherwise keep the weight and beat last time by a rep.
function suggestFor(ex) {
  const def = EXERCISES[ex.id], prev = lastSets(ex.id);
  if (!prev.length) return null;
  const [lo, hi] = String(ex.target).split('-').map(Number);
  const top = hi || lo;
  if (def.bw) return { kind: 'reps', r: Math.max(...prev.map((s) => s.r)) + (def.timed ? 5 : 1) };
  const w = Math.max(...prev.map((s) => s.w));
  if (!w) return null;
  if (prev.filter((s) => s.w === w).every((s) => s.r >= top)) {
    const inc = unit() === 'lb' ? 5 / LB : def.perHand ? 2 : 2.5;
    return { kind: 'up', w: w + inc, d: inc, lo };
  }
  return { kind: 'same', w, lo };
}
function suggLine(ex) {
  const sg = suggestFor(ex), def = EXERCISES[ex.id];
  if (!sg) return '';
  const txt = sg.kind === 'reps' ? t('suggReps', { r: `${sg.r} ${t(def.timed ? 'seconds' : 'reps')}` })
    : sg.kind === 'up' ? t('suggUp', { w: fmtW(sg.w), u: unit(), d: fmtW(sg.d) }) : t('suggSame', { w: fmtW(sg.w), u: unit() });
  return `<p class="sugg ${sg.kind}">${I.up}${txt}</p>`;
}
function lastSets(id) {
  for (let k = S.workouts.length - 1; k >= 0; k--) {
    const ex = S.workouts[k].exercises.find((e) => e.id === id);
    if (ex) return ex.sets;
  }
  return [];
}
function bestFor(id, workouts = S.workouts) {
  const def = EXERCISES[id];
  let best = 0;
  for (const w of workouts) for (const ex of w.exercises) if (ex.id === id) for (const s of ex.sets) best = Math.max(best, def.bw ? s.r : e1rm(s.w, s.r));
  return best;
}

// ---------- Small UI helpers ----------
let toastT;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => el.classList.remove('show'), 2600);
}
let restSheetOpen = false;
let sheetFn = null; // the open sheet's live calculator, if it has one
function openSheet(html) {
  const sh = $('#sheet');
  sheetFn = null;
  sh.innerHTML = `<div class="grab"></div><button class="icon-btn close" data-act="close-sheet" aria-label="${t('close')}">${I.close}</button>${html}`;
  sh.hidden = false;
  $('#scrim').hidden = false;
  sh.scrollTop = 0;
  return sh;
}
function closeSheet() {
  $('#sheet').hidden = true;
  $('#scrim').hidden = true;
  restSheetOpen = false;
}
function dismissSheet() {
  if (restSheetOpen && rest.iv) { restSheetOpen = false; closeSheet(); tickRest(); } else closeSheet();
}
let audio;
function unlockAudio() {
  try { if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === 'suspended') audio.resume(); } catch (e) { /* no audio */ }
}
function beep() {
  if (!audio) return;
  [0, 0.22].forEach((d) => {
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, audio.currentTime + d);
    g.gain.exponentialRampToValueAtTime(0.3, audio.currentTime + d + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + d + 0.16);
    o.connect(g).connect(audio.destination);
    o.start(audio.currentTime + d);
    o.stop(audio.currentTime + d + 0.18);
  });
}
const vibrate = (p) => { try { if (navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive) navigator.vibrate(p); } catch (e) { /* ignore */ } };

// ---------- Splash ----------
function runSplash() {
  const el = $('#splash');
  $('.splash-tag', el).textContent = t('tagline');
  // ?splash forces the full animation (for previewing it), even if the device asks for reduced motion.
  const forced = location.search.includes('splash');
  if (forced) document.documentElement.classList.add('force-motion');
  let seen = false;
  try { seen = sessionStorage.getItem('es-splash') === '1' && !forced; sessionStorage.setItem('es-splash', '1'); } catch (e) { /* ignore */ }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches && !forced;
  const hide = () => { el.classList.add('out'); setTimeout(() => el.remove(), 600); };
  el.addEventListener('click', hide, { once: true });
  setTimeout(hide, seen ? 0 : reduce ? 1000 : 2000);
}

// ---------- Onboarding ----------
const OB_STEPS = ['welcome', 'name', 'goal', 'level', 'days', 'equipment', 'body', 'ready'];
const freshOb = () => ({ step: 0, unitsTouched: false, d: { name: '', goal: null, level: null, days: 3, equipment: null, units: defaultUnits(getLang()), bw: '', age: '' } });
let ob = freshOb();
function optList(list, key) {
  return `<div class="opts">${list.map((o) => { const x = optText(o); return `<button class="opt" type="button" data-ob="${key}" data-v="${o.id}" aria-pressed="${ob.d[key] === o.id}"><span><b>${esc(x.name)}</b><small>${esc(x.note)}</small></span><i class="radio"></i></button>`; }).join('')}</div>`;
}
function langSwitch(attr) {
  return `<div class="lang-switch" role="group" aria-label="${t('language')}">${[['en', 'English'], ['es', 'Español']].map(([l, n]) => `<button type="button" class="chip" ${attr}="${l}" aria-pressed="${getLang() === l}">${n}</button>`).join('')}</div>`;
}
const bodyOk = (d) => num(d.bw) > 20 && num(d.age) >= 14 && num(d.age) <= 100;
function renderOnboard() {
  const el = $('#onboard');
  const step = OB_STEPS[ob.step], d = ob.d;
  const p = PROGRAMS[d.equipment || 'gym'];
  const body = {
    welcome: `${langSwitch('data-oblang')}${AVATAR_READY ? `<div class="ob-char"><img src="${avatarSrc(TOP)}" alt=""></div>` : `<div class="ob-hero">${LOGO}</div>`}<h1>${t('obWelcomeTitle')}</h1><p>${t('obWelcomeText')}</p>
      <ul class="ob-points">
        <li>${I.train}<span><b>${t('obP1')}</b><br><span class="muted small">${t('obP1t')}</span></span></li>
        <li>${I.rank}<span><b>${t('obP2')}</b><br><span class="muted small">${t('obP2t')}</span></span></li>
        <li>${I.learn}<span><b>${t('obP3')}</b><br><span class="muted small">${t('obP3t')}</span></span></li>
      </ul>`,
    name: `<h1>${t('obNameTitle')}</h1><p>${t('obNameText')}</p>
      <div class="field"><label for="obName">${t('name')}</label><input id="obName" autocomplete="given-name" maxlength="24" value="${esc(d.name)}" placeholder="${t('yourName')}"></div>`,
    goal: `<h1>${t('obGoalTitle')}</h1><p>${t('obGoalText')}</p>${optList(GOALS, 'goal')}`,
    level: `<h1>${t('obLevelTitle')}</h1><p>${t('obLevelText')}</p>${optList(LEVELS, 'level')}`,
    days: `<h1>${t('obDaysTitle')}</h1><p>${t('obDaysText')}</p>
      <div class="days">${[2, 3, 4, 5, 6].map((n) => `<button class="opt" type="button" data-ob="days" data-v="${n}" aria-pressed="${d.days === n}">${n}</button>`).join('')}</div>
      <p class="muted small" style="margin-top:14px">${t('obDaysNote')}</p>`,
    equipment: `<h1>${t('obEquipTitle')}</h1><p>${t('obEquipText')}</p>${optList(EQUIPMENT, 'equipment')}`,
    body: `<h1>${t('obBodyTitle')}</h1><p>${t('obBodyText')}</p>
      <div class="unit-toggle">${['lb', 'kg'].map((u) => `<button class="opt" type="button" data-ob="units" data-v="${u}" aria-pressed="${d.units === u}" style="justify-content:center"><b>${u}</b></button>`).join('')}</div>
      <div class="split">
        <div class="field"><label for="obBw">${t('bodyweight', { u: d.units })}</label><input id="obBw" type="number" inputmode="decimal" min="30" max="700" value="${esc(d.bw)}" placeholder="${d.units === 'lb' ? '175' : '80'}"></div>
        <div class="field"><label for="obAge">${t('age')}</label><input id="obAge" type="number" inputmode="numeric" min="14" max="100" value="${esc(d.age)}" placeholder="30"></div>
      </div>`,
    ready: `${AVATAR_READY ? `<div class="ob-char small"><img src="${avatarSrc(0)}" alt=""><span>${t('obStartHere')}</span></div>` : `<div class="ob-hero">${LOGO}</div>`}<h1>${t('obReadyTitle', { name: d.name ? ', ' + esc(d.name) : '' })}</h1>
      <p>${t('obReadyText', { plan: esc(programName(d.equipment || 'gym', p)), days: d.days })}</p>
      <div class="card stack">
        ${p.days.map((day) => `<div class="row"><span class="day-letter">${esc(dayName(day)[0])}</span><span class="grow"><b>${esc(dayName(day))}</b><br><span class="muted small">${esc(dayFocus(day))}</span></span></div>`).join('')}
      </div>
      <p class="muted small" style="margin-top:14px">${t('obPrivate')}</p>`,
  }[step];
  const valid = { welcome: true, name: true, goal: !!d.goal, level: !!d.level, days: !!d.days, equipment: !!d.equipment, body: bodyOk(d), ready: true }[step];
  el.innerHTML = `
    <div class="ob-progress">${OB_STEPS.slice(1).map((_, i) => `<i class="${i < ob.step ? 'on' : ''}"></i>`).join('')}</div>
    <div class="ob-body">${body}</div>
    <div class="ob-foot" ${ob.step === 0 ? 'style="grid-template-columns:1fr"' : ''}>
      ${ob.step > 0 ? `<button class="btn" type="button" data-ob="back" aria-label="${t('back')}">${I.back}</button>` : ''}
      <button class="btn btn-primary" type="button" data-ob="next" ${valid ? '' : 'disabled'}>${step === 'welcome' ? t('getStarted') : step === 'ready' ? t('letsGo') : t('continue')}</button>
    </div>`;
  for (const inp of el.querySelectorAll('.ob-body input')) {
    inp.addEventListener('input', () => {
      if (inp.id === 'obName') d.name = inp.value.trim();
      else {
        if (inp.id === 'obBw') d.bw = inp.value;
        if (inp.id === 'obAge') d.age = inp.value;
        $('[data-ob="next"]', el).disabled = !bodyOk(d);
      }
    });
  }
}
function showOnboard() {
  $('#onboard').hidden = false;
  renderOnboard();
}
document.getElementById('onboard').addEventListener('click', (e) => {
  const lb = e.target.closest('[data-oblang]');
  if (lb) {
    S.lang = lb.dataset.oblang;
    setLang(S.lang);
    save();
    if (!ob.unitsTouched) ob.d.units = defaultUnits(S.lang);
    renderOnboard();
    return;
  }
  const b = e.target.closest('[data-ob]');
  if (!b) return;
  const k = b.dataset.ob, d = ob.d;
  if (k === 'next') {
    if (OB_STEPS[ob.step] === 'ready') {
      S.profile = { name: d.name, goal: d.goal, level: d.level, days: d.days, equipment: d.equipment, units: d.units, bw: Math.round(toKgFrom(d.units, num(d.bw)) * 10) / 10, age: Math.round(num(d.age)) };
      if (!S.lang) S.lang = getLang();
      save();
      $('#onboard').hidden = true;
      go('home');
      toast(t('welcome'));
      return;
    }
    ob.step++;
  } else if (k === 'back') ob.step = Math.max(0, ob.step - 1);
  else if (k === 'days') d.days = +b.dataset.v;
  else { d[k] = b.dataset.v; if (k === 'units') ob.unitsTouched = true; }
  renderOnboard();
});

// ---------- Views ----------
const TABS = [['home', 'tabHome', I.home], ['train', 'tabTrain', I.train], ['rank', 'tabRank', I.rank], ['learn', 'tabLearn', I.learn], ['me', 'tabMe', I.me]];
let current = 'home';
let learnTab = 'quiz';
let libFilter = 'All';

function go(v) {
  if (location.hash !== '#' + v) history.replaceState(null, '', '#' + v);
  current = v;
  render();
}
window.addEventListener('hashchange', () => {
  const v = location.hash.slice(1);
  if (!TABS.some((x) => x[0] === v)) return;
  if (!$('#sheet').hidden) dismissSheet();
  current = v;
  render();
});

function render() {
  if (!S.profile) return; // still in the first-time questions
  $('#tabs').innerHTML = TABS.map(([id, label, icon]) => id === 'train'
    ? `<button class="tab tab-main" type="button" data-act="builder" ${current === id ? 'aria-current="page"' : ''}><span class="tab-fab">${icon}</span><span>${t('fabLabel')}</span></button>`
    : `<button class="tab" type="button" data-act="go" data-v="${id}" ${current === id ? 'aria-current="page"' : ''}>${icon}<span>${t(label)}</span></button>`).join('');
  $('#main').innerHTML = `<div class="view">${VIEWS[current]()}</div>`;
  window.scrollTo(0, 0);
  if (current === 'rank') mountAvatar();
}

function greeting() {
  const h = new Date().getHours();
  return t(h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening');
}
function rankBadge(score) {
  const r = RANKS[rankIndex(score)];
  return `<button class="badge" data-act="go" data-v="rank" style="--c:${r.color}"><i></i>${esc(r.name)}</button>`;
}
function weekDots() {
  const ws = weekStart(Date.now());
  const done = new Set(S.workouts.filter((w) => w.date >= ws).map((w) => dayKey(w.date)));
  const today = dayKey(Date.now());
  const letters = getLang() === 'es' ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return `<div class="week">${letters.map((l, i) => {
    const d = new Date(ws); d.setDate(d.getDate() + i);
    const k = dayKey(d.getTime());
    const cls = done.has(k) ? 'done' : k === today ? 'today' : '';
    return `<div class="wd ${cls}"><b>${done.has(k) ? I.check : d.getDate()}</b>${l}</div>`;
  }).join('')}</div>`;
}
function mythAt(i) {
  const k = ((i % MYTHS.length) + MYTHS.length) % MYTHS.length;
  return { ...MYTHS[k], ...mythText(k, MYTHS[k]) };
}
const todayIdx = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / DAY);
const enNote = () => t('inEnglish').trim() && getLang() === 'es' ? t('inEnglish') : '';
function verdict(answer, m) {
  const right = (answer === 1) === m.fact;
  return `<div class="verdict ${right ? 'right' : 'wrong'}"><b>${t(right ? 'correct' : 'notQuite')} ${t('itsA', { x: t(m.fact ? 'aFact' : 'aMyth') })}</b>${esc(m.a)}<br><a class="link" href="${m.link}">${t('readArticle')}${enNote()}</a></div>`;
}
const repsLabel = (id, reps) => `${reps}${EXERCISES[id].timed ? ' ' + t('sec') : ''}`;

const VIEWS = {
  home() {
    const sc = computeScore(), r = rankIndex(sc.total), next = RANKS[r + 1];
    const ws = weekStart(Date.now());
    const thisWeek = S.workouts.filter((w) => w.date >= ws).length;
    const d = nextDay();
    const dm = S.daily[dayKey(Date.now())];
    const m = mythAt(todayIdx());
    const v = VIDEOS[todayIdx() % VIDEOS.length];
    const p = next ? (sc.total - RANKS[r].at) / (next.at - RANKS[r].at) : 1;
    return `
      <section class="hero" style="--c:${RANKS[r].color}">
        <div class="hero-copy">
          <p class="eyebrow">${new Date().toLocaleDateString(locale(), { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h1>${greeting()}${S.profile.name ? ',<br>' + esc(S.profile.name) : ''}</h1>
          <button class="hero-rank" data-act="go" data-v="rank">
            <svg class="ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" class="ring-bg"/><circle cx="32" cy="32" r="27" class="ring-fg" stroke-dasharray="169.6" stroke-dashoffset="${(169.6 * (1 - p)).toFixed(1)}"/><text x="32" y="38" text-anchor="middle">${sc.total}</text></svg>
            <span><span class="eyebrow">${t('yourRank')}</span><b>${esc(RANKS[r].name)}</b><small>${next ? t('pointsTo', { n: next.at - sc.total, rank: esc(next.name) }) : t('topRank')}</small></span>
          </button>
        </div>
        <img class="hero-img" src="${avatarSrc(r)}" alt="">
      </section>
      ${S.active ? `<button class="card card-tap next-card row" data-act="resume"><span class="grow"><span class="eyebrow">${t('inProgress')}</span><br><b>${esc(S.active.name)}</b></span><span class="btn btn-primary btn-sm">${t('resume')}</span></button>` : ''}
      <section class="card">
        <div class="streak"><span class="flame">${I.flame}</span><span class="grow"><span class="big-num">${streakWeeks()}</span> <b>${t('weekStreak')}</b><br><span class="muted small">${t('thisWeek', { n: thisWeek, goal: S.profile.days })}</span></span></div>
        ${weekDots()}
      </section>
      ${challengeCard()}
      ${musclesCard()}
      ${S.active ? '' : `<section class="card next-card">
        <span class="eyebrow">${t('nextWorkout')}</span>
        <div class="h2" style="margin-top:6px">${esc(dayName(d))}</div>
        <p class="muted small">${esc(dayFocus(d))} · ${t('aboutMin', { n: d.items.length * 9 })}</p>
        <div class="ex-chips">${d.items.slice(0, 4).map(([id]) => `<span>${esc(exName(id))}</span>`).join('')}${d.items.length > 4 ? `<span class="more">${t('moreN', { n: d.items.length - 4 })}</span>` : ''}</div>
        <button class="btn btn-primary btn-block" data-act="start" data-v="${d.id}">${I.play} ${t('startWorkout')}</button>
      </section>`}
      <section class="card myth">
        <span class="eyebrow">${t('mythDaily')}</span>
        <q>${esc(m.q)}</q>
        ${dm == null ? `<div class="actions"><button class="btn" data-act="daily" data-v="0">${t('myth')}</button><button class="btn" data-act="daily" data-v="1">${t('fact')}</button></div>` : verdict(dm, m)}
      </section>
      <div class="section-title"><span class="eyebrow">${t('tools')}</span></div>
      <div class="tools">
        <button class="card card-tap tool" data-act="rest">${I.timer}<b>${t('restTimer')}</b><span>${t('restTimerSub')}</span></button>
        <button class="card card-tap tool" data-act="calc">${I.calc}<b>${t('calcTitle')}</b><span>${t('calcSub')}</span></button>
        <button class="card card-tap tool" data-act="plates">${I.plates}<b>${t('platesTool')}</b><span>${t('platesSub')}</span></button>
        <button class="card card-tap tool" data-act="orm">${I.gauge}<b>${t('ormTitle')}</b><span>${t('ormSub')}</span></button>
      </div>
      <div class="section-title"><span class="eyebrow">${t('fromChannel')}</span><a class="link" href="#learn" data-act="learn-videos">${t('allVideos')}</a></div>
      <a class="card card-tap video" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener"><img src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy"><span><span class="eyebrow">${t('video')}</span><br><b>${esc(videoTopic(v))}</b></span></a>`;
  },

  train() {
    const p = program();
    const lvl = LEVELS.find((l) => l.id === S.profile.level);
    const groups = { fAll: null, fChest: ['Chest'], fBack: ['Lats', 'Upper back', 'Hamstrings'], fShoulders: ['Shoulders', 'Side shoulders', 'Rear shoulders'], fArms: ['Biceps', 'Triceps'], fLegs: ['Quads', 'Glutes', 'Hamstrings', 'Calves'], fCore: ['Abs'] };
    if (!(libFilter in groups)) libFilter = 'fAll';
    const lib = Object.entries(EXERCISES).filter(([, e]) => !groups[libFilter] || groups[libFilter].includes(e.muscles[0]));
    const hist = [...S.workouts].reverse().slice(0, 8);
    const nd = nextDay().id;
    return `
      <header class="top"><div><p class="eyebrow">${t('yourPlan')}</p><h1>${esc(progName())}</h1><p>${t('daysWeek', { n: S.profile.days })} · ${esc(lvl ? optText(lvl).name : '')}${S.profile.level === 'comeback' ? t('comebackNote') : ''}</p></div></header>
      ${p.days.map((d) => `<section class="card day">
        <div class="day-head"><span class="row"><span class="day-letter">${esc(dayName(d)[0])}</span><span><b>${esc(dayName(d))}</b><br><span class="muted small">${esc(dayFocus(d))}</span></span></span>
        <button class="btn btn-sm ${d.id === nd ? 'btn-primary' : ''}" data-act="start" data-v="${d.id}">${t(d.id === nd ? 'next' : 'start')}</button></div>
        <ul class="ex-list" style="margin-bottom:0">${d.items.map(([id, sets, reps]) => `<li><button class="link" style="color:var(--text);text-align:left" data-act="ex" data-v="${id}">${esc(exName(id))}</button><span>${setsFor(sets)} × ${repsLabel(id, reps)}</span></li>`).join('')}</ul>
      </section>`).join('')}
      <section class="card">
        <span class="eyebrow">${t('pickWeight')}</span>
        <p style="margin-top:8px">${t('pickWeightText')}</p>
        <a class="link" href="/beginner-routine">${t('readRoutine')}${enNote()}</a>
      </section>
      <div class="section-title"><span class="eyebrow">${t('library')}</span><span class="muted small">${t('nExercises', { n: lib.length })}</span></div>
      <div class="chips">${Object.keys(groups).map((g) => `<button class="chip" data-act="filter" data-v="${g}" aria-pressed="${libFilter === g}">${t(g)}</button>`).join('')}</div>
      <section class="card list-card">${lib.map(([id, e]) => `<button class="lib-item" data-act="ex" data-v="${id}"><span class="grow"><b>${esc(exName(id))}</b><small>${esc(e.muscles.map(muscleName).join(', '))}</small></span>${I.chev}</button>`).join('')}</section>
      <div class="section-title"><span class="eyebrow">${t('history')}</span></div>
      <section class="card" id="calCard">${calendarHtml()}</section>
      <section class="card list-card">${hist.length ? hist.map((w) => `<button class="lib-item" data-act="hist" data-v="${esc(w.id)}"><span class="grow"><b>${esc(histName(w))}</b><small>${fmtDate(w.date)} · ${Math.max(1, Math.round(w.dur / 60))} min · ${t('nSets', { n: w.exercises.reduce((a, e) => a + e.sets.length, 0) })}</small></span>${I.chev}</button>`).join('') : `<p class="hist muted">${t('noHistory')}</p>`}</section>`;
  },

  rank() {
    const sc = computeScore(), r = rankIndex(sc.total), R = RANKS[r], next = RANKS[r + 1];
    const p = next ? (sc.total - R.at) / (next.at - R.at) : 1;
    return `
      <div class="ia-stage ${r === TOP ? 'ia-max' : ''}" id="stage">
        <div class="ia-aura" aria-hidden="true"><i class="ia-rays"></i><i class="ia-halo"></i></div>
        <div class="stage-rank" style="--c:${R.color}"><span class="eyebrow">${t('yourRank')}</span><b id="iaName">${esc(R.name)}</b><span class="muted small" id="iaLine">${esc(rankLine(r, R))}</span></div>
        <div class="ia-floor"></div>
        <div class="ia-figure" id="iaFigure"><div class="ia-tilt" id="iaTilt"><img class="ia-img" id="iaImg" alt="${esc(R.name)}" src="${avatarSrc(r)}"></div></div>
        <div class="ia-flash" id="iaFlash"></div>
        <div class="ia-banner" id="iaBanner"><span class="eyebrow">${t('rankUp')}</span><b></b></div>
      </div>
      <div class="ia-actions">
        ${hasFlex(r) ? `<button class="btn btn-sm" data-act="ia-flex" aria-pressed="false">${t('flexBtn')}</button>` : ''}
        <button class="btn btn-sm" data-act="ia-demo">${t('tryAnim')}</button>
      </div>
      ${AVATAR_READY ? '' : `<p class="muted small" style="text-align:center">${t('placeholderNote')}</p>`}
      <section class="card">
        <div class="card-head"><span class="eyebrow">${t('strengthScore')}</span><span class="big-num">${sc.total}<span class="muted" style="font-size:18px"> / 100</span></span></div>
        <div class="bar"><i style="width:${(p * 100).toFixed(0)}%"></i></div>
        <p class="muted small" style="margin-top:10px">${next ? t('pointsTo', { n: next.at - sc.total, rank: esc(next.name) }) : t('reachedTop')}</p>
      </section>
      <section class="card"><span class="eyebrow">${t('progress')}</span>${scoreChart()}</section>
      <button class="btn btn-block" data-act="share-rank">${I.share}${t('shareRank')}</button>
      <div class="split">
        <div class="card"><span class="eyebrow">${t('strength')}</span><b>${sc.strength}</b><span class="muted small">${t('strengthSub')}</span></div>
        <div class="card"><span class="eyebrow">${t('consistency')}</span><b>${sc.consistency}</b><span class="muted small">${t('weeksHit', { n: sc.goalWeeks })}</span></div>
      </div>
      ${lifetimeCard()}
      <section class="card">
        <span class="eyebrow">${t('byGroup')}</span>
        ${muscleMap(Object.fromEntries(sc.groups.map(([g, v]) => [g, v >= 50 ? 'on' : v >= 20 ? 'mid' : v > 0 ? 'low' : ''])), 'mmap-wide')}
        <div class="groups">${sc.groups.map(([g, v]) => `<div class="grp"><span>${t('g_' + g)}</span><div class="bar"><i style="width:${v}%"></i></div><b>${v}</b></div>`).join('')}</div>
        <p class="muted small" style="margin-top:10px">${t('byGroupNote')}</p>
      </section>
      <div class="section-title"><span class="eyebrow">${t('badges')}</span><span class="muted small">${badges().filter((b) => b.on).length} / ${badges().length}</span></div>
      <div class="badges">${badges().map((b) => `<div class="bdg ${b.on ? 'on' : ''}"><span>${b.icon}</span><b>${t(b.key)}</b></div>`).join('')}</div>
      <details class="card fold">
        <summary><span class="eyebrow">${t('howRank')}</span>${I.chev}</summary>
        <ul class="ex-list" style="color:var(--text);margin-bottom:4px">${['howRank1', 'howRank2', 'howRank5', 'howRank3', 'howRank4'].map((k) => `<li><span>${t(k)}</span></li>`).join('')}</ul>
      </details>
      <div class="section-title"><span class="eyebrow">${t('allRanks')}</span></div>
      <section class="card list-card"><ul class="ladder">${RANKS.map((x, i) => `<li class="${i === r ? 'current' : i > r ? 'locked' : ''}" style="--c:${x.color}"><i></i><span><b>${esc(x.name)}</b><br><span class="muted small">${esc(rankExample(i, RANK_EXAMPLES[i]))}</span></span><em>${x.at}+</em></li>`).join('')}</ul></section>`;
  },

  learn() {
    const tabs = [['quiz', 'quizTab'], ['articles', 'articlesTab'], ['videos', 'videosTab']];
    let body = '';
    if (learnTab === 'quiz') {
      const q = S.quiz, m = mythAt(q.idx);
      body = `<section class="card myth">
        <div class="card-head"><span class="eyebrow">${t('questionN', { n: (q.idx % MYTHS.length) + 1, total: MYTHS.length })}</span><span class="badge">${t('nRight', { n: q.right, total: q.total })}</span></div>
        <q>${esc(m.q)}</q>
        ${q.answer == null ? `<div class="actions"><button class="btn" data-act="quiz" data-v="0">${t('myth')}</button><button class="btn" data-act="quiz" data-v="1">${t('fact')}</button></div>`
          : `${verdict(q.answer, m)}<button class="btn btn-primary btn-block" style="margin-top:12px" data-act="quiz-next">${t('nextQuestion')}</button>`}
      </section>
      <p class="muted small" style="padding:0 2px">${t('quizNote')}</p>`;
    } else if (learnTab === 'articles') {
      body = (t('englishNote') ? `<p class="muted small" style="padding:0 2px">${t('englishNote')}</p>` : '') + ARTICLES.map((g) => `<div class="section-title"><span class="eyebrow">${esc(articleCat(g.cat))}</span></div>
        <section class="card list-card">${g.items.map(([title, href]) => `<a class="lib-item" href="${href}" style="text-decoration:none"><span class="grow"><b>${esc(articleTitle(href, title))}</b></span>${I.chev}</a>`).join('')}</section>`).join('');
    } else {
      body = (t('englishNote') ? `<p class="muted small" style="padding:0 2px">${t('englishNote')}</p>` : '') + `<div class="stack">${VIDEOS.map((v) => `<a class="card card-tap video" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener"><img src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy"><span><b>${esc(videoTopic(v))}</b><br><span class="muted small">${t('watch')}</span></span></a>`).join('')}</div>`;
    }
    return `<header class="top"><div><p class="eyebrow">${t('tagline')}</p><h1>${t('tabLearn')}</h1></div></header>
      <div class="chips">${tabs.map(([id, l]) => `<button class="chip" data-act="learn-tab" data-v="${id}" aria-pressed="${learnTab === id}">${t(l)}</button>`).join('')}</div>${body}`;
  },

  me() {
    const P = S.profile;
    const sel = (field, list, val) => `<select data-field="${field}">${list.map((o) => `<option value="${o.id}" ${String(o.id) === String(val) ? 'selected' : ''}>${esc(o.name)}</option>`).join('')}</select>`;
    const tx = (list) => list.map((o) => ({ id: o.id, name: optText(o).name }));
    return `
      <header class="top"><div><p class="eyebrow">${t('profile')}</p><h1>${esc(P.name || t('you'))}</h1><p>${t('nLogged', { n: S.workouts.length })}</p></div></header>
      <section class="card stack">
        <div class="field"><span class="lbl">${t('language')}</span>${sel('lang', [{ id: 'en', name: 'English' }, { id: 'es', name: 'Español' }], getLang())}</div>
        <div class="field"><label>${t('name')}</label><input data-field="name" maxlength="24" value="${esc(P.name)}"></div>
        <div class="split">
          <div class="field"><label>${t('bodyweight', { u: unit() })}</label><input data-field="bw" type="number" inputmode="decimal" value="${P.bw ? fmtW(P.bw) : ''}"></div>
          <div class="field"><label>${t('age')}</label><input data-field="age" type="number" inputmode="numeric" min="14" max="100" value="${P.age || ''}"></div>
        </div>
        <div class="field"><span class="lbl">${t('units')}</span>${sel('units', [{ id: 'lb', name: t('pounds') }, { id: 'kg', name: t('kilos') }], P.units)}</div>
      </section>
      <section class="card stack">
        <span class="eyebrow">${t('training')}</span>
        <div class="field"><span class="lbl">${t('goal')}</span>${sel('goal', tx(GOALS), P.goal)}</div>
        <div class="field"><span class="lbl">${t('level')}</span>${sel('level', tx(LEVELS), P.level)}</div>
        <div class="field"><span class="lbl">${t('equipment')}</span>${sel('equipment', tx(EQUIPMENT), P.equipment)}</div>
        <div class="field"><span class="lbl">${t('perWeek')}</span>${sel('days', [2, 3, 4, 5, 6].map((n) => ({ id: n, name: t('nDays', { n }) })), P.days)}</div>
        <div class="field"><span class="lbl">${t('restDefault')}</span>${sel('rest', [60, 90, 120, 180].map((n) => ({ id: n, name: n < 120 ? t('nSeconds', { n }) : t('nMinutes', { n: n / 60 }) })), S.rest)}</div>
      </section>
      <section class="card">
        <div class="row">${I.phone.replace('<svg', '<svg style="width:22px;height:22px;stroke:var(--red);fill:none;stroke-width:2;flex:0 0 auto"')}<span class="grow"><b>${t('reminders')}</b><br><span class="muted small">${t('remindersSub')}</span></span></div>
      </section>
      <section class="card stack">
        <span class="eyebrow">${t('yourData')}</span>
        <p class="small muted">${t('dataNote')}</p>
        <div class="split"><button class="btn btn-sm" data-act="export">${t('saveBackup')}</button><button class="btn btn-sm" data-act="import">${t('loadBackup')}</button></div>
        <button class="btn btn-sm" data-act="demo">${t('demo')}</button>
        <button class="btn btn-sm" data-act="intro">${t('intro')}</button>
        <button class="btn btn-sm" data-act="reset" style="color:var(--red-2)">${t('deleteAll')}</button>
        <input type="file" id="importFile" accept="application/json" hidden>
      </section>
      <section class="card list-card">
        <a class="lib-item" href="/" style="text-decoration:none"><span class="grow"><b>${t('website')}</b></span>${I.chev}</a>
        <a class="lib-item" href="https://www.youtube.com/@earnedstrength-s5h" target="_blank" rel="noopener" style="text-decoration:none"><span class="grow"><b>${t('channel')}</b></span>${I.chev}</a>
        <a class="lib-item" href="/privacy" style="text-decoration:none"><span class="grow"><b>${t('privacy')}</b></span>${I.chev}</a>
        <a class="lib-item" href="/terms" style="text-decoration:none"><span class="grow"><b>${t('terms')}</b></span>${I.chev}</a>
      </section>
      <p class="muted small" style="text-align:center">${t('footer')}</p>`;
  },
};
// Workout names are saved in the language used at the time; show them in the current one when possible.
function histName(w) {
  for (const p of Object.values(PROGRAMS)) { const d = p.days.find((x) => x.id === w.dayId); if (d && w.equip && PROGRAMS[w.equip] === p) return dayName(d); }
  return w.name;
}

// ---------- Sheets: exercise, calculator, confirm ----------
function showExercise(id) {
  const e = EXERCISES[id], x = exText(id, e);
  const best = bestFor(id);
  openSheet(`
    <span class="eyebrow">${t('howTo')}</span>
    <h2 style="margin-top:6px">${esc(x.name)}</h2>
    <div class="muscles">${e.muscles.map((m, i) => `<span class="badge" ${i ? '' : 'style="color:var(--text);border-color:var(--red)"'}>${esc(muscleName(m))}</span>`).join('')}</div>
    <h3>${t('stepByStep')}</h3><ol>${x.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
    <h3>${t('mistakes')}</h3><ul>${x.mistakes.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    <div class="tip"><b>${t('tip')}</b> ${esc(x.tip)}</div>
    ${e.perHand ? `<p class="muted small" style="margin-top:12px">${t('perDumbbell')}</p>` : ''}
    ${best ? `<h3>${t('yourBest')}</h3><p>${e.bw ? t(e.timed ? 'bestSecs' : 'bestReps', { n: best }) : t('best1rm', { w: fmtW(best), u: unit() })}</p>` : ''}
    ${exerciseChart(id)}`);
}
function showCalc() {
  const bw = S.profile.bw ? fmtW(S.profile.bw) : '';
  const sh = openSheet(`
    <span class="eyebrow">${t('tool')}</span><h2 style="margin-top:6px">${t('calcTitle')}</h2>
    <div class="stack" style="margin-top:16px">
      <div class="field"><label for="cW">${t('bodyweight', { u: unit() })}</label><input id="cW" type="number" inputmode="decimal" value="${bw}"></div>
      <div class="field"><label for="cA">${t('activity')}</label><select id="cA">${ACTIVITY.map((a) => { const x = activityText(a); return `<option value="${a.f}" ${a.f === 30 ? 'selected' : ''}>${esc(x.name)}: ${esc(x.note)}</option>`; }).join('')}</select></div>
      <div class="field"><label for="cG">${t('goal')}</label><select id="cG"><option value="1">${t('maintain')}</option><option value="1.15" ${S.profile.goal === 'muscle' ? 'selected' : ''}>${t('bulk')}</option><option value="0.8" ${S.profile.goal === 'fat' ? 'selected' : ''}>${t('cut')}</option></select></div>
      <div class="result"><div><span class="eyebrow">${t('protein')}</span><b id="cP">-</b><span class="muted small">${t('gramsDay')}</span></div><div><span class="eyebrow">${t('calories')}</span><b id="cC">-</b><span class="muted small">${t('kcalDay')}</span></div></div>
      <p class="muted small">${t('calcNote')}</p>
      <a class="link" href="/daily-protein">${t('whyNumbers')}${enNote()}</a>
    </div>`);
  const calc = () => {
    const kg = toKg(num($('#cW', sh).value));
    $('#cP', sh).textContent = kg ? Math.round(kg * 1.8) : '-';
    $('#cC', sh).textContent = kg ? fmtN(kg * num($('#cA', sh).value) * num($('#cG', sh).value)) : '-';
  };
  sheetFn = calc;
  calc();
}
function confirmSheet(title, text, yes, onYes, danger) {
  const sh = openSheet(`<h2>${esc(title)}</h2><p class="muted" style="margin:10px 0 18px">${esc(text)}</p>
    <div class="stack"><button class="btn btn-block ${danger ? '' : 'btn-primary'}" id="cfYes" ${danger ? 'style="color:var(--red-2)"' : ''}>${esc(yes)}</button><button class="btn btn-block" data-act="close-sheet">${t('cancel')}</button></div>`);
  $('#cfYes', sh).addEventListener('click', () => { closeSheet(); onYes(); });
}

// ---------- Rest timer ----------
const rest = { end: 0, total: 0, iv: null };
function startRest(sec) {
  unlockAudio();
  rest.total = sec;
  rest.end = Date.now() + sec * 1000;
  clearInterval(rest.iv);
  rest.iv = setInterval(tickRest, 250);
  showRestSheet();
  tickRest();
}
function showRestSheet() {
  restSheetOpen = true;
  $('#restPill').hidden = true;
  openSheet(`
    <span class="eyebrow">${t('restTitle')}</span>
    <div class="timer"><svg viewBox="0 0 220 220"><circle class="t-bg" cx="110" cy="110" r="100"/><circle class="t-fg" id="tFg" cx="110" cy="110" r="100" stroke-dasharray="628.3" stroke-dashoffset="0"/></svg><div class="timer-num" id="tNum">0:00</div></div>
    <div class="timer-row"><button class="btn" data-rest="-15">-15s</button><button class="btn" data-rest="+15">+15s</button><button class="btn btn-light" data-rest="skip">${t('skip')}</button></div>
    <div class="timer-row" style="margin-top:8px"><button class="btn btn-sm" data-rest="60">1:00</button><button class="btn btn-sm" data-rest="120">2:00</button><button class="btn btn-sm" data-rest="180">3:00</button></div>
    <button class="btn btn-block" style="margin-top:8px" data-rest="hide">${t('keepRunning')}</button>
    <p class="muted small" style="margin-top:14px">${t('restNote')}</p>`);
}
function tickRest() {
  const left = Math.max(0, rest.end - Date.now());
  const s = Math.ceil(left / 1000);
  const txt = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const n = $('#tNum'), fg = $('#tFg');
  if (restSheetOpen && n) { n.textContent = txt; fg.style.strokeDashoffset = String(628.3 * (1 - left / (rest.total * 1000))); }
  const pill = $('#restPill');
  if (!restSheetOpen && rest.iv) { pill.hidden = false; pill.innerHTML = `${I.timer.replace('<svg', '<svg style="width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2"')} ${t('rest')} ${txt}`; }
  if (left <= 0) endRest(true);
}
function endRest(finished) {
  clearInterval(rest.iv);
  rest.iv = null;
  $('#restPill').hidden = true;
  if (restSheetOpen) closeSheet();
  if (finished) { beep(); vibrate([200, 100, 200]); toast(t('restOver')); }
}
document.getElementById('restPill').addEventListener('click', showRestSheet);

// ---------- Workout logger ----------
let woTick;
function startWorkout(dayId) {
  if (S.active) { openWorkout(); return; }
  const d = program().days.find((x) => x.id === dayId);
  S.active = {
    dayId: d.id, name: dayName(d), equip: S.profile.equipment, start: Date.now(),
    exercises: d.items.map(([id, sets, reps]) => ({ id, target: reps, sets: Array.from({ length: setsFor(sets) }, () => ({ w: '', r: '', done: false })) })),
  };
  save();
  openWorkout();
}
function openWorkout() {
  $('#workout').hidden = false;
  document.body.style.overflow = 'hidden';
  renderWorkout();
  clearInterval(woTick);
  woTick = setInterval(updateElapsed, 1000);
}
function closeWorkout() {
  $('#workout').hidden = true;
  document.body.style.overflow = '';
  clearInterval(woTick);
  render();
}
function updateElapsed() {
  const a = S.active, el = $('#woTime');
  if (!a || !el) return;
  const s = Math.floor((Date.now() - a.start) / 1000);
  const all = a.exercises.flatMap((e) => e.sets);
  el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} · ${t('setsDone', { n: all.filter((x) => x.done).length, total: all.length })}`;
}
function setRow(ex, i, j, prev, sg) {
  const def = EXERCISES[ex.id], s = ex.sets[j], p = prev[j] || prev[prev.length - 1];
  const prevTxt = p ? (def.bw ? `${p.r}${def.timed ? 's' : ''}` : `${fmtW(p.w)} × ${p.r}`) : '-';
  const low = String(ex.target).split('-')[0];
  const wHint = sg && sg.w ? fmtW(sg.w) : p ? fmtW(p.w) : unit();
  const topR = +String(ex.target).split('-').pop();
  const rHint = sg ? (sg.kind === 'reps' ? sg.r : sg.kind === 'up' ? sg.lo : (p ? Math.min(p.r + 1, topR || p.r + 1) : low)) : (p ? p.r : low);
  return `<div class="set ${s.done ? 'done' : ''}" data-i="${i}" data-j="${j}">
    <span class="set-n">${j + 1}</span><span class="prev">${prevTxt}</span>
    ${def.bw ? `<span class="prev" style="text-align:center">${t('body')}</span>` : `<input type="number" inputmode="decimal" data-k="w" value="${esc(s.w)}" placeholder="${wHint}" aria-label="${unit()} ${j + 1}">`}
    <input type="number" inputmode="numeric" data-k="r" value="${esc(s.r)}" placeholder="${rHint}" aria-label="${t(def.timed ? 'secShort' : 'repsShort')} ${j + 1}">
    <button class="check" data-wo="check" aria-label="${t('set')} ${j + 1}" aria-pressed="${s.done}">${I.check}</button>
  </div>`;
}
function renderWorkout() {
  const a = S.active;
  $('#workout').innerHTML = `<div class="wo-inner">
    <header class="wo-head"><button class="icon-btn" data-wo="min" aria-label="${t('back')}">${I.back}</button>
      <div class="grow"><b style="font-size:17px">${esc(histName(a))}</b><div class="wo-time" id="woTime"></div></div>
      <button class="btn btn-sm" data-wo="rest">${I.timer}${t('rest')}</button></header>
    <p class="hint-row">${I.info}<span>${t('woHint')}</span></p>
    ${a.exercises.map((ex, i) => {
      const def = EXERCISES[ex.id], prev = lastSets(ex.id), sg = suggestFor(ex);
      return `<section class="card wo-ex">
        <div class="wo-ex-top"><button class="wo-ex-name" data-wo="info" data-v="${ex.id}">${esc(exName(ex.id))} ${I.info}</button><button class="icon-btn sm" data-wo="menu" data-i="${i}" aria-label="${t('exOptions')}">${I.more}</button></div>
        <p class="muted small">${t('target', { sets: ex.sets.length, reps: ex.target, what: t(def.timed ? 'seconds' : 'reps') })}${def.perHand ? t('oneDumbbell') : ''}</p>
        ${suggLine(ex)}
        <div class="sets"><div class="set head"><span>${t('set')}</span><span>${t('lastTime')}</span><span style="text-align:center">${def.bw ? '' : unit()}</span><span style="text-align:center">${t(def.timed ? 'secShort' : 'repsShort')}</span><span></span></div>
          ${ex.sets.map((_, j) => setRow(ex, i, j, prev, sg)).join('')}</div>
        <div class="wo-ex-btns"><button class="btn btn-sm" data-wo="add" data-i="${i}">${I.plus}${t('addSet')}</button>${BARBELL.includes(ex.id) ? `<button class="btn btn-sm" data-wo="plates" data-i="${i}">${I.plates}${t('platesTool')}</button>` : ''}</div>
      </section>`;
    }).join('')}
    <button class="btn add-ex" data-wo="add-ex">${I.plus}${t('addExercise')}</button>
  </div>
  <div class="wo-foot"><button class="btn btn-primary btn-block" data-wo="finish">${t('finish')}</button></div>`;
  updateElapsed();
}
const woEl = document.getElementById('workout');
woEl.addEventListener('input', (e) => {
  const inp = e.target.closest('input[data-k]');
  if (!inp) return;
  const row = inp.closest('.set');
  S.active.exercises[row.dataset.i].sets[row.dataset.j][inp.dataset.k] = inp.value;
  save();
});
woEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-wo]');
  if (!b) return;
  const k = b.dataset.wo, a = S.active;
  if (k === 'min') closeWorkout();
  else if (k === 'rest') startRest(S.rest);
  else if (k === 'info') showExercise(b.dataset.v);
  else if (k === 'add') { a.exercises[b.dataset.i].sets.push({ w: '', r: '', done: false }); save(); renderWorkout(); }
  else if (k === 'menu') openExMenu(+b.dataset.i);
  else if (k === 'add-ex') { pickGroup = 'all'; openExPicker(); }
  else if (k === 'plates') {
    // Start from the weight of the next set to do.
    const card = b.closest('.wo-ex');
    const row = card.querySelector('.set:not(.head):not(.done)') || [...card.querySelectorAll('.set:not(.head)')].pop();
    const wi = row && row.querySelector('input[data-k="w"]');
    showPlates(wi ? num(wi.value || (wi.placeholder !== unit() ? wi.placeholder : '')) || '' : '');
  }
  else if (k === 'check') {
    unlockAudio();
    const row = b.closest('.set'), i = +row.dataset.i, j = +row.dataset.j;
    const ex = a.exercises[i], s = ex.sets[j], def = EXERCISES[ex.id];
    if (!s.done) {
      const wIn = $('input[data-k="w"]', row), rIn = $('input[data-k="r"]', row);
      if (wIn && !wIn.value && wIn.placeholder !== unit()) wIn.value = wIn.placeholder;
      if (!rIn.value) rIn.value = rIn.placeholder;
      s.w = wIn ? wIn.value : '';
      s.r = rIn.value;
      if (!(num(s.r) > 0) || (!def.bw && !(num(s.w) > 0))) { toast(t(def.bw ? 'enterReps' : 'enterBoth')); return; }
    }
    s.done = !s.done;
    if (s.done) vibrate(18);
    row.classList.toggle('done', s.done);
    b.setAttribute('aria-pressed', s.done);
    // Suggest the same weight and reps for the next set, like most loggers do.
    const nextRow = s.done && row.nextElementSibling;
    if (nextRow && nextRow.classList.contains('set')) {
      const nw = $('input[data-k="w"]', nextRow), nr = $('input[data-k="r"]', nextRow);
      if (nw && !nw.value) nw.placeholder = s.w;
      if (nr && !nr.value) nr.placeholder = s.r;
    }
    save();
    updateElapsed();
    const all = a.exercises.flatMap((x) => x.sets);
    if (s.done && all.some((x) => !x.done)) startRest(S.rest);
    if (s.done && all.every((x) => x.done)) toast(t('allDone'));
  } else if (k === 'finish') {
    const any = a.exercises.some((x) => x.sets.some((s) => s.done));
    if (!any) confirmSheet(t('discardTitle'), t('discardText'), t('discard'), () => { S.active = null; save(); closeWorkout(); }, true);
    else finishWorkout();
  }
});

function finishWorkout() {
  const a = S.active;
  if (rest.iv) endRest(false);
  const before = computeScore();
  const prevWorkouts = S.workouts.slice();
  const w = {
    id: Date.now().toString(36), dayId: a.dayId, name: a.name, equip: a.equip, place: a.place || a.equip, date: a.start, dur: Math.round((Date.now() - a.start) / 1000),
    exercises: a.exercises.map((ex) => ({ id: ex.id, t: ex.target, sets: ex.sets.filter((s) => s.done).map((s) => ({ w: Math.round(toKg(num(s.w)) * 100) / 100, r: num(s.r) })) })).filter((ex) => ex.sets.length),
  };
  S.workouts.push(w);
  S.active = null;
  save();
  const after = computeScore();
  const prs = w.exercises.filter((ex) => { const old = bestFor(ex.id, prevWorkouts); return old > 0 && bestFor(ex.id, [w]) > old; });
  const muscles = [...new Set(w.exercises.flatMap((ex) => EXERCISES[ex.id].muscles))];
  const vol = workVolume(w);
  const rb = rankIndex(before.total), ra = rankIndex(after.total);
  const thisWeek = S.workouts.filter((x) => x.date >= weekStart(Date.now())).length;
  const goal = S.profile.days;
  $('#workout').hidden = true;
  document.body.style.overflow = '';
  clearInterval(woTick);
  render();
  openSheet(`
    <span class="eyebrow">${t('complete')}</span><h2 style="margin-top:6px">${t('niceWork', { name: S.profile.name ? ', ' + esc(S.profile.name) : '' })}</h2>
    <p class="muted">${esc(histName(w))} · ${fmtDate(w.date)}</p>
    <div class="sum-stats"><div><b>${Math.max(1, Math.round(w.dur / 60))}</b><span>${t(Math.round(w.dur / 60) <= 1 ? 'minute' : 'minutes')}</span></div><div><b>${w.exercises.reduce((sum, e) => sum + e.sets.length, 0)}</b><span>${t('setsWord')}</span></div>${vol.kg ? `<div><b>${fmtN(toDisp(vol.kg))}</b><span>${t('lifted', { u: unit() })}</span></div>` : `<div><b>${vol.reps}</b><span>${t('repsWord')}</span></div>`}</div>
    ${funLine(vol.moved, vol.est)}
    ${ra > rb ? `<div class="rankup" style="--c:${RANKS[ra].color}"><span class="eyebrow">${t('rankUp')}</span><b>${esc(RANKS[ra].name)}</b><span class="muted small">${esc(rankLine(ra, RANKS[ra]))}</span></div>` : ''}
    <h3>${t('prs')}</h3>${prs.length ? `<ul>${prs.map((ex) => `<li><b>${esc(exName(ex.id))}</b>: ${t('newBest')}</li>`).join('')}</ul>` : `<p class="muted small">${t('noPrs')}</p>`}
    <h3>${t('musclesWorked')}</h3>${muscleMap(Object.fromEntries(w.exercises.filter((e) => STANDARDS[e.id]).map((e) => [STANDARDS[e.id][0], 'on'])), 'mmap-wide')}<div class="muscles">${muscles.map((m) => `<span class="badge">${esc(muscleName(m))}</span>`).join('')}</div>
    <h3>${t('yourScore')}</h3><p>${before.total} → <b>${after.total}</b> / 100</p>
    <h3>${t('thisWeekTitle')}</h3><p>${thisWeek >= goal ? t('weekDone', { n: thisWeek, goal }) : t('weekTodo', { n: thisWeek, goal, left: goal - thisWeek })}</p>
    <div class="split" style="margin-top:18px"><button class="btn" data-act="share-workout">${I.share}${t('share')}</button><button class="btn btn-primary" data-act="close-sheet">${t('done')}</button></div>`);
  confetti(ra > rb ? 90 : 45);
  if (ra > rb) vibrate([60, 40, 60, 40, 120]);
}

// ---------- Muscle map (front and back) ----------
// state: group -> 'on' (worked / selected), 'mid', 'low', 'rec' (recovering), 'ready'
function muscleMap(state = {}, cls = '') {
  const g = (k, el) => `<g class="mm ${state[k] || ''}">${el}</g>`;
  const r = (x, y, w, h, rx = 3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;
  const front = `
    <circle class="base" cx="30" cy="10" r="8"/><rect class="base" x="26.5" y="17" width="7" height="6"/>
    <path class="base" d="M22 56 L38 56 L40 64 L20 64 Z"/>
    ${g('shoulders', '<ellipse cx="16.5" cy="27" rx="6" ry="5"/><ellipse cx="43.5" cy="27" rx="6" ry="5"/>')}
    ${g('chest', '<path d="M21 24 Q29 21.5 29.4 25.5 L29.4 34.5 Q24 36.5 20.5 33 Z"/><path d="M39 24 Q31 21.5 30.6 25.5 L30.6 34.5 Q36 36.5 39.5 33 Z"/>')}
    ${g('core', r(24, 37, 12, 18) + '<path d="M21 37 L23.4 37 L23.4 54 L21.5 52 Z"/><path d="M39 37 L36.6 37 L36.6 54 L38.5 52 Z"/>')}
    ${g('arms', r(9.5, 32, 6.5, 13) + r(44, 32, 6.5, 13) + r(7.5, 46, 6, 14) + r(46.5, 46, 6, 14))}
    ${g('legs', r(20.5, 64, 8.5, 25, 4) + r(31, 64, 8.5, 25, 4) + r(21.5, 92, 6.5, 19) + r(32, 92, 6.5, 19))}
    <ellipse class="base" cx="24.5" cy="113" rx="4.5" ry="2.5"/><ellipse class="base" cx="35.5" cy="113" rx="4.5" ry="2.5"/>`;
  const back = `
    <circle class="base" cx="30" cy="10" r="8"/>
    ${g('back', '<path d="M23.5 18 L36.5 18 L43 25 L17 25 Z"/><path d="M19 27 L29.4 27 L29.4 49 L24 49 Z"/><path d="M41 27 L30.6 27 L30.6 49 L36 49 Z"/>')}
    ${g('shoulders', '<ellipse cx="16.5" cy="27" rx="6" ry="5"/><ellipse cx="43.5" cy="27" rx="6" ry="5"/>')}
    ${g('arms', r(9.5, 32, 6.5, 13) + r(44, 32, 6.5, 13) + r(7.5, 46, 6, 14) + r(46.5, 46, 6, 14))}
    ${g('hinge', r(24.5, 50, 11, 6, 2) + '<ellipse cx="25.3" cy="60.5" rx="5.3" ry="5"/><ellipse cx="34.7" cy="60.5" rx="5.3" ry="5"/>' + r(20.5, 66, 8.5, 23, 4) + r(31, 66, 8.5, 23, 4))}
    ${g('legs', r(21.5, 92, 6.5, 19) + r(32, 92, 6.5, 19))}
    <ellipse class="base" cx="24.5" cy="113" rx="4.5" ry="2.5"/><ellipse class="base" cx="35.5" cy="113" rx="4.5" ry="2.5"/>`;
  return `<svg class="mmap ${cls}" viewBox="0 0 136 120" aria-hidden="true"><g transform="translate(4,2)">${front}</g><g transform="translate(72,2)">${back}</g></svg>`;
}

// ---------- Recovery: which muscles are ready ----------
function recovery() {
  const last = {};
  for (const w of S.workouts) for (const e of w.exercises) {
    const st = STANDARDS[e.id];
    if (st) last[st[0]] = Math.max(last[st[0]] || 0, w.date + (w.dur || 0) * 1000);
  }
  const state = {}, ready = [], resting = [];
  for (const gname of GROUPS) {
    const hours = last[gname] ? (Date.now() - last[gname]) / 36e5 : Infinity;
    if (hours < 48) { state[gname] = 'rec'; resting.push(gname); } else { state[gname] = 'ready'; ready.push([gname, hours]); }
  }
  ready.sort((a, b) => b[1] - a[1]);
  return { state, ready: ready.map((x) => x[0]), resting };
}
function musclesCard() {
  const rc = recovery();
  const pick = rc.ready.slice(0, 2);
  return `<section class="card muscles-card">
    ${muscleMap(rc.state)}
    <div class="mc-side">
      <span class="eyebrow">${t('myMuscles')}</span>
      <span class="legend"><i class="dot ready"></i>${t('readyLbl')}<i class="dot rec"></i>${t('restingLbl')}</span>
      <b>${pick.length ? t('suggest', { g: pick.map((x) => t('g_' + x)).join(' + ') }) : t('restAll')}</b>
      ${pick.length ? `<button class="btn btn-primary btn-sm" data-act="builder" data-v="${pick.join(',')}">${I.plus}${t('buildBtn')}</button>` : ''}
    </div>
  </section>`;
}

// ---------- Workout builder: muscles -> place -> time -> workout ----------
let bd = null;
const PER_TIME = { 20: 3, 30: 4, 45: 5, 60: 6 };
const PLACE_ICON = {
  gym: '<svg viewBox="0 0 48 48"><path d="M8 18v12M14 13v22M34 13v22M40 18v12M14 24h20"/></svg>',
  dumbbells: '<svg viewBox="0 0 48 48"><path d="M10 20v8M15 16v16M33 16v16M38 20v8M15 24h18"/><path d="M6 40h36"/></svg>',
  bodyweight: '<svg viewBox="0 0 48 48"><circle cx="24" cy="9" r="4"/><path d="M24 14v14M24 18l-9 7M24 18l9 7M24 28l-7 12M24 28l7 12"/></svg>',
};
function shuffled(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
function openBuilder(pre) {
  if (S.active) { openWorkout(); return; }
  bd = { step: pre && pre.length ? 1 : 0, groups: pre && pre.length ? pre : [], place: S.lastPlace || S.profile.equipment, time: S.lastTime || 45, plan: null };
  $('#builder').hidden = false;
  document.body.style.overflow = 'hidden';
  renderBuilder();
}
function closeBuilder() { $('#builder').hidden = true; document.body.style.overflow = ''; }
function buildPlan() {
  const ok = PLACE_OK[bd.place];
  const groups = bd.groups.length ? bd.groups : GROUPS;
  const n = PER_TIME[bd.time];
  const pools = groups.map((gname) => shuffled(Object.keys(STANDARDS).filter((id) => STANDARDS[id][0] === gname && ok.includes(placeOf(id))))
    .sort((a, b) => COMPOUND.includes(b) - COMPOUND.includes(a)));
  const picked = [];
  for (let round = 0; picked.length < n && pools.some((x) => x.length) && round < 12; round++) {
    for (const pool of pools) { if (picked.length >= n) break; const id = pool.shift(); if (id) picked.push(id); }
  }
  picked.sort((a, b) => COMPOUND.includes(b) - COMPOUND.includes(a));
  const goal = S.profile.goal;
  return picked.map((id) => {
    const e = EXERCISES[id], comp = COMPOUND.includes(id);
    let sets = comp ? 4 : 3;
    let reps = goal === 'strength' ? (comp ? '5-8' : '8-10') : goal === 'fat' || goal === 'habit' ? '10-15' : comp ? '8-10' : '10-12';
    if (e.timed) { sets = 3; reps = '30-45'; } else if (e.bw) reps = comp ? '8-15' : '10-20';
    return [id, setsFor(sets), reps];
  });
}
function builderName() {
  return !bd.groups.length || bd.groups.length === GROUPS.length ? t('fullBody') : bd.groups.map((x) => t('g_' + x)).join(' + ');
}
function renderBuilder() {
  const el = $('#builder'), s = bd.step;
  const today = nextDay();
  const tiles = [['all', t('fullBody'), Object.fromEntries(GROUPS.map((x) => [x, 'on']))], ...GROUPS.map((x) => [x, t('g_' + x), { [x]: 'on' }])];
  const allOn = bd.groups.length === GROUPS.length;
  const body = [
    `<button class="card card-tap plan-quick" data-bd="plan"><span class="grow"><span class="eyebrow">${t('todayPlan')}</span><br><b>${esc(dayName(today))}</b> <span class="muted small">· ${esc(dayFocus(today))}</span></span><span class="btn btn-primary btn-sm">${I.play}</span></button>
     <h1>${t('bTitle1')}</h1><p class="muted small">${t('bPick')}</p>
     <div class="tiles">${tiles.map(([k, label, st]) => `<button class="tile" data-bd="g" data-v="${k}" aria-pressed="${k === 'all' ? allOn : bd.groups.includes(k)}">${muscleMap(st)}<b>${label}</b></button>`).join('')}</div>
     <button class="link" data-bd="plans" style="margin-top:14px">${t('seePlan')}</button>`,
    `<h1>${t('bTitle2')}</h1>
     <div class="places">${['gym', 'dumbbells', 'bodyweight'].map((k) => `<button class="place" data-bd="place" data-v="${k}" aria-pressed="${bd.place === k}"><span class="pi">${PLACE_ICON[k]}</span><span><b>${t('place_' + k)}</b><small>${t('placeSub_' + k)}</small></span></button>`).join('')}</div>`,
    `<h1>${t('bTitle3')}</h1>
     <div class="times">${[20, 30, 45, 60].map((m) => `<button class="time" data-bd="time" data-v="${m}" aria-pressed="${bd.time === m}"><b>${m}</b><small>min</small></button>`).join('')}</div>`,
    bd.plan && bd.plan.length ? `<div class="plan-head">${muscleMap(Object.fromEntries((bd.groups.length ? bd.groups : GROUPS).map((x) => [x, 'on'])), 'mmap-wide')}
       <h1>${esc(builderName())}</h1><p class="muted small">${t('place_' + bd.place)} · ${t('nEx', { n: bd.plan.length, m: bd.time })}</p></div>
     <div class="stack">${bd.plan.map(([id, sets, reps], i) => `<button class="card card-tap plan-ex" data-bd="info" data-v="${id}"><span class="pn">${i + 1}</span><span class="grow"><b>${esc(exName(id))}</b><small>${t('g_' + STANDARDS[id][0])}</small></span><span class="sr">${sets} × ${repsLabel(id, reps)}</span></button>`).join('')}</div>`
      : `<h1>${esc(builderName())}</h1><p class="muted">${t('noEx')}</p>`,
  ][s];
  const next = [
    `<button class="btn btn-primary" data-bd="next" ${bd.groups.length ? '' : 'disabled'}>${t('continue')}</button>`,
    `<button class="btn btn-primary" data-bd="next">${t('continue')}</button>`,
    `<button class="btn btn-primary" data-bd="make">${I.plus}${t('createWorkout')}</button>`,
    bd.plan && bd.plan.length ? `<div class="split"><button class="btn" data-bd="shuffle">${t('shuffle')}</button><button class="btn btn-primary" data-bd="go">${I.play}${t('startNow')}</button></div>`
      : `<button class="btn" data-bd="back">${t('back')}</button>`,
  ][s];
  el.innerHTML = `<div class="bd-top"><button class="icon-btn" data-bd="${s ? 'back' : 'close'}" aria-label="${t('back')}">${s ? I.back : I.close}</button>
      <div class="ob-progress">${[0, 1, 2, 3].map((i) => `<i class="${i <= s ? 'on' : ''}"></i>`).join('')}</div></div>
    <div class="bd-body">${body}</div><div class="bd-foot">${next}</div>`;
}
document.getElementById('builder').addEventListener('click', (e) => {
  const b = e.target.closest('[data-bd]');
  if (!b) return;
  const k = b.dataset.bd, v = b.dataset.v;
  if (k === 'close') { closeBuilder(); return; }
  if (k === 'back') bd.step = Math.max(0, bd.step - 1);
  else if (k === 'plan') { closeBuilder(); startWorkout(nextDay().id); return; }
  else if (k === 'plans') { closeBuilder(); go('train'); return; }
  else if (k === 'g') {
    if (v === 'all') bd.groups = bd.groups.length === GROUPS.length ? [] : GROUPS.slice();
    else bd.groups = bd.groups.includes(v) ? bd.groups.filter((x) => x !== v) : [...bd.groups, v];
  } else if (k === 'place') { bd.place = v; bd.step = 2; }
  else if (k === 'time') bd.time = +v;
  else if (k === 'next') bd.step++;
  else if (k === 'make' || k === 'shuffle') { bd.plan = buildPlan(); bd.step = 3; }
  else if (k === 'info') { showExercise(v); return; }
  else if (k === 'go') {
    S.lastPlace = bd.place; S.lastTime = bd.time;
    S.active = {
      dayId: 'custom', name: builderName(), equip: S.profile.equipment, place: bd.place, start: Date.now(),
      exercises: bd.plan.map(([id, sets, reps]) => ({ id, target: reps, sets: Array.from({ length: sets }, () => ({ w: '', r: '', done: false })) })),
    };
    save();
    closeBuilder();
    openWorkout();
    return;
  }
  renderBuilder();
});

// ---------- Logger extras: swap, remove and add exercises ----------
const woPlace = () => (S.active && (S.active.place || S.active.equip)) || 'gym';
function targetFor(id, prevId, prevTarget) {
  const e = EXERCISES[id], pe = prevId && EXERCISES[prevId];
  if (e.timed) return pe && pe.timed ? prevTarget : '30-45';
  if (pe && !pe.timed && !pe.bw === !e.bw) return prevTarget;
  return e.bw ? '8-15' : '8-12';
}
const exAllowed = (id) => (PLACE_OK[woPlace()] || PLACE_OK.gym).includes(placeOf(id)) && !S.active.exercises.some((e) => e.id === id);
function altsFor(id) {
  const st = STANDARDS[id], m0 = EXERCISES[id].muscles[0];
  return Object.keys(EXERCISES)
    .filter((x) => exAllowed(x) && (EXERCISES[x].muscles[0] === m0 || (st && STANDARDS[x] && STANDARDS[x][0] === st[0])))
    .sort((a, b) => (EXERCISES[b].muscles[0] === m0) - (EXERCISES[a].muscles[0] === m0));
}
const exItem = (id, act, extra = '') => `<button class="lib-item" data-act="${act}" data-v="${id}" ${extra}><span class="grow"><b>${esc(exName(id))}</b><small>${esc(EXERCISES[id].muscles.map(muscleName).join(', '))}</small></span>${I.chev}</button>`;
function openExMenu(i) {
  const ex = S.active.exercises[i], locked = ex.sets.some((s) => s.done), alts = locked ? [] : altsFor(ex.id);
  openSheet(`<span class="eyebrow">${t('exOptions')}</span><h2 style="margin-top:6px">${esc(exName(ex.id))}</h2>
    <h3>${t('swapFor')}</h3>
    ${locked ? `<p class="muted small">${t('swapLocked')}</p>` : alts.length ? `<div class="card list-card">${alts.map((id) => exItem(id, 'swap-to', `data-i="${i}"`)).join('')}</div>` : `<p class="muted small">${t('noAlts')}</p>`}
    ${S.active.exercises.length > 1 ? `<button class="btn btn-block" style="margin-top:16px;color:var(--red-2)" data-act="remove-ex" data-i="${i}">${I.trash}${t('removeEx')}</button>` : ''}`);
}
let pickGroup = 'all';
function openExPicker() {
  const list = Object.keys(EXERCISES).filter((x) => exAllowed(x) && (pickGroup === 'all' || STANDARDS[x][0] === pickGroup));
  openSheet(`<span class="eyebrow">${t('addExercise')}</span><h2 style="margin-top:6px">${t('pickTitle')}</h2>
    <div class="chips sheet-chips">${['all', ...GROUPS].map((g) => `<button class="chip" data-act="pick-group" data-v="${g}" aria-pressed="${pickGroup === g}">${g === 'all' ? t('allGroups') : t('g_' + g)}</button>`).join('')}</div>
    ${list.length ? `<div class="card list-card">${list.map((id) => exItem(id, 'add-ex-id')).join('')}</div>` : `<p class="muted small">${t('noAlts')}</p>`}`);
}
function swapEx(i, id) {
  const ex = S.active.exercises[i];
  ex.target = targetFor(id, ex.id, ex.target);
  ex.id = id;
  ex.sets = ex.sets.map(() => ({ w: '', r: '', done: false }));
  save();
  closeSheet();
  renderWorkout();
  toast(t('swapped', { name: exName(id) }));
}
function removeEx(i) {
  const doIt = () => { S.active.exercises.splice(i, 1); save(); renderWorkout(); toast(t('removed')); };
  if (S.active.exercises[i].sets.some((s) => s.done)) confirmSheet(t('removeTitle'), t('removeText'), t('removeEx'), doIt, true);
  else { closeSheet(); doIt(); }
}
function addEx(id) {
  S.active.exercises.push({ id, target: targetFor(id), sets: Array.from({ length: 3 }, () => ({ w: '', r: '', done: false })) });
  save();
  closeSheet();
  renderWorkout();
  toast(t('added', { name: exName(id) }));
  const all = document.querySelectorAll('#workout .wo-ex');
  if (all.length) all[all.length - 1].scrollIntoView({ block: 'center' });
}

// ---------- History: calendar and workout details ----------
let calOffset = 0;
function calendarHtml() {
  const now = new Date(), m = new Date(now.getFullYear(), now.getMonth() + calOffset, 1);
  const y = m.getFullYear(), mo = m.getMonth(), days = new Date(y, mo + 1, 0).getDate(), lead = (m.getDay() + 6) % 7;
  const inMonth = S.workouts.filter((w) => { const d = new Date(w.date); return d.getFullYear() === y && d.getMonth() === mo; });
  const byDay = {};
  for (const w of inMonth) byDay[new Date(w.date).getDate()] = true;
  const firstTs = S.workouts.reduce((a, w) => Math.min(a, w.date), Date.now()), first = new Date(firstTs);
  const canPrev = m > new Date(first.getFullYear(), first.getMonth(), 1);
  const isNow = calOffset === 0;
  const heads = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: 'narrow' }));
  const cells = Array.from({ length: lead }, () => '<span></span>');
  for (let d = 1; d <= days; d++) {
    const cls = `cd${isNow && d === now.getDate() ? ' now' : ''}${isNow && d > now.getDate() ? ' fut' : ''}`;
    cells.push(byDay[d] ? `<button class="${cls} on" data-act="cal-day" data-v="${y}-${mo}-${d}">${d}</button>` : `<span class="${cls}">${d}</span>`);
  }
  return `<div class="cal-head"><button class="icon-btn sm" data-act="cal" data-v="-1" ${canPrev ? '' : 'disabled'} aria-label="${t('prevMonth')}">${I.back}</button>
    <span><b>${esc(m.toLocaleDateString(locale(), { month: 'long', year: 'numeric' }))}</b><small>${t('monthCount', { n: inMonth.length })}</small></span>
    <button class="icon-btn sm" data-act="cal" data-v="1" ${calOffset < 0 ? '' : 'disabled'} aria-label="${t('nextMonth')}">${I.chev}</button></div>
    <div class="cal">${heads.map((h) => `<i>${esc(h)}</i>`).join('')}${cells.join('')}</div>`;
}
function showWorkout(id) {
  const w = S.workouts.find((x) => String(x.id) === id);
  if (!w) return;
  const v = workVolume(w), before = S.workouts.filter((x) => x.date < w.date);
  const rows = w.exercises.map((ex) => {
    const def = EXERCISES[ex.id], old = bestFor(ex.id, before), pr = old > 0 && bestFor(ex.id, [w]) > old;
    return `<div class="hd-ex"><b>${esc(exName(ex.id))}</b>${pr ? `<em class="pr">${t('prTag')}</em>` : ''}<small>${ex.sets.map((s) => (def.bw ? `${s.r}${def.timed ? 's' : ''}` : `${fmtW(s.w)}×${s.r}`)).join('  ·  ')}</small></div>`;
  }).join('');
  openSheet(`<span class="eyebrow">${fmtDate(w.date)}</span><h2 style="margin-top:6px">${esc(histName(w))}</h2>
    <div class="sum-stats"><div><b>${Math.max(1, Math.round(w.dur / 60))}</b><span>${t(Math.round(w.dur / 60) <= 1 ? 'minute' : 'minutes')}</span></div><div><b>${w.exercises.reduce((a, e) => a + e.sets.length, 0)}</b><span>${t('setsWord')}</span></div>${v.kg ? `<div><b>${fmtN(toDisp(v.kg))}</b><span>${t('lifted', { u: unit() })}</span></div>` : `<div><b>${v.reps}</b><span>${t('repsWord')}</span></div>`}</div>
    ${funLine(v.moved, v.est)}
    <div class="card list-card" style="margin-top:14px">${rows}</div>
    <div class="split" style="margin-top:16px"><button class="btn" data-act="del-workout" data-v="${esc(w.id)}" style="color:var(--red-2)">${I.trash}${t('delWorkout')}</button><button class="btn btn-primary" data-act="repeat" data-v="${esc(w.id)}">${I.repeat}${t('repeat')}</button></div>`);
}
function showDay(key) {
  const list = S.workouts.filter((w) => dayKey(w.date) === key);
  if (!list.length) return;
  if (list.length === 1) { showWorkout(String(list[0].id)); return; }
  openSheet(`<span class="eyebrow">${fmtDate(list[0].date)}</span><h2 style="margin-top:6px">${t('nWorkouts', { n: list.length })}</h2>
    <div class="card list-card" style="margin-top:14px">${list.map((w) => `<button class="lib-item" data-act="hist" data-v="${esc(w.id)}"><span class="grow"><b>${esc(histName(w))}</b><small>${Math.max(1, Math.round(w.dur / 60))} min</small></span>${I.chev}</button>`).join('')}</div>`);
}
function repeatWorkout(id) {
  const w = S.workouts.find((x) => String(x.id) === id);
  if (!w) return;
  closeSheet();
  if (S.active) { toast(t('finishFirst')); openWorkout(); return; }
  const progReps = (eid) => { for (const p of Object.values(PROGRAMS)) for (const d of p.days) { const it = d.items.find((x) => x[0] === eid); if (it) return it[2]; } return null; };
  const sameProgram = w.equip === S.profile.equipment && program().days.some((d) => d.id === w.dayId);
  S.active = {
    dayId: sameProgram ? w.dayId : 'custom', name: histName(w), equip: S.profile.equipment, place: w.place || w.equip, start: Date.now(),
    exercises: w.exercises.map((ex) => ({ id: ex.id, target: ex.t || progReps(ex.id) || targetFor(ex.id), sets: ex.sets.map(() => ({ w: '', r: '', done: false })) })),
  };
  save();
  openWorkout();
}

// ---------- "That's like lifting an elephant" ----------
const THINGS = [[30, 'dog', '🐕'], [70, 'kangaroo', '🦘'], [250, 'piano', '🎹'], [500, 'horse', '🐎'], [1300, 'car', '🚗'], [2300, 'rhino', '🦏'], [5000, 'elephant', '🐘'], [8000, 'trex', '🦖'], [12000, 'bus', '🚌'], [30000, 'whale', '🐋'], [150000, 'bluewhale', '🐳'], [420000, 'station', '🛰️']];
// Weight lifted in one workout. Dumbbell weights are per hand; bodyweight reps count as about 60% of bodyweight.
function workVolume(w) {
  const bw = (S.profile && S.profile.bw) || 75;
  let kg = 0, reps = 0, est = 0;
  for (const ex of w.exercises) {
    const def = EXERCISES[ex.id];
    if (!def) continue;
    for (const s of ex.sets) {
      if (!def.bw) kg += s.w * s.r * (def.perHand ? 2 : 1);
      else if (!def.timed) { reps += s.r; est += s.r * bw * 0.6; }
    }
  }
  return { kg, reps, moved: kg + est, est: est > 0 };
}
const fmtNum = (n) => Number(n).toLocaleString(locale());
function funLine(kg, est) {
  let th = null;
  for (const x of THINGS) if (kg >= x[0]) th = x;
  if (!th) return '';
  const n = kg / th[0], v = n < 10 ? Math.round(n * 10) / 10 : Math.round(n);
  const [one, many] = t('th_' + th[1]).split('|');
  return `<div class="fun"><span class="fun-ic">${th[2]}</span><span><b>${t('likeLifting', { n: fmtNum(v), thing: v === 1 ? one : many })}</b>${est ? `<small>${t('approxBw')}</small>` : ''}</span></div>`;
}
function lifetimeCard() {
  const life = S.workouts.reduce((a, w) => { const v = workVolume(w); a.moved += v.moved; a.est = a.est || v.est; return a; }, { moved: 0, est: false });
  if (!life.moved) return '';
  return `<section class="card"><span class="eyebrow">${t('lifetime')}</span><div class="big-num" style="margin-top:8px">${fmtN(toDisp(life.moved))} <span class="muted" style="font-size:18px">${unit()}</span></div>${funLine(life.moved, life.est)}</section>`;
}

// ---------- Daily challenge ----------
const CHALLENGES = [['push-up', 40], ['bw-squat', 80], ['plank', 150], ['lunge', 40], ['crunch', 60], ['glute-bridge', 60], ['superman', 40], ['pike-push-up', 25], ['split-squat', 40], ['leg-raise', 30], ['diamond-push-up', 20], ['chair-dip', 40]];
const CH_MULT = { beginner: 0.5, comeback: 0.5, intermediate: 1, advanced: 1.5 };
const fmtSecs = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
function todayChallenge() {
  const [id, base] = CHALLENGES[todayIdx() % CHALLENGES.length];
  const timed = !!EXERCISES[id].timed, step = timed ? 15 : 5;
  const goal = Math.max(step * 2, Math.round((base * (CH_MULT[S.profile.level] || 1)) / step) * step);
  const key = dayKey(Date.now()), rec = (S.ch && S.ch[key]) || [0, goal];
  return { id, timed, n: rec[0], goal: rec[1], key, done: rec[0] >= rec[1] };
}
function chStreak() {
  if (!S.ch) return 0;
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  const ok = () => { const r = S.ch[dayKey(d.getTime())]; return !!r && r[0] >= r[1]; };
  if (!ok()) d.setDate(d.getDate() - 1);
  let n = 0;
  while (ok()) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function challengeCard() {
  const c = todayChallenge(), st = chStreak(), p = Math.min(1, c.n / c.goal);
  const amt = (v) => (c.timed ? fmtSecs(v) : v);
  const steps = c.timed ? [15, 30, 60] : c.goal <= 30 ? [1, 5, 10] : [5, 10, 20];
  return `<section class="card challenge ${c.done ? 'done' : ''}" id="chCard">
    <div class="card-head"><span class="eyebrow">${t('chTitle')}</span>${st ? `<span class="ch-streak">${I.flame}${t(st === 1 ? 'chStreak1' : 'chStreak', { n: st })}</span>` : ''}</div>
    <div class="ch-main">
      <svg class="ring ch-ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" class="ring-bg"/><circle cx="32" cy="32" r="27" class="ring-fg" stroke-dasharray="169.6" stroke-dashoffset="${(169.6 * (1 - p)).toFixed(1)}"/><text x="32" y="39" text-anchor="middle">${c.done ? '✓' : amt(c.n)}</text></svg>
      <div><b class="ch-goal">${c.timed ? `${esc(exName(c.id))} ${fmtSecs(c.goal)}` : `${c.goal} ${esc(exName(c.id))}`}</b><small>${c.done ? t('chDone') : t('chLeft', { n: amt(c.goal - c.n) })}</small></div>
    </div>
    ${c.done ? '' : `<div class="ch-btns">${steps.map((s) => `<button class="btn btn-sm" data-act="ch" data-v="${s}">+${c.timed ? s + ' s' : s}</button>`).join('')}<button class="icon-btn sm" data-act="ch" data-v="-${steps[0]}" aria-label="${t('undo')}" ${c.n ? '' : 'disabled'}>${I.minus}</button><button class="icon-btn sm" data-act="ex" data-v="${c.id}" aria-label="${t('howTo')}">${I.info}</button></div>`}
  </section>`;
}
function addChallenge(v) {
  const c = todayChallenge();
  const n = clamp(c.n + v, 0, c.goal);
  S.ch = S.ch || {};
  S.ch[c.key] = [n, c.goal];
  const keys = Object.keys(S.ch);
  for (const k of keys.slice(0, Math.max(0, keys.length - 120))) delete S.ch[k];
  save();
  const el = $('#chCard');
  if (el) el.outerHTML = challengeCard();
  if (n >= c.goal && c.n < c.goal) { confetti(60); vibrate([40, 30, 80]); toast(t('chToast')); } else if (v > 0) vibrate(12);
}

// ---------- Plate calculator and 1-rep max ----------
const BARBELL = ['bench-press', 'overhead-press', 'barbell-row', 'barbell-curl', 'squat', 'romanian-deadlift', 'hip-thrust'];
const PLATES = { lb: [45, 35, 25, 10, 5, 2.5], kg: [25, 20, 15, 10, 5, 2.5, 1.25] };
const BARS = { lb: [45, 35, 15], kg: [20, 15, 10] };
const PLATE_COL = ['#C8443B', '#3E6FB0', '#D9B23A', '#4FA374', '#E9E5DC', '#8A9096', '#5F666C'];
const PLATE_H = [96, 88, 78, 62, 50, 40, 32];
function platesFor(total, bar, u) {
  let side = (total - bar) / 2;
  const out = [];
  for (const p of PLATES[u]) while (side >= p - 1e-9) { out.push(p); side -= p; }
  return { out, loaded: bar + 2 * out.reduce((a, b) => a + b, 0) };
}
function plateSvg(list, u) {
  const P = PLATES[u], ws = list.map((p) => (P.indexOf(p) < 3 ? 13 : 9));
  const total = ws.reduce((a, b) => a + b + 2, 0), k = total > 96 ? 96 / total : 1;
  const out = [];
  let xl = 104, xr = 216;
  list.forEach((p, i) => {
    const idx = P.indexOf(p), h = PLATE_H[idx], w = ws[i] * k, y = 60 - h / 2;
    xl -= w;
    out.push(`<rect x="${xl.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="2.5" fill="${PLATE_COL[idx]}"/><rect x="${xr.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="2.5" fill="${PLATE_COL[idx]}"/>`);
    xl -= 2 * k;
    xr += w + 2 * k;
  });
  return `<svg class="plates-svg" viewBox="0 0 320 120" aria-hidden="true"><rect x="4" y="56" width="312" height="8" rx="3" fill="#8A9096"/><rect x="118" y="57" width="84" height="6" fill="#6B7176"/><rect x="104" y="48" width="6" height="24" rx="1.5" fill="#B9BEC2"/><rect x="210" y="48" width="6" height="24" rx="1.5" fill="#B9BEC2"/>${out.join('')}</svg>`;
}
function showPlates(initial) {
  const u = unit();
  const sh = openSheet(`<span class="eyebrow">${t('tool')}</span><h2 style="margin-top:6px">${t('platesTitle')}</h2>
    <div class="split" style="margin-top:16px">
      <div class="field"><label for="plW">${t('totalW', { u })}</label><input id="plW" type="number" inputmode="decimal" value="${initial || ''}" placeholder="${u === 'lb' ? 135 : 60}"></div>
      <div class="field"><label for="plB">${t('barW')}</label><select id="plB">${BARS[u].map((b) => `<option value="${b}">${b} ${u}</option>`).join('')}</select></div>
    </div>
    <div id="plOut"></div>`);
  sheetFn = () => {
    const bar = num($('#plB', sh).value), total = Math.max(bar, num($('#plW', sh).value) || num($('#plW', sh).placeholder));
    const r = platesFor(total, bar, u);
    $('#plOut', sh).innerHTML = `${plateSvg(r.out, u)}
      <div class="plate-list"><span class="eyebrow">${t('perSide')}</span><b>${r.out.length ? r.out.map(fmtNum).join(' + ') : t('barOnly')}</b></div>
      ${Math.abs(r.loaded - total) > 0.01 ? `<p class="muted small" style="text-align:center;margin-top:6px">${t('closest', { w: fmtNum(r.loaded), u })}</p>` : ''}`;
  };
  sheetFn();
}
function showOrm() {
  const u = unit(), stepW = u === 'lb' ? 5 : 2.5;
  const sh = openSheet(`<span class="eyebrow">${t('tool')}</span><h2 style="margin-top:6px">${t('ormTitle')}</h2>
    <div class="split" style="margin-top:16px">
      <div class="field"><label for="oW">${t('ormW', { u })}</label><input id="oW" type="number" inputmode="decimal" placeholder="${u === 'lb' ? 135 : 60}"></div>
      <div class="field"><label for="oR">${t('ormR')}</label><input id="oR" type="number" inputmode="numeric" placeholder="8"></div>
    </div>
    <div id="oOut"></div>
    <p class="muted small" style="margin-top:12px">${t('ormNote')}</p>`);
  sheetFn = () => {
    const w = num($('#oW', sh).value) || num($('#oW', sh).placeholder), r = clamp(Math.round(num($('#oR', sh).value) || 8), 1, 30);
    const m = e1rm(w, r), rnd = (x) => Math.round(x / stepW) * stepW;
    $('#oOut', sh).innerHTML = `<div class="orm-big"><span class="eyebrow">${t('ormRes')}</span><b>${fmtNum(Math.round(m))} <small>${u}</small></b></div>
      <div class="card list-card">${[[95, 2], [90, 4], [85, 6], [80, 8], [75, 10], [70, 12], [65, 15]].map(([pc, reps]) => `<div class="orm-row"><span>${pc}%</span><b>${fmtNum(rnd((m * pc) / 100))} ${u}</b><span class="muted">${t('aboutReps', { n: reps })}</span></div>`).join('')}</div>`;
  };
  sheetFn();
}

// ---------- Charts ----------
function lineChart(points, fmt = (v) => v) {
  if (points.length < 2) return '';
  const W = 320, H = 130, L = 8, R = 36, T = 12, B = 22;
  const xs = points.map((p) => p.t), ys = points.map((p) => p.v);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), yMax = Math.max(...ys) * 1.15 || 1, yMin = Math.min(0, ...ys);
  const X = (v) => L + ((v - x0) / Math.max(1, x1 - x0)) * (W - L - R), Y = (v) => T + (1 - (v - yMin) / (yMax - yMin)) * (H - T - B);
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${X(p.t).toFixed(1)} ${Y(p.v).toFixed(1)}`).join(' ');
  const area = `${line} L${X(x1).toFixed(1)} ${H - B} L${X(x0).toFixed(1)} ${H - B} Z`;
  const last = points[points.length - 1];
  const d = (ts) => new Date(ts).toLocaleDateString(locale(), { month: 'short', day: 'numeric' });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">
    <defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#C8443B" stop-opacity=".45"/><stop offset="1" stop-color="#C8443B" stop-opacity="0"/></linearGradient></defs>
    <path d="${area}" fill="url(#cg)"/><path d="${line}" fill="none" stroke="#E8806F" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${X(last.t)}" cy="${Y(last.v)}" r="5" fill="#C8443B" stroke="#F4EEE4" stroke-width="2"/>
    <text x="${X(last.t) + 8}" y="${Y(last.v) + 5}" class="cv">${fmt(last.v)}</text>
    <text x="${L}" y="${H - 6}" class="cx">${d(x0)}</text><text x="${W - R}" y="${H - 6}" class="cx" text-anchor="end">${d(x1)}</text>
  </svg>`;
}
function scoreChart() {
  if (!S.workouts.length) return `<p class="muted small" style="margin-top:8px">${t('progressEmpty')}</p>`;
  const pts = [];
  let ws = weekStart(S.workouts[0].date);
  const end = Date.now();
  while (ws <= end) {
    const until = Math.min(end, ws + 7 * DAY);
    pts.push({ t: until, v: computeScore(S.workouts.filter((w) => w.date < until)).total });
    ws = weekStart(ws + 8 * DAY);
  }
  return lineChart(pts) || `<p class="muted small" style="margin-top:8px">${t('progressEmpty')}</p>`;
}
function exerciseChart(id) {
  const def = EXERCISES[id], pts = [];
  for (const w of S.workouts) {
    const ex = w.exercises.find((e) => e.id === id);
    if (!ex) continue;
    const v = Math.max(...ex.sets.map((s) => (def.bw ? s.r : e1rm(s.w, s.r))));
    if (v > 0) pts.push({ t: w.date, v: def.bw ? v : +fmtW(v) });
  }
  if (pts.length < 2) return '';
  return `<h3>${def.bw ? t('exProgressReps') : t('exProgressW', { u: unit() })}</h3>${lineChart(pts)}`;
}

// ---------- Share cards (an image for stories and posts) ----------
let shareBlob = null;
function loadImg(src) { return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; }); }
async function makeCard({ eyebrow, title, stats, r }) {
  const W = 1080, H = 1350, cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  try { await Promise.all([document.fonts.load('120px "Bebas Neue"'), document.fonts.load('600 32px Inter')]); } catch (e) { /* fonts optional */ }
  g.fillStyle = '#0E1012'; g.fillRect(0, 0, W, H);
  let grad = g.createRadialGradient(780, 560, 40, 780, 560, 640);
  grad.addColorStop(0, 'rgba(200,68,59,.55)'); grad.addColorStop(1, 'rgba(200,68,59,0)');
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  grad = g.createRadialGradient(780, -100, 20, 780, -100, 900);
  grad.addColorStop(0, 'rgba(255,255,255,.14)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  if (r === TOP) { // light rays behind the top rank
    g.save(); g.translate(780, 560);
    for (let i = 0; i < 24; i++) { g.rotate(Math.PI / 12); g.fillStyle = 'rgba(255,230,190,.07)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(900, -50); g.lineTo(900, 50); g.fill(); }
    g.restore();
  }
  if (AVATAR_READY) {
    try {
      const im = await loadImg(avatarSrc(r));
      const h = 1260, w = (im.width / im.height) * h;
      g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 40;
      g.drawImage(im, 780 - w / 2, H - h + 40, w, h); g.restore();
    } catch (e) { /* draw without the character */ }
  }
  const shade = g.createLinearGradient(0, 0, 640, 0);
  shade.addColorStop(0, 'rgba(14,16,18,.92)'); shade.addColorStop(1, 'rgba(14,16,18,0)');
  g.fillStyle = shade; g.fillRect(0, 0, 700, H);
  g.textBaseline = 'alphabetic';
  g.font = '64px "Bebas Neue", sans-serif'; g.fillStyle = '#EDEAE4'; g.fillText('EARNED', 70, 120);
  const ew = g.measureText('EARNED ').width; g.fillStyle = '#C8443B'; g.fillText('STRENGTH', 70 + ew, 120);
  g.font = '600 30px Inter, sans-serif'; g.fillStyle = '#93999E'; g.fillText(eyebrow.toUpperCase(), 72, 250);
  g.font = '150px "Bebas Neue", sans-serif'; g.fillStyle = '#F4EEE4';
  const words = String(title).toUpperCase().split(' '); let line = '', y = 390;
  for (const wd of words) { const test = line ? line + ' ' + wd : wd; if (g.measureText(test).width > 560 && line) { g.fillText(line, 66, y); y += 140; line = wd; } else line = test; }
  if (line) g.fillText(line, 66, y);
  y += 120;
  for (const [v, label] of stats) {
    g.font = '110px "Bebas Neue", sans-serif'; g.fillStyle = '#E8806F'; g.fillText(String(v), 70, y + 90);
    g.font = '600 30px Inter, sans-serif'; g.fillStyle = '#93999E'; g.fillText(label, 72, y + 132);
    y += 190;
  }
  g.font = '600 30px Inter, sans-serif'; g.fillStyle = '#EDEAE4'; g.fillText('earnedstrength.online', 72, H - 70);
  g.fillStyle = RANKS[r].color; g.font = '64px "Bebas Neue", sans-serif'; g.textAlign = 'right'; g.fillText(RANKS[r].name.toUpperCase(), W - 60, H - 64); g.textAlign = 'left';
  return new Promise((res) => cv.toBlob(res, 'image/png'));
}
async function openShare(blob) {
  shareBlob = blob;
  const url = URL.createObjectURL(blob);
  openSheet(`<span class="eyebrow">${t('share')}</span><img class="share-preview" src="${url}" alt="">
    <div class="split" style="margin-top:14px"><a class="btn" href="${url}" download="earned-strength.png">${t('saveImg')}</a><button class="btn btn-primary" data-act="share-file">${I.share}${t('share')}</button></div>`);
}
async function shareFile() {
  if (!shareBlob) return;
  const file = new File([shareBlob], 'earned-strength.png', { type: 'image/png' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share({ files: [file], title: 'Earned Strength' });
    else { const a = document.createElement('a'); a.href = URL.createObjectURL(shareBlob); a.download = 'earned-strength.png'; a.click(); }
  } catch (e) { /* the person closed the share menu */ }
}
async function shareWorkout() {
  const w = S.workouts[S.workouts.length - 1];
  if (!w) return;
  const vol = workVolume(w);
  const stats = [[Math.max(1, Math.round(w.dur / 60)), t('cardMin')], [w.exercises.reduce((sum, e) => sum + e.sets.length, 0), t('cardSets')]];
  if (vol.kg > 0) stats.push([fmtN(toDisp(vol.kg)), t('lifted', { u: unit() })]);
  else if (vol.reps > 0) stats.push([vol.reps, t('repsWord')]);
  openShare(await makeCard({ eyebrow: t('cardWorkout'), title: histName(w), stats, r: rankIndex(computeScore().total) }));
}
async function shareRank() {
  const sc = computeScore(), r = rankIndex(sc.total);
  openShare(await makeCard({ eyebrow: t('cardRank'), title: RANKS[r].name, stats: [[`${sc.total}/100`, t('cardScore')], [streakWeeks(), t('weekStreak')], [S.workouts.length, t('cardWorkouts')]], r }));
}

// ---------- Celebrations ----------
function confetti(n = 60) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.createElement('div');
  box.className = 'confetti';
  const colors = ['#C8443B', '#E8806F', '#F4EEE4', '#E58A4E', '#FFD8A8'];
  for (let i = 0; i < n; i++) {
    const b = document.createElement('i');
    b.style.left = Math.random() * 100 + '%';
    b.style.background = colors[i % colors.length];
    b.style.setProperty('--dx', (Math.random() * 160 - 80).toFixed(0) + 'px');
    b.style.setProperty('--r', (Math.random() * 720 - 360).toFixed(0) + 'deg');
    b.style.animationDelay = (Math.random() * 0.35).toFixed(2) + 's';
    b.style.animationDuration = (1.3 + Math.random() * 0.9).toFixed(2) + 's';
    box.appendChild(b);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 2800);
}

// ---------- Achievements ----------
function badges() {
  const sc = computeScore(), n = S.workouts.length, st = streakWeeks();
  const bw = (S.profile && S.profile.bw) || 0;
  const benchBw = bw > 0 && S.workouts.some((w) => w.exercises.some((e) => e.id === 'bench-press' && e.sets.some((x) => e1rm(x.w, x.r) >= bw)));
  const B = (key, on, icon) => ({ key, on, icon });
  return [
    B('bFirst', n >= 1, I.play), B('bTen', n >= 10, I.train), B('bFifty', n >= 50, I.train),
    B('bStreak3', st >= 3, I.flame), B('bIron', sc.total >= RANKS[1].at, I.rank), B('bForged', sc.total >= RANKS[3].at, I.rank),
    B('bBench', benchBw, I.check), B('bLimit', sc.total >= RANKS[5].at, I.rank),
  ];
}

// ---------- Character images on the Rank tab ----------
// One image of the channel character per rank (and an optional flexing one), in app/avatar/.
// Until the real images are added, a simple drawn placeholder shows where they go.
// Made with ../avatar-images/prepare.py from the Google Flow images (app/avatar/*.webp).
// Which picture each rank shows: ranks share the closest picture until each one has its own.
const AVATAR_READY = true;
const AVATAR_RANK = ['rank-1', 'rank-2', 'rank-3', 'rank-4', 'rank-5', 'rank-6'];
const AVATAR_FLEXES = [null, null, null, null, 'flex-5', 'flex-5'];
const hasFlex = (i) => !AVATAR_READY || !!AVATAR_FLEXES[i];
const avatarSrc = (i, flex) => (!AVATAR_READY ? placeholderSvg(i, flex)
  : `/app/avatar/${flex && AVATAR_FLEXES[i] ? AVATAR_FLEXES[i] : AVATAR_RANK[i]}.webp`);
const TOP = RANKS.length - 1;
function placeholderSvg(i, flex) {
  const m = i / (RANKS.length - 1);
  const sh = 44 + 26 * m, wa = 27 + 2 * m, arm = 10 + 6 * m, leg = 15 + 5 * m, neck = 9 + 4 * m;
  const armPath = (sx) => flex
    ? `M${100 + sx * (sh - 6)} 84 L${100 + sx * (sh + 34)} 92 L${100 + sx * (sh + 30)} 54`
    : `M${100 + sx * (sh - 6)} 84 L${100 + sx * (sh + 6)} 150 L${100 + sx * (sh + 4)} 190`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
    <g stroke="#15171a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <path d="${armPath(-1)}" fill="none" stroke-width="${arm + 3}"/><path d="${armPath(1)}" fill="none" stroke-width="${arm + 3}"/>
      <path d="${armPath(-1)}" fill="none" stroke="#5c6168" stroke-width="${arm}"/><path d="${armPath(1)}" fill="none" stroke="#5c6168" stroke-width="${arm}"/>
      <rect x="${100 - wa + 2}" y="200" width="${leg}" height="80" rx="7" fill="#5c6168"/><rect x="${100 + wa - 2 - leg}" y="200" width="${leg}" height="80" rx="7" fill="#5c6168"/>
      <rect x="${100 - wa - 2}" y="276" width="${leg + 8}" height="12" rx="5" fill="#1e2226"/><rect x="${100 + wa - 6 - leg}" y="276" width="${leg + 8}" height="12" rx="5" fill="#1e2226"/>
      <path d="M${100 - sh} 80 Q100 ${68 - 4 * m} ${100 + sh} 80 L${100 + wa} 156 L${100 - wa} 156 Z" fill="#5c6168"/>
      <path d="M${100 + sh - 14} 76 L${100 + sh - 2} 84 L${100 - wa + 6} 152 L${100 - wa - 4} 146 Z" fill="#C8443B"/>
      <path d="M${100 - wa - 3} 150 L${100 + wa + 3} 150 L${100 + wa + 6} 222 L102 222 L100 196 L98 222 L${100 - wa - 6} 222 Z" fill="#C8443B"/>
      <rect x="${100 - neck}" y="52" width="${neck * 2}" height="22" fill="#5c6168"/>
      <ellipse cx="100" cy="42" rx="19" ry="23" fill="#5c6168"/>
      <path d="M88 38 L97 41 M112 38 L103 41" stroke-width="3"/>
    </g></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
let iaFlex = false;
let iaBusy = false;
function mountAvatar() {
  const fig = $('#iaFigure'), tilt = $('#iaTilt');
  if (!fig) return;
  const r = rankIndex(computeScore().total);
  // A rank reached since the last visit gets its moment.
  if (S.seenRank == null) { S.seenRank = r; save(); }
  else if (r > S.seenRank) { const from = S.seenRank; S.seenRank = r; save(); setTimeout(() => playRankUp(from, r), 350); }
  else if (r < S.seenRank) { S.seenRank = r; save(); }
  // Lean the figure toward the finger (a bit of depth without 3D).
  let x0 = null;
  fig.addEventListener('pointerdown', (e) => { x0 = e.clientX; fig.setPointerCapture(e.pointerId); tilt.style.transition = 'none'; });
  fig.addEventListener('pointermove', (e) => {
    if (x0 == null) return;
    const d = clamp((e.clientX - x0) * 0.12, -16, 16);
    tilt.style.transform = `rotateY(${d}deg) rotateX(${-Math.abs(d) * 0.08}deg)`;
  });
  const release = () => { x0 = null; tilt.style.transition = ''; tilt.style.transform = ''; };
  fig.addEventListener('pointerup', release);
  fig.addEventListener('pointercancel', release);
}
function swapImage(src, alt) {
  const img = $('#iaImg');
  if (!img) return;
  img.classList.remove('enter');
  void img.offsetWidth;
  img.src = src;
  if (alt) img.alt = alt;
  img.classList.add('enter');
}
function playRankUp(from, to) {
  if (iaBusy || !$('#iaImg')) return;
  iaBusy = true;
  const flash = $('#iaFlash'), banner = $('#iaBanner'), R = RANKS[to];
  $('#iaImg').src = avatarSrc(from);
  setTimeout(() => {
    flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
    vibrate([60, 40, 60, 40, 140]);
    setTimeout(() => confetti(70), 250);
    setTimeout(() => {
      swapImage(avatarSrc(to, iaFlex), R.name);
      $('#stage').classList.toggle('ia-max', to === TOP);
      $('#iaName').textContent = R.name;
      $('#iaName').parentElement.style.setProperty('--c', R.color);
      $('#iaLine').textContent = rankLine(to, R);
      banner.querySelector('b').textContent = R.name;
      banner.style.setProperty('--c', R.color);
      banner.classList.remove('show'); void banner.offsetWidth; banner.classList.add('show');
      setTimeout(() => { banner.classList.remove('show'); iaBusy = false; }, 2200);
    }, 260);
  }, 500);
}

// ---------- Global actions ----------
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const k = b.dataset.act, v = b.dataset.v;
  if (k === 'go') go(v);
  else if (k === 'start') startWorkout(v);
  else if (k === 'resume') openWorkout();
  else if (k === 'ex') showExercise(v);
  else if (k === 'rest') startRest(S.rest);
  else if (k === 'calc') showCalc();
  else if (k === 'close-sheet') dismissSheet();
  else if (k === 'daily') { S.daily = { [dayKey(Date.now())]: +v }; save(); render(); }
  else if (k === 'learn-tab') { learnTab = v; render(); }
  else if (k === 'learn-videos') { e.preventDefault(); learnTab = 'videos'; go('learn'); }
  else if (k === 'quiz') { S.quiz.answer = +v; S.quiz.total++; if ((+v === 1) === mythAt(S.quiz.idx).fact) S.quiz.right++; save(); render(); }
  else if (k === 'quiz-next') { S.quiz.idx++; S.quiz.answer = null; save(); render(); }
  else if (k === 'filter') { libFilter = v; render(); }
  else if (k === 'builder') openBuilder(v ? v.split(',') : null);
  else if (k === 'share-workout') shareWorkout();
  else if (k === 'share-rank') shareRank();
  else if (k === 'share-file') shareFile();
  else if (k === 'swap-to') swapEx(+b.dataset.i, v);
  else if (k === 'remove-ex') removeEx(+b.dataset.i);
  else if (k === 'add-ex-id') addEx(v);
  else if (k === 'pick-group') { pickGroup = v; openExPicker(); }
  else if (k === 'hist') showWorkout(v);
  else if (k === 'cal-day') showDay(v);
  else if (k === 'cal') { calOffset = Math.min(0, calOffset + +v); const c = $('#calCard'); if (c) c.innerHTML = calendarHtml(); }
  else if (k === 'repeat') repeatWorkout(v);
  else if (k === 'del-workout') confirmSheet(t('delTitle'), t('delText'), t('delWorkout'), () => { S.workouts = S.workouts.filter((x) => String(x.id) !== v); save(); render(); toast(t('deleted')); }, true);
  else if (k === 'ch') addChallenge(+v);
  else if (k === 'plates') showPlates('');
  else if (k === 'orm') showOrm();
  else if (k === 'ia-flex') {
    iaFlex = !iaFlex;
    b.setAttribute('aria-pressed', iaFlex);
    const r = rankIndex(computeScore().total);
    swapImage(avatarSrc(r, iaFlex));
  }
  else if (k === 'ia-demo') {
    // Preview: animate from the current rank to the next one (wraps around at the top).
    const r = rankIndex(computeScore().total), shown = RANKS.findIndex((x) => x.name === $('#iaName').textContent);
    const from = shown >= 0 ? shown : r;
    iaFlex = false;
    const fb = $('[data-act="ia-flex"]');
    if (fb) fb.setAttribute('aria-pressed', 'false');
    playRankUp(from, (from + 1) % RANKS.length);
  }
  else if (k === 'export') exportData();
  else if (k === 'import') $('#importFile').click();
  else if (k === 'demo') confirmSheet(t('demoTitle'), t('demoText'), t('demoYes'), () => { loadDemo(); render(); toast(t('demoAdded')); });
  else if (k === 'intro') location.href = location.pathname + '?splash' + location.hash;
  else if (k === 'reset') confirmSheet(t('resetTitle'), t('resetText'), t('resetYes'), () => { const l = S.lang; S = blank(); S.lang = l; save(); ob = freshOb(); showOnboard(); }, true);
});
document.getElementById('scrim').addEventListener('click', dismissSheet);
for (const ev of ['input', 'change']) document.getElementById('sheet').addEventListener(ev, () => { if (sheetFn) sheetFn(); });
document.getElementById('sheet').addEventListener('click', (e) => {
  const b = e.target.closest('[data-rest]');
  if (!b) return;
  const v = b.dataset.rest;
  if (v === 'skip') endRest(false);
  else if (v === 'hide') { restSheetOpen = false; closeSheet(); tickRest(); }
  else if (v === '+15' || v === '-15') { rest.end += (v === '+15' ? 15 : -15) * 1000; rest.total = Math.max(rest.total, Math.ceil((rest.end - Date.now()) / 1000)); tickRest(); }
  else { rest.total = +v; rest.end = Date.now() + +v * 1000; tickRest(); }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#sheet').hidden) dismissSheet(); });
document.addEventListener('change', (e) => {
  if (e.target.id === 'importFile') { importData(e.target.files[0]); return; }
  const f = e.target.dataset && e.target.dataset.field;
  if (!f) return;
  const val = e.target.value;
  if (f === 'lang') { S.lang = val; setLang(val); }
  else if (f === 'rest') S.rest = +val;
  else if (f === 'days') S.profile.days = +val;
  else if (f === 'bw') S.profile.bw = Math.round(toKg(num(val)) * 10) / 10;
  else if (f === 'age') S.profile.age = clamp(Math.round(num(val)), 14, 100);
  else if (f === 'name') S.profile.name = val.trim().slice(0, 24);
  else S.profile[f] = val;
  save();
  if (['lang', 'units', 'equipment', 'name', 'goal', 'level', 'days', 'rest'].includes(f)) render();
  toast(t('saved'));
});

function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `earned-strength-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
async function importData(file) {
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.v !== 1 || !Array.isArray(data.workouts)) throw new Error('bad file');
    S = { ...blank(), ...data };
    setLang(S.lang || getLang());
    save();
    render();
    toast(t('backupLoaded'));
  } catch (err) { toast(t('badBackup')); }
}

// Sample history so the screens can be previewed with data.
function loadDemo() {
  const p = program(), bw = S.profile.bw || 80;
  const now = new Date();
  const sessions = [];
  for (let wk = 10; wk >= 0; wk--) {
    if (wk === 6) continue; // a missed week, to show the streak resetting
    const mon = new Date(weekStart(now.getTime()));
    mon.setDate(mon.getDate() - wk * 7);
    for (const off of [0, 2, 4].slice(0, S.profile.days)) {
      const d = new Date(mon);
      d.setDate(d.getDate() + off);
      d.setHours(18, 0, 0, 0);
      if (d.getTime() < Date.now() - DAY / 2) sessions.push({ ts: d.getTime(), prog: 1 - wk / 10 });
    }
  }
  let k = 0;
  const made = sessions.map(({ ts, prog }) => {
    const day = p.days[k++ % p.days.length];
    return {
      id: 'demo' + ts.toString(36), dayId: day.id, name: dayName(day), equip: S.profile.equipment, date: ts, dur: 2700 + (k % 4) * 300,
      exercises: day.items.map(([id, sets, reps]) => {
        const def = EXERCISES[id];
        const [a, b] = String(reps).split('-').map(Number);
        let r = b || a, w = 0;
        // Sample numbers that move from about 15% to 45% of each exercise's standard.
        const st = STANDARDS[id], lvl = 0.12 + 0.33 * prog + (Math.random() - 0.5) * 0.1;
        if (st && st[1] !== 'ratio') r = Math.round(st[2] + (st[3] - st[2]) * lvl);
        else if (st) w = Math.max(1.25, Math.round((bodyBase(bw) * (st[2] + (st[3] - st[2]) * lvl)) / (1 + r / 30) / 1.25) * 1.25);
        else if (!def.bw) w = Math.round((bw * (0.12 + 0.08 * prog)) / 1.25) * 1.25;
        return { id, sets: Array.from({ length: setsFor(sets) }, (_, j) => ({ w, r: Math.max(1, r - (j === setsFor(sets) - 1 ? 1 : 0)) })) };
      }),
    };
  });
  S.workouts = [...S.workouts.filter((w) => !String(w.id).startsWith('demo')), ...made].sort((x, y) => x.date - y.date);
  save();
}

// ---------- Start ----------
runSplash();
if (!S.profile) showOnboard();
else {
  const h = location.hash.slice(1);
  current = TABS.some((x) => x[0] === h) ? h : 'home';
  render();
}
