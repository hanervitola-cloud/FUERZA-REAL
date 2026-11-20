// Content for the Earned Strength app prototype. Routines and numbers match the website's articles.

export const RANKS = [
  { name: 'Rookie',        at: 0,  color: '#93999E', line: 'Everyone starts here.' },
  { name: 'Iron',          at: 17, color: '#9AA6B0', line: 'The habit is forming.' },
  { name: 'Steel',         at: 34, color: '#B9CAD8', line: 'Real strength is showing.' },
  { name: 'Forged',        at: 51, color: '#E58A4E', line: 'Years of work, and it shows.' },
  { name: 'Earned',        at: 68, color: '#E5574B', line: 'Top tier, built the right way.' },
  { name: 'Natural Limit', at: 85, color: '#F4EEE4', line: 'As far as natural goes. No shortcuts.' },
];

// What a typical lifter can do at each rank (bench press as the example, relative to bodyweight).
export const RANK_EXAMPLES = [
  'Log your first workout',
  'Bench press about 0.75x your bodyweight, or 15 push-ups in a row',
  'Bench press about 1x your bodyweight, or 25 push-ups in a row',
  'Bench press about 1.25x your bodyweight, or 35 push-ups in a row',
  'Bench press about 1.5x your bodyweight, or 45 push-ups in a row',
  'Bench press about 1.75x your bodyweight, or 60 push-ups in a row',
];

