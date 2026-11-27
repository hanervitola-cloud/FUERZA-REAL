// Earned Strength app prototype. Everything is stored on the phone (localStorage).
import { RANKS, RANK_EXAMPLES, EXERCISES, PROGRAMS, GOALS, LEVELS, EQUIPMENT, MYTHS, ARTICLES, VIDEOS, ACTIVITY, STANDARDS, GROUPS, placeOf, PLACE_OK, COMPOUND } from './data.js';
import {
  t, setLang, getLang, detectLang, defaultUnits, locale, muscleName, exText, exNames, programName, dayName, dayFocus,
  optText, rankLine, rankExample, mythText, articleCat, articleTitle, videoTopic, activityText,
} from './i18n.js';
import { PUNCHES, COMBO_SETS, COMBOS, LESSONS, SPORTS } from './combat.js';
import { exFigure, lessonFigure } from './figures.js';
import { bodySvg } from './bodymap.js';
import { MOVES } from './moves.js';
import { buildPlan as makePlan, autoSplit, timesPerWeek, SPLITS, BLOCK_WEEKS } from './plan.js';
import { QUOTES, PROGRESS_QUOTES, personalQuotes } from './quotes.js';
import { coachReply, SUGGEST, QUICK } from './coach.js';
import * as net from './net.js';
import { CHALLENGES as CAM_CHALLENGES, challengeById, ruleOf, Counter, loadPose, detect, openCamera, stopCamera, drawPose, drawPoseOn } from './repcount.js';

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
  down: '<svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  rotate: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/></svg>',
  yt: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none"/></svg>',
  list: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>',
  target: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z"/><path d="M8.5 8.5h7M8.5 11.5h4.5"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  camera: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.8"/></svg>',
  trophy: '<svg viewBox="0 0 24 24"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v4M8 21h8M9.5 18h5"/></svg>',
  gloves: '<svg viewBox="0 0 24 24"><path d="M7 10.5V8.2C7 5.3 9.2 3.5 12 3.5h1.3c2.9 0 4.9 2.1 4.9 5v3.6c0 2.4-1.5 4.2-3.8 4.7V20H8.6v-3.4C7.6 15.9 7 14.8 7 13.5z"/><path d="M7 11h3.6a1.9 1.9 0 0 1 0 3.8H8.8"/><path d="M8.6 18h5.8"/></svg>',
};
const LOGO = '<img class="logo-img" src="icons/logo-512.png" alt="Earned Strength">';

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
// Best score (0-100) per muscle group, without looking at the plan (the plan itself uses it).
function groupBests(workouts = S.workouts) {
  const bw = (S.profile && S.profile.bw) || 0, af = ageFactor((S.profile && S.profile.age) || 30), best = {};
  for (const w of workouts) for (const ex of w.exercises || []) {
    const st = STANDARDS[ex.id];
    if (!st) continue;
    const [group, type, lo, hi] = st;
    for (const s of ex.sets) {
      let val;
      if (type === 'ratio') { if (!bw || !s.w) continue; val = e1rm(s.w, s.r) / bodyBase(bw); } else val = s.r;
      best[group] = Math.max(best[group] || 0, clamp((((val * af) / sexAdj(group) - lo) / (hi - lo)) * 100, 0, 100));
    }
  }
  return best;
}
// The muscle group furthest behind gets an extra set (only once there is enough data to know).
function laggingGroup() {
  if (S.workouts.length < 6) return null;
  const b = groupBests(), ks = GROUPS.filter((g) => b[g] > 0);
  return ks.length < 3 ? null : ks.sort((x, y) => b[x] - b[y])[0];
}
// The plan is built from the person's answers and changes every 4-week block (plan.js).
let planCache = { key: '', plan: null };
function program() {
  const P = S.profile || {};
  if (!S.plan) S.plan = { split: 'auto', start: Date.now() };
  const lag = laggingGroup(), wk = Math.floor((Date.now() - S.plan.start) / (7 * DAY));
  const key = JSON.stringify([P.days, P.minutes, P.equipment, P.level, P.goal, P.focus, S.plan, wk, lag]);
  if (planCache.key !== key) planCache = { key, plan: makePlan(P, S.plan, Date.now(), lag) };
  return planCache.plan;
}
const progName = () => t('split_' + program().split);
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
// Women's results are compared with standards scaled to the usual strength difference (more for the upper body).
const SEX_ADJ = { chest: 0.6, shoulders: 0.62, back: 0.65, arms: 0.62, legs: 0.72, hinge: 0.75, core: 0.9 };
const sexAdj = (group) => { const sx = S.profile && S.profile.sex; const f = SEX_ADJ[group] || 0.7; return sx === 'f' ? f : sx === 'x' ? (1 + f) / 2 : 1; };
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
        best[group] = Math.max(best[group] || 0, clamp((((val * af) / sexAdj(group) - lo) / (hi - lo)) * 100, 0, 100));
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
  if (!prev.length) {
    const st = STANDARDS[ex.id], P = S.profile || {};
    if (def.bw || !st || st[1] !== 'ratio' || !P.bw) return null;
    const frac = { beginner: 0.1, comeback: 0.16, intermediate: 0.3, advanced: 0.48 }[P.level] || 0.15;
    const adj = sexAdj(st[0]);
    const e1 = bodyBase(P.bw) * (st[2] + (st[3] - st[2]) * frac) * adj;
    const lo = +String(ex.target).split('-')[0] || 8;
    const step = unit() === 'lb' ? 5 / LB : def.perHand ? 2 : 2.5;
    const w = Math.max(step, Math.round(((e1 / (1 + lo / 30)) * 0.85) / step) * step);
    return { kind: 'start', w, lo };
  }
  const [lo, hi] = String(ex.target).split('-').map(Number);
  const top = hi || lo;
  if (def.bw) return { kind: 'reps', r: Math.max(...prev.map((s) => s.r)) + (def.timed ? 5 : 1) };
  const w = Math.max(...prev.map((s) => s.w));
  if (!w) return null;
  const atW = prev.filter((s) => s.w === w);
  if (atW.every((s) => s.r >= top)) {
    // Steps that exist on real bars, machines and dumbbells: 2.5 kg (2 kg per dumbbell) or 5 lb.
    const step = unit() === 'lb' ? 5 / LB : def.perHand ? 2 : 2.5;
    const next = Math.round((w + step) / step) * step;
    return { kind: 'up', w: next > w ? next : w + step, d: step, lo };
  }
  return { kind: 'same', w, lo, top, some: atW.some((s) => s.r >= top) };
}
function suggLine(ex) {
  const sg = suggestFor(ex), def = EXERCISES[ex.id];
  if (!sg) return '';
  const txt = sg.kind === 'reps' ? t('suggReps', { r: `${sg.r} ${t(def.timed ? 'seconds' : 'reps')}` })
    : sg.kind === 'up' ? t('suggUp', { w: fmtW(sg.w), u: unit(), d: fmtW(sg.d) })
    : sg.kind === 'start' ? t('suggStart', { w: fmtW(sg.w), u: unit() })
    : t(sg.some ? 'suggSameTop' : 'suggSame', { w: fmtW(sg.w), u: unit(), r: sg.top });
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
const OB_STEPS = ['welcome', 'name', 'sex', 'goal', 'focus', 'level', 'days', 'time', 'equipment', 'body', 'target', 'why', 'building', 'ready'];
const WHY = ['look', 'strong', 'health', 'confidence', 'sport'];
const freshOb = () => ({ step: 0, unitsTouched: false, building: false, d: { name: '', sex: null, goal: null, focus: [], level: null, days: 3, minutes: 45, equipment: null, units: defaultUnits(getLang()), bw: '', height: '', age: '', target: '', why: null } });
let ob = freshOb();
function optList(list, key) {
  return `<div class="opts">${list.map((o) => { const x = optText(o); return `<button class="opt" type="button" data-ob="${key}" data-v="${o.id}" aria-pressed="${ob.d[key] === o.id}"><span><b>${esc(x.name)}</b><small>${esc(x.note)}</small></span><i class="radio"></i></button>`; }).join('')}</div>`;
}
const kgTo = (u, kg) => (u === 'lb' ? kg * LB : kg);
const bodyOk = (d) => num(d.bw) > 20 && num(d.age) >= 14 && num(d.age) <= 100 && num(d.height) >= 120 && num(d.height) <= 230;
const obKg = (d) => toKgFrom(d.units, num(d.bw));
const obTargetKg = (d) => (num(d.target) > 20 ? toKgFrom(d.units, num(d.target)) : obKg(d));
const suggestTarget = (d) => Math.round(kgTo(d.units, obKg(d) * (d.goal === 'fat' ? 0.9 : d.goal === 'muscle' ? 1.06 : 1)));

// The numbers behind the plan screen: daily food targets and a realistic weight line.
function planNumbers(d) {
  const kg = obKg(d), cm = num(d.height), age = num(d.age), target = obTargetKg(d);
  const sx = d.sex === 'f' ? -161 : d.sex === 'm' ? 5 : -78;
  const bmr = 10 * kg + 6.25 * cm - 5 * age + sx;
  const kcal = Math.round((bmr * (d.days <= 2 ? 1.375 : d.days <= 4 ? 1.5 : 1.65) * (d.goal === 'fat' ? 0.82 : d.goal === 'muscle' ? 1.1 : 1)) / 50) * 50;
  const protein = Math.round(kg * (d.goal === 'fat' ? 2 : 1.8));
  const water = Math.round(kg * 0.035 * 10) / 10;
  const diff = target - kg, pts = [];
  let weeks = 0;
  if (Math.abs(diff) >= 0.5) {
    // About 0.75% of bodyweight a week when losing, about a quarter kilo a week when gaining.
    weeks = Math.min(52, Math.max(2, Math.ceil(Math.abs(diff) / (diff < 0 ? kg * 0.0075 : 0.25))));
    for (let i = 0; i <= weeks; i++) {
      const u = i / weeks, curve = diff < 0 ? 1 - Math.pow(1 - u, 1.4) : u;
      pts.push({ t: Date.now() + i * 7 * DAY, v: Math.round(kgTo(d.units, kg + diff * curve) * 10) / 10 });
    }
  }
  return { kcal, protein, water, weeks, pts, target };
}
function planHtml(d) {
  const n = planNumbers(d);
  const end = new Date(Date.now() + n.weeks * 7 * DAY).toLocaleDateString(locale(), { month: 'long', day: 'numeric' });
  const focus = !d.focus.length || d.focus.length === GROUPS.length ? t('wholeBody') : d.focus.map((g) => t('g_' + g)).join(', ');
  const phrase = t('whyQ_' + (d.why || 'strong'), { days: d.days });
  return `<div class="ob-hello"><img src="${avatarSrc(0)}" alt=""><div><span class="eyebrow">${t('obPlanEyebrow')}</span><h1>${t('obPlanTitle', { name: esc(d.name) })}</h1></div></div>
    <blockquote class="ob-quote">“${esc(phrase)}”</blockquote>
    ${n.weeks ? `<section class="card ob-chart"><span class="eyebrow">${t('obChartTitle')}</span>
      <div class="ob-chart-head"><b>${Math.round(kgTo(d.units, n.target))} ${d.units}</b><small>${t('obChartSub', { n: n.weeks, date: esc(end) })}</small></div>
      ${lineChart(n.pts, (v) => v, true)}</section>` : ''}
    <section class="card ob-timeline"><span class="eyebrow">${t('obTimelineTitle')}</span>
      <ol>${[1, 4, 8, 12].map((w, i) => `<li><b>${t('weekN', { n: w })}</b><span>${t('obT' + (i + 1))}</span></li>`).join('')}</ol></section>
    <div class="sum-stats ob-stats"><div><b>${n.protein}</b><span>${t('obProtein')}</span></div><div><b>${fmtN(n.kcal)}</b><span>${t('obKcal')}</span></div><div><b>${n.water}</b><span>${t('obWater')}</span></div></div>
    <section class="card ob-planbox"><span class="eyebrow">${t('yourPlan')}</span><b>${esc(t('split_' + autoSplit(d.days)))}</b>
      <span class="ob-tags"><span>${t('nDays', { n: d.days })} / ${t('weekWord')}</span><span>${d.minutes} min</span><span>${esc(focus)}</span></span></section>
    <p class="muted small" style="margin-top:12px">${t('obEstimate')} ${t('obPrivate')}</p>`;
}

function renderOnboard() {
  const el = $('#onboard');
  const step = OB_STEPS[ob.step], d = ob.d;
  const opt = (key, id, title, note) => `<button class="opt" type="button" data-ob="${key}" data-v="${id}" aria-pressed="${d[key] === id}"><span><b>${esc(title)}</b>${note ? `<small>${esc(note)}</small>` : ''}</span><i class="radio"></i></button>`;
  const body = {
    welcome: `${AVATAR_READY ? `<div class="ob-char"><img src="${avatarSrc(TOP)}" alt=""></div>` : `<div class="ob-hero">${LOGO}</div>`}<h1>${t('obWelcomeTitle')}</h1><p>${t('obWelcomeText')}</p>
      <ul class="ob-points">
        <li><span class="obp-ic">${I.camera}</span><span><b>${t('obN1')}</b><br><span class="muted small">${t('obN1t')}</span></span></li>
        <li><span class="obp-ic">${I.train}</span><span><b>${t('obN2')}</b><br><span class="muted small">${t('obN2t')}</span></span></li>
        <li><span class="obp-ic">${I.chat}</span><span><b>${t('obN3')}</b><br><span class="muted small">${t('obN3t')}</span></span></li>
        <li><span class="obp-ic">${I.trophy}</span><span><b>${t('obN4')}</b><br><span class="muted small">${t('obN4t')}</span></span></li>
      </ul>
      <p class="ob-note">${t('healthNote')}</p>`,
    name: `<h1>${t('obNameTitle')}</h1><p>${t('obNameText')}</p>
      <div class="field"><label for="obName">${t('name')}</label><input id="obName" autocomplete="given-name" maxlength="24" value="${esc(d.name)}" placeholder="${t('yourName')}"></div>`,
    sex: `<h1>${t('obSexTitle')}</h1><p>${t('obSexText')}</p><div class="opts">${opt('sex', 'm', t('sexM'))}${opt('sex', 'f', t('sexF'))}${opt('sex', 'x', t('sexX'), t('sexXNote'))}</div>`,
    goal: `<h1>${t('obGoalTitle')}</h1><p>${t('obGoalText')}</p>${optList(GOALS, 'goal')}`,
    focus: `<h1>${t('obFocusTitle')}</h1><p>${t('obFocusText')}</p>
      <div class="tiles"><button class="tile" type="button" data-ob="focus" data-v="all" aria-pressed="${d.focus.length === GROUPS.length}">${muscleMap(Object.fromEntries(GROUPS.map((g) => [g, 'on'])))}<b>${t('wholeBody')}</b></button>${GROUPS.map((g) => `<button class="tile" type="button" data-ob="focus" data-v="${g}" aria-pressed="${d.focus.length < GROUPS.length && d.focus.includes(g)}">${muscleMap({ [g]: 'on' })}<b>${t('g_' + g)}</b></button>`).join('')}</div>`,
    level: `<h1>${t('obLevelTitle')}</h1><p>${t('obLevelText')}</p>${optList(LEVELS, 'level')}`,
    days: `<h1>${t('obDaysTitle')}</h1><p>${t('obDaysText')}</p>
      <div class="days">${[2, 3, 4, 5, 6].map((n) => `<button class="opt" type="button" data-ob="days" data-v="${n}" aria-pressed="${d.days === n}">${n}</button>`).join('')}</div>
      <p class="muted small" style="margin-top:14px">${t('obDaysNote')}</p>`,
    time: `<h1>${t('obTimeTitle')}</h1><p>${t('obTimeText')}</p>
      <div class="times">${[30, 45, 60, 75, 90].map((m) => `<button class="time" type="button" data-ob="minutes" data-v="${m}" aria-pressed="${d.minutes === m}"><b>${m}</b><small>min</small></button>`).join('')}</div>`,
    equipment: `<h1>${t('obEquipTitle')}</h1><p>${t('obEquipText')}</p>${optList(EQUIPMENT, 'equipment')}`,
    body: `<h1>${t('obBodyTitle')}</h1><p>${t('obBodyText')}</p>
      <div class="unit-toggle">${['lb', 'kg'].map((u) => `<button class="opt" type="button" data-ob="units" data-v="${u}" aria-pressed="${d.units === u}" style="justify-content:center"><b>${u}</b></button>`).join('')}</div>
      <div class="split">
        <div class="field"><label for="obBw">${t('bodyweight', { u: d.units })}</label><input id="obBw" type="number" inputmode="decimal" min="30" max="700" value="${esc(d.bw)}" placeholder="${d.units === 'lb' ? '175' : '80'}"></div>
        <div class="field"><label for="obHeight">${t('heightCm')}</label><input id="obHeight" type="number" inputmode="numeric" min="120" max="230" value="${esc(d.height)}" placeholder="175"></div>
      </div>
      <div class="field" style="margin-top:12px"><label for="obAge">${t('age')}</label><input id="obAge" type="number" inputmode="numeric" min="14" max="100" value="${esc(d.age)}" placeholder="25"></div>`,
    target: `<h1>${t('obTargetTitle')}</h1><p>${t('obTargetText')}</p>
      <div class="field"><label for="obTarget">${t('targetW', { u: d.units })}</label><input id="obTarget" type="number" inputmode="decimal" value="${esc(d.target)}" placeholder="${suggestTarget(d)}"></div>
      <p class="muted small" style="margin-top:10px">${t('obTargetHint', { w: suggestTarget(d), u: d.units })}</p>`,
    why: `<h1>${t('obWhyTitle')}</h1><p>${t('obWhyText')}</p><div class="opts">${WHY.map((w) => opt('why', w, t('why_' + w))).join('')}</div>`,
    building: `<div class="ob-build"><div class="ob-ring"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" class="ring-bg"/><circle cx="32" cy="32" r="27" class="ring-fg" id="obRing" stroke-dasharray="169.6" stroke-dashoffset="169.6"/></svg><b id="obPct">0%</b></div>
      <h1>${t('obBuildTitle')}</h1><ul class="ob-checks">${['obB1', 'obB2', 'obB3', 'obB4'].map((k) => `<li>${I.check}<span>${t(k)}</span></li>`).join('')}</ul></div>`,
    ready: step === 'ready' ? planHtml(d) + `<div class="ob-start"><span class="eyebrow">${t('obStartT')}</span><ol>${['obS1', 'obS2', 'obS3'].map((k, i) => `<li><span>${i + 1}</span>${t(k)}</li>`).join('')}</ol></div>` : '',
  }[step];
  const valid = { welcome: true, name: d.name.length >= 2, sex: !!d.sex, goal: !!d.goal, focus: d.focus.length > 0, level: !!d.level, days: !!d.days, time: !!d.minutes, equipment: !!d.equipment, body: bodyOk(d), target: true, why: !!d.why, building: false, ready: true }[step];
  const label = step === 'welcome' ? t('getStarted') : step === 'ready' ? t('letsGo') : t('continue');
  const moved = ob.shown !== ob.step ? (ob.shown == null || ob.step > ob.shown ? ' fwd' : ' bwd') : ' same';
  ob.shown = ob.step;
  el.innerHTML = `
    <div class="ob-bar"><i style="width:${Math.round((ob.step / (OB_STEPS.length - 1)) * 100)}%"></i></div>
    <div class="ob-body${moved}">${body}</div>
    ${step === 'building' ? '' : `<div class="ob-foot" ${ob.step === 0 ? 'style="grid-template-columns:1fr"' : ''}>
      ${ob.step > 0 ? `<button class="btn" type="button" data-ob="back" aria-label="${t('back')}">${I.back}</button>` : ''}
      <button class="btn btn-primary" type="button" data-ob="next" ${valid ? '' : 'disabled'}>${label}</button>
    </div>`}`;
  for (const inp of el.querySelectorAll('.ob-body input')) {
    inp.addEventListener('input', () => {
      if (inp.id === 'obName') { d.name = inp.value.trim(); $('[data-ob="next"]', el).disabled = d.name.length < 2; return; }
      if (inp.id === 'obTarget') { d.target = inp.value; return; }
      if (inp.id === 'obBw') d.bw = inp.value;
      if (inp.id === 'obHeight') d.height = inp.value;
      if (inp.id === 'obAge') d.age = inp.value;
      $('[data-ob="next"]', el).disabled = !bodyOk(d);
    });
  }
  const nm = $('#obName', el);
  if (nm) {
    nm.focus();
    nm.addEventListener('keydown', (e) => { if (e.key === 'Enter' && d.name.length >= 2) $('[data-ob="next"]', el).click(); });
  }
  if (step === 'building' && !ob.building) {
    // A short "building your plan" moment, ticking off each part.
    ob.building = true;
    let pct = 0;
    const iv = setInterval(() => {
      pct = Math.min(100, pct + 2);
      const ring = $('#obRing'), label2 = $('#obPct');
      if (ring) ring.setAttribute('stroke-dashoffset', (169.6 * (1 - pct / 100)).toFixed(1));
      if (label2) label2.textContent = `${pct}%`;
      el.querySelectorAll('.ob-checks li').forEach((li, i) => li.classList.toggle('on', pct >= (i + 1) * 24));
      if (pct >= 100) {
        clearInterval(iv);
        setTimeout(() => { ob.building = false; if (OB_STEPS[ob.step] === 'building') { ob.step++; renderOnboard(); } }, 350);
      }
    }, 45);
  }
}
function showOnboard() {
  $('#onboard').hidden = false;
  renderOnboard();
}
document.getElementById('onboard').addEventListener('click', (e) => {
  const b = e.target.closest('[data-ob]');
  if (!b) return;
  const k = b.dataset.ob, d = ob.d, v = b.dataset.v;
  if (k === 'next') {
    if (OB_STEPS[ob.step] === 'ready') {
      const bw = Math.round(obKg(d) * 10) / 10;
      S.profile = {
        name: d.name, sex: d.sex, goal: d.goal, focus: d.focus, level: d.level, days: d.days, minutes: d.minutes, equipment: d.equipment, units: d.units,
        bw, height: Math.round(num(d.height)), age: Math.round(num(d.age)), target: num(d.target) > 20 ? Math.round(obTargetKg(d) * 10) / 10 : null, why: d.why,
      };
      S.bodyLog = [{ d: Date.now(), kg: bw }];
      save();
      $('#onboard').hidden = true;
      go('home');
      toast(t('welcome'));
      confetti(90);
      vibrate([40, 30, 80]);
      return;
    }
    ob.step++;
  } else if (k === 'back') {
    ob.step = Math.max(0, ob.step - 1);
    if (OB_STEPS[ob.step] === 'building') ob.step--;
  } else if (k === 'days' || k === 'minutes') d[k] = +v;
  else if (k === 'focus') {
    if (v === 'all') d.focus = d.focus.length === GROUPS.length ? [] : GROUPS.slice();
    else { const cur = d.focus.length === GROUPS.length ? [] : d.focus; d.focus = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]; }
  }
  else { d[k] = v; if (k === 'units') ob.unitsTouched = true; }
  renderOnboard();
});

// ---------- Views ----------
const TABS = [['home', 'tabHome', I.home], ['train', 'tabTrain', I.list], ['build', 'fabLabel', I.train], ['sports', 'tabSports', I.gloves], ['rank', 'tabProgress', I.rank]];
let current = 'home';
let lastView = '';
let learnTab = 'quiz';
let sportSel = null;
let trainTab = 'routines';
let progTab = 'summary';
let libQuery = '';
let libFilter = 'All';

function go(v) {
  if (location.hash !== '#' + v) history.replaceState(null, '', '#' + v);
  current = v;
  render();
}
window.addEventListener('hashchange', () => {
  if (takeChallengeLink() && S.profile) { current = 'vs'; render(); return; }
  const v = location.hash.slice(1);
  if (!Object.hasOwn(VIEWS, v)) return;
  if (!$('#sheet').hidden) dismissSheet();
  current = v;
  render();
});

