// Builds the training plan from what the person told us: type of routine, days per week, minutes per
// session, equipment, level, goal and the muscles they want to improve.
// The main lifts of each day stay the same so progress can be measured week to week. The helper
// exercises change every 4-week block, so training never feels the same and the body keeps adapting.
// The last week of each block (not for beginners) is lighter, to recover and come back stronger.
import { EXERCISES, STANDARDS } from './data.js';

export const SPLITS = ['auto', 'fb', 'ul', 'ppl'];
// Full body for 2-3 days, upper/lower for 4-5, push/pull/legs for 6: every muscle about twice a week.
export const autoSplit = (days) => (days <= 3 ? 'fb' : days <= 5 ? 'ul' : 'ppl');
export const BLOCK_WEEKS = 4;

// Exercises that can fill each slot, best first. One list per kind of equipment.
const POOLS = {
  gym: {
    squat: ['squat', 'front-squat', 'hack-squat'], squat2: ['leg-press', 'hack-squat', 'bulgarian-split-squat'],
    hinge: ['romanian-deadlift', 'deadlift'], hinge2: ['hip-thrust', 'single-leg-rdl', 'romanian-deadlift'], lunge: ['bulgarian-split-squat', 'lunge', 'step-up'],
    quad: ['leg-extension'], ham: ['leg-curl', 'nordic-curl'], calves: ['calf-raise'],
    hpress: ['bench-press', 'db-bench-press', 'machine-chest-press'], ipress: ['incline-db-press', 'incline-bench-press'], vpress: ['overhead-press', 'db-shoulder-press', 'arnold-press'],
    dip: ['parallel-dip', 'close-grip-bench'], vpull: ['lat-pulldown', 'pull-up', 'chin-up'], hpull: ['cable-row', 'barbell-row', 'chest-supported-row', 'db-row'],
    fly: ['cable-fly', 'pec-deck', 'db-fly'], side: ['lateral-raise', 'cable-lateral-raise'], rear: ['face-pull', 'rear-delt-fly'],
    bi: ['barbell-curl', 'incline-curl', 'preacher-curl', 'cable-curl', 'hammer-curl', 'db-curl'], tri: ['oh-triceps-extension', 'skull-crusher', 'triceps-pushdown', 'triceps-kickback'],
    core: ['hanging-leg-raise', 'cable-crunch', 'ab-wheel', 'side-plank', 'plank', 'crunch'], traps: ['shrug', 'farmer-carry'],
  },
  dumbbells: {
    squat: ['goblet-squat'], squat2: ['bulgarian-split-squat', 'step-up', 'lunge'], hinge: ['db-rdl'], hinge2: ['single-leg-rdl', 'glute-bridge', 'db-rdl'], lunge: ['lunge', 'bulgarian-split-squat', 'step-up'],
    quad: [], ham: ['nordic-curl'], calves: ['calf-raise'],
    hpress: ['db-bench-press'], ipress: ['incline-db-press'], vpress: ['db-shoulder-press', 'arnold-press'],
    dip: ['chair-dip', 'diamond-push-up'], vpull: ['db-pullover', 'db-row'], hpull: ['db-row', 'chest-supported-row'],
    fly: ['db-fly'], side: ['lateral-raise'], rear: ['rear-delt-fly'],
    bi: ['db-curl', 'incline-curl', 'hammer-curl'], tri: ['oh-triceps-extension', 'triceps-kickback', 'diamond-push-up'],
    core: ['crunch', 'side-plank', 'leg-raise', 'plank'], traps: ['shrug', 'farmer-carry'],
  },
  bodyweight: {
    squat: ['bw-squat'], squat2: ['split-squat'], hinge: ['glute-bridge'], hinge2: ['glute-bridge'], lunge: ['split-squat'],
    quad: [], ham: ['nordic-curl'], calves: ['calf-raise'],
    hpress: ['push-up'], ipress: ['decline-push-up', 'diamond-push-up', 'push-up'], vpress: ['pike-push-up'],
    dip: ['chair-dip', 'parallel-dip'], vpull: ['pull-up', 'chin-up', 'inverted-row'], hpull: ['inverted-row'],
    fly: [], side: [], rear: ['superman'],
    bi: ['backpack-curl'], tri: ['diamond-push-up', 'chair-dip'],
    core: ['plank', 'side-plank', 'leg-raise', 'crunch'], traps: [],
  },
};
const SMALL = new Set(['side', 'rear', 'fly', 'bi', 'tri', 'calves', 'quad', 'ham', 'core', 'traps']);