// std: how strong is "zero" and "top" for the score. ratio = best estimated 1-rep max / bodyweight
// (per dumbbell for dumbbell lifts). reps = best reps in one set.
export const EXERCISES = {
  'bench-press': {
    name: 'Bench press', muscles: ['Chest', 'Triceps', 'Front shoulders'], pattern: 'push', std: ['ratio', 0.5, 1.75],
    steps: ['Lie with your eyes under the bar, feet flat, shoulder blades pulled back and down.', 'Grip a bit wider than your shoulders and lower the bar to your mid-chest with control.', 'Press up and slightly back until your arms are straight.'],
    mistakes: ['Bouncing the bar off your chest.', 'Flaring your elbows straight out to the sides.'],
    tip: 'Use a spotter or safety pins when you go heavy.',
  },
  'overhead-press': {
    name: 'Overhead press', muscles: ['Shoulders', 'Triceps', 'Upper chest'], pattern: 'push', std: ['ratio', 0.35, 1.1],
    steps: ['Start with the bar on your front shoulders, hands just outside shoulder width.', 'Brace your abs and glutes, then press straight up, moving your head back slightly to clear the bar.', 'Finish with the bar over your mid-foot and your arms locked.'],
    mistakes: ['Leaning far back to push the weight.', 'Pressing the bar forward instead of straight up.'],
    tip: 'Squeeze your glutes. It keeps your lower back from arching.',
  },
  'lateral-raise': {
    name: 'Lateral raise', muscles: ['Side shoulders'],
    steps: ['Hold light dumbbells at your sides with a slight bend in your elbows.', 'Raise your arms out to the sides until they reach about shoulder height.', 'Lower slowly. Do not let the weights drop.'],
    mistakes: ['Swinging your body to lift the weight.', 'Going too heavy and shrugging your shoulders up.'],
    tip: 'Light weight and strict reps work better here than heavy weight.',
  },
  'triceps-pushdown': {
    name: 'Triceps pushdown', muscles: ['Triceps'],
    steps: ['Stand at a cable with a bar or rope, elbows tucked at your sides.', 'Push down until your arms are straight.', 'Let it come back up under control while your elbows stay in place.'],
    mistakes: ['Elbows drifting forward.', 'Leaning over the weight and pushing with your body.'],
    tip: 'Pause for a second at the bottom of every rep.',
  },
  'lat-pulldown': {
    name: 'Lat pulldown', muscles: ['Lats', 'Upper back', 'Biceps'], pattern: 'pull', std: ['ratio', 0.5, 1.3],
    steps: ['Sit with your thighs under the pad and grip a bit wider than your shoulders.', 'Pull the bar to your upper chest, leading with your elbows.', 'Let the bar rise slowly until your arms are straight.'],
    mistakes: ['Leaning far back and turning it into a row.', 'Pulling the bar behind your neck.'],
    tip: 'Think about driving your elbows down toward your back pockets.',
  },
  'barbell-row': {
    name: 'Barbell row', muscles: ['Upper back', 'Lats', 'Biceps'], pattern: 'pull', std: ['ratio', 0.5, 1.5],
    steps: ['Hinge at the hips with a flat back, the bar hanging near your knees.', 'Row the bar toward your lower ribs.', 'Lower it under control without standing up.'],
    mistakes: ['Rounding your lower back.', 'Jerking the weight up with your hips.'],
    tip: 'Keep the same torso angle on every rep.',
  },
  'barbell-curl': {
    name: 'Barbell curl', muscles: ['Biceps'],
    steps: ['Stand tall and grip the bar at shoulder width, palms up.', 'Curl the bar up while your elbows stay at your sides.', 'Lower all the way down with control.'],
    mistakes: ['Swinging your back to lift the bar.', 'Cutting the range short at the bottom.'],
    tip: 'If you have to swing, the weight is too heavy.',
  },
  'hammer-curl': {
    name: 'Hammer curl', muscles: ['Biceps', 'Forearms'],
    steps: ['Hold dumbbells with your palms facing each other.', 'Curl up without turning your wrists.', 'Lower slowly.'],
    mistakes: ['Letting your elbows move forward.', 'Rushing the way down.'],
    tip: 'Great for thicker-looking arms from the front.',
  },
  'squat': {
    name: 'Squat', muscles: ['Quads', 'Glutes', 'Inner thighs'], pattern: 'squat', std: ['ratio', 0.75, 2.5],
    steps: ['Bar on your upper back, feet about shoulder width, toes slightly out.', 'Brace, then sit down and back until your thighs reach at least parallel, knees following your toes.', 'Drive up through your whole foot.'],
    mistakes: ['Knees caving inward.', 'Heels lifting off the floor.'],
    tip: 'Take a big breath and hold it before each rep.',
  },
  'romanian-deadlift': {
    name: 'Romanian deadlift', muscles: ['Hamstrings', 'Glutes', 'Lower back'], pattern: 'hinge', std: ['ratio', 0.75, 2.25],
    steps: ['Stand holding the bar with your knees slightly bent.', 'Push your hips back and slide the bar down your thighs with a flat back.', 'Stop when you feel a strong stretch in your hamstrings, then drive your hips forward.'],
    mistakes: ['Rounding your back to reach lower.', 'Bending your knees so much that it becomes a squat.'],
    tip: 'Keep the bar touching your legs the whole time.',
  },
  'hip-thrust': {
    name: 'Hip thrust', muscles: ['Glutes', 'Hamstrings'],
    steps: ['Upper back on a bench, a padded bar over your hips, feet flat.', 'Drive your hips up until your body is straight from shoulders to knees.', 'Pause and squeeze, then lower with control.'],
    mistakes: ['Arching your lower back at the top.', 'Feet too far forward or too close.'],
    tip: 'Tuck your chin and look forward, not at the ceiling.',
  },
  'leg-press': {
    name: 'Leg press', muscles: ['Quads', 'Glutes'],
    steps: ['Sit with your back flat on the pad, feet shoulder width on the platform.', 'Lower until your knees are at about 90 degrees.', 'Press back up without slamming your knees straight.'],
    mistakes: ['Letting your lower back lift off the pad.', 'Very short reps with too much weight.'],
    tip: 'Full controlled reps beat a heavy half rep.',
  },
  'calf-raise': {
    name: 'Calf raise', muscles: ['Calves'],
    steps: ['Stand with the balls of your feet on a step.', 'Lower your heels for a deep stretch.', 'Rise as high as you can and pause.'],
    mistakes: ['Bouncing at the bottom.', 'Using a tiny range of motion.'],
    tip: 'Pause for one second at the top and at the bottom.',
  },
  'plank': {
    name: 'Plank', muscles: ['Abs', 'Core'], timed: true, bw: true,
    steps: ['Forearms on the floor, elbows under your shoulders.', 'Keep your body in a straight line from head to heels.', 'Squeeze your glutes and abs, and keep breathing.'],
    mistakes: ['Letting your hips sag.', 'Pushing your hips too high.'],
    tip: 'Good seconds count more than long, sloppy holds.',
  },
  'db-bench-press': {
    name: 'Dumbbell bench press', muscles: ['Chest', 'Triceps', 'Front shoulders'], pattern: 'push', std: ['ratio', 0.2, 0.7], perHand: true,
    steps: ['Lie on a bench with a dumbbell in each hand at chest level.', 'Press up until your arms are straight, bringing the weights slightly together.', 'Lower slowly until you feel a stretch in your chest.'],
    mistakes: ['Dropping the weights too fast at the bottom.', 'Arching your back off the bench.'],
    tip: 'No bench? Do it on the floor. It is called a floor press and it works too.',
  },
  'db-shoulder-press': {
    name: 'Dumbbell shoulder press', muscles: ['Shoulders', 'Triceps'], pattern: 'push', std: ['ratio', 0.15, 0.5], perHand: true,
    steps: ['Sit or stand with dumbbells at shoulder height, palms forward.', 'Press straight up until your arms are straight.', 'Lower back to your shoulders with control.'],
    mistakes: ['Arching your lower back.', 'Only going halfway down.'],
    tip: 'Brace your abs like someone is about to poke your stomach.',
  },
  'oh-triceps-extension': {
    name: 'Overhead triceps extension', muscles: ['Triceps'],
    steps: ['Hold one dumbbell with both hands above your head.', 'Lower it behind your head by bending your elbows.', 'Straighten your arms back up.'],
    mistakes: ['Elbows flaring wide.', 'Arching your back.'],
    tip: 'The stretch at the bottom is what makes this one work.',
  },
  'db-row': {
    name: 'One-arm dumbbell row', muscles: ['Lats', 'Upper back', 'Biceps'], pattern: 'pull', std: ['ratio', 0.2, 0.75], perHand: true,
    steps: ['One hand and knee on a bench, back flat, dumbbell in the other hand.', 'Pull the dumbbell toward your hip.', 'Lower it until your arm is straight.'],
    mistakes: ['Twisting your torso to lift the weight.', 'Pulling toward your shoulder instead of your hip.'],
    tip: 'Imagine starting a lawn mower, but slow and controlled.',
  },
  'rear-delt-fly': {
    name: 'Rear delt fly', muscles: ['Rear shoulders', 'Upper back'],
    steps: ['Hinge forward with a flat back, light dumbbells hanging below you.', 'Raise your arms out to the sides with a small bend in your elbows.', 'Lower slowly.'],
    mistakes: ['Using momentum.', 'Squeezing your shoulder blades so hard your traps take over.'],
    tip: 'This one helps your shoulders look full from the side.',
  },
  'db-curl': {
    name: 'Dumbbell curl', muscles: ['Biceps'],
    steps: ['Stand with dumbbells at your sides, palms forward.', 'Curl up while your elbows stay at your sides.', 'Lower all the way down.'],
    mistakes: ['Swinging the weights.', 'Elbows moving forward.'],
    tip: 'Turn your pinky up slightly at the top for a stronger squeeze.',
  },
  'goblet-squat': {
    name: 'Goblet squat', muscles: ['Quads', 'Glutes'], pattern: 'squat', std: ['ratio', 0.2, 0.8],
    steps: ['Hold one dumbbell against your chest.', 'Sit down between your knees until your thighs reach at least parallel.', 'Stand up through your whole foot.'],
    mistakes: ['Knees caving in.', 'Leaning far forward.'],
    tip: 'The weight in front makes it easier to stay upright. Great for learning to squat.',
  },
  'db-rdl': {
    name: 'Dumbbell Romanian deadlift', muscles: ['Hamstrings', 'Glutes'], pattern: 'hinge', std: ['ratio', 0.25, 0.9], perHand: true,
    steps: ['Hold dumbbells in front of your thighs, knees slightly bent.', 'Push your hips back and lower the weights along your legs with a flat back.', 'Stand up by driving your hips forward.'],
    mistakes: ['Rounding your back.', 'Letting the weights drift away from your legs.'],
    tip: 'Move your hips back, not your chest down.',
  },
  'lunge': {
    name: 'Lunge', muscles: ['Quads', 'Glutes'],
    steps: ['Step forward and lower until both knees are at about 90 degrees.', 'Keep your torso upright.', 'Push back to the start. Reps are per leg.'],
    mistakes: ['Front knee caving in.', 'Steps that are too short.'],
    tip: 'Hold dumbbells at your sides when bodyweight gets easy.',
  },
  'push-up': {
    name: 'Push-up', muscles: ['Chest', 'Triceps', 'Shoulders'], bw: true, pattern: 'push', std: ['reps', 5, 60],
    steps: ['Hands a bit wider than your shoulders, body straight from head to heels.', 'Lower until your chest almost touches the floor, elbows at about 45 degrees.', 'Push back up.'],
    mistakes: ['Hips sagging.', 'Only going halfway down.'],
    tip: 'Too hard for now? Put your hands on a bench or a table.',
  },
  'pike-push-up': {
    name: 'Pike push-up', muscles: ['Shoulders', 'Triceps'], bw: true,
    steps: ['Start in a push-up position and walk your feet in so your hips go up.', 'Bend your elbows and lower your head toward the floor.', 'Push back up.'],
    mistakes: ['Hips dropping during the rep.', 'Elbows flaring wide.'],
    tip: 'The higher your hips, the more it works your shoulders.',
  },
  'chair-dip': {
    name: 'Bench dip', muscles: ['Triceps', 'Chest'], bw: true,
    steps: ['Hands on the edge of a sturdy bench or chair behind you.', 'Lower by bending your elbows to about 90 degrees.', 'Push back up.'],
    mistakes: ['Going so deep that your shoulders hurt.', 'Shrugging your shoulders up to your ears.'],
    tip: 'Bend your knees to make it easier, straighten your legs to make it harder.',
  },
  'inverted-row': {
    name: 'Pull-up or inverted row', muscles: ['Lats', 'Upper back', 'Biceps'], bw: true, pattern: 'pull', std: ['reps', 3, 25],
    steps: ['Pull-up: hang from a bar and pull your chest up toward it.', 'No bar? Lie under a sturdy table, hold the edge and pull your chest up to it.', 'Lower all the way down with control.'],
    mistakes: ['Half reps.', 'Kicking your legs to get up.'],
    tip: 'Log the version you can do for at least 6 clean reps.',
  },
  'bw-squat': {
    name: 'Bodyweight squat', muscles: ['Quads', 'Glutes'], bw: true, pattern: 'squat', std: ['reps', 10, 60],
    steps: ['Feet shoulder width, toes slightly out.', 'Sit down and back until your thighs reach at least parallel.', 'Stand up through your whole foot.'],
    mistakes: ['Heels lifting.', 'Knees caving in.'],
    tip: 'Slow down the way down to make it harder.',
  },
  'split-squat': {
    name: 'Split squat', muscles: ['Quads', 'Glutes'], bw: true,
    steps: ['One foot forward, one foot back, like a long stride.', 'Lower your back knee toward the floor.', 'Push up through your front foot. Reps are per leg.'],
    mistakes: ['Front heel lifting.', 'Leaning far forward.'],
    tip: 'Put your back foot on a chair to make it much harder.',
  },
  'backpack-curl': {
    name: 'Backpack curl', muscles: ['Biceps', 'Forearms'],
    steps: ['Load a backpack with books or water bottles and hold it by the straps with both hands.', 'Curl it up toward your chest with your elbows at your sides.', 'Lower it slowly.'],
    mistakes: ['Swinging the backpack.', 'Letting your elbows move forward.'],
    tip: 'Weigh the backpack on a bathroom scale so you can log the weight.',
  },
  'crunch': {
    name: 'Crunch', muscles: ['Abs'], bw: true,
    steps: ['Lie on your back, knees bent, hands by your ears.', 'Curl your shoulders off the floor by squeezing your abs.', 'Lower slowly. Your lower back stays on the floor.'],
    mistakes: ['Pulling your head with your hands.', 'Using momentum.'],
    tip: 'Breathe out as you curl up.',
  },
  'leg-raise': {
    name: 'Lying leg raise', muscles: ['Abs'], bw: true,
    steps: ['Lie on your back, legs straight, hands under your hips.', 'Raise your legs until they point at the ceiling.', 'Lower them slowly without touching the floor.'],
    mistakes: ['Arching your lower back.', 'Dropping your legs fast.'],
    tip: 'Bend your knees a little to make it easier.',
  },
  'superman': {
    name: 'Superman', muscles: ['Lower back', 'Upper back', 'Glutes'], bw: true,
    steps: ['Lie face down with your arms stretched out in front.', 'Lift your arms, chest and legs a few centimeters off the floor.', 'Hold for a second, then lower.'],
    mistakes: ['Lifting so high that your neck strains.', 'Holding your breath.'],
    tip: 'Squeeze your glutes and shoulder blades at the top.',
  },
  'diamond-push-up': {
    name: 'Diamond push-up', muscles: ['Triceps', 'Chest'], bw: true,
    steps: ['Push-up position with your hands together under your chest, forming a diamond.', 'Lower your chest to your hands, elbows close to your body.', 'Push back up.'],
    mistakes: ['Elbows flaring out.', 'Hips sagging.'],
    tip: 'Too hard for now? Do it with your knees on the floor.',
  },
  'glute-bridge': {
    name: 'Glute bridge', muscles: ['Glutes', 'Hamstrings'], bw: true,
    steps: ['Lie on your back, knees bent, feet flat.', 'Drive your hips up until your body is straight from shoulders to knees.', 'Squeeze for a second, then lower.'],
    mistakes: ['Arching your lower back.', 'Pushing through your toes.'],
    tip: 'Try one leg at a time once two legs gets easy.',
  },
};