function render() {
  if (!S.profile) return; // still in the first-time questions
  $('#tabs').innerHTML = TABS.map(([id, label, icon]) => id === 'build'
    ? `<button class="tab tab-main" type="button" data-act="builder"><span class="tab-fab">${icon}</span><span>${t('fabLabel')}</span></button>`
    : `<button class="tab" type="button" data-act="go" data-v="${id}" ${current === id ? 'aria-current="page"' : ''}>${icon}<span>${t(label)}</span></button>`).join('');
  const fresh = current !== lastView;
  lastView = current;
  $('#main').innerHTML = `<div class="view v-${current}${fresh ? ' enter' : ''}">${VIEWS[current]()}</div>`;
  window.scrollTo(0, 0);
  if (current === 'rank' && progTab === 'body') loadPhotos();
  if (current === 'friends') loadFriends();
  if (current === 'rank') { mountAvatar(); const cur = $('#rankLadder .cur'); if (cur) cur.parentElement.scrollLeft = Math.max(0, cur.offsetLeft - 70); }
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
    const thisWeek = S.workouts.filter((w) => w.date >= weekStart(Date.now())).length;
    const d = nextDay();
    const doneToday = S.workouts.some((w) => dayKey(w.date) === dayKey(Date.now()));
    const p = next ? (sc.total - RANKS[r].at) / (next.at - RANKS[r].at) : 1;
    const today = S.active
      ? `<button class="card card-tap next-card row" data-act="resume"><span class="grow"><span class="eyebrow">${t('inProgress')}</span><br><b>${esc(histName(S.active))}</b></span><span class="btn btn-primary btn-sm">${t('resume')}</span></button>`
      : doneToday
        ? `<section class="card today-done"><span class="td-ic">${I.check}</span><span class="grow"><b>${t('doneToday')}</b><small>${t('upNext', { name: esc(dayName(d)) })}</small></span><button class="btn btn-sm" data-act="start" data-v="${d.id}">${t('trainAgain')}</button></section>`
        : `<section class="card next-card">
        <div class="today-top"><div class="grow"><span class="eyebrow">${t('todayWorkout')}</span>
        <div class="h2" style="margin-top:6px">${esc(dayName(d))}</div>
        <p class="muted small">${esc(dayFocus(d))} · ${t('aboutMin', { n: d.items.length * 9 })}</p></div>
        ${muscleMap(dayMuscles(d), 'mmap-today')}</div>
        <button class="btn btn-primary btn-block" data-act="start" data-v="${d.id}">${I.play} ${t('startWorkout')}</button>
        <button class="btn btn-block warm-btn" data-act="warm" data-v="${d.id}">${I.flame}${t('wmBtn')}</button>
        <button class="link other-btn" data-act="builder">${t('otherWorkout')}</button>
      </section>`;
    return `
      <section class="hero" style="--c:${RANKS[r].color}">
        <div class="hero-copy">
          <p class="eyebrow">${new Date().toLocaleDateString(locale(), { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h1>${greeting()}${S.profile.name ? ',<br>' + esc(S.profile.name) : ''}</h1>
          <button class="hero-rank" data-act="go" data-v="rank">
            <svg class="ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" class="ring-bg"/><circle cx="32" cy="32" r="27" class="ring-fg" stroke-dasharray="169.6" stroke-dashoffset="${(169.6 * (1 - p)).toFixed(1)}"/><text x="32" y="38" text-anchor="middle">${sc.total}</text></svg>
            <span><span class="eyebrow">${t('yourRank')}</span><b>${esc(RANKS[r].name)}</b><small>${next ? t('pointsTo', { n: next.at - sc.total, rank: esc(next.name) }) : t('topRank')}</small></span>
          </button>
          ${levelPill()}
        </div>
        <img class="hero-img" src="${avatarSrc(r)}" alt="">
        <button class="icon-btn hero-chat" data-act="go" data-v="coach" aria-label="${t('coachTitle')}">${I.chat}</button>
        <button class="icon-btn hero-me" data-act="go" data-v="me" aria-label="${t('tabMe')}">${I.me}</button>
      </section>
      ${today}
      ${weekCard()}
      ${missionsCard()}
      ${foodCard()}
      ${coachCard(r)}
      ${vsHomeCard()}
      ${homeTiles(thisWeek)}`;
  },

  train() {
    const tabs = [['routines', 'tRoutines'], ['exercises', 'tExercises'], ['history', 'history'], ['tools', 'tools']];
    if (!tabs.some(([id]) => id === trainTab)) trainTab = 'routines';
    let body = '';
    if (trainTab === 'routines') {
      const p = program(), lvl = LEVELS.find((l) => l.id === S.profile.level), nd = nextDay().id, mine = S.routines || [];
      body = `
      <button class="card card-tap build-cta" data-act="builder"><span class="bc-ic">${I.plus}</span><span class="grow"><b>${t('buildBtnBig')}</b><small>${t('buildSub')}</small></span>${I.chev}</button>
      ${musclesCard()}
      <div class="section-title"><span class="eyebrow">${t('myRoutines')}</span></div>
      ${mine.length ? `<section class="card list-card">${mine.map((x) => `<div class="rt"><button class="rt-main" data-act="rt-info" data-v="${x.id}"><b>${esc(x.name)}</b><small>${t(x.items.length === 1 ? 'nExShort1' : 'nExShort', { n: x.items.length })} · ${t('place_' + (x.place || 'gym'))}</small></button><button class="btn btn-sm btn-primary" data-act="rt-start" data-v="${x.id}" aria-label="${t('start')}">${I.play}</button></div>`).join('')}</section>`
        : `<p class="muted small empty">${t('noRoutines')}</p>`}
      <div class="section-title"><span class="eyebrow">${t('yourPlan')}</span></div>
      <section class="card plan-card">
        <div class="pc-top"><div class="grow"><b>${esc(progName())}</b><small>${t('planMeta', { days: S.profile.days, min: S.profile.minutes || 45, place: t('place_' + (S.profile.equipment || 'gym')) })}${lvl ? ' · ' + esc(optText(lvl).name) : ''}</small></div><button class="btn btn-sm" data-act="programs">${t('planAdjust')}</button></div>
        <div class="blk"><b>${t('blockN', { n: p.block + 1 })}</b><span class="blk-dots">${[...Array(BLOCK_WEEKS).keys()].map((i) => `<i class="${i + 1 < p.week ? 'done' : i + 1 === p.week ? 'cur' : ''}"></i>`).join('')}</span><span class="muted small">${t('weekOf', { w: p.week, n: BLOCK_WEEKS })}</span></div>
        <p class="small muted">${p.deload ? t('deloadNote') : t('blockNote')}</p>
        ${p.lagging ? `<p class="small lag">${I.up}<span>${t('lagNote', { g: t('g_' + p.lagging) })}</span></p>` : ''}
      </section>
      <details class="card fold how-plan"><summary><span class="hp-t">${I.info}${t('howPlanTitle')}</span>${I.chev}</summary>
        <ul class="how-list">${['planWhy_' + p.split, 'howSets', 'howRest', 'howProgress', 'howBlocks'].map((k) => `<li>${t(k)}</li>`).join('')}</ul></details>
      ${p.days.map((d) => `<section class="card day">
        <div class="day-head"><span class="row"><span class="day-letter">${esc(dayName(d)[0])}</span><span><b>${esc(dayName(d))}</b><br><span class="muted small">${esc(dayFocus(d))}</span></span></span>
        <button class="btn btn-sm ${d.id === nd ? 'btn-primary' : ''}" data-act="start" data-v="${d.id}">${t(d.id === nd ? 'next' : 'start')}</button></div>
        <ul class="ex-list" style="margin-bottom:0">${d.items.map(([id, sets, reps]) => `<li><button class="link" style="color:var(--text);text-align:left" data-act="ex" data-v="${id}">${esc(exName(id))}</button><span>${setsFor(sets)} × ${repsLabel(id, reps)}</span></li>`).join('')}</ul>
      </section>`).join('')}`;
    } else if (trainTab === 'exercises') {
      if (!(libFilter in LIB_GROUPS)) libFilter = 'fAll';
      body = `<label class="search">${I.search}<input type="search" data-search placeholder="${t('searchEx')}" value="${esc(libQuery)}" autocomplete="off"></label>
      <div class="chips">${Object.keys(LIB_GROUPS).map((g) => `<button class="chip" data-act="filter" data-v="${g}" aria-pressed="${libFilter === g}">${t(g)}</button>`).join('')}</div>
      <section class="card list-card" id="libList">${libListHtml()}</section>`;
    } else if (trainTab === 'history') {
      const hist = [...S.workouts].reverse().slice(0, 12);
      body = `<section class="card" id="calCard">${calendarHtml()}</section>
      <section class="card list-card">${hist.length ? hist.map((w) => `<button class="lib-item" data-act="hist" data-v="${esc(w.id)}"><span class="grow"><b>${esc(histName(w))}</b><small>${fmtDate(w.date)} · ${Math.max(1, Math.round(w.dur / 60))} min · ${w.rounds ? t('nRounds', { n: w.rounds.n }) : t('nSets', { n: w.exercises.reduce((a, e) => a + e.sets.length, 0) })}</small></span>${I.chev}</button>`).join('') : `<p class="hist muted">${t('noHistory')}</p>`}</section>`;
    } else {
      const tool = (act, icon, title, sub, v) => `<button class="card card-tap tool" data-act="${act}" ${v ? `data-v="${v}"` : ''}>${icon}<b>${t(title)}</b><span>${t(sub)}</span></button>`;
      body = `<div class="tools">${tool('rest', I.timer, 'restTimer', 'restTimerSub')}${tool('plates', I.plates, 'platesTool', 'platesSub')}${tool('orm', I.gauge, 'ormTitle', 'ormSub')}${tool('calc', I.calc, 'calcTitle', 'calcSub')}${tool('fight', I.bell, 'roundsBtn', 'roundsTool', 'rounds')}${tool('fight', I.gloves, 'shadowBtn', 'shadowTool', 'shadow')}${tool('warm', I.flame, 'wmTitle', 'wmTool')}</div>`;
    }
    return `<header class="top"><div><h1>${t('tabTrain')}</h1></div></header>
      <div class="chips seg">${tabs.map(([id, l]) => `<button class="chip" data-act="train-tab" data-v="${id}" aria-pressed="${trainTab === id}">${t(l)}</button>`).join('')}</div>${body}`;
  },

  rank() {
    const tabs = [['summary', 'pSummary'], ['exercises', 'tExercises'], ['body', 'pBody'], ['awards', 'badges']];
    if (!tabs.some(([id]) => id === progTab)) progTab = 'summary';
    const seg = `<header class="top"><div><h1>${t('tabProgress')}</h1></div></header><div class="chips seg">${tabs.map(([id, l]) => `<button class="chip" data-act="prog-tab" data-v="${id}" aria-pressed="${progTab === id}">${t(l)}</button>`).join('')}</div>`;
    if (progTab === 'exercises') return seg + exRanksHtml();
    if (progTab === 'body') return seg + bodyHtml();
    if (progTab === 'awards') {
      const r = rankIndex(computeScore().total);
      return seg + `
      ${badgesHtml()}
      <details class="card fold">
        <summary><span class="eyebrow">${t('howRank')}</span>${I.chev}</summary>
        <ul class="ex-list" style="color:var(--text);margin-bottom:4px">${['howRank1', 'howRank2', 'howRank5', 'howRank3', 'howRank4'].map((k) => `<li><span>${t(k)}</span></li>`).join('')}</ul>
      </details>
      <div class="section-title"><span class="eyebrow">${t('allRanks')}</span></div>
      <section class="card list-card"><ul class="ladder">${RANKS.map((x, i) => `<li class="${i === r ? 'current' : i > r ? 'locked' : ''}" style="--c:${x.color}"><i></i><span><b>${esc(x.name)}</b><br><span class="muted small">${esc(rankExample(i, RANK_EXAMPLES[i]))}</span></span><em>${x.at}+</em></li>`).join('')}</ul></section>`;
    }
    const sc = computeScore(), r = rankIndex(sc.total), R = RANKS[r], next = RANKS[r + 1];
    const p = next ? (sc.total - R.at) / (next.at - R.at) : 1;
    return seg + `
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
        <button class="btn btn-sm btn-primary" data-act="share-rank">${I.share}${t('shareRank')}</button>
      </div>
      ${rankLadder(r, sc)}
      ${bodyRanks(sc)}
      ${AVATAR_READY ? '' : `<p class="muted small" style="text-align:center">${t('placeholderNote')}</p>`}
      <section class="card">
        <div class="card-head"><span class="eyebrow">${t('strengthScore')}</span><span class="big-num">${sc.total}<span class="muted" style="font-size:18px"> / 100</span></span></div>
        <div class="bar"><i style="width:${(p * 100).toFixed(0)}%"></i></div>
        <p class="muted small" style="margin-top:10px">${next ? t('pointsTo', { n: next.at - sc.total, rank: esc(next.name) }) : t('reachedTop')}</p>
      </section>
      <section class="card"><span class="eyebrow">${t('progress')}</span>${scoreChart()}</section>
      <div class="split">
        <div class="card"><span class="eyebrow">${t('strength')}</span><b>${sc.strength}</b><span class="muted small">${t('strengthSub')}</span></div>
        <div class="card"><span class="eyebrow">${t('consistency')}</span><b>${sc.consistency}</b><span class="muted small">${t('weeksHit', { n: sc.goalWeeks })}</span></div>
      </div>
      ${lifetimeCard()}
      <section class="card">
        <span class="eyebrow">${t('byGroup')}</span>
        ${flipMap(Object.fromEntries(sc.groups.map(([g, v]) => [g, v >= 50 ? 'on' : v >= 20 ? 'mid' : v > 0 ? 'low' : ''])))}
        <div class="groups">${sc.groups.map(([g, v]) => `<div class="grp"><span>${t('g_' + g)}</span><div class="bar"><i style="width:${v}%;background:${RANKS[rankIndex(v)].color}"></i></div>${rkChip(RANKS[rankIndex(v)])}</div>`).join('')}</div>
        <p class="muted small" style="margin-top:10px">${t('byGroupNote')}</p>
      </section>
`;
  },

  learn() {
    const tabs = [['quiz', 'quizTab'], ['articles', 'articlesTab'], ['videos', 'videosTab']];
    if (!tabs.some(([id]) => id === learnTab)) learnTab = 'quiz';
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
    return `<header class="top me-top"><button class="icon-btn" data-act="go" data-v="home" aria-label="${t('back')}">${I.back}</button><div class="grow"><p class="eyebrow">${t('tagline')}</p><h1>${t('tabLearn')}</h1></div></header>
      <div class="chips seg">${tabs.map(([id, l]) => `<button class="chip" data-act="learn-tab" data-v="${id}" aria-pressed="${learnTab === id}">${t(l)}</button>`).join('')}</div>${body}`;
  },

  sports() {
    if (sportSel) return sportDetail(sportSel);
    const n = (k) => LESSONS.filter((l) => l.kind === k).length;
    return `<header class="top"><div><p class="eyebrow">${t('sportsEyebrow')}</p><h1>${t('tabSports')}</h1></div></header>
      ${vsHomeCard()}
      ${SPORTS.map(({ id: k, card }) => `<button class="sport-card sp-${k}" data-act="sport" data-v="${k}">
        <span class="sp-txt"><span class="eyebrow">${t('sportLabel_' + k)}</span><b>${t(k + 'Title')}</b><small>${t(k + 'Sub')}</small><span class="sp-meta">${t('nLessons', { n: n(k) })} ${I.chev}</span></span>
        <span class="sp-art">${heroArt(card)}</span>
      </button>`).join('')}
      <div class="section-title"><span class="eyebrow">${t('fightTools')}</span></div>
      <div class="tools">${toolTile('fight', I.gloves, 'shadowBtn', 'shadowTool', 'shadow')}${toolTile('fight', I.bell, 'roundsBtn', 'roundsTool', 'rounds')}</div>
      <section class="card safety"><b>${I.info}${t('safetyTitle')}</b><p class="small">${t('safetyText')}</p></section>`;
  },

  coach() {
    const r = rankIndex(computeScore().total);
    return `<header class="top me-top coach-top"><button class="icon-btn" data-act="go" data-v="home" aria-label="${t('back')}">${I.back}</button>
      <span class="coach-av"><img src="${avatarSrc(r)}" alt=""><i></i></span><div class="grow"><h1 class="h2">${t('coachTitle')}</h1><p class="muted small">${t('coachOnline')}</p></div>
      ${(S.chat || []).length ? `<button class="link small" data-act="coach-clear">${t('coachClear')}</button>` : ''}</header>
      <div class="chat" id="chat">${chatHtml()}</div>
      <div class="chat-dock"><div class="chat-quick">${QUICK.map((q) => `<button class="chip" data-act="coach-ask" data-v="${esc(q[getLang() === 'es' ? 3 : 2])}">${esc(q[getLang() === 'es' ? 1 : 0])}</button>`).join('')}</div>
      <form class="chat-bar" id="chatForm" autocomplete="off"><input id="chatIn" type="text" enterkeyhint="send" maxlength="300" placeholder="${t('coachPlaceholder')}" aria-label="${t('coachPlaceholder')}"><button class="chat-send" type="submit" aria-label="${t('coachSend')}">${I.send}</button></form></div>`;
  },

  me() {
    const P = S.profile;
    const sel = (field, list, val) => `<select data-field="${field}">${list.map((o) => `<option value="${o.id}" ${String(o.id) === String(val) ? 'selected' : ''}>${esc(o.name)}</option>`).join('')}</select>`;
    const tx = (list) => list.map((o) => ({ id: o.id, name: optText(o).name }));
    return `
      <header class="top me-top"><button class="icon-btn" data-act="go" data-v="home" aria-label="${t('back')}">${I.back}</button><div class="grow"><p class="eyebrow">${t('profile')}</p><h1>${esc(P.name || t('you'))}</h1><p>${t('nLogged', { n: S.workouts.length })}</p></div></header>
      <section class="card stack">
        <div class="field"><span class="lbl">${t('language')}</span>${sel('lang', [{ id: 'auto', name: t('langAuto') }, { id: 'en', name: 'English' }, { id: 'es', name: 'Español' }], S.lang || 'auto')}</div>
        <div class="field"><label>${t('name')}</label><input data-field="name" maxlength="24" value="${esc(P.name)}"></div>
        <div class="split">
          <div class="field"><label>${t('bodyweight', { u: unit() })}</label><input data-field="bw" type="number" inputmode="decimal" value="${P.bw ? fmtW(P.bw) : ''}"></div>
          <div class="field"><label>${t('age')}</label><input data-field="age" type="number" inputmode="numeric" min="14" max="100" value="${P.age || ''}"></div>
        </div>
        <div class="split">
          <div class="field"><label>${t('heightCm')}</label><input data-field="height" type="number" inputmode="numeric" min="120" max="230" value="${P.height || ''}"></div>
          <div class="field"><span class="lbl">${t('sexLbl')}</span>${sel('sex', [{ id: 'm', name: t('sexM') }, { id: 'f', name: t('sexF') }, { id: 'x', name: t('sexX') }], P.sex || 'm')}</div>
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
      ${remindCard()}
      ${acctCard()}
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
// Online account: friends, ranking, live rooms, AI coach and backup. No email, no password.
function acctCard() {
  const A = S.acct;
  if (!A) {
    return `<section class="card stack acct"><span class="eyebrow">${t('acctTitle')}</span><p class="small muted">${t('acctWhy')}</p>
      <button class="btn btn-primary btn-sm" data-act="acct-on">${t('acctOn')}</button><button class="link small" data-act="acct-restore">${t('acctHave')}</button></section>`;
  }
  const when = S.backupAt ? fmtDate(S.backupAt) : t('acctNever');
  return `<section class="card stack acct"><span class="eyebrow">${t('acctTitle')}</span>
    <div class="acct-code"><span><small>${t('acctFriendCode')}</small><b>${esc(A.code)}</b></span><button class="btn btn-sm" data-act="acct-share">${I.share}${t('share')}</button></div>
    <div class="split"><button class="btn btn-sm" data-act="friend-add">${I.plus}${t('friendAdd')}</button><button class="btn btn-sm" data-act="friends">${t('friendsTitle')}</button></div>
    <div class="acct-row"><span class="grow"><b>${t('backupTitle')}</b><small>${t('backupLast', { d: when })}</small></span><button class="btn btn-sm" data-act="backup-now">${t('backupNow')}</button></div>
    <div class="split"><button class="btn btn-sm" data-act="backup-restore">${t('backupRestore')}</button><button class="btn btn-sm" data-act="acct-code">${t('acctRecovery')}</button></div>
    <button class="link small" data-act="acct-delete" style="color:var(--red-2)">${t('acctDelete')}</button></section>`;
}
const backupData = () => { const { acct, chat, ...rest } = S; return rest; };
async function backupNow(quiet) {
  try {
    await ensureAccount();
    await net.pushBackup(backupData());
    S.backupAt = Date.now();
    save();
    if (!quiet) { toast(t('backupDone')); if (current === 'me') render(); }
  } catch (e) { if (!quiet) toast(t(net.isOnline() ? 'vsRankFail' : 'vsNeedNet')); }
}
function autoBackup() { if (S.acct && S.profile && net.isOnline() && Date.now() - (S.backupAt || 0) > 12 * 36e5) backupNow(true); }
async function acctAction(k) {
  if (k === 'acct-on') { try { await ensureAccount(); toast(t('acctReady')); render(); } catch (e) { toast(t('vsNeedNet')); } }
  else if (k === 'acct-share') { vs.shareText = t('acctShareText', { code: S.acct.code }); vsSend(); }
  else if (k === 'acct-code') {
    openSheet(`<span class="eyebrow">${t('acctTitle')}</span><h2 style="margin-top:6px">${t('acctRecovery')}</h2><p class="muted small" style="margin:6px 0 12px">${t('acctRecoveryP')}</p>
      <div class="vs-code"><code class="big">${esc(net.recoveryCode(S.acct.token))}</code></div><button class="btn btn-block" style="margin-top:12px" data-act="acct-copy">${t('vsCopy')}</button>`);
  } else if (k === 'acct-copy') { vs.shareText = net.recoveryCode(S.acct.token); vsCopy(); }
  else if (k === 'acct-restore') {
    openSheet(`<span class="eyebrow">${t('acctTitle')}</span><h2 style="margin-top:6px">${t('acctHave')}</h2><p class="muted small" style="margin:6px 0 12px">${t('acctRestoreP')}</p>
      <input class="vs-in" id="acctIn" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABCD-EFGH-…"><button class="btn btn-primary btn-block" style="margin-top:12px" data-act="acct-restore-go">${t('acctRestoreGo')}</button>`);
  } else if (k === 'acct-restore-go') {
    try { S.acct = await net.restoreAccount($('#acctIn').value); net.setAccount(S.acct); save(); closeSheet(); toast(t('acctRestored', { name: S.acct.name })); acctAction('backup-restore'); }
    catch (e) { toast(t(e && e.status === 401 ? 'acctBadCode' : net.isOnline() ? 'acctBadCode' : 'vsNeedNet')); }
  } else if (k === 'backup-restore') {
    try {
      await ensureAccount();
      const b = await net.pullBackup();
      confirmSheet(t('backupRestore'), t('backupRestoreP', { d: fmtDate(b.updated) }), t('backupRestoreYes'), () => {
        const keep = { acct: S.acct, chat: S.chat };
        S = { ...blank(), ...b.data, ...keep, backupAt: b.updated };
        save();
        location.reload();
      });
    } catch (e) { toast(t(e && e.status === 404 ? 'backupNone' : net.isOnline() ? 'vsRankFail' : 'vsNeedNet')); }
  } else if (k === 'backup-now') backupNow();
  else if (k === 'friend-add') {
    openSheet(`<span class="eyebrow">${t('friendsTitle')}</span><h2 style="margin-top:6px">${t('friendAdd')}</h2><p class="muted small" style="margin:6px 0 12px">${t('friendAddP')}</p>
      <input class="vs-in vs-room-in" id="friendIn" maxlength="6" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABC123"><button class="btn btn-primary btn-block" style="margin-top:12px" data-act="friend-add-go">${t('friendAddGo')}</button>`);
  } else if (k === 'friend-add-go') {
    try { const f = await net.addFriend($('#friendIn').value); closeSheet(); toast(t('friendAdded', { name: f.name })); grow('friend', 1, true); }
    catch (e) { toast(t(e && e.status === 404 ? 'friendNotFound' : e && e.status === 400 ? 'friendSelf' : 'vsNeedNet')); }
  } else if (k === 'friends') {
    openSheet(`<span class="eyebrow">${t('acctTitle')}</span><h2 style="margin-top:6px">${t('friendsTitle')}</h2><div id="friendList" class="vs-rank"><p class="muted small">${t('vsRankLoading')}</p></div>`);
    try {
      const list = await net.listFriends();
      const el = $('#friendList');
      if (el) el.innerHTML = list.length ? `<ol>${list.map((f) => `<li><span class="grow">${esc(f.name)} <small>${esc(f.code)}</small></span><button class="icon-btn" data-act="friend-del" data-v="${esc(f.id)}" aria-label="${t('vsRemove')}">${I.minus}</button></li>`).join('')}</ol>` : `<p class="muted small">${t('friendsNone')}</p>`;
    } catch (e) { const el = $('#friendList'); if (el) el.innerHTML = `<p class="muted small">${t('vsNeedNet')}</p>`; }
  } else if (k === 'acct-delete') {
    confirmSheet(t('acctDelete'), t('acctDeleteP'), t('acctDeleteYes'), async () => {
      try { await net.deleteAccount(); S.acct = null; delete S.backupAt; net.setAccount(null); save(); toast(t('acctDeleted')); render(); } catch (e) { toast(t('vsNeedNet')); }
    }, true);
  }
}
// Workout names are saved in the language used at the time; show them in the current one when possible.
function histName(w) {
  if (w.rounds) return t(w.rounds.mode === 'shadow' ? 'shadowName' : 'roundsName');
  return w.dayId ? dayName({ id: w.dayId, name: w.name }) : w.name;
}

// Home: four small doors instead of four big cards.
function homeTiles(thisWeek = S.workouts.filter((w) => w.date >= weekStart(Date.now())).length) {
  const c = todayChallenge(), st = streakWeeks();
  const tile = (act, v, icon, title, sub, extra = '') => `<button class="tile-h" data-act="${act}" ${v ? `data-v="${v}"` : ''}><span class="th-ic">${icon}${extra}</span><b>${title}</b><small>${sub}</small></button>`;
  return `<div class="home-tiles">
    ${tile('go', 'coach', I.chat, t('tileCoach'), t('tileCoachSub'), '<i class="th-dot"></i>')}
    ${tile('ch-open', '', I.target, t('chTitle'), c.done ? t('chDone') : `${c.timed ? fmtSecs(c.n) : c.n} / ${c.timed ? fmtSecs(c.goal) : c.goal} · ${esc(exName(c.id))}`)}
    ${tile('go', 'rank', I.flame, t('tileStreak', { n: st }), t('thisWeek', { n: thisWeek, goal: S.profile.days }))}
    ${tile('go', 'friends', I.trophy, t('tileFriends'), S.acct ? t('tileFriendsSub') : t('tileFriendsOff'))}
    ${tile('photos', '', I.camera, t('baTitle'), t('tilePhotosSub'))}
    ${tile('go', 'learn', I.learn, t('tileLearn'), t('tileLearnSub'))}
  </div>`;
}
function showChallenge() {
  openSheet(`<span class="eyebrow">${t('chTitle')}</span><h2 style="margin-top:6px">${t('chSheetTitle')}</h2><p class="muted" style="margin:6px 0 14px">${t('chSheetText')}</p>${challengeCard()}`);
}

// Progress: every rank with the character, and where you are.
function rankLadder(r, sc) {
  const next = RANKS[r + 1];
  return `<div class="section-title"><span class="eyebrow">${t('ranksTitle')}</span><span class="muted small">${next ? t('pointsTo', { n: next.at - sc.total, rank: esc(next.name) }) : t('reachedTop')}</span></div>
    <div class="rank-ladder" id="rankLadder">${RANKS.map((x, i) => `<div class="rl-card ${i === r ? 'cur' : i < r ? 'past' : 'lock'}" style="--c:${x.color}">
      <img src="${avatarSrc(i)}" alt="" loading="lazy"><b>${esc(x.name)}</b><small>${i === r ? t('youAreHere') : i < r ? t('rankPassed') : t('rankFrom', { n: x.at })}</small></div>`).join('')}</div>`;
}
// Each muscle group painted with the color of its own rank (brighter than the badge colors, so the map reads at a glance).
const RANK_TINT = ['#7C8389', '#6F93B5', '#4FA3E8', '#F08A3C', '#E5483D', '#F2C94C'];
function bodyRanks(sc) {
  const rows = sc.groups.map(([g, v]) => ({ g, v, ri: rankIndex(v), has: v > 0 })).sort((a, b) => b.v - a.v);
  const st = Object.fromEntries(rows.map((x) => [x.g, x.has ? 'rk' + x.ri : 'rkn']));
  const done = rows.filter((x) => x.has);
  const note = done.length >= 2 ? t('bestWorst', { g: t('g_' + done[0].g), w: t('g_' + rows[rows.length - 1].g) }) : t('bodyRanksEmpty');
  return `<div class="section-title"><span class="eyebrow">${t('bodyRanksTitle')}</span></div>
    <section class="card body-ranks">
      ${bodySvg(st, 'both', 'bmap brmap')}
      <div class="br-list">${rows.map((x) => `<div class="br-row"><i style="background:${x.has ? RANK_TINT[x.ri] : 'rgba(255,255,255,.12)'}"></i><span>${t('g_' + x.g)}</span><b style="color:${x.has ? RANK_TINT[x.ri] : 'var(--faint)'}">${x.has ? esc(RANKS[x.ri].name) : t('noData')}</b></div>`).join('')}</div>
      <p class="muted small" style="margin-top:12px">${note}</p>
    </section>`;
}