// Each day: slots in order of importance [slot, role, offset]. Short sessions keep only the first ones.
// offset picks a different exercise from the same list, so the A and B days are not copies.
const DAYS = {
  fb: [
    ['fb-a', 'Full body A', 'Squat, press and row', [['squat', 'main'], ['hpress', 'main'], ['hpull', 'main'], ['side', 'acc'], ['ham', 'acc'], ['bi', 'acc'], ['tri', 'acc'], ['core', 'acc']]],
    ['fb-b', 'Full body B', 'Hinge, pull-down and incline', [['hinge', 'main'], ['vpull', 'main'], ['ipress', 'main'], ['lunge', 'acc'], ['rear', 'acc'], ['tri', 'acc', 1], ['calves', 'acc'], ['core', 'acc', 1]]],
    ['fb-c', 'Full body C', 'Legs, shoulders and arms', [['squat2', 'main'], ['vpress', 'main'], ['hpull', 'acc', 1], ['hinge2', 'acc'], ['fly', 'acc'], ['side', 'acc', 1], ['bi', 'acc', 1], ['core', 'acc', 2]]],
  ],
  ul: [
    ['upper-a', 'Upper A', 'Chest, back and arms', [['hpress', 'main'], ['vpull', 'main'], ['ipress', 'acc'], ['hpull', 'acc'], ['side', 'acc'], ['tri', 'acc'], ['bi', 'acc'], ['rear', 'acc']]],
    ['lower-a', 'Lower A', 'Quads, hamstrings and calves', [['squat', 'main'], ['hinge', 'main'], ['squat2', 'acc'], ['ham', 'acc'], ['calves', 'acc'], ['core', 'acc'], ['quad', 'acc']]],
    ['upper-b', 'Upper B', 'Shoulders, upper back and arms', [['ipress', 'main', 1], ['vpull', 'main', 1], ['vpress', 'acc'], ['hpull', 'acc', 1], ['side', 'acc', 1], ['bi', 'acc', 1], ['tri', 'acc', 1], ['fly', 'acc']]],
    ['lower-b', 'Lower B', 'Glutes, single leg and abs', [['hinge', 'main', 1], ['lunge', 'acc'], ['hinge2', 'acc'], ['quad', 'acc'], ['calves', 'acc'], ['core', 'acc', 1], ['ham', 'acc']]],
  ],
  ppl: [
    ['push', 'Push', 'Chest, shoulders and triceps', [['hpress', 'main'], ['vpress', 'main'], ['ipress', 'acc'], ['side', 'acc'], ['tri', 'acc'], ['fly', 'acc'], ['dip', 'acc']]],
    ['pull', 'Pull', 'Back and biceps', [['vpull', 'main'], ['hpull', 'main'], ['rear', 'acc'], ['bi', 'acc'], ['bi', 'acc', 1], ['traps', 'acc'], ['core', 'acc']]],
    ['legs', 'Legs', 'Full legs', [['squat', 'main'], ['hinge', 'main'], ['squat2', 'acc'], ['ham', 'acc'], ['calves', 'acc'], ['quad', 'acc'], ['core', 'acc']]],
  ],
};

// About 9 minutes per exercise with warm-up sets and rest.
export const exercisesFor = (minutes) => (minutes <= 20 ? 3 : minutes <= 30 ? 4 : minutes <= 45 ? 5 : minutes <= 60 ? 6 : minutes <= 75 ? 7 : 8);
export const timesPerWeek = (split, days) => (split === 'fb' ? days : split === 'ul' ? days / 2 : days / 3);

export function blockInfo(start, now) {
  const weeks = Math.max(0, Math.floor((now - start) / (7 * 864e5)));
  return { block: Math.floor(weeks / BLOCK_WEEKS), week: (weeks % BLOCK_WEEKS) + 1 };
}

// profile: { days, minutes, equipment, level, goal, focus }   settings: { split, start }   lagging: muscle group or null
export function buildPlan(profile, settings, now, lagging) {
  const P = profile || {};
  const days = Math.min(6, Math.max(2, P.days || 3));
  const split = settings && settings.split && settings.split !== 'auto' ? settings.split : autoSplit(days);
  const pools = POOLS[P.equipment] || POOLS.gym;
  const { block, week } = blockInfo((settings && settings.start) || now, now);
  const beginner = P.level === 'beginner' || P.level === 'comeback';
  const deload = !beginner && week === BLOCK_WEEKS;
  const n = exercisesFor(P.minutes || 45);
  const focus = new Set(P.focus && P.focus.length && !P.focus.includes('all') ? P.focus : []);
  const groupOf = (id) => STANDARDS[id] && STANDARDS[id][0];
  let laggingGiven = false;

  const template = DAYS[split];
  const out = template.slice(0, split === 'fb' ? Math.min(3, Math.max(2, days)) : template.length).map(([id, name, focusText, slots]) => {
    const used = new Set(), items = [];
    for (const [slot, role, off = 0] of slots) {
      if (items.length >= n) break;
      const pool = pools[slot] || [];
      if (!pool.length) continue;
      // Main lifts keep their exercise; helpers move one step down the list every block.
      const start = role === 'main' ? off : off + block;
      let ex = null;
      for (let k = 0; k < pool.length && !ex; k++) { const c = pool[(start + k) % pool.length]; if (!used.has(c) && EXERCISES[c]) ex = c; }
      if (!ex) continue;
      used.add(ex);
      const def = EXERCISES[ex], g = groupOf(ex);
      let sets = role === 'main' ? (beginner ? 3 : 4) : (n <= 4 ? 2 : 3);
      if (focus.has(g)) sets += 1;
      if (lagging && g === lagging && !laggingGiven) { sets += 1; laggingGiven = true; }
      if (deload) sets = Math.max(2, sets - 1);
      sets = Math.min(5, sets);
      const reps = def.timed ? (beginner ? '20-40' : '30-60')
        : def.bw ? (role === 'main' ? '6-12' : '8-15')
        : role === 'main' ? (P.goal === 'strength' ? '4-6' : beginner ? '8-12' : '6-10')
        : SMALL.has(slot) ? (slot === 'side' || slot === 'rear' || slot === 'calves' ? '12-20' : '10-15') : '8-12';
      items.push([ex, sets, reps, role]);
    }
    return { id, name, focus: focusText, items: items.map(([e, s, r]) => [e, s, r]), roles: items.map((x) => x[3]) };
  });
  return { split, days: out, block, week, deload, perWeek: timesPerWeek(split, days), exercises: n, lagging: laggingGiven ? lagging : null };
}