const day = (id, name, focus, items) => ({ id, name, focus, items });

// From the "Beginner Routine" article: push / pull / legs, 3 days a week, plus core.
export const PROGRAMS = {
  gym: {
    name: 'Push / Pull / Legs',
    days: [
      day('push', 'Push', 'Chest, shoulders and triceps', [['bench-press', 4, '8-10'], ['overhead-press', 3, '10-12'], ['lateral-raise', 3, '12-15'], ['triceps-pushdown', 3, '10-12'], ['plank', 3, '30-45']]),
      day('pull', 'Pull', 'Back and biceps', [['lat-pulldown', 4, '8-10'], ['barbell-row', 3, '10-12'], ['barbell-curl', 3, '10-12'], ['hammer-curl', 2, '12']]),
      day('legs', 'Legs', 'Full legs', [['squat', 4, '8-10'], ['romanian-deadlift', 3, '10-12'], ['hip-thrust', 3, '10-12'], ['leg-press', 3, '12'], ['calf-raise', 3, '15']]),
    ],
  },
  dumbbells: {
    name: 'Push / Pull / Legs with dumbbells',
    days: [
      day('push', 'Push', 'Chest, shoulders and triceps', [['db-bench-press', 4, '8-10'], ['db-shoulder-press', 3, '10-12'], ['lateral-raise', 3, '12-15'], ['oh-triceps-extension', 3, '10-12'], ['plank', 3, '30-45']]),
      day('pull', 'Pull', 'Back and biceps', [['db-row', 4, '8-10'], ['rear-delt-fly', 3, '12-15'], ['db-curl', 3, '10-12'], ['hammer-curl', 2, '12']]),
      day('legs', 'Legs', 'Full legs', [['goblet-squat', 4, '8-12'], ['db-rdl', 3, '10-12'], ['lunge', 3, '10'], ['calf-raise', 3, '15']]),
    ],
  },
  bodyweight: {
    name: 'Full body at home',
    days: [
      day('a', 'Full body A', 'Push-ups, squats and rows', [['push-up', 4, '8-20'], ['bw-squat', 4, '15-20'], ['inverted-row', 4, '6-12'], ['plank', 3, '30-45']]),
      day('b', 'Full body B', 'Shoulders, legs and glutes', [['pike-push-up', 3, '8-12'], ['split-squat', 3, '10'], ['glute-bridge', 3, '15'], ['chair-dip', 3, '8-12'], ['calf-raise', 3, '20']]),
    ],
  },
};