// ---------- Sheets: exercise, calculator, confirm ----------
function showExercise(id) {
  const e = EXERCISES[id], x = exText(id, e);
  const best = bestFor(id);
  openSheet(`
    <span class="eyebrow">${t('howTo')}</span>
    <h2 style="margin-top:6px">${esc(x.name)}</h2>
    ${demoBox('ex', id, x.steps.length)}
    ${e.timed || id === 'nordic-curl' ? '' : `<p class="tempo">${I.timer}<span>${t('tempoLine')}</span></p>`}
    <div class="ex-muscles">${muscleMap(exMuscleState(id), 'mmap-ex')}<div><span class="eyebrow">${t('worksTitle')}</span><div class="muscles">${e.muscles.map((m, i) => `<span class="badge ${i ? 'help' : 'main'}">${esc(muscleName(m))}</span>`).join('')}</div>
      <p class="mm-legend"><i class="lg-main"></i>${t('worksMain')} <i class="lg-help"></i>${t('worksHelp')}</p></div></div>
    <h3>${t('stepByStep')}</h3><ol class="steps-list" id="demoSteps">${x.steps.map((s, i) => `<li data-act="demo-step" data-v="${i}">${esc(s)}</li>`).join('')}</ol>
    <h3>${t('mistakes')}</h3><ul>${x.mistakes.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    <div class="tip"><b>${t('tip')}</b> ${esc(x.tip)}</div>
    <a class="btn btn-block vid-btn" href="${ytLink(`${x.name} ${t('ytTechnique')}`)}" target="_blank" rel="noopener">${I.yt}${t('watchVideos')}</a>
    ${e.perHand ? `<p class="muted small" style="margin-top:12px">${t('perDumbbell')}</p>` : ''}
    ${best ? `<h3>${t('yourBest')}</h3><p>${e.bw ? t(e.timed ? 'bestSecs' : 'bestReps', { n: best }) : t('best1rm', { w: fmtW(best), u: unit() })}</p>` : ''}
    ${exRankBlock(id)}
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
  const d = program().days.find((x) => x.id === dayId) || nextDay();
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
  const done = all.filter((x) => x.done).length;
  el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} · ${t('setsDone', { n: done, total: all.length })}`;
  const pg = $('#woProg');
  if (pg) pg.style.width = `${all.length ? Math.round((done / all.length) * 100) : 0}%`;
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
      <button class="btn btn-sm" data-wo="rest">${I.timer}${t('rest')}</button><div class="wo-prog"><i id="woProg"></i></div></header>
    <p class="hint-row">${I.info}<span>${t('woHint')}</span></p>
    ${a.exercises.map((ex, i) => {
      const def = EXERCISES[ex.id], prev = lastSets(ex.id), sg = suggestFor(ex);
      return `<section class="card wo-ex">
        <div class="wo-ex-top"><button class="wo-ex-name" data-wo="info" data-v="${ex.id}">${exThumb(ex.id)}<span>${esc(exName(ex.id))}</span>${I.info}</button><button class="icon-btn sm" data-wo="menu" data-i="${i}" aria-label="${t('exOptions')}">${I.more}</button></div>
        <p class="muted small">${t('target', { sets: ex.sets.length, reps: ex.target, what: t(def.timed ? 'seconds' : 'reps') })}${def.perHand ? t('oneDumbbell') : ''}</p>
        ${suggLine(ex)}
        <div class="sets"><div class="set head"><span>#</span><span>${t('lastShort')}</span><span style="text-align:center">${def.bw ? '' : unit()}</span><span style="text-align:center">${t(def.timed ? 'secShort' : 'repsShort')}</span><span></span></div>
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
    if (s.done) vibrate(40);
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
  const xp0 = xpTotal();
  grow('workout', 1, true);
  if (prs.length) grow('pr', prs.length, true);
  const startH = new Date(w.date).getHours();
  if (startH < 8) grow('early', 1, true); else if (startH >= 21) grow('night', 1, true);
  const xpGain = xpTotal() - xp0, lvNow = levelOf(xpTotal());
  shareEvent('workout', { w: histName(w), sets: w.exercises.reduce((sum, e) => sum + e.sets.length, 0) });
  for (const ex of prs.slice(0, 3)) shareEvent('pr', { ex: ex.id });
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
    <p class="xp-gain">${I.flame}<b>+${xpGain} XP</b><span>${t('lvlN', { n: lvNow.L })} · ${lvNow.into}/${lvNow.need}</span></p>
    <p class="sum-quote">“${esc(nextQuote())}”</p>
    ${ra > rb ? `<div class="rankup" style="--c:${RANKS[ra].color}"><span class="eyebrow">${t('rankUp')}</span><b>${esc(RANKS[ra].name)}</b><span class="muted small">${esc(rankLine(ra, RANKS[ra]))}</span></div>` : ''}
    <h3>${t('prs')}</h3>${prs.length ? `<ul>${prs.map((ex) => `<li><b>${esc(exName(ex.id))}</b>: ${t('newBest')}</li>`).join('')}</ul>` : `<p class="muted small">${t('noPrs')}</p>`}
    <h3>${t('musclesWorked')}</h3>${muscleMap(Object.fromEntries(w.exercises.filter((e) => STANDARDS[e.id]).map((e) => [STANDARDS[e.id][0], 'on'])), 'mmap-wide')}<div class="muscles">${muscles.map((m) => `<span class="badge">${esc(muscleName(m))}</span>`).join('')}</div>
    <h3>${t('yourScore')}</h3><p>${before.total} → <b>${after.total}</b> / 100</p>
    <h3>${t('thisWeekTitle')}</h3><p>${thisWeek >= goal ? t('weekDone', { n: thisWeek, goal }) : t('weekTodo', { n: thisWeek, goal, left: goal - thisWeek })}</p>
    <p class="coach-line">${I.up}<span>${projection()}</span></p>
    <div class="split" style="margin-top:18px"><button class="btn" data-act="share-workout">${I.share}${t('share')}</button><button class="btn btn-primary" data-act="close-sheet">${t('done')}</button></div>`);
  confetti(ra > rb ? 90 : 45);
  if (ra > rb) vibrate([60, 40, 60, 40, 120]);
  checkBadges();
}

// ---------- Muscle map (front and back) ----------
// state: group -> 'on' (worked / selected), 'mid', 'low', 'rec' (recovering), 'ready'
function muscleMap(state = {}, cls = '') {
  return bodySvg(state, 'both', `mmap ${cls}`);
}
// One big body you can turn around (front and back).
function flipMap(state) {
  return `<div class="flipmap"><div class="fm-in">${bodySvg(state, 'front', 'fm-front')}${bodySvg(state, 'back', 'fm-back')}</div><button class="icon-btn fm-rot" data-act="flipmap" aria-label="${t('turnAround')}">${I.rotate}</button></div>`;
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
  const d = nextDay(), st = dayMuscles(d), rc = recovery();
  const main = Object.keys(st).filter((g) => st[g] === 'on');
  const tired = main.filter((g) => rc.state[g] === 'rec');
  return `<section class="card muscles-card">
    <div class="mc-head"><span class="eyebrow">${t('myMuscles')}</span><span class="legend"><i class="dot on"></i>${t('worksMain')}<i class="dot mid"></i>${t('worksHelp')}</span></div>
    ${flipMap(st)}
    <div class="mc-side">
      <b>${t('suggestDay', { day: esc(dayName(d)) })}</b>
      <small>${main.map((g) => t('g_' + g)).join(' · ')}</small>
      ${tired.length ? `<small class="mc-warn">${t('mcTired', { g: tired.map((g) => t('g_' + g)).join(', ') })}</small>` : ''}
      <div class="mc-btns"><button class="btn btn-primary btn-sm" data-act="start" data-v="${d.id}">${I.play}${t('startWorkout')}</button><button class="btn btn-sm" data-act="builder">${t('otherWorkout')}</button></div>
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
       <h1>${esc(builderName())}</h1><p class="muted small">${t('place_' + bd.place)} · ${t('nEx', { n: bd.plan.length, m: bd.time })}</p><button class="btn btn-sm" data-bd="save" style="margin-top:10px">${I.bookmark}${t('saveRoutine')}</button></div><p class="plan-why">${I.info}<span>${t('builderWhy')}</span></p>
     <div class="stack">${bd.plan.map(([id, sets, reps], i) => `<button class="card card-tap plan-ex" data-bd="info" data-v="${id}"><span class="pn-fig">${exThumb(id)}<i>${i + 1}</i></span><span class="grow"><b>${esc(exName(id))}</b><small>${t('g_' + STANDARDS[id][0])}</small></span><span class="sr">${sets} × ${repsLabel(id, reps)}</span></button>`).join('')}</div>`
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
  else if (k === 'save') { openSaveRoutine(bd.plan.map((x) => x.slice()), bd.place, builderName()); return; }
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
    ${S.active.exercises.length > 1 ? `<div class="split" style="margin-top:16px"><button class="btn" data-act="move-ex" data-i="${i}" data-v="-1" ${i === 0 ? 'disabled' : ''}>${I.up}${t('moveUp')}</button><button class="btn" data-act="move-ex" data-i="${i}" data-v="1" ${i === S.active.exercises.length - 1 ? 'disabled' : ''}>${I.down}${t('moveDown')}</button></div>` : ''}
    ${S.active.exercises.length > 1 ? `<button class="btn btn-block" style="margin-top:10px;color:var(--red-2)" data-act="remove-ex" data-i="${i}">${I.trash}${t('removeEx')}</button>` : ''}`);
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
  if (w.rounds) {
    const mins = Math.max(1, Math.round(w.dur / 60));
    openSheet(`<span class="eyebrow">${fmtDate(w.date)}</span><h2 style="margin-top:6px">${esc(histName(w))}</h2>
      <div class="sum-stats"><div><b>${mins}</b><span>${t(mins <= 1 ? 'minute' : 'minutes')}</span></div><div><b>${w.rounds.n}</b><span>${t('roundsWord')}</span></div><div><b>${fmtSecs(w.rounds.work)}</b><span>${t('perRound')}</span></div></div>
      <div class="split" style="margin-top:16px"><button class="btn" data-act="del-workout" data-v="${esc(w.id)}" style="color:var(--red-2)">${I.trash}${t('delWorkout')}</button><button class="btn btn-primary" data-act="fight" data-v="${w.rounds.mode}">${I.repeat}${t('repeat')}</button></div>`);
    return;
  }
  const v = workVolume(w), before = S.workouts.filter((x) => x.date < w.date);
  const rows = w.exercises.map((ex) => {
    const def = EXERCISES[ex.id], old = bestFor(ex.id, before), pr = old > 0 && bestFor(ex.id, [w]) > old;
    return `<div class="hd-ex"><b>${esc(exName(ex.id))}</b>${pr ? `<em class="pr">${t('prTag')}</em>` : ''}<small>${ex.sets.map((s) => (def.bw ? `${s.r}${def.timed ? 's' : ''}` : `${fmtW(s.w)}×${s.r}`)).join('  ·  ')}</small></div>`;
  }).join('');
  openSheet(`<span class="eyebrow">${fmtDate(w.date)}</span><h2 style="margin-top:6px">${esc(histName(w))}</h2>
    <div class="sum-stats"><div><b>${Math.max(1, Math.round(w.dur / 60))}</b><span>${t(Math.round(w.dur / 60) <= 1 ? 'minute' : 'minutes')}</span></div><div><b>${w.exercises.reduce((a, e) => a + e.sets.length, 0)}</b><span>${t('setsWord')}</span></div>${v.kg ? `<div><b>${fmtN(toDisp(v.kg))}</b><span>${t('lifted', { u: unit() })}</span></div>` : `<div><b>${v.reps}</b><span>${t('repsWord')}</span></div>`}</div>
    ${funLine(v.moved, v.est)}
    <div class="card list-card" style="margin-top:14px">${rows}</div>
    <button class="btn btn-block" style="margin-top:16px" data-act="rt-from" data-v="${esc(w.id)}">${I.bookmark}${t('saveAsRoutine')}</button>
    <div class="split" style="margin-top:10px"><button class="btn" data-act="del-workout" data-v="${esc(w.id)}" style="color:var(--red-2)">${I.trash}${t('delWorkout')}</button><button class="btn btn-primary" data-act="repeat" data-v="${esc(w.id)}">${I.repeat}${t('repeat')}</button></div>`);
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
  const progReps = (eid) => { for (const d of program().days) { const it = d.items.find((x) => x[0] === eid); if (it) return it[2]; } return null; };
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
  const ht = $('.home-tiles');
  if (ht) ht.outerHTML = homeTiles();
  if (n >= c.goal && c.n < c.goal) { confetti(60); vibrate([40, 30, 80]); toast(t('chToast')); grow('daily', 1, true); } else if (v > 0) vibrate(12);
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
    <div class="field" style="margin-top:12px"><label for="oE">${t('ormEx')}</label><select id="oE">${RANKABLE.map((id) => `<option value="${id}" ${id === 'bench-press' ? 'selected' : ''}>${esc(exName(id))}</option>`).join('')}</select></div>
    <div id="oOut"></div>
    <p class="muted small" style="margin-top:12px">${t('ormNote')}</p>`);
  sheetFn = () => {
    const w = num($('#oW', sh).value) || num($('#oW', sh).placeholder), r = clamp(Math.round(num($('#oR', sh).value) || 8), 1, 30);
    const m = e1rm(w, r), rnd = (x) => Math.round(x / stepW) * stepW;
    $('#oOut', sh).innerHTML = `<div class="orm-big"><span class="eyebrow">${t('ormRes')}</span><b>${fmtNum(Math.round(m))} <small>${u}</small></b></div>${ormRank(m, $('#oE', sh).value)}
      <div class="card list-card">${[[95, 2], [90, 4], [85, 6], [80, 8], [75, 10], [70, 12], [65, 15]].map(([pc, reps]) => `<div class="orm-row"><span>${pc}%</span><b>${fmtNum(rnd((m * pc) / 100))} ${u}</b><span class="muted">${t('aboutReps', { n: reps })}</span></div>`).join('')}</div>`;
  };
  sheetFn();
}

// ---------- Exercise library ----------
const LIB_GROUPS = { fAll: null, fChest: ['Chest'], fBack: ['Lats', 'Upper back', 'Hamstrings'], fShoulders: ['Shoulders', 'Side shoulders', 'Rear shoulders'], fArms: ['Biceps', 'Triceps'], fLegs: ['Quads', 'Glutes', 'Hamstrings', 'Calves'], fCore: ['Abs'] };
const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function libListHtml() {
  if (!(libFilter in LIB_GROUPS)) libFilter = 'fAll';
  const g = LIB_GROUPS[libFilter], q = norm(libQuery.trim());
  const list = Object.entries(EXERCISES).filter(([id, e]) => (!g || g.includes(e.muscles[0])) && (!q || norm(exName(id)).includes(q) || norm(e.name).includes(q) || e.muscles.some((m) => norm(muscleName(m)).includes(q))));
  if (!list.length) return `<p class="hist muted">${t('noResults')}</p>`;
  return list.map(([id, e]) => {
    const sc = exScore(id);
    return `<button class="lib-item" data-act="ex" data-v="${id}">${exThumb(id)}<span class="grow"><b>${esc(exName(id))}</b><small>${esc(e.muscles.map(muscleName).join(', '))}</small></span>${sc == null ? '' : rkChip(RANKS[rankIndex(sc)])}${I.chev}</button>`;
  }).join('');
}

// ---------- Rank for each exercise ----------
const rkChip = (R) => `<span class="rk" style="--c:${R.color}">${esc(R.name)}</span>`;
const RANKABLE = Object.keys(STANDARDS).filter((id) => STANDARDS[id][1] === 'ratio');
function exScore(id, workouts = S.workouts) {
  const st = STANDARDS[id];
  if (!st) return null;
  const bw = S.profile.bw || 0, af = ageFactor(S.profile.age || 30), [, type, lo, hi] = st;
  let best = -1;
  for (const w of workouts) for (const ex of w.exercises) if (ex.id === id) for (const s of ex.sets) {
    let val;
    if (type === 'ratio') { if (!bw || !s.w) continue; val = e1rm(s.w, s.r) / bodyBase(bw); } else val = s.r;
    best = Math.max(best, clamp((((val * af) / sexAdj(st[0]) - lo) / (hi - lo)) * 100, 0, 100));
  }
  return best < 0 ? null : Math.round(best);
}
function exRankBlock(id) {
  const st = STANDARDS[id];
  if (!st || !S.profile.bw) return '';
  const sc = exScore(id), i = rankIndex(sc || 0), R = RANKS[i], N = RANKS[i + 1];
  let need = '';
  if (N) {
    const [, type, lo, hi] = st, val = ((lo + (N.at / 100) * (hi - lo)) / ageFactor(S.profile.age || 30)) * sexAdj(st[0]);
    if (type === 'ratio') need = t('needW', { rank: N.name, w: fmtW((val * bodyBase(S.profile.bw)) / (1 + 5 / 30)), u: unit() });
    else need = t(type === 'secs' ? 'needS' : 'needR', { rank: N.name, n: Math.ceil(val) });
  }
  return `<h3>${t('exRankTitle')}</h3><div class="exr-box">${sc == null ? `<p class="muted small">${t('exRankNone')}</p>` : `<div class="row">${rkChip(R)}<span class="bar"><i style="width:${sc}%;background:${R.color}"></i></span><b>${sc}</b></div>`}${need ? `<p class="small" style="margin-top:8px">${need}</p>` : ''}</div>`;
}
function exRanksHtml() {
  const ids = [...new Set(S.workouts.flatMap((w) => w.exercises.map((e) => e.id)))].filter((id) => STANDARDS[id] && EXERCISES[id]);
  if (!ids.length) return `<section class="card"><p class="muted">${t('noExRanks')}</p></section>`;
  const rows = ids.map((id) => [id, exScore(id) || 0]).sort((x, y) => y[1] - x[1]);
  return `<p class="muted small empty">${t('exRanksNote')}</p>
    <section class="card list-card">${rows.map(([id, sc]) => {
      const R = RANKS[rankIndex(sc)], def = EXERCISES[id], best = bestFor(id);
      return `<button class="exr" data-act="ex" data-v="${id}"><span class="grow"><b>${esc(exName(id))}</b><small>${def.bw ? t(def.timed ? 'bestSecs' : 'bestReps', { n: best }) : t('best1rm', { w: fmtW(best), u: unit() })}</small><span class="bar sm"><i style="width:${sc}%;background:${R.color}"></i></span></span>${rkChip(R)}</button>`;
    }).join('')}</section>`;
}
function ormRank(m, eid) {
  const st = STANDARDS[eid];
  if (!st || !S.profile.bw || !m) return '';
  const [, , lo, hi] = st, sc = clamp(((((toKg(m) / bodyBase(S.profile.bw)) * ageFactor(S.profile.age || 30)) / sexAdj(st[0]) - lo) / (hi - lo)) * 100, 0, 100);
  return `<div class="orm-rank"><span>${t('ormRank', { ex: esc(exName(eid)) })}</span>${rkChip(RANKS[rankIndex(sc)])}</div>`;
}

// ---------- Body weight log ----------
function bodyLog() {
  if (!S.bodyLog) S.bodyLog = S.profile.bw ? [{ d: Date.now(), kg: S.profile.bw }] : [];
  return S.bodyLog;
}
function logWeight(kg) {
  if (!(kg > 20)) return;
  const log = bodyLog(), last = log[log.length - 1];
  if (last && dayKey(last.d) === dayKey(Date.now())) { last.kg = kg; last.d = Date.now(); } else log.push({ d: Date.now(), kg });
  S.profile.bw = kg;
  save();
  grow('weigh', 1, true);
}
function bodyHtml() {
  const log = bodyLog(), cur = S.profile.bw || 0, first = log[0];
  const diff = first && log.length > 1 ? cur - first.kg : 0;
  const chart = lineChart(log.map((e) => ({ t: e.d, v: +fmtW(e.kg) })), (v) => v, true);
  return `<section class="card">
      <span class="eyebrow">${t('bodyweightNow')}</span>
      <div class="big-num" style="margin-top:6px">${fmtW(cur)} <span class="muted" style="font-size:18px">${unit()}</span></div>
      ${log.length > 1 ? `<p class="muted small" style="margin-top:4px">${t(diff > 0.05 ? 'bwUp' : diff < -0.05 ? 'bwDown' : 'bwSame', { n: fmtW(Math.abs(diff)), u: unit(), date: fmtDate(first.d) })}</p>` : ''}
      ${chart || `<p class="muted small" style="margin-top:10px">${t('bwChartEmpty')}</p>`}
      <div class="bw-add"><input type="number" inputmode="decimal" id="bwIn" placeholder="${fmtW(cur)}" aria-label="${t('bodyweight', { u: unit() })}"><button class="btn btn-primary" data-act="bw-add">${t('saveWeight')}</button></div>
    </section>
    ${log.length ? `<section class="card list-card">${[...log].reverse().slice(0, 8).map((e) => `<div class="hist"><span>${fmtDate(e.d)}</span><b>${fmtW(e.kg)} ${unit()}</b></div>`).join('')}</section>` : ''}
    <p class="muted small empty">${t('bwNote')}</p>
    ${photosHtml()}`;
}

// ---------- Plans ----------
let planDraft = null;
function planAdvice(dr) {
  const split = dr.split === 'auto' ? autoSplit(dr.days) : dr.split, f = timesPerWeek(split, dr.days), beg = S.profile.level === 'beginner';
  const n = Math.round(f * 10) / 10, better = { split: t('split_' + autoSplit(dr.days)) };
  const out = [f > 3.5 ? t('advFreqHigh', { n, ...better }) : f >= 2 ? t('advFreqGood', { n }) : t('advFreqLow', better)];
  out.push(t(dr.minutes <= 30 ? 'advTime30' : dr.minutes <= 60 ? 'advTime60' : dr.minutes <= 75 ? 'advTime75' : 'advTime90'));
  if (beg && dr.minutes > 60) out.push(t('advBeginnerTime'));
  if (beg && dr.days >= 6) out.push(t('advBeginnerDays'));
  return out;
}
function showPlan() {
  const P = S.profile;
  if (!planDraft) planDraft = { split: (S.plan && S.plan.split) || 'auto', days: P.days || 3, minutes: P.minutes || 45, equipment: P.equipment || 'gym' };
  const dr = planDraft;
  const prev = makePlan({ ...P, days: dr.days, minutes: dr.minutes, equipment: dr.equipment }, { split: dr.split, start: Date.now() }, Date.now(), laggingGroup());
  const seg = (k, vals, label) => `<div class="chips seg">${vals.map((v) => `<button class="chip" data-act="pd" data-k="${k}" data-v="${v}" aria-pressed="${String(dr[k]) === String(v)}">${label(v)}</button>`).join('')}</div>`;
  const html = `<span class="eyebrow">${t('yourPlan')}</span><h2 style="margin-top:6px">${t('planTitle')}</h2>
    <h3>${t('pqType')}</h3><div class="opts">${SPLITS.map((s) => `<button class="opt" type="button" data-act="pd" data-k="split" data-v="${s}" aria-pressed="${dr.split === s}"><span><b>${t('split_' + s)}${s === 'auto' ? ` · ${t('split_' + autoSplit(dr.days))}` : ''}</b><small>${t('splitSub_' + s)}</small></span><i class="radio"></i></button>`).join('')}</div>
    <h3>${t('pqDays')}</h3>${seg('days', [2, 3, 4, 5, 6], (v) => v)}
    <h3>${t('pqTime')}</h3>${seg('minutes', [30, 45, 60, 75, 90], (v) => v + ' min')}
    <h3>${t('pqEquip')}</h3>${seg('equipment', ['gym', 'dumbbells', 'bodyweight'], (v) => t('place_' + v))}
    <div class="plan-advice">${planAdvice(dr).map((l) => `<p>${I.info}<span>${esc(l)}</span></p>`).join('')}</div>
    <h3>${t('pqPreview')}</h3>
    <div class="plan-prev">${prev.days.map((d) => `<div><b>${esc(dayName(d))}</b><small>${t('nExShort', { n: d.items.length })} · ${t('aboutMin', { n: d.items.length * 9 })}</small><span>${d.items.map(([id]) => esc(exName(id))).join(' · ')}</span></div>`).join('')}</div>
    <button class="btn btn-primary btn-block" style="margin-top:16px" data-act="plan-save">${t('planSave')}</button>`;
  const box = $('#planSheet');
  if (box && !$('#sheet').hidden) box.innerHTML = html; else openSheet(`<div id="planSheet">${html}</div>`);
}

// ---------- My routines ----------
function findProgReps(eid) {
  for (const d of program().days) { const it = d.items.find((x) => x[0] === eid); if (it) return it[2]; }
  return null;
}
let pendingRoutine = null;
function openSaveRoutine(items, place, name) {
  if (!items.length) return;
  pendingRoutine = { items, place };
  openSheet(`<span class="eyebrow">${t('myRoutines')}</span><h2 style="margin-top:6px">${t('saveRoutine')}</h2>
    <div class="field" style="margin-top:14px"><label for="rtName">${t('routineName')}</label><input id="rtName" maxlength="40" value="${esc(name)}"></div>
    <p class="muted small" style="margin-top:8px">${t(items.length === 1 ? 'nExShort1' : 'nExShort', { n: items.length })} · ${t('place_' + place)}</p>
    <button class="btn btn-primary btn-block" style="margin-top:14px" data-act="rt-save">${I.bookmark}${t('saveRoutine')}</button>`);
}
function saveRoutine() {
  if (!pendingRoutine) return;
  const name = ($('#rtName').value || '').trim() || t('myRoutine');
  S.routines = S.routines || [];
  S.routines.push({ id: Date.now().toString(36), name: name.slice(0, 40), place: pendingRoutine.place, items: pendingRoutine.items });
  pendingRoutine = null;
  save();
  closeSheet();
  toast(t('routineSaved'));
  if (current === 'train') render();
}
function showRoutine(id) {
  const r = (S.routines || []).find((x) => x.id === id);
  if (!r) return;
  openSheet(`<span class="eyebrow">${t('myRoutines')}</span><h2 style="margin-top:6px">${esc(r.name)}</h2>
    <p class="muted small">${t('place_' + (r.place || 'gym'))} · ${t(r.items.length === 1 ? 'nExShort1' : 'nExShort', { n: r.items.length })}</p>
    <div class="card list-card" style="margin-top:14px">${r.items.map(([eid, sets, reps], i) => `<button class="lib-item" data-act="ex" data-v="${eid}"><span class="pn-fig">${exThumb(eid)}<i>${i + 1}</i></span><span class="grow"><b>${esc(exName(eid))}</b></span><span class="sr">${sets} × ${repsLabel(eid, reps)}</span></button>`).join('')}</div>
    <div class="split" style="margin-top:16px"><button class="btn" data-act="rt-del" data-v="${r.id}" style="color:var(--red-2)">${I.trash}${t('delWorkout')}</button><button class="btn btn-primary" data-act="rt-start" data-v="${r.id}">${I.play}${t('start')}</button></div>`);
}
function startRoutine(id) {
  const r = (S.routines || []).find((x) => x.id === id);
  if (!r) return;
  closeSheet();
  if (S.active) { toast(t('finishFirst')); openWorkout(); return; }
  S.active = {
    dayId: 'custom', name: r.name, equip: S.profile.equipment, place: r.place, start: Date.now(),
    exercises: r.items.map(([eid, sets, reps]) => ({ id: eid, target: reps, sets: Array.from({ length: sets }, () => ({ w: '', r: '', done: false })) })),
  };
  save();
  openWorkout();
}
function moveEx(i, dir) {
  const list = S.active.exercises, j = i + dir;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  save();
  closeSheet();
  renderWorkout();
}

// ---------- Boxing and MMA ----------
const L = (o) => o[getLang()] || o.en;
const punchName = (tok) => (PUNCHES[tok] ? PUNCHES[tok][getLang() === 'es' ? 1 : 0] : tok);
const comboLabel = (c) => c.split('-').map((x) => (/^\d$/.test(x) ? x : punchName(x))).join(' · ');
function showLesson(id) {
  const l = LESSONS.find((x) => x.id === id);
  if (!l) return;
  const x = L(l);
  const sp = SPORTS.find((s) => s.id === l.kind) || SPORTS[0];
  openSheet(`<span class="eyebrow">${t(l.kind + 'Title')}${l.tag ? ' · ' + esc(l.tag) : ''}</span><h2 style="margin-top:6px">${esc(x.name)}</h2>
    ${demoBox('ls', id, x.steps.length)}
    <h3>${t('stepByStep')}</h3><ol class="steps-list" id="demoSteps">${x.steps.map((s, i) => `<li data-act="demo-step" data-v="${i}">${esc(s)}</li>`).join('')}</ol>
    <h3>${t('mistakes')}</h3><ul>${x.mistakes.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    <div class="tip"><b>${t('tip')}</b> ${esc(x.tip)}</div>
    <a class="btn btn-block vid-btn" href="${ytLink(`${x.name} ${t(l.kind + 'Title')} ${t('ytTechnique')}`)}" target="_blank" rel="noopener">${I.yt}${t('watchVideos')}</a>
    ${l.drill ? `<button class="btn btn-primary btn-block" style="margin-top:16px" data-act="fight" data-v="shadow" data-set="${sp.set || 'basic'}">${I.gloves}${t('practice')}</button>` : ''}
    <button class="btn btn-block lesson-done ${S.lessonsDone && S.lessonsDone[l.id] ? 'on' : ''}" style="margin-top:12px" data-act="lesson-done" data-v="${l.id}">${I.check}<span>${t(S.lessonsDone && S.lessonsDone[l.id] ? 'lessonDoneOn' : 'lessonDoneBtn')}</span></button>
    ${l.kind === 'cali' && MOVE_ALIAS[l.id] ? `<button class="btn btn-primary btn-block" style="margin-top:16px" data-act="builder" data-v="${MOVE_ALIAS[l.id]}">${I.train}${t('caliTrain')}</button>` : ''}`);
}

// Round timer and guided shadowboxing: a full screen you can see from a few steps away.
const fight = { mode: 'rounds', rounds: 3, work: 180, rest: 60, set: 'basic', voice: true, phase: 'setup', round: 0, end: 0, left: 0, total: 0, paused: false, iv: null, nextCall: 0, combo: null, start: 0, ended: 0, done: 0, lock: null, warned: false };
function fightEl() {
  let el = $('#fight');
  if (!el) {
    el = document.createElement('div');
    el.id = 'fight';
    el.className = 'fight';
    el.hidden = true;
    document.body.appendChild(el);
    el.addEventListener('click', onFightClick);
  }
  return el;
}
function openFight(mode) {
  const el = fightEl();
  if (!fight.iv) Object.assign(fight, { mode: mode === 'shadow' ? 'shadow' : 'rounds', phase: 'setup', round: 0, paused: false, done: 0, combo: null });
  el.hidden = false;
  document.body.style.overflow = 'hidden';
  renderFight();
}
function toneAt(freq, delay, len, vol = 0.3) {
  if (!audio) return;
  const o = audio.createOscillator(), g = audio.createGain(), t0 = audio.currentTime + delay;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
  o.connect(g).connect(audio.destination);
  o.start(t0);
  o.stop(t0 + len + 0.02);
}
function bell(n) { for (let i = 0; i < n; i++) toneAt(1046, i * 0.3, 0.25); vibrate([180, 90, 180]); }
function say(text) {
  try {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = getLang() === 'es' ? 'es-419' : 'en-US';
    u.rate = 1.15;
    speechSynthesis.speak(u);
  } catch (e) { /* this phone has no voice */ }
}
function renderFight() {
  const el = fightEl(), f = fight;
  const opt = (k, vals, fmt) => `<div class="fopts">${vals.map((v) => `<button class="chip" data-f="${k}" data-v="${v}" aria-pressed="${f[k] === v}">${fmt(v)}</button>`).join('')}</div>`;
  if (f.phase === 'setup') {
    el.innerHTML = `<div class="f-top"><button class="icon-btn" data-f="close" aria-label="${t('close')}">${I.close}</button></div>
      <div class="f-body">
        <span class="eyebrow">${t('combatEyebrow')}</span>
        <h1>${t(f.mode === 'shadow' ? 'shadowBtn' : 'roundsBtn')}</h1>
        <p class="muted small">${t(f.mode === 'shadow' ? 'shadowSub' : 'roundsSub')}</p>
        <h3>${t('fRounds')}</h3>${opt('rounds', [3, 5, 8, 12], (v) => v)}
        <h3>${t('fWork')}</h3>${opt('work', [60, 120, 180], fmtSecs)}
        <h3>${t('fRest')}</h3>${opt('rest', [30, 60], fmtSecs)}
        ${f.mode === 'shadow' ? `<h3>${t('fLevel')}</h3>${opt('set', ['basic', 'advanced', 'mma', 'muay'], (v) => t('set_' + v))}
        <label class="f-voice"><input type="checkbox" data-f="voice" ${f.voice ? 'checked' : ''}>${t('fVoice')}</label>` : ''}
      </div>
      <div class="f-foot"><button class="btn btn-primary btn-block" data-f="go">${I.play}${t('fStart')}</button></div>`;
    return;
  }
  if (f.phase === 'done') {
    el.innerHTML = `<div class="f-top"><button class="icon-btn" data-f="close" aria-label="${t('close')}">${I.close}</button></div>
      <div class="f-body center"><div class="f-done-ic">${I.gloves}</div><h1>${t(f.done ? 'fDone' : 'fStopped')}</h1>
        <p class="muted">${t('fDoneSub', { n: f.done, m: Math.max(1, Math.round((f.ended - f.start) / 60000)) })}</p></div>
      <div class="f-foot">${f.done ? `<button class="btn btn-primary btn-block" data-f="save">${t('fSave')}</button>` : ''}<button class="btn btn-block" data-f="close">${t('close')}</button></div>`;
    return;
  }
  el.innerHTML = `<div class="f-top"><button class="icon-btn" data-f="stop" aria-label="${t('fStop')}">${I.close}</button><span class="f-round">${t('fRoundN', { n: f.round, total: f.rounds })}</span><span style="width:40px"></span></div>
    <div class="f-run ${f.phase}">
      <span class="f-phase" id="fPhase"></span>
      <div class="f-time" id="fTime"></div>
      <div class="f-bar"><i id="fBar"></i></div>
      ${f.mode === 'shadow' ? `<div class="f-combo" id="fCombo">${f.phase === 'work' ? '' : `<small>${t('fComboSoon')}</small>`}</div>` : ''}
    </div>
    <div class="f-foot"><button class="btn btn-block" data-f="pause">${f.paused ? I.play + t('fResume') : I.pause + t('fPause')}</button></div>`;
  tickFight(true);
}
function startPhase(phase, secs) {
  Object.assign(fight, { phase, total: secs, end: Date.now() + secs * 1000, warned: false });
  if (phase === 'work') fight.nextCall = Date.now() + 1500;
  renderFight();
}
function fightGo() {
  unlockAudio();
  Object.assign(fight, { round: 1, done: 0, start: Date.now(), paused: false, combo: null });
  try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then((l) => { fight.lock = l; }).catch(() => {}); } catch (e) { /* screen may turn off */ }
  startPhase('ready', 5);
  clearInterval(fight.iv);
  fight.iv = setInterval(tickFight, 200);
}
function tickFight(force) {
  const f = fight;
  if (!['ready', 'work', 'rest'].includes(f.phase) || (f.paused && force !== true)) return;
  const now = Date.now(), left = f.paused ? f.left : Math.max(0, f.end - now), sec = Math.ceil(left / 1000);
  const te = $('#fTime'), pe = $('#fPhase'), be = $('#fBar');
  if (te) te.textContent = fmtSecs(sec);
  if (pe) pe.textContent = t('ph_' + f.phase);
  if (be) be.style.width = `${(1 - left / (f.total * 1000)) * 100}%`;
  if (f.paused) return;
  if (f.phase === 'work' && sec <= 10 && !f.warned) { f.warned = true; toneAt(660, 0, 0.09); toneAt(660, 0.15, 0.09); }
  if (f.mode === 'shadow' && f.phase === 'work' && now >= f.nextCall && left > 2500) callCombo();
  if (left > 0) return;
  if (f.phase === 'ready') { bell(3); startPhase('work', f.work); }
  else if (f.phase === 'work') {
    f.done = f.round;
    bell(2);
    if (f.round >= f.rounds) endFight();
    else if (f.rest) startPhase('rest', f.rest);
    else { f.round++; startPhase('work', f.work); }
  } else if (f.phase === 'rest') { f.round++; bell(3); startPhase('work', f.work); }
}
function callCombo() {
  const f = fight, set = COMBO_SETS[f.set] || COMBO_SETS.basic;
  let c;
  do { c = set[Math.floor(Math.random() * set.length)]; } while (set.length > 1 && c === f.combo);
  f.combo = c;
  const toks = c.split('-');
  const el = $('#fCombo');
  if (el) {
    el.classList.toggle('long', comboLabel(c).length > 11);
    el.innerHTML = `<b>${esc(comboLabel(c))}</b><small>${toks.map((x) => esc(punchName(x))).join(' · ')}</small>`;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }
  if (f.voice) say(toks.map((x) => (/^\d$/.test(x) ? x : punchName(x))).join(', '));
  else toneAt(880, 0, 0.07, 0.15);
  f.nextCall = Date.now() + (f.set === 'advanced' ? 2400 : 2800) + toks.length * 650 + Math.random() * 1500;
}
function stopFightTimers() {
  clearInterval(fight.iv);
  fight.iv = null;
  try { if (fight.lock) fight.lock.release(); } catch (e) { /* already released */ }
  fight.lock = null;
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* no voice */ }
}
function endFight() {
  stopFightTimers();
  Object.assign(fight, { phase: 'done', ended: Date.now() });
  if (fight.done) confetti(50);
  renderFight();
}
function closeFight() {
  stopFightTimers();
  fight.phase = 'setup';
  fightEl().hidden = true;
  document.body.style.overflow = '';
}
function saveFight() {
  const f = fight;
  S.workouts.push({ id: Date.now().toString(36), dayId: 'combat', name: t(f.mode === 'shadow' ? 'shadowName' : 'roundsName'), equip: S.profile.equipment, place: 'bodyweight', date: f.start, dur: Math.round((f.ended - f.start) / 1000), exercises: [], rounds: { n: f.done, work: f.work, rest: f.rest, mode: f.mode } });
  save();
  closeFight();
  render();
  toast(t('fSaved'));
}
function onFightClick(e) {
  const b = e.target.closest('[data-f]');
  if (!b) return;
  const k = b.dataset.f, v = b.dataset.v, f = fight;
  if (k === 'voice') { f.voice = b.checked; return; }
  if (k === 'close') closeFight();
  else if (k === 'go') fightGo();
  else if (k === 'stop') endFight();
  else if (k === 'save') saveFight();
  else if (k === 'pause') {
    f.paused = !f.paused;
    if (f.paused) { f.left = Math.max(0, f.end - Date.now()); try { speechSynthesis.cancel(); } catch (x) { /* no voice */ } }
    else { f.end = Date.now() + f.left; f.nextCall = Date.now() + 1200; }
    renderFight();
  } else if (k === 'rounds' || k === 'work' || k === 'rest') { f[k] = +v; renderFight(); }
  else if (k === 'set') { f.set = v; renderFight(); }
}

// ---------- How each exercise moves, and what it works ----------
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches && !document.documentElement.classList.contains('force-motion');
const MUSCLE_GROUP = { Chest: 'chest', 'Upper chest': 'chest', Triceps: 'arms', Biceps: 'arms', Forearms: 'arms', 'Front shoulders': 'shoulders', Shoulders: 'shoulders', 'Side shoulders': 'shoulders', 'Rear shoulders': 'shoulders', Lats: 'back', 'Upper back': 'back', 'Lower back': 'back', Quads: 'legs', Calves: 'legs', 'Inner thighs': 'legs', Glutes: 'hinge', Hamstrings: 'hinge', Abs: 'core', Core: 'core' };
function exMuscleState(id) {
  const st = {};
  EXERCISES[id].muscles.forEach((m, i) => { const grp = MUSCLE_GROUP[m]; if (grp && !st[grp]) st[grp] = i === 0 ? 'on' : 'mid'; });
  return st;
}
function dayMuscles(d) {
  const st = {};
  for (const [id] of d.items) {
    if (STANDARDS[id]) st[STANDARDS[id][0]] = 'on';
    for (const [g, v] of Object.entries(exMuscleState(id))) if (!st[g]) st[g] = v === 'on' ? 'mid' : v;
  }
  return st;
}
// Animated figure (a still one with a play button when the phone asks for less motion).
let demoCur = null;
function demoSvg(kind, id, mode) {
  const fn = kind === 'ex' ? exFigure : lessonFigure;
  if (mode.step != null) {
    const n = Math.max(1, mode.n - 1);
    return fn(id, { anim: false, still: mode.step / n, ghost: mode.step > 0 ? (mode.step - 1) / n : null });
  }
  return fn(id, { speed: mode.speed || 1 });
}
function demoBox(kind, id, nSteps = 3) {
  const first = REDUCED ? { step: nSteps - 1, n: nSteps } : { speed: 1 };
  const m = moveId(id);
  demoCur = { kind, id, m, n: nSteps, photo: !!m };
  const art = m ? photoHtml(m, first) : demoSvg(kind, id, first);
  if (!art) return '';
  // Two pictures: the buttons say Start and End, so none of them looks broken.
  const stepChips = m
    ? [[0, t('stepStart')], [nSteps - 1, t('stepEnd')]].map(([i, l]) => `<button class="chip" data-act="demo-step" data-v="${i}" aria-pressed="${REDUCED && i === nSteps - 1}">${l}</button>`)
    : [...Array(nSteps).keys()].map((i) => `<button class="chip" data-act="demo-step" data-v="${i}" aria-pressed="${REDUCED && i === nSteps - 1}">${t('stepN', { n: i + 1 })}</button>`);
  const chips = [`<button class="chip" data-act="demo-play" data-v="1" aria-pressed="${!REDUCED}">${I.play}${t('demoPlay')}</button>`,
    `<button class="chip" data-act="demo-play" data-v="2.2" aria-pressed="false">${t('demoSlow')}</button>`, ...stepChips];
  return `<div class="demo-fig" id="demoFig">${art}</div><div class="chips demo-ctl" id="demoCtl">${chips.join('')}</div>`;
}
// Pictures of the character (made in Google Flow, listed in moves.js) take the drawing's place wherever they exist.
const MOVE_ALIAS = {
  'split-squat': 'lunge', 'mt-stance': 'stance', 'mt-teep': 'teep', 'mt-roundhouse': 'low-kick',
  'cali-pushup': 'push-up', 'cali-pullup': 'pull-up', 'cali-dip': 'chair-dip', 'cali-pike': 'pike-push-up',
  'cali-squat': 'bw-squat', 'cali-plank': 'plank', 'cali-legraise': 'leg-raise',
};
const moveId = (id) => (MOVES.includes(id) ? id : MOVES.includes(MOVE_ALIAS[id]) ? MOVE_ALIAS[id] : null);
const movePath = (id, n) => `moves/${id}-${n}.webp`;
function moveThumb(kind, id) {
  const m = moveId(id);
  if (m) return `<img class="mv-thumb" src="${movePath(m, 't')}" alt="" loading="lazy">`;
  return (kind === 'ex' ? exFigure : lessonFigure)(id, { anim: false, cls: 'fig-mini' });
}
const exThumb = (id) => moveThumb('ex', id);
// Big looping picture for the sport cards; the drawing stays only where there is no picture yet.
function heroArt(id, drawnId = id) {
  const m = moveId(id);
  if (!m) return lessonFigure(drawnId, REDUCED ? { anim: false, still: 1 } : {});
  return REDUCED ? `<div class="move-anim"><img src="${movePath(m, 2)}" alt=""></div>`
    : `<div class="move-anim"><img src="${movePath(m, 1)}" alt="" class="m1"><img src="${movePath(m, 2)}" alt="" class="m2"></div>`;
}
function photoHtml(id, mode) {
  // A step in the list shows the start picture for the first step and the end picture for the rest.
  const op = mode.step === 0 ? 0 : 1;
  const dur = `animation-duration:${(mode.speed || 1) * 3.2}s`;
  // The two pictures cross-fade: when the end shows, the start fades out (they have no background).
  const first = mode.step == null ? `class="m1" style="${dur}"` : `class="m1 still" style="opacity:${1 - op}"`;
  const second = mode.step == null ? `class="m2" style="${dur}"` : `class="m2 still" style="opacity:${op}"`;
  // .play: the person asked to see it move, so it plays even when the phone asks for less motion.
  return `<div class="move-anim${mode.step == null ? ' play' : ''}"><img src="${movePath(id, 1)}" alt="" ${first}><img src="${movePath(id, 2)}" alt="" ${second}></div>`;
}
function demoShow(mode, btn) {
  const box = $('#demoFig');
  if (!box || !demoCur) return;
  box.innerHTML = demoCur.photo ? photoHtml(demoCur.m, mode) : demoSvg(demoCur.kind, demoCur.id, mode.step != null ? { ...mode, n: demoCur.n } : mode);
  document.querySelectorAll('#demoCtl .chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
  const sv = mode.step == null ? null : demoCur.photo ? (mode.step === 0 ? 0 : demoCur.n - 1) : mode.step;
  const chip = sv != null ? $(`#demoCtl [data-act="demo-step"][data-v="${sv}"]`) : btn;
  if (chip) chip.setAttribute('aria-pressed', 'true');
  document.querySelectorAll('#demoSteps li').forEach((li, i) => li.classList.toggle('on', i === mode.step));
}
const ytLink = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
const toolTile = (act, icon, title, sub, v) => `<button class="card card-tap tool" data-act="${act}" ${v ? `data-v="${v}"` : ''}>${icon}<b>${t(title)}</b><span>${t(sub)}</span></button>`;

// ---------- Sports ----------
function sportDetail(k) {
  const sp = SPORTS.find((s) => s.id === k) || SPORTS[0];
  const lessons = LESSONS.filter((l) => l.kind === k);
  const list = k === 'box' ? COMBOS.filter((c) => !/[a-z]/.test(c)) : COMBO_SETS[sp.set] || [];
  const combos = list.map((c) => `<span class="combo">${esc(comboLabel(c))}</span>`).join('');
  const actions = sp.routine
    ? `<button class="btn btn-primary btn-block" style="margin-top:12px" data-act="builder" data-v="${sp.routine.join(',')}">${I.train}${t('caliRoutine')}</button>`
    : `<div class="split" style="margin-top:12px"><button class="btn btn-primary" data-act="fight" data-v="shadow" data-set="${sp.set}">${I.gloves}${t('shadowBtn')}</button><button class="btn" data-act="fight" data-v="rounds">${I.bell}${t('roundsBtn')}</button></div>`;
  let extra = '';
  if (k === 'box') {
    extra = `<div class="section-title"><span class="eyebrow">${t('numbersTitle')}</span></div>
    <section class="card"><div class="nums">${['1', '2', '3', '4', '5', '6'].map((n) => `<div><b>${n}</b><span>${esc(punchName(n))}</span></div>`).join('')}</div>
      <h3 class="mini">${t('combosTitle')}</h3><div class="combos">${combos}</div><p class="muted small" style="margin-top:10px">${t('lefty')}</p></section>`;
  } else if (sp.routine) {
    const rows = [['cali-pushup', 'lvPushups', '10', '30', '50'], ['cali-pullup', 'lvPullups', '1', '8', '15'], ['cali-pullup', 'lvRows', '8', '15', '25'], ['cali-dip', 'lvDips', '3', '10', '20'], ['cali-plank', 'lvPlank', '30 s', '1 min', '2 min'], ['cali-squat', 'lvSquats', '20', '50', t('pistol')]];
    extra = `<div class="section-title"><span class="eyebrow">${t('caliLevelsTitle')}</span></div>
    <section class="card levels"><div class="lv-row lv-head"><span></span><b>${t('levelBeg')}</b><b>${t('levelMid')}</b><b>${t('levelAdv')}</b></div>
      ${rows.map(([id, key, a, b, c]) => `<button class="lv-row" data-act="lesson" data-v="${id}"><span>${t(key)}</span><i>${a}</i><i>${b}</i><i>${c}</i></button>`).join('')}
      <p class="muted small" style="margin-top:10px">${t('caliLevelsNote')}</p></section>`;
  } else {
    extra = `<div class="section-title"><span class="eyebrow">${t('combosTitle')}</span></div><section class="card"><div class="combos">${combos}</div></section>`;
  }
  return `<header class="top me-top"><button class="icon-btn" data-act="sport" data-v="" aria-label="${t('back')}">${I.back}</button><div class="grow"><p class="eyebrow">${t('tabSports')}</p><h1>${t(k + 'Title')}</h1></div></header>
    <section class="card combat-hero sp-${k}">
      <div class="ch-fig">${heroArt(sp.detail, k === 'box' ? 'cross' : k === 'mma' ? 'lowkick' : sp.detail)}</div>
      <p class="muted small">${t(k + 'Sub')}</p>
      ${actions}
    </section>
    <div class="section-title"><span class="eyebrow">${t('lessonsTitle')}</span><span class="muted small">${t('lessonsCount', { n: lessons.filter((l) => S.lessonsDone && S.lessonsDone[l.id]).length, total: lessons.length })}</span></div>
    <section class="card list-card">${lessons.map((l, i) => `<button class="lib-item" data-act="lesson" data-v="${l.id}">${moveThumb('ls', l.id) || `<span class="ln">${i + 1}</span>`}<span class="grow"><b>${esc(L(l).name)}${l.tag ? ` <em class="ptag">${esc(l.tag)}</em>` : ''}</b><small>${esc(L(l).short)}</small></span>${S.lessonsDone && S.lessonsDone[l.id] ? `<span class="ls-done">${I.check}</span>` : I.chev}</button>`).join('')}</section>
    ${extra}
    <section class="card safety"><b>${I.info}${t(sp.routine ? 'caliSafetyTitle' : 'safetyTitle')}</b><p class="small">${t(sp.routine ? 'caliSafety' : 'safetyText')}</p></section>`;
}

// ---------- Motivation ----------
// Random lines that do not repeat until the others were shown; about a third use the person's own numbers.
function quoteCtx() {
  const P = S.profile || {}, u = unit();
  const c = { name: P.name || '', u, workouts: S.workouts.length, streak: streakWeeks() };
  const sets = {}, max = {}, old = {}, monthAgo = Date.now() - 28 * DAY;
  let week = 0, month = 0, last = 0;
  for (const w of S.workouts) {
    last = Math.max(last, w.date);
    if (w.exercises) {
      const v = workVolume(w).moved;
      if (w.date >= weekStart(Date.now())) week += v;
      if (w.date >= Date.now() - 30 * DAY) month += v;
      for (const ex of w.exercises) {
        const d = EXERCISES[ex.id];
        if (!d || d.bw) continue;
        for (const s of ex.sets) {
          if (!s.w) continue;
          sets[ex.id] = (sets[ex.id] || 0) + 1;
          max[ex.id] = Math.max(max[ex.id] || 0, s.w);
          if (w.date < monthAgo) old[ex.id] = Math.max(old[ex.id] || 0, s.w);
        }
      }
    }
  }
  const top = Object.keys(sets).sort((a, b) => sets[b] - sets[a])[0];
  if (top) {
    const w = +fmtW(max[top]);
    c.top = { ex: exName(top).toLocaleLowerCase(locale()), w, next: w + (u === 'lb' ? 5 : 2.5), prev: old[top] ? +fmtW(old[top]) : 0 };
  }
  c.week = week ? fmtN(toDisp(week)) : 0;
  c.month = month ? fmtN(toDisp(month)) : 0;
  c.daysOff = last ? Math.floor((Date.now() - last) / DAY) : null;
  const sc = computeScore(), N = RANKS[rankIndex(sc.total) + 1];
  if (N && S.workouts.length) c.rank = { pts: N.at - sc.total, name: N.name };
  if (P.target && P.bw && Math.abs(P.bw - P.target) >= 1) c.target = { left: fmtW(Math.abs(P.bw - P.target)), goal: fmtW(P.target) };
  return c;
}
function nextQuote() {
  const es = getLang() === 'es';
  const pool = [...QUOTES.map((q, i) => ['g' + i, q[es ? 1 : 0]]), ...personalQuotes(quoteCtx(), es)];
  let seen = S.qseen || [];
  let fresh = pool.filter(([k]) => !seen.includes(k));
  if (!fresh.length) { seen = []; fresh = pool; }
  const mine = fresh.filter(([k]) => k[0] === 'p');
  const from = mine.length && Math.random() < 0.35 ? mine : fresh;
  const pick = from[Math.floor(Math.random() * from.length)];
  S.qseen = [...seen, pick[0]].slice(-(pool.length - 1));
  save();
  return pick[1];
}
// A progress line at random, never the same one until all of them have been shown.
function progressQuote() {
  const es = getLang() === 'es';
  let seen = S.qseenP || [];
  let fresh = PROGRESS_QUOTES.map((q, i) => i).filter((i) => !seen.includes(i));
  if (!fresh.length) { seen = []; fresh = PROGRESS_QUOTES.map((q, i) => i); }
  const i = fresh[Math.floor(Math.random() * fresh.length)];
  S.qseenP = [...seen, i].slice(-(PROGRESS_QUOTES.length - 1));
  save();
  return PROGRESS_QUOTES[i][es ? 1 : 0];
}
let curQuote = null;
// Where your trend is taking you: based on your last four weeks, never a promise.
function projection() {
  const sc = computeScore(), r = rankIndex(sc.total), N = RANKS[r + 1], days = S.profile.days;
  if (!N) return t('projTop');
  const past = computeScore(S.workouts.filter((w) => w.date < Date.now() - 28 * DAY)).total;
  const gain = sc.total - past;
  if (S.workouts.length < 3 || gain <= 0) return t('projStart', { days, rank: esc(N.name) });
  const weeks = Math.ceil((N.at - sc.total) / (gain / 4));
  if (weeks <= 2) return t('projSoon', { rank: esc(N.name) });
  if (weeks <= 12) return t('projWeeks', { n: weeks, rank: esc(N.name) });
  return t('projLong', { days, rank: esc(N.name) });
}
function coachCard(r) {
  if (!curQuote) curQuote = nextQuote();
  return `<button class="card card-tap coach" data-act="quote"><span class="coach-pic"><img src="${avatarSrc(r)}" alt=""></span><span class="coach-txt"><span class="eyebrow">${t('coachEyebrow')}<em class="q-hint">${t('quoteNext')}</em></span><b class="quote-txt">“${esc(curQuote)}”</b><small>${I.up}<span>${projection()}</span></small></span></button>`;
}
function learnCard() {
  const v = VIDEOS[todayIdx() % VIDEOS.length];
  return `<button class="card card-tap learn-card" data-act="go" data-v="learn"><img src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy"><span class="grow"><span class="eyebrow">${t('learnCardEyebrow')}</span><b>${t('learnCardTitle')}</b><small>${t('learnCardSub')}</small></span>${I.chev}</button>`;
}

// ---------- Coach chat (answers on the phone, any time, without internet) ----------
function coachKcal() {
  const P = S.profile || {};
  if (!P.bw || !P.height || !P.age) return 0;
  const base = 10 * P.bw + 6.25 * P.height - 5 * P.age + (P.sex === 'f' ? -161 : P.sex === 'x' ? -78 : 5);
  const f = P.days >= 6 ? 1.725 : P.days >= 4 ? 1.55 : 1.375;
  return Math.round((base * f) / 50) * 50;
}
let coachData = null;
function coachCtx() {
  if (!coachData || coachData.lang !== getLang()) {
    coachData = {
      lang: getLang(),
      exercises: Object.keys(EXERCISES).map((id) => { const x = exText(id, EXERCISES[id]); return { id, names: exNames(id, EXERCISES[id]), steps: x.steps, mistakes: x.mistakes, tip: x.tip, group: STANDARDS[id] && STANDARDS[id][0], bw: !!EXERCISES[id].bw }; }),
      lessons: LESSONS.map((l) => ({ id: l.id, names: [l.en.name, l.es.name], steps: L(l).steps, mistakes: L(l).mistakes, tip: L(l).tip })),
    };
  }
  const P = S.profile || {};
  const sc = computeScore().total, lg = laggingGroup();
  return {
    ...coachData, es: getLang() === 'es', name: P.name || '', weightKg: P.bw || 0, kcal: coachKcal(), days: P.days, score: sc, nextDay: dayName(nextDay()), quote: nextQuote,
    age: P.age || 0, best: (id) => (EXERCISES[id] ? bestFor(id) : 0), fmtW, unit: unit(), week: S.workouts.filter((w) => w.date >= weekStart(Date.now())).length,
    streak: streakWeeks(), rankName: RANKS[rankIndex(sc)].name, lag: lg ? t('g_' + lg) : '', lagGroup: lg, vsN: Object.keys((S.vs && S.vs.best) || {}).length,
  };
}
const coachProfile = () => { const P = S.profile || {}; return { name: P.name, age: P.age, weightKg: P.bw, goal: P.goal, level: P.level, days: P.days, place: P.equipment, plan: progName() }; };
const chatText = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|\n)(Evita|Consejo|Avoid|Tip|Así se hace|How to do)([^:\n]*:)/g, '$1<b>$2$3</b>').replace(/\n/g, '<br>');
function chatHtml() {
  const msgs = S.chat || [];
  const es = getLang() === 'es';
  if (!msgs.length) {
    const sug = [...SUGGEST].sort(() => Math.random() - 0.5).slice(0, 5);
    return `<div class="msg bot"><p>${chatText(t('coachHello', { name: S.profile.name ? ' ' + S.profile.name : '' }))}</p></div>
      <div class="chat-sug">${sug.map((s) => `<button class="chip" data-act="coach-ask" data-v="${esc(s[es ? 1 : 0])}">${esc(s[es ? 1 : 0])}</button>`).join('')}</div>`;
  }
  return msgs.map((m) => `<div class="msg ${m.me ? 'me' : 'bot'}"><p>${m.ai ? `<em class="ai-tag">${t('aiTag')}</em>` : ''}${chatText(m.text)}</p>${(m.acts || []).length ? `<div class="msg-acts">${m.acts.map((a) => `<button class="chip" data-act="${esc(a.act)}" data-v="${esc(a.v)}">${a.act === 'ex' || a.act === 'lesson' ? I.play : ''}${esc(a.label)}</button>`).join('')}</div>` : ''}${m.link ? `<a class="link small" href="https://earnedstrength.online${esc(m.link)}" target="_blank" rel="noopener">${t('coachReadMore')}</a>` : ''}</div>`).join('');
}
function chatScroll() { requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: REDUCED ? 'auto' : 'smooth' })); }
let coachBusy = false;
function coachAsk(text) {
  text = String(text || '').trim();
  if (!text || coachBusy) return;
  S.chat = [...(S.chat || []), { me: true, text }].slice(-60);
  save();
  grow('coach', 1, true);
  const box = $('#chat');
  if (!box) return;
  box.innerHTML = chatHtml() + '<div class="msg bot typing"><p><i></i><i></i><i></i></p></div>';
  chatScroll();
  coachBusy = true;
  setTimeout(async () => {
    const r = coachReply(text, coachCtx());
    let msg = { me: false, text: r.text, acts: r.acts, link: r.link };
    // Pain, dizziness or feeling sick always get the careful answer written in the app. Everything else goes
    // to the AI coach when there is internet; if it cannot answer, the app's own answer stays.
    if (!r.urgent && net.isOnline()) {
      try {
        await ensureAccount();
        const ai = await net.askAI({ lang: getLang(), messages: S.chat.slice(-8), profile: coachProfile() });
        msg = { me: false, text: ai, acts: r.sure ? r.acts : [], link: r.sure ? r.link : undefined, ai: true };
      } catch (e) { if (e && e.status === 429) msg.text += '\n\n' + t('coachAiLimit'); }
    }
    coachBusy = false;
    S.chat = [...S.chat, msg].slice(-60);
    save();
    const b = $('#chat');
    if (b) { b.innerHTML = chatHtml(); chatScroll(); }
  }, 450);
}
document.addEventListener('submit', (e) => {
  if (e.target.id !== 'chatForm') return;
  e.preventDefault();
  const inp = $('#chatIn');
  coachAsk(inp.value);
  inp.value = '';
});