export const GOALS = [
  { id: 'muscle', name: 'Build muscle', note: 'Look bigger and more defined' },
  { id: 'strength', name: 'Get stronger', note: 'Lift more on the big lifts' },
  { id: 'fat', name: 'Lose fat', note: 'Keep your muscle while you lean out' },
  { id: 'habit', name: 'Build the habit', note: 'Train consistently, week after week' },
];

export const LEVELS = [
  { id: 'beginner', name: 'Beginner', note: 'Less than 1 year of training' },
  { id: 'intermediate', name: 'Intermediate', note: '1 to 3 years' },
  { id: 'advanced', name: 'Advanced', note: 'More than 3 years' },
  { id: 'comeback', name: 'Coming back', note: 'Returning after a break' },
];

export const EQUIPMENT = [
  { id: 'gym', name: 'Full gym', note: 'Barbells, machines and cables' },
  { id: 'dumbbells', name: 'Dumbbells only', note: 'At home or a small gym' },
  { id: 'bodyweight', name: 'No equipment', note: 'Just your body' },
];

// Daily "Myth or fact" cards, based on the site's articles.
export const MYTHS = [
  { q: 'No pain, no gain.', fact: false, a: 'Effort should feel hard, but sharp or joint pain is a signal to stop, not a sign of progress.', link: '/gym-myths' },
  { q: 'Deadlifts hurt your back.', fact: false, a: 'With good technique and sensible weights, deadlifts make your back stronger.', link: '/gym-myths' },
  { q: 'If you are not sore, the muscle did not grow.', fact: false, a: 'Soreness drops as your body adapts. It is not a measure of growth.', link: '/gym-myths' },
  { q: 'Cardio makes you lose the muscle you gained.', fact: false, a: 'Moderate cardio does not erase your gains if you keep lifting and eat enough protein.', link: '/gym-myths' },
  { q: 'Training every day without rest gives better results.', fact: false, a: 'Muscle grows while you recover. Rest days are part of the plan.', link: '/gym-myths' },
  { q: 'Protein powder is basically steroids.', fact: false, a: 'It is food protein in powder form, not a drug. It is just a convenient option.', link: '/protein-powder' },
  { q: 'Ab exercises burn belly fat.', fact: false, a: 'You cannot burn fat from one spot. Fat loss comes from your whole diet and activity.', link: '/gym-myths' },
  { q: 'Without supplements you will not make progress.', fact: false, a: 'Training, food and sleep do almost all of the work. Supplements are the small extra.', link: '/gym-myths' },
  { q: 'Muscle grows while you rest, not while you train.', fact: true, a: 'Training is the signal. The building happens in the hours and days after, while you recover.', link: '/after-workout-muscles' },
  { q: 'Muscle you lost after a break comes back faster than it took to build.', fact: true, a: 'Muscle memory is real: regaining lost size is usually faster than building it the first time.', link: '/stop-training-muscles' },
  { q: 'Sleep affects how much muscle you build.', fact: true, a: 'Poor sleep hurts recovery, strength and appetite control. It is part of training.', link: '/sleep-recovery' },
  { q: 'You can hit your protein target with normal food.', fact: true, a: 'Powder is optional. Chicken, eggs, fish, dairy and legumes all count.', link: '/high-protein-foods' },
];