// ---------- Charts ----------
function lineChart(points, fmt = (v) => v, fit = false) {
  if (points.length < 2) return '';
  const W = 320, H = 130, L = 8, R = 36, T = 12, B = 22;
  const xs = points.map((p) => p.t), ys = points.map((p) => p.v);
  const pad = Math.max(1, (Math.max(...ys) - Math.min(...ys)) * 0.3);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), yMax = fit ? Math.max(...ys) + pad : Math.max(...ys) * 1.15 || 1, yMin = fit ? Math.min(...ys) - pad : Math.min(0, ...ys);
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
// Achievements in five groups. Each has a goal and shows how close you are.
const cnt = (k) => (S.cnt && S.cnt[k]) || 0;
function totalKg() { let kg = 0; for (const w of S.workouts) if (w.exercises) kg += workVolume(w).kg || 0; return kg; }
function badges() {
  const sc = computeScore(), n = S.workouts.filter((w) => w.exercises && w.exercises.length).length, st = streakWeeks();
  const bw = (S.profile && S.profile.bw) || 0;
  const benchBw = bw > 0 && S.workouts.some((w) => (w.exercises || []).some((e) => e.id === 'bench-press' && e.sets.some((x) => e1rm(x.w, x.r) >= bw)));
  const lv = levelOf(xpTotal()).L, kg = Math.round(totalKg()), rounds = S.workouts.filter((w) => w.rounds).length;
  const lessons = Object.keys(S.lessonsDone || {}).length, recs = Object.keys((S.vs && S.vs.best) || {}).length;
  const B = (cat, key, cur, goal, icon) => ({ cat, key, cur: Math.min(cur, goal), goal, on: cur >= goal, icon });
  return [
    B('train', 'bFirst', n, 1, I.play), B('train', 'bTen', n, 10, I.train), B('train', 'bFifty', n, 50, I.train), B('train', 'bHundred', n, 100, I.train),
    B('train', 'bEarly', cnt('early'), 1, I.timer), B('train', 'bNight', cnt('night'), 1, I.timer), B('train', 'bTons', kg, 10000, I.plates), B('train', 'bTons2', kg, 100000, I.plates),
    B('strength', 'bIron', sc.total, RANKS[1].at, I.rank), B('strength', 'bForged', sc.total, RANKS[3].at, I.rank), B('strength', 'bLimit', sc.total, RANKS[5].at, I.rank),
    B('strength', 'bBench', benchBw ? 1 : 0, 1, I.check), B('strength', 'bPr5', cnt('pr'), 5, I.trophy), B('strength', 'bPr25', cnt('pr'), 25, I.trophy),
    B('compete', 'bCam1', cnt('camera'), 1, I.camera), B('compete', 'bCam10', cnt('camera'), 10, I.camera), B('compete', 'bGoal', cnt('goal'), 1, I.target), B('compete', 'bGoal10', cnt('goal'), 10, I.target),
    B('compete', 'bWin', cnt('win'), 1, I.trophy), B('compete', 'bWin10', cnt('win'), 10, I.trophy), B('compete', 'bVariety', recs, 5, I.camera), B('compete', 'bDaily7', cnt('daily'), 7, I.target),
    B('habit', 'bStreak3', st, 3, I.flame), B('habit', 'bStreak8', st, 8, I.flame), B('habit', 'bLvl5', lv, 5, I.up), B('habit', 'bLvl10', lv, 10, I.up), B('habit', 'bLvl20', lv, 20, I.up),
    B('habit', 'bMission10', cnt('mission'), 10, I.check), B('habit', 'bProtein7', cnt('protein'), 7, I.flame), B('habit', 'bWater7', cnt('water'), 7, I.flame),
    B('habit', 'bPhoto', cnt('photo'), 1, I.camera), B('habit', 'bPhoto5', cnt('photo'), 5, I.camera),
    B('friends', 'bFriend', cnt('friend'), 1, I.me), B('friends', 'bFriend5', cnt('friend'), 5, I.me), B('friends', 'bLesson10', lessons, 10, I.gloves), B('friends', 'bRounds5', rounds, 5, I.bell),
  ];
}
// New achievements unlocked since last time: celebrate them once.
function checkBadges() {
  const list = badges(), on = list.filter((b) => b.on).map((b) => b.key);
  if (!S.badgesOn) { S.badgesOn = on; save(); return; }
  const fresh = on.filter((k) => !S.badgesOn.includes(k));
  if (!fresh.length) return;
  S.badgesOn = [...S.badgesOn, ...fresh];
  save();
  setTimeout(() => { toast(t('badgeNew', { b: t(fresh[0]) })); confetti(60); vibrate([40, 30, 80]); }, 1600);
}
function badgesHtml() {
  const list = badges(), done = list.filter((b) => b.on).length;
  const fmt = (b) => (b.goal >= 1000 ? `${fmtN(toDisp(b.cur))}/${fmtN(toDisp(b.goal))} ${unit()}` : `${b.cur}/${b.goal}`);
  return `<section class="card bdg-sum"><b>${done}</b><span class="grow"><small>${t('badgesDone', { n: done, total: list.length })}</small><span class="bar"><i style="width:${Math.round((done / list.length) * 100)}%"></i></span></span></section>
    ${['train', 'strength', 'compete', 'habit', 'friends'].map((cat) => `<div class="section-title"><span class="eyebrow">${t('bcat_' + cat)}</span></div>
      <div class="badges">${list.filter((b) => b.cat === cat).map((b) => `<div class="bdg ${b.on ? 'on' : ''}"><span>${b.icon}</span><b>${t(b.key)}</b>${b.on ? '' : `<small>${fmt(b)}</small>`}</div>`).join('')}</div>`).join('')}`;
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
    if (!flash.isConnected) { iaBusy = false; return; }
    flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
    vibrate([60, 40, 60, 40, 140]);
    setTimeout(() => confetti(70), 250);
    setTimeout(() => {
      if (!$('#stage')) { iaBusy = false; return; }
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
  if (k === 'go') { if (v === 'sports') sportSel = null; if (v === 'home') curQuote = null; go(v); }
  else if (k === 'coach-ask') coachAsk(v);
  else if (k === 'missions') showMissions();
  else if (k === 'rm-toggle') { const R = remind(); if (R.on) { remindOff().then(() => { render(); toast(t('rmOffToast')); }); } else { R.on = true; saveRemind().then(() => render()); } }
  else if (k === 'rm-day') { const R = remind(), d = +v; R.days = R.days.includes(d) ? R.days.filter((x) => x !== d) : [...R.days, d]; b.setAttribute('aria-pressed', String(R.days.includes(d))); save(); }
  else if (k === 'rm-save') saveRemind();
  else if (k === 'rm-test') testRemind();
  else if (k === 'warm') openWarm(v);
  else if (k === 'fr-cheer') { b.disabled = true; b.classList.add('on'); vibrate(15); net.cheer(v).then((n) => { const s = b.querySelector('span'); if (s) s.textContent = n; }).catch(() => { b.disabled = false; b.classList.remove('on'); toast(t('vsNeedNet')); }); }
  else if (k === 'food-add') addFood(+v);
  else if (k === 'food-pick') { const f = FOODS.find((x) => x[0] === v); if (f) { addFood(f[1], v); toast(`+${f[1]} g · ${t('food_' + v)}`); } }
  else if (k === 'water-add') addWater(+v);
  else if (k === 'food-list') showFoods();
  else if (k === 'week-hide') { const L = lastWeek(); if (L) { S.weekSeen = L.key; save(); } const el = $('#weekCard'); if (el) el.remove(); }
  else if (k === 'week-share') shareWeek();
  else if (k === 'photo-add') { const f = $('#photoFile'); if (f) f.click(); }
  else if (k === 'photo-view') showPhoto(v);
  else if (k === 'photo-del') confirmSheet(t('photosDelete'), t('photosDeleteP'), t('photosDelete'), () => { idbDel(v).then(loadPhotos); }, true);
  else if (k === 'photo-compare') comparePhotos();
  else if (k === 'photos') { progTab = 'body'; go('rank'); }
  else if (k === 'ba-pick') { ba[b.dataset.k] = v; comparePhotos(); }
  else if (k === 'ba-share') shareBeforeAfter();
  else if (k.startsWith('acct-') || k.startsWith('backup-') || k.startsWith('friend')) {
    if (k === 'friend-del') { net.removeFriend(v).then(() => acctAction('friends')).catch(() => toast(t('vsNeedNet'))); } else acctAction(k);
  }
  else if (k === 'vs-ch') showVsChallenge(v);
  else if (k === 'vs-who') { if (sheetFn) sheetFn(); vs.who = v; showVsChallenge(vs.cid); }
  else if (k === 'vs-goal') { if (sheetFn) sheetFn(); vs.goal = v; showVsChallenge(vs.cid); }
  else if (k === 'vs-rank') { vs.scope = v; document.querySelectorAll('.vs-rank-tabs .chip').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.v === v))); const c = challengeById(vs.cid); if (c) loadRank(c); }
  else if (k === 'vs-add') { if (sheetFn) sheetFn(); if (vs.players.length < 6) vs.players.push(''); showVsChallenge(vs.cid); }
  else if (k === 'vs-del') { if (sheetFn) sheetFn(); vs.players.splice(+v, 1); showVsChallenge(vs.cid); }
  else if (k === 'vs-start') { if (sheetFn) sheetFn(); openCam(v); }
  else if (k === 'vs-join') showVsJoin();
  else if (k === 'vs-join-go') {
    if (sheetFn) sheetFn();
    const code = ($('#vsRoomIn').value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 6) { toast(t('vsNoRoom')); return; }
    vs.joinCode = '';
    closeSheet();
    unlockAudio();
    liveJoin(code);
  }
  else if (k === 'vs-code') showVsCode();
  else if (k === 'vs-code-add') { const r = vsParse($('#vsCodeIn').value); if (!r) toast(t('vsCodeBad')); else { addRival(r); closeSheet(); toast(t('vsCodeOk', { name: r.p })); go('vs'); } }
  else if (k === 'vs-copy') vsCopy();
  else if (k === 'vs-send') vsSend();
  else if (k === 'coach-clear') { S.chat = []; save(); render(); }
  else if (k === 'quote') {
    curQuote = nextQuote();
    const q = b.querySelector('.quote-txt');
    if (q) { q.textContent = `“${curQuote}”`; q.classList.remove('q-in'); void q.offsetWidth; q.classList.add('q-in'); }
  }
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
  else if (k === 'train-tab') { trainTab = v; render(); }
  else if (k === 'prog-tab') { progTab = v; render(); }
  else if (k === 'programs') { planDraft = null; showPlan(); }
  else if (k === 'pd') { planDraft[b.dataset.k] = b.dataset.k === 'split' || b.dataset.k === 'equipment' ? v : +v; showPlan(); }
  else if (k === 'plan-save') {
    Object.assign(S.profile, { days: planDraft.days, minutes: planDraft.minutes, equipment: planDraft.equipment });
    S.plan = { split: planDraft.split, start: Date.now() };
    planDraft = null; save(); closeSheet(); render(); toast(t('planSaved'));
  }
  else if (k === 'use-program') { S.profile.equipment = v; save(); closeSheet(); render(); toast(t('planChanged')); }
  else if (k === 'rt-info') showRoutine(v);
  else if (k === 'rt-start') startRoutine(v);
  else if (k === 'rt-save') saveRoutine();
  else if (k === 'rt-del') confirmSheet(t('rtDelTitle'), t('rtDelText'), t('delWorkout'), () => { S.routines = (S.routines || []).filter((x) => x.id !== v); save(); render(); toast(t('rtDeleted')); }, true);
  else if (k === 'rt-from') {
    const w = S.workouts.find((x) => String(x.id) === v);
    if (w) openSaveRoutine(w.exercises.map((ex) => [ex.id, ex.sets.length, ex.t || findProgReps(ex.id) || targetFor(ex.id)]), w.place || w.equip || 'gym', histName(w));
  }
  else if (k === 'move-ex') moveEx(+b.dataset.i, +v);
  else if (k === 'bw-add') { const n = num($('#bwIn').value); if (n > 20) { logWeight(Math.round(toKg(n) * 10) / 10); render(); toast(t('saved')); } }
  else if (k === 'lesson') showLesson(v);
  else if (k === 'ch-open') showChallenge();
  else if (k === 'lesson-done') {
    S.lessonsDone = S.lessonsDone || {};
    if (S.lessonsDone[v]) delete S.lessonsDone[v]; else { S.lessonsDone[v] = Date.now(); vibrate(30); grow('lesson', 1, true); }
    save();
    const on = !!S.lessonsDone[v];
    b.classList.toggle('on', on);
    b.querySelector('span').textContent = t(on ? 'lessonDoneOn' : 'lessonDoneBtn');
    if (current === 'sports') { const y = window.scrollY; render(); window.scrollTo(0, y); }
  }
  else if (k === 'fight') { closeSheet(); if (b.dataset.set && !fight.iv) fight.set = b.dataset.set; openFight(v); }
  else if (k === 'sport') { sportSel = v || null; render(); }
  else if (k === 'flipmap') b.closest('.flipmap').classList.toggle('back');
  else if (k === 'demo-play') demoShow({ speed: +v }, b);
  else if (k === 'demo-step') demoShow({ step: +v }, b);
  else if (k === 'fig-play') {
    const [kind, id] = v.split(':'), box = $('#demoFig');
    if (box) box.innerHTML = `${(kind === 'ex' ? exFigure : lessonFigure)(id)}<span class="demo-tag">${t('howItMoves')}</span>`;
  }
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
document.addEventListener('input', (e) => {
  if (!e.target.matches || !e.target.matches('[data-search]')) return;
  libQuery = e.target.value;
  const l = $('#libList');
  if (l) l.innerHTML = libListHtml();
});
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
  if (e.target.id === 'photoFile') { addPhoto(e.target.files[0]); e.target.value = ''; return; }
  const f = e.target.dataset && e.target.dataset.field;
  if (!f) return;
  const val = e.target.value;
  if (f === 'lang') { S.lang = val === 'auto' ? null : val; setLang(S.lang || detectLang()); }
  else if (f === 'rest') S.rest = +val;
  else if (f === 'days') S.profile.days = +val;
  else if (f === 'bw') logWeight(Math.round(toKg(num(val)) * 10) / 10);
  else if (f === 'age') S.profile.age = clamp(Math.round(num(val)), 14, 100);
  else if (f === 'height') S.profile.height = clamp(Math.round(num(val)), 120, 230);
  else if (f === 'name') S.profile.name = val.trim().slice(0, 24);
  else S.profile[f] = val;
  save();
  if (['lang', 'units', 'equipment', 'name', 'goal', 'level', 'days', 'rest', 'sex'].includes(f)) render();
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
        const stp = def.perHand ? 2 : 2.5; // weights you can load on a real bar, machine or dumbbell
        if (st && st[1] !== 'ratio') r = Math.round(st[2] + (st[3] - st[2]) * lvl);
        else if (st) w = Math.max(stp, Math.round((bodyBase(bw) * (st[2] + (st[3] - st[2]) * lvl)) / (1 + r / 30) / stp) * stp);
        else if (!def.bw) w = Math.max(stp, Math.round((bw * (0.12 + 0.08 * prog)) / stp) * stp);
        return { id, sets: Array.from({ length: setsFor(sets) }, (_, j) => ({ w, r: Math.max(1, r - (j === setsFor(sets) - 1 ? 1 : 0)) })) };
      }),
    };
  });
  S.workouts = [...S.workouts.filter((w) => !String(w.id).startsWith('demo')), ...made].sort((x, y) => x.date - y.date);
  save();
}

// ---------- Training reminders ----------
// You pick the time and the days; the server wakes the phone (Web Push) and the phone shows a line saved here.
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const defaultDays = (n) => ({ 2: [2, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 5], 6: [1, 2, 3, 4, 5, 6] }[n] || [1, 3, 5]);
const remind = () => { if (!S.remind) S.remind = { on: false, time: '18:00', days: defaultDays(S.profile.days) }; return S.remind; };
const pushOk = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
function remindCard() {
  const R = remind(), letters = getLang() === 'es' ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return `<section class="card stack remind" id="remindCard"><div class="row"><span class="rm-ic">${I.bell}</span><span class="grow"><b>${t('reminders')}</b><br><span class="muted small">${t(R.on ? 'rmOn' : 'rmOff')}</span></span>
      <button class="switch${R.on ? ' on' : ''}" data-act="rm-toggle" role="switch" aria-checked="${R.on}" aria-label="${t('reminders')}"><i></i></button></div>
    <div class="rm-set"><label class="rm-time"><span>${t('rmTime')}</span><input type="time" id="rmTime" value="${esc(R.time)}"></label>
      <div class="rm-days">${DAY_ORDER.map((d, i) => `<button class="chip" data-act="rm-day" data-v="${d}" aria-pressed="${R.days.includes(d)}">${letters[i]}</button>`).join('')}</div></div>
    <div class="split"><button class="btn btn-sm" data-act="rm-test">${t('rmTest')}</button><button class="btn btn-sm btn-primary" data-act="rm-save">${t('rmSave')}</button></div>
    <p class="muted small">${t(pushOk() ? 'rmNote' : 'rmNoSupport')}</p></section>`;
}
// What the reminder will say: today's workout, your name, and lines that change.
async function writeRemindText() {
  if (!('caches' in window)) return;
  const d = nextDay(), nm = S.profile.name || '';
  const bodies = [t('rmB1', { day: dayName(d), name: nm }), t('rmB2', { name: nm }), t('rmB3', { day: dayName(d) }), nextQuote(), nextQuote(), nextQuote()];
  try { const c = await caches.open('es-remind'); await c.put('/app/__remind', new Response(JSON.stringify({ title: 'Earned Strength', bodies, url: '/app/#home' }), { headers: { 'content-type': 'application/json' } })); } catch (e) { /* no storage */ }
}
const b64uToBytes = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
async function saveRemind() {
  const R = remind(), tm = $('#rmTime');
  if (tm && /^\d\d:\d\d$/.test(tm.value)) R.time = tm.value;
  if (!R.days.length) { toast(t('rmPickDay')); return; }
  save();
  if (!R.on) { toast(t('rmSaved')); return; }
  if (!pushOk()) { toast(t('rmNoSupport')); return; }
  try {
    if ((await Notification.requestPermission()) !== 'granted') { toast(t('rmDenied')); R.on = false; save(); render(); return; }
    const reg = await navigator.serviceWorker.ready;
    const sub = (await reg.pushManager.getSubscription()) || (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToBytes(net.VAPID_PUBLIC) }));
    await ensureAccount();
    const [h, m] = R.time.split(':').map(Number);
    await net.savePush(sub.toJSON(), h, m, R.days, -new Date().getTimezoneOffset());
    R.endpoint = sub.endpoint;
    save();
    await writeRemindText();
    toast(t('rmSavedOn', { time: R.time }));
  } catch (e) { toast(t(net.isOnline() ? 'rmFail' : 'vsNeedNet')); }
}
async function remindOff() {
  const R = remind();
  R.on = false;
  save();
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) { if (S.acct) await net.deletePush(sub.endpoint).catch(() => {}); await sub.unsubscribe(); }
  } catch (e) { /* nothing to undo */ }
}
async function testRemind() {
  if (!('Notification' in window)) { toast(t('rmNoSupport')); return; }
  if ((await Notification.requestPermission()) !== 'granted') { toast(t('rmDenied')); return; }
  const d = nextDay();
  const body = t('rmB1', { day: dayName(d), name: S.profile.name || '' });
  try {
    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : null;
    if (reg) await reg.showNotification('Earned Strength', { body, icon: 'icons/icon-192.png', tag: 'es-test' }); else new Notification('Earned Strength', { body, icon: 'icons/icon-192.png' });
  } catch (e) { toast(body); }
}

// ---------- Guided warm-up: about 4 minutes, picked for what you train today ----------
// [id, picture (character move) or null, emoji when there is no picture]
const WARM_MOVES = {
  jacks: [null, '⭐'], march: [null, '🚶'], arms: [null, '🔄'], hips: [null, '⭕'], legswing: [null, '🦵'],
  squat: ['bw-squat'], pushup: ['push-up'], lunge: ['lunge'], bridge: ['glute-bridge'], superman: ['superman'], plank: ['plank'], calves: ['calf-raise'],
};
const WARM_PLANS = {
  upper: ['march', 'jacks', 'arms', 'pushup', 'superman', 'plank', 'pushup', 'arms'],
  lower: ['march', 'jacks', 'hips', 'legswing', 'squat', 'lunge', 'bridge', 'calves'],
  full: ['jacks', 'arms', 'hips', 'squat', 'pushup', 'lunge', 'bridge', 'plank'],
};
const WARM_SECS = 30;
const warm = { plan: [], i: 0, end: 0, left: 0, paused: false, iv: 0, kind: 'full', voice: true, dayId: '', lastBeep: 0 };
function warmKind(dayId) { return /lower|legs/.test(dayId) ? 'lower' : /upper|push|pull/.test(dayId) ? 'upper' : 'full'; }
function warmEl() {
  let el = $('#warm');
  if (!el) {
    el = document.createElement('div');
    el.id = 'warm';
    el.className = 'fight warm';
    el.hidden = true;
    document.body.appendChild(el);
    el.addEventListener('click', onWarmClick);
  }
  return el;
}
function openWarm(dayId) {
  const d = dayId || nextDay().id;
  Object.assign(warm, { dayId: d, kind: warmKind(d), i: -1, paused: false });
  warm.plan = WARM_PLANS[warm.kind];
  warmEl().hidden = false;
  document.body.style.overflow = 'hidden';
  renderWarm();
}
function warmArt(id) {
  const [pic, emoji] = WARM_MOVES[id];
  const m = pic && moveId(pic);
  return m ? `<div class="move-anim play"><img src="${movePath(m, 1)}" alt="" class="m1" style="animation-duration:2.4s"><img src="${movePath(m, 2)}" alt="" class="m2" style="animation-duration:2.4s"></div>` : `<span class="wm-emoji">${emoji}</span>`;
}
function renderWarm() {
  const el = warmEl(), w = warm;
  if (w.i < 0) {
    el.innerHTML = `<div class="f-top"><button class="icon-btn" data-w="close" aria-label="${t('close')}">${I.close}</button></div>
      <div class="f-body"><span class="eyebrow">${t('wmEyebrow')}</span><h1>${t('wmTitle')}</h1><p class="muted small">${t('wmSub_' + w.kind, { n: Math.round((w.plan.length * WARM_SECS) / 60) })}</p>
        <ol class="wm-list">${w.plan.map((id) => `<li><span class="wm-th">${warmArt(id)}</span><span class="grow"><b>${t('wm_' + id)}</b><small>${t('wmc_' + id)}</small></span><em>${WARM_SECS} s</em></li>`).join('')}</ol>
        <label class="f-voice"><input type="checkbox" data-w="voice" ${w.voice ? 'checked' : ''}>${t('fVoice')}</label></div>
      <div class="f-foot"><button class="btn btn-primary btn-block" data-w="go">${I.play}${t('wmStart')}</button></div>`;
    return;
  }
  if (w.i >= w.plan.length) {
    el.innerHTML = `<div class="f-top"><button class="icon-btn" data-w="close" aria-label="${t('close')}">${I.close}</button></div>
      <div class="f-body center"><div class="f-done-ic">${I.check}</div><h1>${t('wmDone')}</h1><p class="muted">${t('wmDoneSub')}</p><p class="ps-quote">“${esc(nextQuote())}”</p></div>
      <div class="f-foot"><button class="btn btn-primary btn-block" data-w="start">${I.play}${t('startWorkout')}</button><button class="btn btn-block" data-w="close">${t('close')}</button></div>`;
    return;
  }
  const id = w.plan[w.i], nx = w.plan[w.i + 1];
  el.innerHTML = `<div class="f-top"><button class="icon-btn" data-w="close" aria-label="${t('close')}">${I.close}</button><span class="f-round">${t('wmStep', { n: w.i + 1, total: w.plan.length })}</span><button class="icon-btn" data-w="skip" aria-label="${t('wmSkip')}">${I.chev}</button></div>
    <div class="wm-run"><div class="wm-art">${warmArt(id)}</div><b class="wm-name">${t('wm_' + id)}</b><small class="wm-cue">${t('wmc_' + id)}</small>
      <div class="f-time" id="wmTime">0:${String(WARM_SECS).padStart(2, '0')}</div><div class="f-bar"><i id="wmBar"></i></div>
      <div class="wm-dots">${w.plan.map((_, i) => `<i class="${i < w.i ? 'done' : i === w.i ? 'cur' : ''}"></i>`).join('')}</div>
      ${nx ? `<small class="wm-next">${t('wmNext', { m: t('wm_' + nx) })}</small>` : ''}</div>
    <div class="f-foot"><button class="btn btn-block" data-w="pause">${w.paused ? I.play + t('fResume') : I.pause + t('fPause')}</button></div>`;
  tickWarm(true);
}
function warmStep(i) {
  warm.i = i;
  warm.lastBeep = 0;
  if (i >= warm.plan.length) { warmFinish(); return; }
  warm.end = Date.now() + WARM_SECS * 1000;
  renderWarm();
  if (warm.voice) say(t('wm_' + warm.plan[i]));
  else toneAt(880, 0, 0.1, 0.2);
}
function tickWarm(force) {
  const w = warm;
  if (w.i < 0 || w.i >= w.plan.length) return;
  if (w.paused && force !== true) return;
  const left = w.paused ? w.left : Math.max(0, w.end - Date.now()), sec = Math.ceil(left / 1000);
  const te = $('#wmTime'), be = $('#wmBar');
  if (te) te.textContent = fmtSecs(sec);
  if (be) be.style.width = `${(1 - left / (WARM_SECS * 1000)) * 100}%`;
  if (w.paused) return;
  if (sec <= 3 && sec > 0 && sec !== w.lastBeep) { w.lastBeep = sec; toneAt(660, 0, 0.08, 0.2); }
  if (left <= 0) warmStep(w.i + 1);
}
function warmFinish() {
  clearInterval(warm.iv);
  warm.iv = 0;
  try { if (warm.lock) warm.lock.release(); } catch (e) { /* released */ }
  bell(2);
  confetti(40);
  grow('warmup', 1, true);
  renderWarm();
}
function closeWarm() {
  clearInterval(warm.iv);
  warm.iv = 0;
  try { if (warm.lock) warm.lock.release(); } catch (e) { /* released */ }
  try { speechSynthesis.cancel(); } catch (e) { /* no voice */ }
  warmEl().hidden = true;
  document.body.style.overflow = '';
}
function onWarmClick(e) {
  const b = e.target.closest('[data-w]');
  if (!b) return;
  const k = b.dataset.w, w = warm;
  if (k === 'voice') { w.voice = b.checked; return; }
  if (k === 'close') closeWarm();
  else if (k === 'go') {
    unlockAudio();
    try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then((l) => { w.lock = l; }).catch(() => {}); } catch (x) { /* the screen may turn off */ }
    clearInterval(w.iv);
    w.iv = setInterval(tickWarm, 200);
    warmStep(0);
  } else if (k === 'skip') warmStep(w.i + 1);
  else if (k === 'pause') {
    w.paused = !w.paused;
    if (w.paused) w.left = Math.max(0, w.end - Date.now()); else w.end = Date.now() + w.left;
    renderWarm();
  } else if (k === 'start') { closeWarm(); startWorkout(w.dayId); }
}

// ---------- Missions, XP and levels: small daily and weekly goals that bring you back ----------
// Everything you do gives XP; three daily missions and three weekly missions give extra. Levels never go down.
const XP_FOR = { workout: 50, pr: 25, camera: 20, goal: 25, lesson: 15, daily: 20, weigh: 10, coach: 5, protein: 15, water: 10, photo: 15, win: 30, friend: 20, early: 10, night: 10, warmup: 10 };
const XP_ONCE = new Set(['weigh', 'coach', 'protein', 'water']); // these give XP once a day
const MIS_D = [['d-train', 'workout', 1, 40], ['d-daily', 'daily', 1, 25], ['d-camera', 'camera', 1, 30], ['d-lesson', 'lesson', 1, 20],
  ['d-protein', 'protein', 1, 25], ['d-water', 'water', 1, 20], ['d-coach', 'coach', 1, 15], ['d-weigh', 'weigh', 1, 15]];
const MIS_W = [['w-days', 'workout', 0, 150], ['w-pr', 'pr', 1, 80], ['w-camera', 'camera', 3, 90], ['w-goal', 'goal', 1, 70], ['w-daily', 'daily', 4, 100], ['w-photo', 'photo', 1, 50]];
const lvlAt = (L) => 50 * L * (L - 1);
function levelOf(xp) { let L = 1; while (xp >= lvlAt(L + 1)) L++; return { L, into: xp - lvlAt(L), need: lvlAt(L + 1) - lvlAt(L) }; }
const xpData = () => { if (!S.xp) S.xp = { total: 0, weeks: {}, once: {} }; return S.xp; };
const xpTotal = () => xpData().total;
// The same three missions all day for everyone with the same day (a seeded shuffle), different each day.
function seeded(list, seed, k) {
  const a = list.slice();
  let x = seed % 2147483647 || 1;
  for (let i = a.length - 1; i > 0; i--) { x = (x * 16807) % 2147483647; const j = x % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, k);
}
function missions() {
  const day = dayKey(Date.now()), wk = dayKey(weekStart(Date.now()));
  if (!S.mis || S.mis.day !== day) {
    const rest = seeded(MIS_D.filter((m) => m[0] !== 'd-train'), todayIdx() * 7 + 3, 2);
    S.mis = { ...(S.mis || {}), day, d: [MIS_D[0], ...rest].map((m) => ({ id: m[0], c: 0 })) };
  }
  if (S.mis.week !== wk) {
    const rest = seeded(MIS_W.slice(1), Math.floor(todayIdx() / 7) * 13 + 5, 2);
    S.mis.week = wk;
    S.mis.w = [MIS_W[0], ...rest].map((m) => ({ id: m[0], c: 0 }));
  }
  return S.mis;
}
const misDef = (id) => MIS_D.find((m) => m[0] === id) || MIS_W.find((m) => m[0] === id);
const misNeed = (def) => (def[2] || S.profile.days || 3);
const MIS_IC = { workout: 'train', daily: 'target', camera: 'camera', lesson: 'gloves', protein: 'flame', coach: 'chat', weigh: 'gauge', pr: 'trophy', goal: 'trophy', photo: 'camera' };
const misIcon = (def) => (def[1] === 'water' ? '<span class="mi-drop">💧</span>' : I[MIS_IC[def[1]]] || '');
function misText(id) { const d = misDef(id); return t('m_' + id, { n: misNeed(d) }); }
// Something happened: give XP, move missions forward, celebrate a mission or a new level.
function grow(ev, count = 1, quiet) {
  const X = xpData(), day = dayKey(Date.now());
  if (XP_ONCE.has(ev)) {
    if (X.once.day !== day) X.once = { day, list: [] };
    if (X.once.list.includes(ev)) return;
    X.once.list.push(ev);
  }
  const before = levelOf(X.total).L;
  let gain = (XP_FOR[ev] || 0) * count;
  const M = missions(), done = [];
  for (const m of [...M.d, ...M.w]) {
    const def = misDef(m.id);
    if (!def || def[1] !== ev) continue;
    const need = misNeed(def);
    if (m.c >= need) continue;
    m.c = Math.min(need, m.c + count);
    if (m.c >= need) { gain += def[3]; done.push(m.id); }
  }
  X.total += gain;
  S.cnt = S.cnt || {};
  S.cnt[ev] = (S.cnt[ev] || 0) + count;
  if (done.length) S.cnt.mission = (S.cnt.mission || 0) + done.length;
  const wk = dayKey(weekStart(Date.now()));
  X.weeks[wk] = (X.weeks[wk] || 0) + gain;
  const ks = Object.keys(X.weeks).sort();
  for (const k of ks.slice(0, Math.max(0, ks.length - 12))) delete X.weeks[k];
  save();
  const after = levelOf(X.total).L;
  syncXp();
  if (after > before) { shareEvent('level', { n: after }); setTimeout(() => { toast(t('lvlUp', { n: after })); confetti(70); vibrate([50, 40, 90]); }, quiet ? 1200 : 0); }
  else if (done.length) { setTimeout(() => { toast(t('misDone', { m: misText(done[0]), xp: misDef(done[0])[3] })); confetti(35); }, quiet ? 1200 : 0); }
  else if (!quiet && gain) toast(`+${gain} XP`);
  checkBadges();
  const mc = $('#misCard');
  if (mc) mc.outerHTML = missionsCard();
  const lp = $('#lvlPill');
  if (lp) lp.outerHTML = levelPill();
}
function levelPill() {
  const lv = levelOf(xpTotal());
  return `<button class="lvl-pill" id="lvlPill" data-act="missions"><b>${t('lvlN', { n: lv.L })}</b><span class="lvl-bar"><i style="width:${Math.round((lv.into / lv.need) * 100)}%"></i></span><small>${lv.into}/${lv.need} XP</small></button>`;
}
function missionsCard() {
  const M = missions();
  const row = (m) => { const d = misDef(m.id), need = misNeed(d), ok = m.c >= need; return `<li class="${ok ? 'ok' : ''}"><i>${ok ? I.check : misIcon(d)}</i><span class="grow">${esc(misText(m.id))}${need > 1 && !ok ? ` <small>${m.c}/${need}</small>` : ''}</span><em>+${d[3]}</em></li>`; };
  return `<section class="card mis-card" id="misCard"><div class="card-head"><span class="eyebrow">${t('misToday')}</span><button class="link small" data-act="missions">${t('misWeekly')}</button></div><ul class="mis-list">${M.d.map(row).join('')}</ul></section>`;
}
function showMissions() {
  const M = missions(), lv = levelOf(xpTotal());
  const row = (m) => { const d = misDef(m.id), need = misNeed(d), ok = m.c >= need; return `<li class="${ok ? 'ok' : ''}"><i>${ok ? I.check : misIcon(d)}</i><span class="grow">${esc(misText(m.id))}${need > 1 ? ` <small>${Math.min(m.c, need)}/${need}</small>` : ''}</span><em>+${d[3]}</em></li>`; };
  openSheet(`<span class="eyebrow">${t('misTitle')}</span>
    <div class="lvl-big"><b>${lv.L}</b><span><small>${t('lvlWord')}</small><span class="lvl-bar"><i style="width:${Math.round((lv.into / lv.need) * 100)}%"></i></span><small>${t('lvlNext', { n: lv.need - lv.into, l: lv.L + 1 })}</small></span></div>
    <h3>${t('misToday')}</h3><ul class="mis-list">${M.d.map(row).join('')}</ul>
    <h3>${t('misWeekly')}</h3><ul class="mis-list">${M.w.map(row).join('')}</ul>
    <h3>${t('xpHow')}</h3><ul class="xp-how">${['workout', 'pr', 'camera', 'goal', 'daily', 'lesson', 'protein', 'water', 'photo', 'weigh'].map((k) => `<li><span>${t('xp_' + k)}</span><b>+${XP_FOR[k]}</b></li>`).join('')}</ul>`);
}

// ---------- Protein and water today ----------
const FOODS = [['egg', 6], ['eggs2', 12], ['chicken', 31], ['beef', 26], ['tuna', 25], ['fish', 22], ['milk', 8], ['yogurt', 15], ['cheese', 7], ['beans', 15], ['shake', 24], ['tofu', 12], ['peanut', 7]];
const proteinTarget = () => Math.round((S.profile.bw || 70) * (S.profile.goal === 'fat' ? 2.0 : 1.8) / 5) * 5;
const waterTarget = () => Math.max(6, Math.ceil(((S.profile.bw || 70) * 0.035) / 0.25));
function foodToday() { const k = dayKey(Date.now()); S.food = S.food || {}; if (!S.food[k]) S.food[k] = { p: 0, w: 0, log: [] }; return S.food[k]; }
function foodCard() {
  const f = foodToday(), pt = proteinTarget(), wt = waterTarget();
  const pp = Math.min(1, f.p / pt), wp = Math.min(1, f.w / wt);
  return `<section class="card food-card" id="foodCard"><div class="card-head"><span class="eyebrow">${t('foodToday')}</span><button class="link small" data-act="food-list">${t('foodMore')}</button></div>
    <div class="food-row"><span class="food-ic">${I.flame}</span><span class="grow"><b>${t('foodProtein')}</b><span class="bar sm"><i style="width:${pp * 100}%"></i></span><small>${f.p} / ${pt} g${f.p >= pt ? ' · ✓' : ''}</small></span>
      <span class="food-btns">${[10, 20, 30].map((g) => `<button class="btn btn-sm" data-act="food-add" data-v="${g}">+${g}</button>`).join('')}</span></div>
    <div class="food-row"><span class="food-ic water">💧</span><span class="grow"><b>${t('foodWater')}</b><span class="bar sm"><i style="width:${wp * 100}%;background:#5AA7E6"></i></span><small>${t('foodGlasses', { n: f.w, t: wt })}${f.w >= wt ? ' · ✓' : ''}</small></span>
      <span class="food-btns"><button class="btn btn-sm" data-act="water-add" data-v="1">+1 ${t('foodGlass')}</button></span></div>
  </section>`;
}
function refreshFood() { const el = $('#foodCard'); if (el) el.outerHTML = foodCard(); const sh = $('#foodSheet'); if (sh) showFoods(); }
function addFood(g, label) {
  const f = foodToday(), pt = proteinTarget(), was = f.p;
  f.p = Math.max(0, Math.min(400, f.p + g));
  if (g > 0) f.log = [...(f.log || []), [label || '', g]].slice(-30);
  const ks = Object.keys(S.food).sort();
  for (const k of ks.slice(0, Math.max(0, ks.length - 30))) delete S.food[k];
  save();
  if (was < pt && f.p >= pt) { toast(t('foodProteinDone')); grow('protein', 1, true); vibrate([30, 20, 60]); } else if (g > 0) vibrate(10);
  refreshFood();
}
function addWater(n) {
  const f = foodToday(), wt = waterTarget(), was = f.w;
  f.w = Math.max(0, Math.min(30, f.w + n));
  save();
  if (was < wt && f.w >= wt) { toast(t('foodWaterDone')); grow('water', 1, true); }
  refreshFood();
}
function showFoods() {
  const f = foodToday();
  const html = `<span class="eyebrow">${t('foodToday')}</span><h2 style="margin-top:6px">${t('foodProtein')}: ${f.p} / ${proteinTarget()} g</h2><p class="muted small" style="margin:4px 0 12px">${t('foodHint', { n: proteinTarget() })}</p>
    <div class="food-grid">${FOODS.map(([k, g]) => `<button class="food-item" data-act="food-pick" data-v="${k}"><b>${t('food_' + k)}</b><small>${g} g</small></button>`).join('')}</div>
    <div class="split" style="margin-top:14px"><button class="btn btn-sm" data-act="food-add" data-v="-10">−10 g</button><button class="btn btn-sm" data-act="water-add" data-v="-1">−1 ${t('foodGlass')}</button></div>`;
  const box = $('#foodSheet');
  if (box && !$('#sheet').hidden) box.innerHTML = html; else openSheet(`<div id="foodSheet">${html}</div>`);
}