export const ARTICLES = [
  { cat: 'Training', items: [['Beginner routine: your first 3 months', '/beginner-routine'], ['Hypertrophy vs strength', '/hypertrophy-strength'], ['8 gym myths holding you back', '/gym-myths'], ['What happens when you stop training', '/stop-training-muscles']] },
  { cat: 'Nutrition', items: [['How much protein you actually need', '/daily-protein'], ['High-protein foods worth eating', '/high-protein-foods'], ['Bulking vs cutting', '/bulking-cutting'], ['How to actually lose weight', '/lose-weight']] },
  { cat: 'Supplements and health', items: [['Creatine guide', '/creatine-guide'], ['Is protein powder bad for you?', '/protein-powder'], ["Why steroids aren't worth it", '/steroids-article']] },
  { cat: 'Recovery', items: [['Inside your muscles after a workout', '/after-workout-muscles'], ['Sleep and recovery', '/sleep-recovery'], ['Signs of overtraining', '/overtraining-signs']] },
  { cat: 'Mindset', items: [['Discipline vs motivation', '/discipline-motivation'], ['Social media comparison', '/social-media-comparison']] },
];

// Channel videos (topic labels, linked to YouTube).
export const VIDEOS = [
  { id: 'oLVFBchiFKA', topic: 'Inside your muscles after a workout' },
  { id: '3CfapTScHrk', topic: 'When you stop training' },
  { id: 'b267VCsazdo', topic: 'Creatine mistakes that waste your money' },
  { id: 'MP6o4UZB7Fk', topic: 'Gym myths holding you back' },
  { id: 'gdqlqDKMqJw', topic: 'How much protein you need' },
  { id: 'rha9o3nnS_0', topic: 'Same protein, very different food' },
  { id: 'rWNc7ValMv4', topic: 'Protein powder: the real risk' },
  { id: 'c2rZHOzhl3c', topic: 'Steroids: why they are not worth it' },
];