// ---------- Progress photos (only on this phone, in its own storage) ----------
let photoDb = null;
function photoStore(mode) {
  if (!photoDb) {
    photoDb = new Promise((res, rej) => {
      const r = indexedDB.open('es-photos', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('photos', { keyPath: 'id' });
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  return photoDb.then((db) => db.transaction('photos', mode).objectStore('photos'));
}
const idbAll = () => photoStore('readonly').then((st) => new Promise((res, rej) => { const q = st.getAll(); q.onsuccess = () => res(q.result.sort((a, b) => b.at - a.at)); q.onerror = () => rej(q.error); }));
const idbPut = (v) => photoStore('readwrite').then((st) => new Promise((res, rej) => { const q = st.put(v); q.onsuccess = () => res(); q.onerror = () => rej(q.error); }));
const idbDel = (id) => photoStore('readwrite').then((st) => new Promise((res, rej) => { const q = st.delete(id); q.onsuccess = () => res(); q.onerror = () => rej(q.error); }));
const photoUrls = new Map();
const photoUrl = (p) => { if (!photoUrls.has(p.id)) photoUrls.set(p.id, URL.createObjectURL(p.blob)); return photoUrls.get(p.id); };
function photosHtml() {
  return `<div class="section-title"><span class="eyebrow">${t('photosTitle')}</span><button class="link small" data-act="photo-compare" id="photoCmpBtn" hidden>${t('baTitle')}</button></div>
    <section class="card photos-card"><div class="photo-grid" id="photoGrid"><button class="photo-add" data-act="photo-add">${I.plus}<span>${t('photosAdd')}</span></button></div>
    <p class="muted small">${t('photosNote')}</p><input type="file" id="photoFile" accept="image/*" hidden></section>`;
}
async function loadPhotos() {
  try {
    const list = await idbAll();
    const g = $('#photoGrid');
    if (!g) return;
    g.innerHTML = `<button class="photo-add" data-act="photo-add">${I.plus}<span>${t('photosAdd')}</span></button>` + list.map((p) => `<button class="photo-th" data-act="photo-view" data-v="${esc(p.id)}"><img src="${photoUrl(p)}" alt=""><small>${fmtDate(p.at)}</small></button>`).join('');
    const b = $('#photoCmpBtn');
    if (b) b.hidden = list.length < 2;
  } catch (e) { /* this browser keeps no photos */ }
}
async function addPhoto(file) {
  if (!file) return;
  try {
    const img = await createImageBitmap(file);
    const k = Math.min(1, 1280 / Math.max(img.width, img.height));
    const cv = document.createElement('canvas');
    cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
    cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
    const blob = await new Promise((res) => cv.toBlob(res, 'image/jpeg', 0.82));
    await idbPut({ id: Date.now().toString(36), at: Date.now(), kg: S.profile.bw || 0, blob });
    grow('photo', 1, true);
    loadPhotos();
    const all = await idbAll(), first = all[all.length - 1];
    const day = first ? Math.max(1, Math.round((Date.now() - first.at) / DAY) + 1) : 1;
    openSheet(`<div class="photo-saved"><span class="ps-ic">${I.check}</span><span class="eyebrow">${t('photosSaved')}</span><h2>${t('photosDayN', { n: day })}</h2>
      <p class="ps-quote">“${esc(progressQuote())}”</p>
      ${all.length >= 2 ? `<button class="btn btn-primary btn-block" data-act="photo-compare">${t('baTitle')}</button>` : `<p class="muted small">${t('photosNext')}</p>`}
      <button class="btn btn-block" style="margin-top:10px" data-act="close-sheet">${t('done')}</button></div>`);
    confetti(30);
  } catch (e) { toast(t('photosFail')); }
}
async function showPhoto(id) {
  const p = (await idbAll()).find((x) => x.id === id);
  if (!p) return;
  openSheet(`<span class="eyebrow">${t('photosTitle')}</span><h2 style="margin-top:6px">${fmtDate(p.at)}</h2>${p.kg ? `<p class="muted">${fmtW(p.kg)} ${unit()}</p>` : ''}
    <img class="photo-big" src="${photoUrl(p)}" alt=""><button class="btn btn-block" style="margin-top:12px;color:var(--red-2)" data-act="photo-del" data-v="${esc(p.id)}">${I.trash}${t('photosDelete')}</button>`);
}
// Before and after: pick the two photos, slide between them, and make a picture to share.
const ba = { a: null, b: null };
async function comparePhotos() {
  const list = await idbAll();
  if (list.length < 2) { toast(t('photosNeed2')); return; }
  if (!list.some((p) => p.id === ba.a)) ba.a = list[list.length - 1].id;
  if (!list.some((p) => p.id === ba.b) || ba.b === ba.a) ba.b = list[0].id;
  const A = list.find((p) => p.id === ba.a), B = list.find((p) => p.id === ba.b);
  const [x, y] = A.at <= B.at ? [A, B] : [B, A];
  const days = Math.max(0, Math.round((y.at - x.at) / DAY));
  const strip = (which) => `<div class="ba-strip">${list.map((p) => `<button class="ba-th${ba[which] === p.id ? ' on' : ''}" data-act="ba-pick" data-k="${which}" data-v="${esc(p.id)}"><img src="${photoUrl(p)}" alt=""><small>${fmtDate(p.at)}</small></button>`).join('')}</div>`;
  const kg = x.kg && y.kg ? y.kg - x.kg : null;
  const html = `<span class="eyebrow">${t('baTitle')}</span><h2 style="margin-top:6px">${t('photosDays', { n: days })}${kg != null && Math.abs(kg) >= 0.1 ? ` · ${kg > 0 ? '+' : '−'}${fmtW(Math.abs(kg))} ${unit()}` : ''}</h2>
    <div class="cmp" id="cmpBox"><img src="${photoUrl(x)}" alt=""><div class="cmp-top" id="cmpTop"><img src="${photoUrl(y)}" alt=""></div><span class="cmp-tag l">${t('baBefore')}</span><span class="cmp-tag r">${t('baAfter')}</span><input type="range" min="0" max="100" value="50" id="cmpRange" aria-label="${t('baTitle')}"></div>
    <h3>${t('baBefore')}</h3>${strip('a')}<h3>${t('baAfter')}</h3>${strip('b')}
    <button class="btn btn-primary btn-block" style="margin-top:16px" data-act="ba-share">${I.share}${t('baShare')}</button>
    <p class="muted small" style="margin-top:10px">${t('baNote')}</p>`;
  const box = $('#baSheet');
  if (box && !$('#sheet').hidden) box.innerHTML = html; else openSheet(`<div id="baSheet">${html}</div>`);
  sheetFn = () => { const r = $('#cmpRange'), top = $('#cmpTop'); if (r && top) top.style.clipPath = `inset(0 0 0 ${r.value}%)`; };
  sheetFn();
}
const roundRect = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
// Draws a picture so it fills the box without stretching (cuts the edges if needed).
function drawCover(g, img, x, y, w, h) {
  const k = Math.max(w / img.width, h / img.height), sw = w / k, sh = h / k;
  g.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
}
async function shareBeforeAfter() {
  const list = await idbAll();
  const A = list.find((p) => p.id === ba.a), B = list.find((p) => p.id === ba.b);
  if (!A || !B) return;
  const [x, y] = A.at <= B.at ? [A, B] : [B, A];
  const W = 1080, H = 1350, cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  try { await Promise.all([document.fonts.load('120px "Bebas Neue"'), document.fonts.load('700 32px Inter'), document.fonts.load('italic 500 34px Inter')]); } catch (e) { /* fonts optional */ }
  g.fillStyle = '#0E1012'; g.fillRect(0, 0, W, H);
  let gr = g.createRadialGradient(W / 2, 760, 40, W / 2, 760, 760);
  gr.addColorStop(0, 'rgba(200,68,59,.42)'); gr.addColorStop(1, 'rgba(200,68,59,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  try { const logo = await loadImg('icons/logo-512.png'); g.save(); roundRect(g, 60, 52, 96, 96, 22); g.clip(); g.drawImage(logo, 60, 52, 96, 96); g.restore(); } catch (e) { /* no logo */ }
  g.textBaseline = 'alphabetic';
  g.font = '58px "Bebas Neue", sans-serif'; g.fillStyle = '#EDEAE4'; g.fillText('EARNED', 178, 118);
  const ew = g.measureText('EARNED ').width; g.fillStyle = '#E2463B'; g.fillText('STRENGTH', 178 + ew, 118);
  g.textAlign = 'right'; g.font = '700 30px Inter, sans-serif'; g.fillStyle = '#93999E'; g.fillText(t('baTitle').toUpperCase(), W - 60, 112); g.textAlign = 'left';
  const imgs = await Promise.all([loadImg(photoUrl(x)), loadImg(photoUrl(y))]);
  const pw = 465, ph = 620, top = 190;
  [[imgs[0], 60, x, t('baBefore')], [imgs[1], W - 60 - pw, y, t('baAfter')]].forEach(([im, px, p, label], i) => {
    g.save(); roundRect(g, px, top, pw, ph, 28); g.clip(); drawCover(g, im, px, top, pw, ph);
    const sh = g.createLinearGradient(0, top + ph - 160, 0, top + ph); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.75)');
    g.fillStyle = sh; g.fillRect(px, top + ph - 160, pw, 160); g.restore();
    g.fillStyle = i ? '#E2463B' : 'rgba(20,22,26,.85)'; roundRect(g, px + 20, top + 20, i ? 210 : 170, 56, 28); g.fill();
    g.font = '44px "Bebas Neue", sans-serif'; g.fillStyle = '#fff'; g.fillText(label.toUpperCase(), px + 40, top + 63);
    g.font = '700 30px Inter, sans-serif'; g.fillStyle = '#fff'; g.fillText(fmtDate(p.at), px + 24, top + ph - 58);
    if (p.kg) { g.font = '600 28px Inter, sans-serif'; g.fillStyle = 'rgba(255,255,255,.8)'; g.fillText(`${fmtW(p.kg)} ${unit()}`, px + 24, top + ph - 22); }
  });
  const days = Math.max(0, Math.round((y.at - x.at) / DAY));
  g.textAlign = 'center';
  g.font = '110px "Bebas Neue", sans-serif'; g.fillStyle = '#F4EEE4'; g.fillText(t('baDaysBig', { n: days }).toUpperCase(), W / 2, top + ph + 120);
  if (x.kg && y.kg && Math.abs(y.kg - x.kg) >= 0.1) { g.font = '700 34px Inter, sans-serif'; g.fillStyle = '#E8806F'; g.fillText(`${y.kg > x.kg ? '+' : '−'}${fmtW(Math.abs(y.kg - x.kg))} ${unit()}`, W / 2, top + ph + 172); }
  // A different line each time.
  const quote = `“${progressQuote()}”`;
  g.font = 'italic 500 36px Inter, sans-serif'; g.fillStyle = '#EDEAE4';
  const words = quote.split(' '); let line = '', yy = top + ph + 245; const lines = [];
  for (const wd of words) { const test = line ? line + ' ' + wd : wd; if (g.measureText(test).width > W - 200 && line) { lines.push(line); line = wd; } else line = test; }
  if (line) lines.push(line);
  for (const l of lines.slice(0, 3)) { g.fillText(l, W / 2, yy); yy += 48; }
  g.font = '600 28px Inter, sans-serif'; g.fillStyle = '#93999E'; g.fillText('earnedstrength.online', W / 2, H - 48);
  g.textAlign = 'left';
  openShare(await new Promise((res) => cv.toBlob(res, 'image/png')));
}
// ---------- Last week in one card ----------
function lastWeek() {
  const end = weekStart(Date.now()), start = end - 7 * DAY;
  const ws = S.workouts.filter((w) => w.date >= start && w.date < end && w.exercises);
  if (!ws.length) return null;
  const before = S.workouts.filter((w) => w.date < start);
  let prs = 0;
  const seen = new Set();
  for (const w of ws) for (const ex of w.exercises) {
    if (seen.has(ex.id)) continue;
    const old = bestFor(ex.id, before), now = bestFor(ex.id, ws);
    if (old > 0 && now > old) { prs++; seen.add(ex.id); }
  }
  return { key: dayKey(start), n: ws.length, sets: ws.reduce((a, w) => a + w.exercises.reduce((s, e) => s + e.sets.length, 0), 0), mins: Math.round(ws.reduce((a, w) => a + (w.dur || 0), 0) / 60), prs, xp: (xpData().weeks || {})[dayKey(start)] || 0 };
}
function weekCard() {
  const day = (new Date().getDay() + 6) % 7;
  if (day > 2) return '';
  const L = lastWeek();
  if (!L || (S.weekSeen === L.key)) return '';
  return `<section class="card week-card" id="weekCard"><div class="card-head"><span class="eyebrow">${t('weekTitle')}</span><button class="icon-btn sm" data-act="week-hide" aria-label="${t('close')}">${I.close}</button></div>
    <div class="week-stats"><div><b>${L.n}</b><small>${t('weekWorkouts')}</small></div><div><b>${L.sets}</b><small>${t('setsWord')}</small></div><div><b>${L.prs}</b><small>${t('weekPrs')}</small></div><div><b>${L.xp}</b><small>XP</small></div></div>
    <p class="small muted">${t(L.n >= (S.profile.days || 3) ? 'weekGood' : 'weekPush', { n: L.n, g: S.profile.days || 3 })}</p>
    <button class="btn btn-sm btn-block" data-act="week-share">${I.share}${t('share')}</button></section>`;
}
async function shareWeek() {
  const L = lastWeek();
  if (!L) return;
  openShare(await makeCard({ eyebrow: t('weekTitle'), title: t('weekCardTitle'), stats: [[L.n, t('weekWorkouts')], [L.sets, t('setsWord')], [L.prs, t('weekPrs')]], r: rankIndex(computeScore().total) }));
}

// ---------- Friends: weekly league and activity ----------
// Your friends see when you train, beat a record, hit a goal or level up, and can send you a "💪".
// Only short facts travel (the workout's name, an exercise, a number): never photos or videos.
function shareEvent(kind, data) {
  if (!S.acct || !net.isOnline()) return;
  net.postEvent(kind, data).catch(() => {});
}
let xpTimer = 0;
function syncXp() {
  if (!S.acct || !net.isOnline()) return;
  clearTimeout(xpTimer);
  xpTimer = setTimeout(() => { const wk = dayKey(weekStart(Date.now())); net.pushXp(Math.min(6000, (xpData().weeks || {})[wk] || 0)).catch(() => {}); }, 4000);
}
const agoText = (ts) => { const m = Math.max(0, Math.round((Date.now() - ts) / 60000)); return m < 1 ? t('agoNow') : m < 60 ? t('agoMin', { n: m }) : m < 1440 ? t('agoH', { n: Math.round(m / 60) }) : t('agoD', { n: Math.round(m / 1440) }); };
function eventText(e) {
  const d = e.data || {}, nm = `<b>${esc(e.me ? t('you') : e.name)}</b>`;
  const ch = d.c && challengeById(d.c);
  if (e.kind === 'workout') return t('ev_workout', { name: nm, w: esc(d.w || t('evWorkoutAny')) });
  if (e.kind === 'pr') return t('ev_pr', { name: nm, ex: esc(EXERCISES[d.ex] ? exName(d.ex) : d.ex || '') });
  if (e.kind === 'record' && ch) return t('ev_record', { name: nm, n: esc(fmtScore(ch, d.n)), ch: esc(chTitle(ch)) });
  if (e.kind === 'goal' && ch) return t('ev_goal', { name: nm, n: esc(fmtScore(ch, d.n)), ch: esc(chTitle(ch)) });
  if (e.kind === 'level') return t('ev_level', { name: nm, n: +d.n || 0 });
  return '';
}
const EV_IC = { workout: 'train', pr: 'trophy', record: 'camera', goal: 'target', level: 'flame' };
function friendsView() {
  const A = S.acct;
  const top = `<header class="top me-top"><button class="icon-btn" data-act="go" data-v="home" aria-label="${t('back')}">${I.back}</button><div class="grow"><p class="eyebrow">${t('frEyebrow')}</p><h1>${t('frTitle')}</h1></div></header>`;
  if (!A) return top + `<section class="card fr-empty"><span class="fr-big">${I.trophy}</span><b>${t('frNoAcct')}</b><p class="muted small">${t('acctWhy')}</p><button class="btn btn-primary btn-block" data-act="acct-on">${t('acctOn')}</button></section>`;
  return top + `
    <section class="card fr-invite"><span class="grow"><small>${t('acctFriendCode')}</small><b>${esc(A.code)}</b></span><button class="btn btn-sm" data-act="acct-share">${I.share}${t('frInvite')}</button><button class="btn btn-sm btn-primary" data-act="friend-add">${I.plus}</button></section>
    <div class="section-title"><span class="eyebrow">${t('lgTitle')}</span><span class="muted small" id="lgEnds"></span></div>
    <section class="card list-card" id="lgBox"><p class="muted small fr-pad">${t('vsRankLoading')}</p></section>
    <div class="section-title"><span class="eyebrow">${t('frActivity')}</span></div>
    <section class="card list-card" id="feedBox"><p class="muted small fr-pad">${t('vsRankLoading')}</p></section>`;
}
async function loadFriends() {
  if (!S.acct) return;
  if (!net.isOnline()) { for (const id of ['#lgBox', '#feedBox']) { const el = $(id); if (el) el.innerHTML = `<p class="muted small fr-pad">${t('vsNeedNet')}</p>`; } return; }
  net.setAccount(S.acct);
  syncXp();
  try {
    const lg = await net.getLeague();
    const el = $('#lgBox');
    if (el) {
      const medal = ['🥇', '🥈', '🥉'];
      el.innerHTML = lg.league.length > 1
        ? lg.league.map((x) => `<div class="lg-row${x.me ? ' me' : ''}"><span class="lg-pos">${medal[x.pos - 1] || x.pos}</span><span class="grow">${esc(x.me ? `${x.name} (${t('you')})` : x.name)}</span><b>${x.xp}</b><small>XP</small></div>`).join('')
        : `<p class="muted small fr-pad">${t('lgAlone')}</p>`;
      const days = Math.max(0, Math.ceil((lg.endsAt - Date.now()) / DAY));
      const ends = $('#lgEnds');
      if (ends) ends.textContent = t('lgEnds', { n: days });
    }
  } catch (e) { const el = $('#lgBox'); if (el) el.innerHTML = `<p class="muted small fr-pad">${t('vsRankFail')}</p>`; }
  try {
    const feed = await net.getFeed();
    const el = $('#feedBox');
    if (el) {
      const rows = feed.map((e) => ({ e, txt: eventText(e) })).filter((x) => x.txt);
      el.innerHTML = rows.length ? rows.map(({ e, txt }) => `<div class="fd-row"><span class="fd-ic">${I[EV_IC[e.kind]] || ''}</span><span class="grow"><span class="fd-txt">${txt}</span><small>${agoText(e.at)}</small></span>
        <button class="fd-cheer${e.mine ? ' on' : ''}" data-act="fr-cheer" data-v="${e.id}" ${e.me || e.mine ? 'disabled' : ''} aria-label="${t('frCheer')}">💪<span>${e.cheers || ''}</span></button></div>`).join('')
        : `<p class="muted small fr-pad">${t('frNoActivity')}</p>`;
    }
  } catch (e) { const el = $('#feedBox'); if (el) el.innerHTML = `<p class="muted small fr-pad">${t('vsRankFail')}</p>`; }
}
VIEWS.friends = friendsView;

// ---------- Compete: camera challenges between friends ----------
// Only the camera counts (repcount.js): there is no button to add reps, so nobody can cheat by tapping.
// You can record a video with your count and record drawn on it; it is saved only on your phone.
// Friends compete three ways: a duel passing the same phone, live on two phones (each phone counts its own
// person and the other's count arrives in real time), or a challenge code/link that carries your score.
const vs = { who: 'solo', players: ['', ''], w: '', rival: null, cid: null, rec: true, see: true, voice: true, goal: '', goalFor: null };
// Short shouts while you train (never the same twice in a row).
const HYPE = [['Keep going!', '¡Sigue así!'], ['One more!', '¡Una más!'], ['You can do it!', '¡Tú puedes!'], ['Do not stop now!', '¡No pares ahora!'],
  ['This is discipline!', '¡Esto es disciplina!'], ['Stronger than yesterday!', '¡Más fuerte que ayer!'], ['Push!', '¡Empuja!'], ['Finish strong!', '¡Termina fuerte!'],
  ['Nobody will do it for you!', '¡Nadie lo va a hacer por ti!'], ['That is how it is done!', '¡Así se hace!'], ['Breathe and keep going!', '¡Respira y sigue!'], ['Earn it!', '¡Gánatelo!'],
  ['Your body can, your mind decides!', '¡Tu cuerpo puede, tu mente decide!'], ['Every rep counts!', '¡Cada repetición cuenta!']];
const goalDefault = (c) => { const b = vsData().best[c.id], g = (vsData().goals || {})[c.id]; return g || (b ? b.n + 1 : c.mode === 'hold' ? 60 : c.mode === 'time' ? 20 : 10); };
const vsData = () => { if (!S.vs) S.vs = { best: {}, rivals: [], duels: [] }; return S.vs; };
const chMode = (c) => (c.mode === 'time' ? t('mTime', { n: c.secs }) : t(c.mode === 'hold' ? 'mHold' : 'mMax'));
const chTitle = (c) => `${exName(c.ex)} · ${chMode(c)}`;
const fmtScore = (c, n) => (c.mode === 'hold' ? fmtSecs(n) : String(n));
const scoreWord = (c, n) => (c.mode === 'hold' ? fmtSecs(n) : t(n === 1 ? 'vsRep1' : 'vsRepsN', { n }));
const cleanName = (s) => String(s || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 16);

// Challenge codes: the score travels inside the code itself, so no server is needed.
const b64u = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
const codeCheck = (s) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 1679616; return h.toString(36).padStart(4, '0'); };
function vsCode(r) {
  const o = { c: r.c, n: r.n, m: 1, p: (r.p || '').slice(0, 20), d: Math.floor(Date.now() / DAY) };
  if (r.w) { o.w = r.w; o.u = unit(); }
  const raw = b64u(JSON.stringify(o));
  return 'ES1' + raw + codeCheck(raw);
}
function vsParse(text) {
  const s = String(text || '').trim().replace(/^[\s\S]*?(ES1[A-Za-z0-9_-]+)[\s\S]*$/, '$1');
  if (!/^ES1[A-Za-z0-9_-]{12,400}$/.test(s)) return null;
  const raw = s.slice(3, -4);
  if (codeCheck(raw) !== s.slice(-4)) return null;
  try {
    const o = JSON.parse(unb64u(raw));
    if (!challengeById(o.c) || !Number.isFinite(o.n) || o.n < 0 || o.n > 9999) return null;
    const w = Number.isFinite(o.w) && o.w > 0 && o.w < 1000 ? Math.round(o.w * 10) / 10 : null;
    return { c: o.c, n: Math.round(o.n), cam: o.m === 1, p: cleanName(o.p) || t('vsFriend'), w, u: w ? (o.u === 'kg' ? 'kg' : 'lb') : null, at: Date.now() };
  } catch (e) { return null; }
}
function addRival(r) {
  const D = vsData();
  D.rivals = [r, ...D.rivals.filter((x) => !(x.p === r.p && x.c === r.c))].slice(0, 60);
  vs.rival = r;
  save();
}
// Links opened from a message: #reto=<code> (a score to beat) or #vivo=<room> (join a live room).
function takeChallengeLink() {
  const h = location.hash;
  if (h.startsWith('#vivo=')) {
    vs.joinCode = h.slice(6).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    history.replaceState(null, '', '#vs');
    setTimeout(() => { if (S.profile) showVsJoin(); }, 300);
    return true;
  }
  if (!h.startsWith('#reto=')) return false;
  const r = vsParse(h.slice(6));
  history.replaceState(null, '', '#vs');
  if (!r) { toast(t('vsCodeBad')); return true; }
  addRival(r);
  toast(t('vsCodeOk', { name: r.p }));
  return true;
}

// Big picture of the character for the challenge tiles (the end of the move), the drawing if there is none.
const vsArt = (ex) => { const m = moveId(ex); return m ? `<img class="vs-img" src="${movePath(m, 2)}" alt="" loading="lazy">` : exThumb(ex); };
function vsHomeCard() {
  const r = vs.rival && challengeById(vs.rival.c) ? vs.rival : null;
  return `<button class="card card-tap vs-home" data-act="go" data-v="vs"><span class="vs-hi">${I.camera}</span><span class="grow"><b>${r ? t('vsHomePending', { name: esc(r.p) }) : t('vsHomeT')}</b><small>${r ? esc(chTitle(challengeById(r.c))) : t('vsHomeSub')}</small></span>${I.chev}</button>`;
}
function vsView() {
  const D = vsData();
  const tile = (c) => { const b = D.best[c.id]; return `<button class="vs-tile" data-act="vs-ch" data-v="${c.id}"><span class="vs-th">${vsArt(c.ex)}</span><span class="vs-tt"><b>${esc(exName(c.ex))}</b><small>${chMode(c)}${b ? ` · ${t('vsBestShort', { n: fmtScore(c, b.n) })}` : ''}</small></span></button>`; };
  const rc = vs.rival && challengeById(vs.rival.c);
  const incoming = rc ? `<section class="card vs-incoming"><span class="eyebrow">${t('vsIncoming')}</span>
    <p><b>${esc(vs.rival.p)}</b> ${t('vsDid', { what: esc(scoreWord(rc, vs.rival.n)), ch: esc(chTitle(rc)) })}${vs.rival.w ? ` (${vs.rival.w} ${vs.rival.u})` : ''}</p>
    <button class="btn btn-primary btn-block" data-act="vs-ch" data-v="${rc.id}">${t('vsBeat', { name: esc(vs.rival.p) })}</button></section>` : '';
  const byC = {};
  for (const r of D.rivals) if (challengeById(r.c)) (byC[r.c] = byC[r.c] || []).push(r);
  const boards = Object.entries(byC).map(([cid, rs]) => {
    const c = challengeById(cid), me = D.best[cid];
    const rows = [...rs.map((r) => ({ p: r.p, n: r.n })), ...(me ? [{ p: S.profile.name || t('you'), n: me.n, me: true }] : [])].sort((a, b) => b.n - a.n);
    return `<section class="card vs-board"><div class="vb-head"><b>${esc(chTitle(c))}</b><button class="btn btn-sm" data-act="vs-ch" data-v="${cid}">${t('vsPlay')}</button></div>
      <ol>${rows.map((x, i) => `<li class="${x.me ? 'me' : ''}"><span class="vb-pos">${i + 1}</span><span class="grow">${esc(x.p)}${x.me ? ` <small>(${t('you')})</small>` : ''}</span><b>${esc(fmtScore(c, x.n))}</b></li>`).join('')}</ol></section>`;
  }).join('');
  const duels = D.duels.slice(0, 4).map((d) => {
    const c = challengeById(d.c);
    if (!c || !d.res.length) return '';
    const top = [...d.res].sort((a, b) => b.n - a.n);
    const tie = top[1] && top[1].n === top[0].n;
    return `<div class="vs-duel"><span class="grow"><b>${d.live ? `<em class="live-tag">${t('vsLiveTag')}</em> ` : ''}${esc(chTitle(c))}</b><small>${fmtDate(d.at)} · ${top.map((r) => `${esc(r.p)} ${esc(fmtScore(c, r.n))}`).join(' · ')}</small></span><span class="vs-win">${I.trophy}${tie ? t('vsTie') : esc(top[0].p)}</span></div>`;
  }).join('');
  return `<header class="top me-top"><button class="icon-btn" data-act="go" data-v="home" aria-label="${t('back')}">${I.back}</button><div class="grow"><p class="eyebrow">${t('vsEyebrow')}</p><h1>${t('vsTitle')}</h1></div></header>
    <section class="vs-hero"><div class="grow"><b>${t('vsHeroT')}</b><p>${t('vsHeroP')}</p></div><span class="vs-hero-ic">${I.camera}</span></section>
    ${incoming}
    <section class="card list-card vs-ways">
      <div class="vs-way"><span class="vw-ic">${I.phone}</span><span class="grow"><b>${t('vsWayDuel')}</b><small>${t('vsWayDuelSub')}</small></span></div>
      <button class="vs-way" data-act="vs-join"><span class="vw-ic live">${I.camera}</span><span class="grow"><b>${t('vsWayLive')}</b><small>${t('vsWayLiveSub')}</small></span>${I.chev}</button>
      <button class="vs-way" data-act="vs-code"><span class="vw-ic">${I.share}</span><span class="grow"><b>${t('vsWayLink')}</b><small>${t('vsWayLinkSub')}</small></span>${I.chev}</button>
    </section>
    <div class="section-title"><span class="eyebrow">${t('vsHome')}</span></div>
    <div class="vs-grid">${CAM_CHALLENGES.filter((c) => c.place === 'home').map(tile).join('')}</div>
    <div class="section-title"><span class="eyebrow">${t('vsGym')}</span></div>
    <div class="vs-grid">${CAM_CHALLENGES.filter((c) => c.place === 'gym').map(tile).join('')}</div>
    <div class="section-title"><span class="eyebrow">${t('vsFriends')}</span><button class="link small" data-act="vs-code">${t('vsHaveCode')}</button></div>
    ${boards || `<p class="muted small empty">${t('vsNoFriends')}</p>`}
    ${duels ? `<div class="section-title"><span class="eyebrow">${t('vsDuels')}</span></div><section class="card list-card">${duels}</section>` : ''}
    <p class="muted small vs-note">${I.info}<span>${t('vsPrivacy')}</span></p>`;
}

function showVsChallenge(id) {
  const c = challengeById(id);
  if (!c) return;
  vs.cid = id;
  const D = vsData(), b = D.best[c.id], rule = ruleOf(c);
  if (!vs.players[0]) vs.players[0] = S.profile.name || '';
  const rivals = D.rivals.filter((r) => r.c === c.id).sort((x, y) => y.n - x.n);
  const who = (k, label) => `<button class="chip" data-act="vs-who" data-v="${k}" aria-pressed="${vs.who === k}">${t(label)}</button>`;
  if (vs.goalFor !== id) { vs.goal = String(goalDefault(c)); vs.goalFor = id; }
  const gs = b ? [b.n + 1, b.n + 3, b.n + 5] : c.mode === 'hold' ? [30, 60, 90] : c.mode === 'time' ? [15, 25, 35] : [5, 10, 20];
  const goalBox = vs.who === 'solo' ? `<h3>${t('vsGoalT')}</h3><div class="vs-goal"><input class="vs-in" data-vs="goal" type="number" inputmode="numeric" min="1" max="999" value="${esc(vs.goal)}"><span>${t(c.mode === 'hold' ? 'vsSeconds' : 'vsReps')}</span></div>
    <div class="chips vs-goal-chips">${gs.map((n) => `<button class="chip" data-act="vs-goal" data-v="${n}" aria-pressed="${String(n) === String(vs.goal)}">${c.mode === 'hold' ? fmtSecs(n) : n}</button>`).join('')}</div><p class="muted small">${t(b ? 'vsGoalHintBest' : 'vsGoalHint', { n: b ? fmtScore(c, b.n) : '' })}</p>` : '';
  openSheet(`<span class="eyebrow">${t('vsChallenge')}</span><h2 style="margin-top:6px">${esc(exName(c.ex))}</h2><p class="muted">${chMode(c)}</p>
    <div class="vs-pic">${heroArt(c.ex)}</div>
    <ul class="vs-rules"><li>${I.phone}<span>${t(rule.view === 'side' ? 'vsViewSide' : 'vsViewFront')}</span></li><li>${I.target}<span>${t('vsRule_' + c.mode, { n: c.secs })}</span></li><li>${I.check}<span>${t(rule.hold ? 'vsFairHold' : 'vsFair')}</span></li></ul>
    ${b || rivals.length ? `<div class="vs-marks">${b ? `<div><small>${t('vsYourBest')}</small><b>${esc(fmtScore(c, b.n))}</b></div>` : ''}${rivals.length ? `<div><small>${t('vsToBeat')}</small><b>${esc(fmtScore(c, rivals[0].n))}</b><small>${esc(rivals[0].p)}</small></div>` : ''}</div>` : ''}
    <h3>${t('vsRanking')}</h3><div class="chips seg vs-rank-tabs"><button class="chip" data-act="vs-rank" data-v="global" aria-pressed="${vs.scope !== 'friends'}">${t('vsRankAll')}</button><button class="chip" data-act="vs-rank" data-v="friends" aria-pressed="${vs.scope === 'friends'}">${t('vsRankFriends')}</button></div><div class="vs-rank" id="vsRank"><p class="muted small">${t('vsRankLoading')}</p></div>
    ${c.w ? `<h3>${t('vsWeight', { u: unit() })}</h3><input class="vs-in" data-vs="w" type="number" inputmode="decimal" min="0" value="${esc(vs.w)}" placeholder="${unit() === 'kg' ? '10' : '25'}">` : ''}
    <h3>${t('vsWho')}</h3>
    <div class="chips seg vs-who">${who('solo', 'vsSolo')}${who('live', 'vsLive')}${who('duel', 'vsDuel')}</div>
    ${vs.who === 'duel' ? `<div class="vs-players">${vs.players.map((p, i) => `<div class="vs-pl"><span>${i + 1}</span><input class="vs-in" data-vs="p${i}" maxlength="16" value="${esc(p)}" placeholder="${t('vsPlayerN', { n: i + 1 })}" autocomplete="off">${i > 1 ? `<button class="icon-btn" data-act="vs-del" data-v="${i}" aria-label="${t('vsRemove')}">${I.minus}</button>` : ''}</div>`).join('')}
      ${vs.players.length < 6 ? `<button class="link small vs-add" data-act="vs-add">${I.plus}${t('vsAddPlayer')}</button>` : ''}<p class="muted small">${t('vsDuelHow')}</p></div>` : ''}
    ${vs.who === 'live' ? `<p class="muted small vs-live-how">${t('vsLiveHow')}</p><label class="vs-check"><input type="checkbox" data-vs="see" ${vs.see ? 'checked' : ''}><span>${t('vsSeeRival')}</span></label>` : ''}
    ${goalBox}
    ${c.heavy ? `<p class="vs-safe">${I.info}<span>${t('vsHeavy')}</span></p>` : ''}
    <label class="vs-check"><input type="checkbox" data-vs="rec" ${vs.rec ? 'checked' : ''}><span>${t('vsRec')}</span></label>
    <label class="vs-check"><input type="checkbox" data-vs="voice" ${vs.voice ? 'checked' : ''}><span>${t('vsVoice')}</span></label>
    <button class="btn btn-primary btn-block" style="margin-top:16px" data-act="vs-start" data-v="${c.id}">${I.camera}${t(vs.who === 'live' ? 'vsCreateRoom' : 'vsStart')}</button>`);
  sheetFn = vsReadSheet;
  loadRank(c);
}
async function loadRank(c) {
  const box = () => $('#vsRank');
  if (!net.isOnline()) { if (box()) box().innerHTML = `<p class="muted small">${t('vsNeedNet')}</p>`; return; }
  try {
    await ensureAccount();
    const r = await net.getRank(c.id, vs.scope === 'friends' ? 'friends' : 'global');
    if (!box() || vs.cid !== c.id) return;
    box().innerHTML = r.list.length
      ? `<ol>${r.list.slice(0, 10).map((x) => `<li class="${x.me ? 'me' : ''}"><span class="vb-pos">${x.pos}</span><span class="grow">${esc(x.name)}${x.w ? ` <small>${esc(x.w)} ${esc(x.u || '')}</small>` : ''}</span><b>${esc(fmtScore(c, x.n))}</b></li>`).join('')}</ol>${r.mine && r.mine.pos > 10 ? `<p class="small">${t('vsRankPos', { pos: r.mine.pos, total: r.total })}</p>` : ''}`
      : `<p class="muted small">${t(vs.scope === 'friends' ? 'vsRankNoFriends' : 'vsRankEmpty')}</p>`;
  } catch (e) { if (box()) box().innerHTML = `<p class="muted small">${t(net.isOnline() ? 'vsRankFail' : 'vsNeedNet')}</p>`; }
}
function vsReadSheet() {
  document.querySelectorAll('#sheet [data-vs]').forEach((el) => {
    const k = el.dataset.vs;
    if (k === 'w') vs.w = el.value;
    else if (k === 'rec') vs.rec = el.checked;
    else if (k === 'see') vs.see = el.checked;
    else if (k === 'voice') vs.voice = el.checked;
    else if (k === 'goal') vs.goal = el.value;
    else if (k[0] === 'p') vs.players[+k.slice(1)] = el.value.slice(0, 16);
  });
}
function showVsCode() {
  openSheet(`<span class="eyebrow">${t('vsChallenge')}</span><h2 style="margin-top:6px">${t('vsCodeTitle')}</h2>
    <textarea class="vs-code-in" id="vsCodeIn" rows="4" placeholder="ES1…" autocomplete="off" spellcheck="false"></textarea>
    <button class="btn btn-primary btn-block" style="margin-top:12px" data-act="vs-code-add">${t('vsCodeAdd')}</button>`);
}
function showVsJoin() {
  openSheet(`<span class="eyebrow">${t('vsWayLive')}</span><h2 style="margin-top:6px">${t('vsJoinTitle')}</h2><p class="muted small" style="margin:6px 0 12px">${t('vsJoinP')}</p>
    <input class="vs-in vs-room-in" id="vsRoomIn" maxlength="6" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABC123" value="${esc(vs.joinCode || '')}">
    <label class="vs-check"><input type="checkbox" data-vs="see" ${vs.see ? 'checked' : ''}><span>${t('vsSeeRival')}</span></label>
    <label class="vs-check"><input type="checkbox" data-vs="rec" ${vs.rec ? 'checked' : ''}><span>${t('vsRec')}</span></label>
    <button class="btn btn-primary btn-block" style="margin-top:12px" data-act="vs-join-go">${t('vsJoin')}</button>
    <p class="muted small" style="margin-top:12px">${t('vsLiveNote')}</p>`);
  sheetFn = vsReadSheet;
}
function vsShareSheet(r) {
  const c = challengeById(r.c), code = vsCode(r);
  const link = `https://earnedstrength.online/app/#reto=${code}`;
  const what = scoreWord(c, r.n) + (r.w ? ` (${r.w} ${unit()})` : '');
  vs.shareText = t('vsShareText', { name: r.p || t('vsFriend'), what, ch: chTitle(c), link, code });
  openSheet(`<span class="eyebrow">${t('vsShare')}</span><h2 style="margin-top:6px">${t('vsShareTitle')}</h2><p class="muted small" style="margin:6px 0 12px">${t('vsShareP')}</p>
    <div class="vs-code"><b>${esc(what)}</b><small>${esc(chTitle(c))}</small><code>${esc(code)}</code></div>
    <div class="split" style="margin-top:14px"><button class="btn" data-act="vs-copy">${t('vsCopy')}</button><button class="btn btn-primary" data-act="vs-send">${I.share}${t('share')}</button></div>`);
}
async function vsSend() {
  try { if (navigator.share) { await navigator.share({ text: vs.shareText }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  vsCopy();
}
async function vsCopy() {
  try { await navigator.clipboard.writeText(vs.shareText); toast(t('vsCopied')); } catch (e) {
    const ta = document.createElement('textarea'); ta.value = vs.shareText; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast(t('vsCopied')); } catch (x) { /* the code stays on screen to copy by hand */ }
    ta.remove();
  }
}

// ---------- Live room on our server: 2 to 8 phones, each counts its own person ----------
// The room (server/src/room.js) tells every phone everyone's count. With exactly two people, the phones can
// also show each other's camera (WebRTC, straight between the two phones; the server only passes the setup).
const live = { on: false, host: false, ws: null, code: '', pid: '', players: [], conn: null, rname: '', rn: 0, rres: null, meReady: false, pc: null, pcPeer: '', iceQ: [], pendingRtc: [], opened: false };
const liveOthers = () => live.players.filter((p) => p.pid !== live.pid);
function liveSend(m) { try { if (live.ws && live.ws.readyState === 1) live.ws.send(JSON.stringify(m)); } catch (e) { /* the room closed */ } }
function rtcClose() {
  try { if (live.pc) live.pc.close(); } catch (e) { /* closed */ }
  Object.assign(live, { pc: null, pcPeer: '', iceQ: [], pendingRtc: [] });
  const rv = $('#camRivalVid');
  if (rv) { rv.srcObject = null; rv.hidden = true; }
}
function liveReset(keepRoom) {
  Object.assign(live, { rres: null, meReady: false });
  if (!keepRoom) {
    rtcClose();
    try { if (live.ws) { live.ws.onclose = null; live.ws.close(); } } catch (e) { /* closed */ }
    Object.assign(live, { on: false, host: false, ws: null, code: '', pid: '', players: [], conn: null, rname: '', rn: 0, opened: false });
  }
}
async function ensureAccount() {
  if (S.acct && S.acct.token) { net.setAccount(S.acct); return S.acct; }
  const a = await net.createAccount(cleanName(S.profile && S.profile.name) || 'Atleta');
  S.acct = a;
  save();
  net.setAccount(a);
  return a;
}
function liveFail(key) {
  if (cam.phase === 'off') return;
  cam.err = t(key);
  cam.phase = 'error';
  renderCamHud();
}
function liveConnect(code) {
  live.code = code;
  const ws = net.roomSocket(code);
  live.ws = ws;
  ws.onopen = () => { live.opened = true; };
  ws.onmessage = (e) => { let m; try { m = JSON.parse(e.data); } catch (x) { return; } liveMsg(m); };
  ws.onclose = () => {
    if (live.ws !== ws || cam.phase === 'off') return;
    if (!live.opened) return liveFail(live.host ? 'vsLiveFail' : 'vsNoRoom');
    toast(t('vsRoomLost'));
    live.conn = null;
    renderCamHud();
  };
}
async function liveHost() {
  liveReset();
  Object.assign(live, { on: true, host: true });
  cam.phase = 'load';
  renderCamHud();
  try {
    await ensureAccount();
    const code = await net.newRoom(cam.c.id, cam.w, unit());
    if (cam.phase === 'off') return;
    liveConnect(code);
    camPrepare();
  } catch (e) { liveFail(net.isOnline() ? 'vsLiveFail' : 'vsNeedNet'); }
}
async function liveJoin(code) {
  liveReset();
  Object.assign(live, { on: true, host: false });
  Object.assign(cam, { c: null, queue: [cleanName(S.profile.name) || t('you')], turn: 0, results: [], w: null, rule: null, goal: 0, phase: 'join' });
  camShow();
  renderCamHud();
  try { await ensureAccount(); liveConnect(code); } catch (e) { liveFail(net.isOnline() ? 'vsLiveFail' : 'vsNeedNet'); }
}
function liveMsg(m) {
  if (!m || typeof m.t !== 'string') return;
  if (m.t === 'you') { live.pid = m.pid; if (m.host) live.host = true; return; }
  if (m.t === 'state') {
    const before = live.conn;
    live.players = (Array.isArray(m.players) ? m.players : []).slice(0, 8).map((p) => ({ pid: String(p.pid), name: cleanName(p.name) || t('vsFriend'), ready: !!p.ready, n: Math.max(0, +p.n || 0), done: !!p.done, host: !!p.host }));
    const others = liveOthers();
    live.conn = others.length ? true : null;
    live.rname = others.length === 1 ? others[0].name : others.length ? t('vsNPeople', { n: others.length }) : '';
    live.rn = others.length ? Math.max(...others.map((p) => p.n)) : 0;
    // A friend who joined: they get the challenge from the room and open their camera.
    if (!cam.c && m.c) {
      const c = challengeById(m.c);
      if (!c) return liveFail('vsLiveFail');
      const w = Number.isFinite(m.w) && m.w > 0 ? m.w : null;
      Object.assign(cam, { c, rule: ruleOf(c), w: w && m.u !== unit() ? Math.round((m.u === 'kg' ? w * LB : w / LB) * 10) / 10 : w });
      camPrepare();
    }
    if (before !== live.conn && others.length) toast(t('vsJoined', { name: others[others.length - 1].name }));
    if (others.length !== 1 && live.pc) rtcClose();
    if (live.host && others.length === 1 && vs.see && cam.stream && !live.pc) rtcStart(others[0].pid, true);
    if (cam.phase === 'place' && before !== live.conn) renderCamHud(); else renderLiveBar();
    liveMaybeEnd();
    return;
  }
  if (m.t === 'go') { if (['place', 'done'].includes(cam.phase)) { if (cam.phase === 'done') camPrepare(); camCountdown(); } return; }
  if (m.t === 'again') { if (['done', 'podium'].includes(cam.phase)) { liveReset(true); camPrepare(); } return; }
  if (m.t === 'rtc' && m.data) rtcMsg(String(m.from), m.data);
}
function rtcStart(peerPid, caller) {
  const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  Object.assign(live, { pc, pcPeer: peerPid, iceQ: [] });
  if (cam.stream) cam.stream.getTracks().forEach((tr) => pc.addTrack(tr, cam.stream));
  pc.onicecandidate = (e) => { if (e.candidate) liveSend({ t: 'rtc', to: peerPid, data: { ice: e.candidate } }); };
  pc.ontrack = (e) => {
    const rv = $('#camRivalVid');
    if (rv && vs.see) { rv.srcObject = e.streams[0]; rv.hidden = false; rv.play().catch(() => {}); }
  };
  if (caller) pc.createOffer().then((o) => pc.setLocalDescription(o)).then(() => liveSend({ t: 'rtc', to: peerPid, data: { sdp: pc.localDescription } })).catch(() => {});
}
async function rtcMsg(from, data) {
  if (!vs.see) return;
  if (!live.pc) {
    if (!cam.stream) { live.pendingRtc.push({ from, data }); return; }
    rtcStart(from, false);
  }
  const pc = live.pc;
  try {
    if (data.sdp) {
      await pc.setRemoteDescription(data.sdp);
      for (const c of live.iceQ.splice(0)) { try { await pc.addIceCandidate(c); } catch (e) { /* skip */ } }
      if (data.sdp.type === 'offer') {
        await pc.setLocalDescription(await pc.createAnswer());
        liveSend({ t: 'rtc', to: from, data: { sdp: pc.localDescription } });
      }
    } else if (data.ice) {
      if (pc.remoteDescription) await pc.addIceCandidate(data.ice); else live.iceQ.push(data.ice);
    }
  } catch (e) { /* the video is optional: counts keep working */ }
}
function liveMaybeEnd() {
  if (cam.phase !== 'done' || !live.on || live.rres) return;
  const others = liveOthers();
  if (others.length && !others.every((p) => p.done)) return;
  const me = cam.last;
  live.rres = [{ p: me.p, n: me.n, me: true }, ...others.map((p) => ({ p: p.name, n: p.n }))].sort((a, b) => b.n - a.n);
  if (others.length) {
    const D = vsData();
    D.duels = [{ c: cam.c.id, at: Date.now(), live: true, res: live.rres.map((r) => ({ p: r.p, n: r.n })) }, ...D.duels].slice(0, 12);
    save();
    if (live.rres[0].me && (!live.rres[1] || live.rres[1].n < me.n)) { confetti(80); grow('win', 1, true); }
  }
  renderCamHud();
}
function renderLiveBar() {
  const el = $('#camLive');
  if (!el || !live.on) return;
  const others = liveOthers();
  const st = !others.length ? (live.host ? '' : t('vsConnecting'))
    : cam.phase === 'place' ? (live.meReady && others.every((p) => p.ready) ? t('vsBothReady') : live.meReady ? t('vsWaitOthers') : t('vsGetReady')) : '';
  el.innerHTML = `<em class="live-tag">${t('vsLiveTag')}</em>${others.slice(0, 4).map((p) => `<span class="lv-p${p.ready && cam.phase === 'place' ? ' rdy' : ''}"><b>${esc(p.name)}</b><span class="lv-n">${cam.c ? esc(fmtScore(cam.c, p.n)) : 0}</span></span>`).join('')}${others.length > 4 ? `<small>+${others.length - 4}</small>` : ''}${st ? `<small>${st}</small>` : ''}`;
}

// ---------- Video with the count drawn on it (made on the phone, never uploaded) ----------
const REC_TYPES = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
function recDrop() {
  const R = cam.rec;
  cam.rec = null;
  if (!R) return;
  try { if (R.mr.state !== 'inactive') R.mr.stop(); } catch (e) { /* stopped */ }
  if (R.url) URL.revokeObjectURL(R.url);
}
function recStart() {
  recDrop();
  const v = $('#camVideo');
  if (!vs.rec || !window.MediaRecorder || !v || !v.videoWidth) return;
  const k = 960 / Math.max(v.videoWidth, v.videoHeight);
  const rc = document.createElement('canvas');
  rc.width = Math.round((v.videoWidth * k) / 2) * 2;
  rc.height = Math.round((v.videoHeight * k) / 2) * 2;
  const type = REC_TYPES.find((x) => MediaRecorder.isTypeSupported(x));
  let mr;
  try { mr = new MediaRecorder(rc.captureStream(30), type ? { mimeType: type, videoBitsPerSecond: 3000000 } : undefined); } catch (e) { return; }
  const R = { rc, g: rc.getContext('2d'), mr, chunks: [], url: null, blob: null, ext: 'webm', stopAt: 0, lm: null };
  mr.ondataavailable = (e) => { if (e.data && e.data.size) R.chunks.push(e.data); };
  mr.onstop = () => {
    if (cam.rec !== R) return;
    R.blob = new Blob(R.chunks, { type: mr.mimeType || type || 'video/webm' });
    R.ext = /mp4/.test(R.blob.type) ? 'mp4' : 'webm';
    R.url = URL.createObjectURL(R.blob);
    if (['done', 'podium'].includes(cam.phase)) renderCamHud();
  };
  cam.rec = R;
  recFrame(null);
  mr.start(500);
}
function recFrame(lm) {
  const R = cam.rec, v = $('#camVideo'), c = cam.c;
  if (!R || R.url || !v || !v.videoWidth || !c) return;
  if (lm) R.lm = lm;
  const { rc, g } = R, W = rc.width, H = rc.height, u = Math.min(W, H) / 100, now = Date.now();
  const hold = cam.rule.hold, who = cam.queue[cam.turn] || '';
  g.save();
  if (cam.facing === 'user') { g.translate(W, 0); g.scale(-1, 1); }
  g.drawImage(v, 0, 0, W, H);
  if (R.lm && cam.phase !== 'done') drawPoseOn(g, R.lm, W, H, true);
  g.restore();
  let gr = g.createLinearGradient(0, 0, 0, H * 0.24);
  gr.addColorStop(0, 'rgba(0,0,0,.72)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H * 0.24);
  gr = g.createLinearGradient(0, H * 0.55, 0, H);
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.82)');
  g.fillStyle = gr; g.fillRect(0, H * 0.55, W, H * 0.45);
  g.textBaseline = 'top';
  g.font = `${7 * u}px "Bebas Neue", sans-serif`; g.fillStyle = '#EDEAE4'; g.fillText('EARNED', 4 * u, 4 * u);
  g.fillStyle = '#E2463B'; g.fillText('STRENGTH', 4 * u + g.measureText('EARNED ').width, 4 * u);
  g.textAlign = 'right';
  g.font = `800 ${4 * u}px Inter, sans-serif`; g.fillStyle = '#fff'; g.fillText(exName(c.ex), W - 4 * u, 4 * u);
  g.font = `600 ${3.2 * u}px Inter, sans-serif`; g.fillStyle = 'rgba(255,255,255,.78)';
  g.fillText(`${chMode(c)}${cam.w ? ' · ' + cam.w + ' ' + unit() : ''} · ${who}`, W - 4 * u, 9.4 * u);
  g.textAlign = 'left';
  // Live rival in the corner.
  if (live.on && live.conn) {
    g.textAlign = 'right'; g.textBaseline = 'top';
    g.font = `800 ${3.4 * u}px Inter, sans-serif`; g.fillStyle = '#FF6B5E'; g.fillText(`● ${t('vsLiveTag')} · ${live.rname}`, W - 4 * u, 15 * u);
    g.font = `${13 * u}px "Bebas Neue", sans-serif`; g.fillStyle = '#fff'; g.fillText(fmtScore(c, live.rn), W - 4 * u, 19.5 * u);
    g.textAlign = 'left';
  }
  g.textBaseline = 'alphabetic';
  if (cam.phase === 'count') {
    g.textAlign = 'center'; g.font = `${40 * u}px "Bebas Neue", sans-serif`; g.fillStyle = '#fff';
    g.fillText(String(cam.cdNum || ''), W / 2, H / 2 + 14 * u); g.textAlign = 'left';
  }
  const score = hold ? Math.floor(cam.held / 1000) : cam.n;
  const best = cam.turn === 0 ? vsData().best[c.id] : null;
  const prevBest = cam.recBase != null ? cam.recBase : best ? best.n : null;
  if (cam.phase === 'go' || cam.phase === 'done') {
    g.font = `${28 * u}px "Bebas Neue", sans-serif`; g.fillStyle = '#fff';
    g.fillText(fmtScore(c, score), 4 * u, H - 10 * u);
    g.font = `800 ${3.4 * u}px Inter, sans-serif`; g.fillStyle = 'rgba(255,255,255,.82)';
    g.fillText(t(hold ? 'vsSeconds' : 'vsReps').toUpperCase(), 4.6 * u, H - 5 * u);
    const newRec = cam.turn === 0 && score > 0 && (prevBest == null || score > prevBest);
    g.font = `800 ${4 * u}px Inter, sans-serif`;
    g.fillStyle = newRec ? '#E8B84A' : 'rgba(255,255,255,.85)';
    const recTxt = newRec ? t('vsNewRecordCaps') : prevBest != null ? t('vsRecordN', { n: fmtScore(c, prevBest) }) : '';
    if (recTxt) g.fillText(recTxt, 4.6 * u, H - 39 * u);
    if (cam.goal) {
      g.font = `800 ${3.6 * u}px Inter, sans-serif`;
      g.fillStyle = cam.goalHit ? '#8FE0AE' : 'rgba(255,255,255,.85)';
      g.fillText(cam.goalHit ? t('vsGoalHitCaps') : t('vsGoalN', { n: fmtScore(c, cam.goal) }), 4.6 * u, H - 44.5 * u);
    }
    if (cam.cheer && now - cam.cheer.at < 1500) {
      g.textAlign = 'center'; g.font = `800 ${(cam.cheer.big ? 7 : 5.2) * u}px Inter, sans-serif`;
      g.fillStyle = cam.cheer.big ? '#E8B84A' : '#fff'; g.fillText(cam.cheer.msg, W / 2, H * 0.36); g.textAlign = 'left';
    }
    if (cam.phase === 'go' && c.mode === 'time') {
      g.textAlign = 'right'; g.font = `${14 * u}px "Bebas Neue", sans-serif`; g.fillStyle = '#fff';
      g.fillText(`${Math.max(0, Math.ceil((cam.end - now) / 1000))}s`, W - 4 * u, H - 6 * u); g.textAlign = 'left';
    }
    if (cam.phase === 'go' && cam.flashT && now - cam.flashT < 1400) {
      g.textAlign = 'center'; g.font = `800 ${5 * u}px Inter, sans-serif`; g.fillStyle = '#FFD08A';
      g.fillText(t('vsNoCount'), W / 2, H * 0.5); g.textAlign = 'left';
    }
    if (cam.phase === 'done') {
      g.textAlign = 'right'; g.font = `800 ${3.6 * u}px Inter, sans-serif`; g.fillStyle = '#8FE0AE';
      g.fillText(`✓ ${t('vsCamCounted')}`, W - 4 * u, H - 6 * u); g.textAlign = 'left';
    }
  }
  if (R.stopAt && now >= R.stopAt && R.mr.state !== 'inactive') { try { R.mr.stop(); } catch (e) { /* stopped */ } }
}
async function recSave() {
  const R = cam.rec;
  if (!R || !R.url) return;
  const a = document.createElement('a');
  a.href = R.url;
  a.download = `earned-strength-${cam.c.id}-${cam.last ? cam.last.n : 0}.${R.ext}`;
  document.body.appendChild(a); a.click(); a.remove();
}
async function recShare() {
  const R = cam.rec;
  if (!R || !R.blob) return;
  const file = new File([R.blob], `earned-strength-${cam.c.id}.${R.ext}`, { type: R.blob.type });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: 'Earned Strength' }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  recSave();
}

// ---------- The camera screen ----------
const cam = { c: null, phase: 'off', stream: null, counter: null, raf: 0, iv: 0, cd: 0, n: 0, start: 0, end: 0, lastRep: 0, held: 0, lastT: 0, badSince: 0, readySince: 0, queue: [], turn: 0, results: [], facing: 'user', err: '', lock: null, lastVT: -1, flashT: 0, w: null, lines: [], last: null, rule: null, rec: null, cdNum: 0, recBase: null };
function camEl() {
  let el = $('#cam');
  if (!el) {
    el = document.createElement('div');
    el.id = 'cam';
    el.className = 'cam';
    el.hidden = true;
    el.innerHTML = '<div class="cam-stage" id="camStage"><video id="camVideo" playsinline muted></video><canvas id="camCanvas"></canvas></div><video class="cam-rival" id="camRivalVid" playsinline muted hidden></video><div class="cam-hud" id="camHud"></div>';
    document.body.appendChild(el);
    el.addEventListener('click', onCamClick);
  }
  return el;
}
function camShow() {
  camEl().hidden = false;
  document.body.style.overflow = 'hidden';
  try { if (navigator.wakeLock && !cam.lock) navigator.wakeLock.request('screen').then((l) => { cam.lock = l; }).catch(() => {}); } catch (e) { /* the screen may turn off */ }
}
function openCam(id) {
  const c = challengeById(id);
  if (!c) return;
  const names = vs.who === 'duel' ? vs.players.map(cleanName).filter(Boolean) : [cleanName(S.profile.name) || t('you')];
  if (vs.who === 'duel' && names.length < 2) { toast(t('vsNeedNames')); return; }
  closeSheet();
  unlockAudio();
  const goal = vs.who === 'solo' ? Math.round(num(vs.goal)) : 0;
  Object.assign(cam, { c, queue: names, turn: 0, results: [], w: c.w && num(vs.w) > 0 ? Math.round(num(vs.w) * 10) / 10 : null, rule: ruleOf(c), goal: goal > 0 && goal < 1000 ? goal : 0 });
  if (cam.goal) { const D = vsData(); D.goals = { ...(D.goals || {}), [c.id]: cam.goal }; save(); }
  camShow();
  if (vs.who === 'live') { liveHost(); return; }
  liveReset();
  if (names.length > 1) { cam.phase = 'turn'; renderCamHud(); } else camPrepare();
}
async function camPrepare() {
  cam.counter = new Counter(cam.rule);
  Object.assign(cam, { n: 0, held: 0, readySince: 0, badSince: 0, recBase: null });
  live.meReady = false;
  recDrop();
  if (cam.stream) { cam.phase = 'place'; renderCamHud(); startLoop(); return; }
  cam.phase = 'load';
  renderCamHud();
  try {
    await loadPose();
    cam.stream = await openCamera($('#camVideo'), cam.facing);
    if (cam.phase !== 'load') { stopCamera(cam.stream); cam.stream = null; return; }
    $('#camStage').classList.toggle('mirror', cam.facing === 'user');
    cam.phase = 'place';
    renderCamHud();
    startLoop();
    // Live room: once my camera is on, the friend can see me (the host calls when the friend arrives).
    // Live room: camera messages that arrived before the camera was on, or start the video as the host.
    for (const r of live.pendingRtc.splice(0)) rtcMsg(r.from, r.data);
    if (live.on && live.host && vs.see && !live.pc && liveOthers().length === 1) rtcStart(liveOthers()[0].pid, true);
  } catch (e) {
    if (cam.phase !== 'load') return;
    cam.err = t(e && (e.name === 'NotAllowedError' || e.name === 'SecurityError') ? 'vsCamDenied' : 'vsCamFail');
    cam.phase = 'error';
    renderCamHud();
  }
}
function startLoop() {
  cancelAnimationFrame(cam.raf);
  const step = () => {
    cam.raf = requestAnimationFrame(step);
    const v = $('#camVideo');
    if (!v || v.readyState < 2 || v.currentTime === cam.lastVT) return;
    cam.lastVT = v.currentTime;
    const active = ['place', 'count', 'go'].includes(cam.phase);
    let lm = null;
    if (active) {
      try { lm = detect(v); } catch (e) { lm = null; }
      const cv = $('#camCanvas');
      if (cv.width !== v.videoWidth) { cv.width = v.videoWidth; cv.height = v.videoHeight; }
      const r = cam.counter.update(lm, v.videoWidth / v.videoHeight);
      drawPose(cv, lm, r.seen && r.ok);
      camFrame(r);
    }
    if (cam.rec && !cam.rec.url && (active || cam.rec.stopAt)) recFrame(lm);
  };
  step();
}
function setText(id, s) { const el = $(id); if (el && el.textContent !== s) el.textContent = s; }
function camFrame(r) {
  const now = Date.now(), rule = cam.rule;
  if (cam.phase === 'place') {
    const inPos = r.seen && r.ok && (rule.hold || r.ph === 'start');
    setText('#camStatus', !r.seen ? t('hWhole') : !r.ok ? t(r.hint || 'hStartPos') : inPos ? t('hReady') : t('hStartPos'));
    const st = $('#camStatus');
    if (st) st.classList.toggle('good', inPos);
    if (inPos) {
      if (!cam.readySince) cam.readySince = now;
      else if (now - cam.readySince > 900) {
        if (!live.on) camCountdown();
        else if (!live.meReady && live.conn) { live.meReady = true; liveSend({ t: 'ready', v: true }); renderLiveBar(); }
      }
    } else cam.readySince = 0;
    return;
  }
  if (cam.phase !== 'go') return;
  if (rule.hold) {
    const dt = cam.lastT ? now - cam.lastT : 0;
    cam.lastT = now;
    if (r.seen && r.ok) { cam.held += dt; cam.badSince = 0; setText('#camHint', ''); }
    else if (cam.held > 0) {
      if (!cam.badSince) cam.badSince = now;
      setText('#camHint', t(r.seen ? r.hint || 'hHips' : 'hWhole'));
      if (now - cam.badSince > 2000) { camFinish(); return; }
    } else if (now - cam.start > 10000) { camFinish(); return; }
    const secs = Math.floor(cam.held / 1000);
    setText('#camN', fmtSecs(secs));
    if (secs !== cam.lastSent) { cam.lastSent = secs; if (live.on) liveSend({ t: 'n', n: secs }); camCheer(secs); }
    return;
  }
  if (r.ev === 'rep') {
    cam.n = r.n;
    cam.lastRep = now;
    setText('#camN', String(cam.n));
    const el = $('#camN');
    if (el) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    toneAt(880, 0, 0.08, 0.2);
    vibrate(25);
    if (live.on) liveSend({ t: 'n', n: cam.n });
    camCheer(cam.n);
  } else if (r.ev === 'half') { setText('#camHint', t(rule.half || 'hDeeper')); cam.flashT = now; toneAt(220, 0, 0.12, 0.15); }
  if (now - cam.flashT > 1600) setText('#camHint', !r.seen ? t('hWhole') : !r.ok && r.hint ? t(r.hint) : '');
}
// Goal progress and shouts: halfway, almost there, goal reached, and a random shout every few reps.
function camCheer(score) {
  const g = cam.goal, hold = cam.rule.hold;
  let msg = '';
  if (g) {
    if (score >= g && !cam.goalHit) {
      cam.goalHit = true;
      cheerShow(t('vsGoalHit'), true);
      confetti(70);
      bell(2);
      vibrate([80, 60, 80]);
    } else if (!cam.goalHit) {
      if (!cam.saidHalf && score >= Math.ceil(g / 2)) { cam.saidHalf = true; msg = t('vsHalf'); }
      else if (!cam.saidNear && g - score <= Math.max(1, Math.round(g * 0.15)) && g - score > 0) { cam.saidNear = true; msg = t('vsAlmost', { n: hold ? fmtSecs(g - score) : g - score }); }
    }
    const bar = $('#camGbar');
    if (bar) bar.style.width = `${Math.min(100, (score / g) * 100)}%`;
    setText('#camGoal', cam.goalHit ? (score === g ? t('vsGoalJust') : t('vsGoalPlus', { n: hold ? fmtSecs(score - g) : score - g })) : t('vsGoalLeft', { n: hold ? fmtSecs(g - score) : g - score, g: hold ? fmtSecs(g) : g }));
  }
  if (!msg && score > 0 && !(g && score === g) && (hold ? score % 15 === 0 : score % 5 === 0)) {
    let i;
    do { i = Math.floor(Math.random() * HYPE.length); } while (HYPE.length > 1 && i === cam.hypeLast);
    cam.hypeLast = i;
    msg = HYPE[i][getLang() === 'es' ? 1 : 0];
  }
  if (msg) cheerShow(msg);
}
function cheerShow(msg, big) {
  const el = $('#camCheer');
  if (el) { el.textContent = msg; el.className = `cam-cheer${big ? ' big' : ''}`; void el.offsetWidth; el.classList.add('show'); }
  cam.cheer = { msg, at: Date.now(), big: !!big };
  if (vs.voice) say(msg);
}
// Clock for the timed and non-stop modes.
function camClock() {
  if (cam.phase !== 'go') return;
  const now = Date.now(), c = cam.c;
  if (c.mode === 'time') {
    const left = Math.max(0, Math.ceil((cam.end - now) / 1000));
    setText('#camT', t('vsLeft', { n: left }));
    if (left <= 3 && left > 0 && left !== cam.lastBeep) { cam.lastBeep = left; toneAt(660, 0, 0.08, 0.2); }
    if (now >= cam.end) camFinish();
  } else if (c.mode === 'max') {
    const idle = now - cam.lastRep, limit = cam.n ? 8000 : 20000;
    setText('#camT', idle > 3000 ? t('vsIdle', { n: Math.max(0, Math.ceil((limit - idle) / 1000)) }) : '');
    if (idle > limit) camFinish();
  } else setText('#camT', t('vsHoldNote'));
}
function camCountdown() {
  cam.phase = 'count';
  renderCamHud();
  recStart();
  let k = 3;
  const tick = () => {
    if (cam.phase !== 'count') return;
    if (k > 0) { cam.cdNum = k; setText('#camBig', String(k)); toneAt(660, 0, 0.12); k--; cam.cd = setTimeout(tick, 900); } else { toneAt(990, 0, 0.35); say(t('vsGo')); camGo(); }
  };
  tick();
}
function camGo() {
  const now = Date.now(), best = vsData().best[cam.c.id];
  cam.counter.reset();
  Object.assign(cam, { phase: 'go', n: 0, held: 0, start: now, lastRep: now, lastT: 0, badSince: 0, flashT: 0, lastBeep: 0, lastSent: -1, goalHit: false, saidHalf: false, saidNear: false, cheer: null, recBase: cam.turn === 0 && best ? best.n : null, end: cam.c.mode === 'time' ? now + cam.c.secs * 1000 : 0 });
  renderCamHud();
  if (cam.goal) camCheer(0);
  clearInterval(cam.iv);
  cam.iv = setInterval(camClock, 200);
  camClock();
}
function camFinish() {
  if (cam.phase !== 'go') return;
  clearInterval(cam.iv);
  const c = cam.c, D = vsData(), who = cam.queue[cam.turn];
  const n = c.mode === 'hold' ? Math.floor(cam.held / 1000) : cam.n;
  const res = { p: who, n, cam: true };
  cam.results.push(res);
  cam.last = res;
  cam.lines = [];
  bell(1);
  if (live.on) liveSend({ t: 'done', n });
  // Personal records belong to the phone's owner: alone, live, or the first name in a duel.
  if (cam.turn === 0) {
    grow('camera', 1, true);
    if (cam.goal && n >= cam.goal) grow('goal', 1, true);
    const prev = D.best[c.id];
    if (n > 0 && (!prev || n > prev.n)) { D.best[c.id] = { n, cam: true, w: cam.w, at: Date.now() }; cam.lines.push(`<b class="vs-rec">${t('vsRecord')}</b>`); confetti(50); shareEvent('record', { c: c.id, n }); }
    else if (cam.goal && n >= cam.goal) shareEvent('goal', { c: c.id, n });
    else if (prev) cam.lines.push(t('vsPrev', { n: fmtScore(c, prev.n) }));
    const top = D.rivals.filter((r) => r.c === c.id).sort((x, y) => y.n - x.n)[0];
    if (top && cam.queue.length === 1 && !live.on) {
      cam.lines.push(n > top.n ? t('vsWon', { name: esc(top.p), n: fmtScore(c, top.n) }) : n === top.n ? t('vsTieWith', { name: esc(top.p) }) : t('vsShort', { d: c.mode === 'hold' ? fmtSecs(top.n - n) : top.n - n, name: esc(top.p) }));
    }
    if (cam.goal) {
      const g = cam.goal, hold = c.mode === 'hold';
      if (n >= g) {
        const next = n + 1;
        cam.lines.unshift(`<b class="vs-goal-done">${t('vsGoalDone', { g: hold ? fmtSecs(g) : g })}</b>`);
        cam.lines.push(t('vsNextGoal', { n: hold ? fmtSecs(next) : next }));
        D.goals = { ...(D.goals || {}), [c.id]: next };
        vs.goalFor = null;
      } else cam.lines.unshift(`<b class="vs-goal-miss">${t('vsGoalMiss', { d: hold ? fmtSecs(g - n) : g - n, g: hold ? fmtSecs(g) : g })}</b>`);
    }
    if (cam.queue.length === 1 && !live.on) cam.lines.push(`<span class="cam-quote">“${esc(nextQuote())}”</span>`);
    save();
  }
  cam.rankLine = '';
  if (cam.turn === 0 && n > 0 && net.isOnline()) {
    const cid = c.id;
    ensureAccount().then(() => net.sendScore(cid, n, cam.w, unit())).then((r) => {
      if (!r || !r.mine || cam.c !== c) return;
      cam.rankLine = t('vsRankPos', { pos: r.mine.pos, total: r.total });
      if (cam.phase === 'done') renderCamHud();
    }).catch(() => {});
  }
  cam.phase = 'done';
  if (cam.rec) cam.rec.stopAt = Date.now() + 1800;
  renderCamHud();
  liveMaybeEnd();
}
function camPodium() {
  const D = vsData();
  D.duels = [{ c: cam.c.id, at: Date.now(), res: cam.results.map((r) => ({ p: r.p, n: r.n })) }, ...D.duels].slice(0, 12);
  save();
  cam.phase = 'podium';
  renderCamHud();
  confetti(80);
  const top = [...cam.results].sort((x, y) => y.n - x.n);
  if (top[0] === cam.results[0] && (!top[1] || top[1].n < top[0].n)) grow('win', 1, true);
}
function closeCam() {
  cam.phase = 'off';
  cancelAnimationFrame(cam.raf);
  clearInterval(cam.iv);
  clearTimeout(cam.cd);
  recDrop();
  liveReset();
  stopCamera(cam.stream);
  cam.stream = null;
  try { if (cam.lock) cam.lock.release(); } catch (e) { /* already released */ }
  cam.lock = null;
  const el = $('#cam');
  if (el) el.hidden = true;
  document.body.style.overflow = '';
  if (current === 'vs') render();
}
function renderCamHud() {
  const c = cam.c, el = $('#camHud'), who = cam.queue[cam.turn], duel = cam.queue.length > 1, ph = cam.phase;
  const top = `<div class="cam-top"><button class="icon-btn" data-cam="close" aria-label="${t('close')}">${I.close}</button>
    <span class="cam-title"><b>${c ? esc(exName(c.ex)) : t('vsWayLive')}</b><small>${c ? chMode(c) : ''}${cam.w ? ` · ${cam.w} ${unit()}` : ''}${duel ? ` · ${esc(who)}` : ''}${live.on && live.code ? ` · ${t('vsRoom', { code: live.code })}` : ''}</small></span>
    ${cam.stream && ['place', 'turn'].includes(ph) ? `<button class="icon-btn" data-cam="flip" aria-label="${t('vsFlip')}">${I.rotate}</button>` : '<span style="width:40px"></span>'}</div>
    ${live.on && c ? '<div class="cam-live" id="camLive"></div>' : ''}`;
  let mid = '', foot = '';
  if (ph === 'turn') {
    mid = `<div class="cam-center"><span class="eyebrow">${t('vsTurnOf')}</span><b class="cam-who">${esc(who)}</b><p>${t('vsTurnP', { n: cam.turn + 1, total: cam.queue.length })}</p></div>`;
    foot = `<button class="btn btn-primary btn-block" data-cam="ready">${t('vsImReady')}</button>`;
  } else if (ph === 'load' || ph === 'join') {
    mid = `<div class="cam-center"><span class="cam-spin"></span><p>${t(ph === 'join' ? 'vsConnecting' : 'vsLoading')}</p></div>`;
  } else if (ph === 'error') {
    mid = `<div class="cam-center"><span class="cam-ic">${I.camera}</span><p>${esc(cam.err)}</p></div>`;
    foot = `<button class="btn btn-block" data-cam="close">${t('close')}</button>`;
  } else if (ph === 'place') {
    const room = live.on && live.host && !live.conn ? `<div class="cam-room"><small>${t('vsWaitFriend')}</small><b>${esc(live.code)}</b><button class="btn btn-sm btn-primary" data-cam="room-share">${I.share}${t('vsSendCode')}</button></div>` : '';
    mid = `${room}<div class="cam-place"><b id="camStatus">${t('hWhole')}</b><small>${t(cam.rule.view === 'side' ? 'vsViewSide' : 'vsViewFront')}</small></div>`;
    foot = live.on ? (live.host && live.conn ? `<button class="btn btn-block" data-cam="go">${t('vsStartNow')}</button>` : '') : `<button class="btn btn-block" data-cam="go">${t('vsStartNow')}</button>`;
  } else if (ph === 'count') {
    mid = '<div class="cam-center"><b class="cam-big" id="camBig">3</b></div>';
  } else if (ph === 'go') {
    const hold = cam.rule.hold;
    mid = `<div class="cam-count"><b class="cam-n" id="camN">${hold ? '0:00' : '0'}</b><small class="cam-unit">${t(hold ? 'vsSeconds' : 'vsReps')}</small>${cam.goal ? '<div class="cam-goalbox"><div class="cam-gbar"><i id="camGbar"></i></div><small id="camGoal"></small></div>' : ''}<span class="cam-t" id="camT"></span><span class="cam-cheer" id="camCheer"></span><span class="cam-hint" id="camHint"></span></div>`;
    foot = `<button class="btn btn-block" data-cam="stop">${t('vsStop')}</button>`;
  } else if (ph === 'done') {
    const r = cam.last, more = cam.turn + 1 < cam.queue.length, R = cam.rec;
    let liveLine = '';
    if (live.on) {
      const top = live.rres;
      const tie = top && top[1] && top[0].n === top[1].n;
      liveLine = !top ? `<p>${t('vsWaitAll')}</p>` : top.length < 2 ? ''
        : `<b class="vs-rec">${tie ? t('vsTie') : top[0].me ? t('vsYouWin') : t('vsYouLose', { name: esc(top[0].p) })}</b><ol class="pod">${top.map((x, i) => `<li${x.me ? ' class="me"' : ''}><span>${i + 1}</span><span class="grow">${esc(x.p)}</span><b>${esc(fmtScore(c, x.n))}</b></li>`).join('')}</ol>`;
    }
    const vid = R ? (R.url ? `<video class="cam-vid" src="${R.url}" playsinline muted loop autoplay></video><div class="split"><button class="btn" data-cam="vid-save">${I.down}${t('vsSaveVid')}</button><button class="btn" data-cam="vid-share">${I.share}${t('vsShareVid')}</button></div>` : `<p class="muted small">${t('vsVidPrep')}</p>`) : '';
    mid = `<div class="cam-center cam-res">${duel ? `<span class="eyebrow">${esc(r.p)}</span>` : ''}<b class="cam-n">${esc(fmtScore(c, r.n))}</b><small class="cam-unit">${t(c.mode === 'hold' ? 'vsSeconds' : 'vsReps')}</small>
      <span class="vs-cam">${I.camera}${t('vsCamCounted')}</span>${cam.lines.map((l) => `<p>${l}</p>`).join('')}${cam.rankLine ? `<p class="vs-rankline">${I.trophy}${esc(cam.rankLine)}</p>` : ''}${liveLine}${vid}</div>`;
    foot = duel ? (more ? `<button class="btn btn-primary btn-block" data-cam="next">${t('vsNext', { name: esc(cam.queue[cam.turn + 1]) })}</button>` : `<button class="btn btn-primary btn-block" data-cam="podium">${I.trophy}${t('vsSeeWinner')}</button>`)
      : live.on ? `${live.host && live.conn && live.rres ? `<button class="btn btn-primary btn-block" data-cam="rematch">${I.repeat}${t('vsRematch')}</button>` : ''}<button class="btn btn-block" data-cam="close">${t('vsDone')}</button>`
        : `<button class="btn btn-primary btn-block" data-cam="share">${I.share}${t('vsShare')}</button><div class="split"><button class="btn" data-cam="again">${I.repeat}${t('vsAgain')}</button><button class="btn" data-cam="close">${t('vsDone')}</button></div>`;
  } else if (ph === 'podium') {
    const res = [...cam.results].sort((a, b) => b.n - a.n), tie = res[1] && res[1].n === res[0].n;
    mid = `<div class="cam-center cam-pod"><span class="cam-trophy">${I.trophy}</span><span class="eyebrow">${t(tie ? 'vsTie' : 'vsWinner')}</span><b class="cam-who">${tie ? res.filter((r) => r.n === res[0].n).map((r) => esc(r.p)).join(' · ') : esc(res[0].p)}</b>
      <ol class="pod">${res.map((r, i) => `<li><span>${i + 1}</span><span class="grow">${esc(r.p)}</span><b>${esc(fmtScore(c, r.n))}</b></li>`).join('')}</ol></div>`;
    foot = `<button class="btn btn-primary btn-block" data-cam="rematch">${I.repeat}${t('vsRematch')}</button><button class="btn btn-block" data-cam="close">${t('vsDone')}</button>`;
  }
  el.className = `cam-hud ph-${ph}`;
  el.innerHTML = top + mid + `<div class="cam-foot">${foot}</div>`;
  renderLiveBar();
}
async function onCamClick(e) {
  const b = e.target.closest('[data-cam]');
  if (!b) return;
  const k = b.dataset.cam;
  if (k === 'close') closeCam();
  else if (k === 'ready') camPrepare();
  else if (k === 'go') {
    if (cam.phase !== 'place') return;
    cam.readySince = 0;
    if (live.on) { if (live.host && live.conn) liveSend({ t: 'go' }); } else camCountdown();
  }
  else if (k === 'stop') camFinish();
  else if (k === 'next') { cam.turn++; recDrop(); cam.phase = 'turn'; renderCamHud(); }
  else if (k === 'podium') camPodium();
  else if (k === 'rematch') {
    if (live.on) { liveSend({ t: 'again' }); return; }
    Object.assign(cam, { turn: 0, results: [] });
    recDrop();
    cam.phase = 'turn';
    renderCamHud();
  }
  else if (k === 'again') camPrepare();
  else if (k === 'share') { const r = cam.last; const cid = cam.c.id, w = cam.w; closeCam(); vsShareSheet({ c: cid, n: r.n, p: cleanName(S.profile.name) || t('vsFriend'), w }); }
  else if (k === 'vid-save') recSave();
  else if (k === 'vid-share') recShare();
  else if (k === 'room-share') {
    vs.shareText = t('vsRoomShare', { ch: chTitle(cam.c), code: live.code, link: `https://earnedstrength.online/app/#vivo=${live.code}` });
    vsSend();
  }
  else if (k === 'flip') {
    cam.facing = cam.facing === 'user' ? 'environment' : 'user';
    stopCamera(cam.stream);
    cam.stream = null;
    cancelAnimationFrame(cam.raf);
    try {
      cam.stream = await openCamera($('#camVideo'), cam.facing);
      $('#camStage').classList.toggle('mirror', cam.facing === 'user');
      cam.lastVT = -1;
      startLoop();
    } catch (x) { cam.err = t('vsCamFail'); cam.phase = 'error'; }
    renderCamHud();
  }
}
VIEWS.vs = vsView;

// ---------- Start ----------
// Installable app that also works without internet (sw.js). Only on the real site, not while developing.
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
if (S.acct) net.setAccount(S.acct);
window.addEventListener('es-auth-lost', () => { S.acct = null; net.setAccount(null); save(); if (['me', 'friends'].includes(current)) render(); });
setTimeout(autoBackup, 4000);
if (S.profile && S.remind && S.remind.on) setTimeout(writeRemindText, 3000);
if (S.profile) setTimeout(checkBadges, 2500);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') autoBackup(); });
runSplash();
if (!S.profile) showOnboard();
else {
  const h = takeChallengeLink() ? 'vs' : location.hash.slice(1);
  current = Object.hasOwn(VIEWS, h) ? h : 'home';
  render();
}