// Same numbers as the website calculator.
export const ACTIVITY = [
  { f: 24, name: 'Sedentary', note: 'Little or no exercise' },
  { f: 27, name: 'Light', note: 'Train 1 to 3 days a week' },
  { f: 30, name: 'Moderate', note: 'Train 3 to 5 days a week' },
  { f: 33, name: 'Intense', note: 'Train 6 to 7 days a week' },
];

// What counts toward the rank: every exercise, grouped by muscle group. [group, type, low, high]
// ratio = estimated one-rep max / bodyweight (bodyweight is adjusted so lighter and heavier people
// compare fairly; per dumbbell for dumbbell lifts). reps = best reps in one set. secs = seconds held.
// "low" scores 0 and "high" scores 100. Approximate adult male standards, to be refined with data.
export const STANDARDS = {
  'bench-press': ['chest', 'ratio', 0.5, 1.75],
  'db-bench-press': ['chest', 'ratio', 0.2, 0.7],
  'push-up': ['chest', 'reps', 5, 60],
  'chair-dip': ['chest', 'reps', 5, 40],
  'overhead-press': ['shoulders', 'ratio', 0.35, 1.1],
  'db-shoulder-press': ['shoulders', 'ratio', 0.15, 0.5],
  'lateral-raise': ['shoulders', 'ratio', 0.04, 0.25],
  'rear-delt-fly': ['shoulders', 'ratio', 0.04, 0.22],
  'pike-push-up': ['shoulders', 'reps', 3, 25],
  'lat-pulldown': ['back', 'ratio', 0.5, 1.3],
  'barbell-row': ['back', 'ratio', 0.5, 1.5],
  'db-row': ['back', 'ratio', 0.2, 0.75],
  'inverted-row': ['back', 'reps', 3, 25],
  'squat': ['legs', 'ratio', 0.75, 2.5],
  'goblet-squat': ['legs', 'ratio', 0.2, 0.8],
  'leg-press': ['legs', 'ratio', 1.0, 4.0],
  'lunge': ['legs', 'ratio', 0.1, 0.8],
  'bw-squat': ['legs', 'reps', 10, 60],
  'split-squat': ['legs', 'reps', 5, 30],
  'calf-raise': ['legs', 'ratio', 0.3, 2.0],
  'romanian-deadlift': ['hinge', 'ratio', 0.75, 2.25],
  'db-rdl': ['hinge', 'ratio', 0.25, 0.9],
  'hip-thrust': ['hinge', 'ratio', 0.5, 2.5],
  'glute-bridge': ['hinge', 'reps', 10, 50],
  'barbell-curl': ['arms', 'ratio', 0.2, 0.75],
  'db-curl': ['arms', 'ratio', 0.08, 0.4],
  'hammer-curl': ['arms', 'ratio', 0.08, 0.4],
  'triceps-pushdown': ['arms', 'ratio', 0.2, 0.8],
  'oh-triceps-extension': ['arms', 'ratio', 0.1, 0.5],
  'plank': ['core', 'secs', 20, 180],
  'crunch': ['core', 'reps', 10, 60],
  'leg-raise': ['core', 'reps', 5, 30],
  'superman': ['back', 'reps', 8, 40],
  'diamond-push-up': ['arms', 'reps', 3, 40],
  'backpack-curl': ['arms', 'ratio', 0.08, 0.45],
};

// Where each exercise can be done. Gym covers everything; dumbbells cover dumbbell and bodyweight.
const DUMBBELL = ['db-bench-press', 'db-shoulder-press', 'db-row', 'db-curl', 'db-rdl', 'lateral-raise', 'hammer-curl',
  'rear-delt-fly', 'goblet-squat', 'lunge', 'oh-triceps-extension'];
const HOME_ITEMS = ['backpack-curl']; // household objects, no equipment needed
export const placeOf = (id) => (EXERCISES[id].bw || HOME_ITEMS.includes(id) ? 'bodyweight' : DUMBBELL.includes(id) ? 'dumbbells' : 'gym');
export const PLACE_OK = { gym: ['gym', 'dumbbells', 'bodyweight'], dumbbells: ['dumbbells', 'bodyweight'], bodyweight: ['bodyweight'] };
// Big multi-joint lifts go first in a session.
export const COMPOUND = ['bench-press', 'db-bench-press', 'push-up', 'overhead-press', 'db-shoulder-press', 'pike-push-up',
  'lat-pulldown', 'barbell-row', 'db-row', 'inverted-row', 'squat', 'goblet-squat', 'leg-press', 'bw-squat', 'split-squat',
  'lunge', 'romanian-deadlift', 'db-rdl', 'hip-thrust', 'chair-dip'];
export const GROUPS = ['chest', 'shoulders', 'back', 'legs', 'hinge', 'arms', 'core'];
