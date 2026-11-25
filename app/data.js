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
    name: 'Inverted row', muscles: ['Upper back', 'Lats', 'Biceps'], bw: true, pattern: 'pull', std: ['reps', 5, 30],
    steps: ['Lie under a sturdy bar or table edge set at hip height, holding it with straight arms.', 'Keep your body straight and pull your chest up to the bar.', 'Lower all the way down with control.'],
    mistakes: ['Letting the hips sag.', 'Half reps.'],
    tip: 'Bend your knees to make it easier, raise your feet to make it harder.',
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
  'incline-bench-press': {
    name: 'Incline bench press', muscles: ['Upper chest', 'Front shoulders', 'Triceps'], pattern: 'push', std: ['ratio', 0.4, 1.4],
    steps: ['Set the bench to about 30 degrees and lie with your eyes under the bar.', 'Lower the bar with control to the top of your chest.', 'Press up until your arms are straight, shoulder blades pulled back.'],
    mistakes: ['Setting the bench too steep: it turns into a shoulder press.', 'Bouncing the bar off your chest.'],
    tip: 'A low incline (about 30 degrees) hits the upper chest best.',
  },
  'incline-db-press': {
    name: 'Incline dumbbell press', muscles: ['Upper chest', 'Front shoulders', 'Triceps'], perHand: true, pattern: 'push', std: ['ratio', 0.15, 0.6],
    steps: ['Sit on a bench set to about 30 degrees with a dumbbell on each knee, then lie back.', 'Press the dumbbells up over your upper chest.', 'Lower them slowly to the sides of your chest.'],
    mistakes: ['Clanking the dumbbells together at the top.', 'Dropping them too fast at the bottom.'],
    tip: 'Dumbbells let each arm work on its own: good for fixing a weaker side.',
  },
  'db-fly': {
    name: 'Dumbbell fly', muscles: ['Chest', 'Front shoulders'], perHand: true, std: ['ratio', 0.06, 0.35],
    steps: ['Lie on a flat bench with the dumbbells above your chest, palms facing each other.', 'With elbows slightly bent, open your arms out to the sides until you feel a stretch.', 'Bring the dumbbells back up in a wide arc, like hugging a tree.'],
    mistakes: ['Bending the elbows so much it becomes a press.', 'Going too low and straining the shoulders.'],
    tip: 'Use light weights: this is about the stretch, not about lifting heavy.',
  },
  'cable-fly': {
    name: 'Cable fly', muscles: ['Chest', 'Front shoulders'], perHand: true, std: ['ratio', 0.06, 0.4],
    steps: ['Stand between two cable pulleys set high, one handle in each hand, one foot forward.', 'With elbows slightly bent, bring your hands together in front of your chest.', 'Open your arms slowly back to the start, feeling the stretch.'],
    mistakes: ['Pulling with the arms instead of the chest.', 'Leaning so far forward that the back takes over.'],
    tip: 'Squeeze for one second when your hands meet.',
  },
  'parallel-dip': {
    name: 'Parallel bar dip', muscles: ['Chest', 'Triceps', 'Front shoulders'], bw: true, pattern: 'push', std: ['reps', 3, 30],
    steps: ['Hold yourself up on parallel bars with straight arms.', 'Lower slowly until your shoulders are just below your elbows.', 'Push back up until your arms are straight.'],
    mistakes: ['Shrugging the shoulders up to the ears.', 'Dropping down fast.'],
    tip: 'Lean forward a little for more chest, stay upright for more triceps.',
  },
  'pull-up': {
    name: 'Pull-up', muscles: ['Lats', 'Upper back', 'Biceps'], bw: true, pattern: 'pull', std: ['reps', 1, 20],
    steps: ['Hang from a bar with hands a bit wider than your shoulders, arms straight.', 'Pull your chest up until your chin is over the bar.', 'Lower all the way down with control.'],
    mistakes: ['Kicking and swinging to get up.', 'Half reps that never reach straight arms.'],
    tip: 'Can not do one yet? Jump up and lower yourself slowly for 5 seconds.',
  },
  'cable-row': {
    name: 'Seated cable row', muscles: ['Upper back', 'Lats', 'Biceps'], pattern: 'pull', std: ['ratio', 0.4, 1.2],
    steps: ['Sit at the cable row with feet on the platform and knees slightly bent, chest up.', 'Pull the handle to your stomach, squeezing your shoulder blades together.', 'Let your arms stretch forward slowly without rounding your back.'],
    mistakes: ['Rocking the body back and forth.', 'Rounding the lower back at the stretch.'],
    tip: 'Think of pulling with your elbows, not with your hands.',
  },
  'deadlift': {
    name: 'Deadlift', muscles: ['Hamstrings', 'Glutes', 'Lower back', 'Upper back'], pattern: 'hinge', std: ['ratio', 1.0, 2.75],
    steps: ['Stand with the bar over the middle of your feet, grip it just outside your legs.', 'Chest up, back flat, push the floor away and stand up tall with the bar close to your legs.', 'Lower the bar the same way: hips back first, bar sliding down your legs.'],
    mistakes: ['Rounding the back.', 'Letting the bar drift away from the legs.'],
    tip: 'Learn it light. A flat back matters more than the weight.',
  },
  'face-pull': {
    name: 'Face pull', muscles: ['Rear shoulders', 'Upper back'], std: ['ratio', 0.1, 0.5],
    steps: ['Set a rope on a cable at face height and hold both ends, palms facing down.', 'Pull the rope toward your face, separating the ends and pulling the elbows high and back.', 'Return slowly with your arms straight.'],
    mistakes: ['Using too much weight and leaning back.', 'Pulling to the chest instead of the face.'],
    tip: 'Great for healthy shoulders and better posture.',
  },
  'shrug': {
    name: 'Dumbbell shrug', muscles: ['Upper back'], perHand: true, std: ['ratio', 0.2, 0.8],
    steps: ['Stand tall with a heavy dumbbell in each hand at your sides.', 'Lift your shoulders straight up toward your ears.', 'Hold one second and lower slowly.'],
    mistakes: ['Rolling the shoulders in circles.', 'Bending the arms to help.'],
    tip: 'Straight up and down: no need to roll.',
  },
  'cable-lateral-raise': {
    name: 'Cable lateral raise', muscles: ['Side shoulders'], std: ['ratio', 0.03, 0.2],
    steps: ['Stand sideways to a low cable, holding the handle with the far hand in front of your hips.', 'Raise the arm out to the side up to shoulder height, elbow slightly bent.', 'Lower slowly, keeping tension on the cable.'],
    mistakes: ['Swinging the body.', 'Raising the arm above the shoulder.'],
    tip: 'The cable keeps tension at the bottom, where dumbbells feel light.',
  },
  'arnold-press': {
    name: 'Arnold press', muscles: ['Front shoulders', 'Side shoulders', 'Triceps'], perHand: true, pattern: 'push', std: ['ratio', 0.12, 0.45],
    steps: ['Sit or stand with dumbbells in front of your shoulders, palms facing you.', 'Press up while turning the palms to face forward at the top.', 'Lower and turn them back to the start.'],
    mistakes: ['Arching the lower back.', 'Rushing the turn.'],
    tip: 'Go slow: the turn is what makes it different from a normal press.',
  },
  'preacher-curl': {
    name: 'Preacher curl', muscles: ['Biceps'], std: ['ratio', 0.15, 0.6],
    steps: ['Sit at the preacher bench with the back of your arms flat on the pad, holding an EZ bar.', 'Curl the bar up toward your shoulders.', 'Lower slowly until your arms are almost straight.'],
    mistakes: ['Lifting the elbows off the pad.', 'Dropping fast at the bottom.'],
    tip: 'The pad stops cheating, so use less weight than a normal curl.',
  },
  'cable-curl': {
    name: 'Cable curl', muscles: ['Biceps', 'Forearms'], std: ['ratio', 0.15, 0.6],
    steps: ['Stand facing a low cable with a straight bar, elbows at your sides.', 'Curl the bar up to your chest.', 'Lower slowly while the cable keeps pulling.'],
    mistakes: ['Leaning back to lift.', 'Elbows moving forward.'],
    tip: 'Good finisher at the end of a workout.',
  },
  'skull-crusher': {
    name: 'Skull crusher', muscles: ['Triceps'], std: ['ratio', 0.15, 0.6],
    steps: ['Lie on a flat bench holding an EZ bar above your chest with straight arms.', 'Bend only at the elbows to lower the bar toward your forehead.', 'Straighten your arms back up.'],
    mistakes: ['Elbows flaring out wide.', 'Moving the upper arms instead of only the elbows.'],
    tip: 'Lower toward the top of your head, not your nose, and go controlled.',
  },
  'close-grip-bench': {
    name: 'Close-grip bench press', muscles: ['Triceps', 'Chest', 'Front shoulders'], pattern: 'push', std: ['ratio', 0.4, 1.4],
    steps: ['Lie on a flat bench and grip the bar at shoulder width.', 'Lower it to your lower chest with elbows close to your body.', 'Press up until your arms are straight.'],
    mistakes: ['Hands too close together, which hurts the wrists.', 'Elbows flaring out.'],
    tip: 'Shoulder-width grip is close enough.',
  },
  'front-squat': {
    name: 'Front squat', muscles: ['Quads', 'Glutes', 'Core'], pattern: 'squat', std: ['ratio', 0.6, 2.0],
    steps: ['Rest the bar on the front of your shoulders, elbows high.', 'Squat down keeping your chest up and elbows pointing forward.', 'Stand back up through the middle of your feet.'],
    mistakes: ['Elbows dropping, so the bar rolls forward.', 'Heels lifting off the floor.'],
    tip: 'Keep the elbows up the whole time.',
  },
  'bulgarian-split-squat': {
    name: 'Bulgarian split squat', muscles: ['Quads', 'Glutes'], perHand: true, pattern: 'squat', std: ['ratio', 0.1, 0.6],
    steps: ['Stand a big step in front of a bench and put the top of your back foot on it, a dumbbell in each hand.', 'Lower straight down until your front thigh is parallel to the floor.', 'Push through the front foot to stand back up.'],
    mistakes: ['Front foot too close to the bench.', 'Front knee caving in.'],
    tip: 'Hard but worth it: one of the best leg exercises with dumbbells.',
  },
  'leg-extension': {
    name: 'Leg extension', muscles: ['Quads'], std: ['ratio', 0.3, 1.2],
    steps: ['Sit on the machine with the pad on the front of your ankles, back against the seat.', 'Straighten your legs fully and squeeze the thighs.', 'Lower slowly.'],
    mistakes: ['Swinging the weight up.', 'Lifting the hips off the seat.'],
    tip: 'Pause one second at the top.',
  },
  'leg-curl': {
    name: 'Leg curl', muscles: ['Hamstrings'], std: ['ratio', 0.2, 0.9],
    steps: ['Lie face down on the leg curl machine with the pad just above your heels.', 'Curl your heels toward your glutes.', 'Lower slowly until your legs are almost straight.'],
    mistakes: ['Lifting the hips off the bench.', 'Short, fast reps.'],
    tip: 'Point your toes up toward your shins for a stronger squeeze.',
  },
  'hack-squat': {
    name: 'Hack squat', muscles: ['Quads', 'Glutes'], pattern: 'squat', std: ['ratio', 0.6, 2.5],
    steps: ['Stand on the hack squat platform with your back and shoulders against the pads.', 'Release the safeties and squat down until your thighs are parallel.', 'Press back up without locking the knees hard.'],
    mistakes: ['Heels lifting off the platform.', 'Very short reps with too much weight.'],
    tip: 'Feet a bit lower on the platform work the quads more.',
  },
  'hanging-leg-raise': {
    name: 'Hanging leg raise', muscles: ['Abs', 'Core'], bw: true, std: ['reps', 3, 25],
    steps: ['Hang from a pull-up bar with straight arms.', 'Raise your knees (or straight legs) up toward your chest.', 'Lower slowly without swinging.'],
    mistakes: ['Swinging the body.', 'Dropping the legs fast.'],
    tip: 'Start with knees bent; straight legs are the advanced version.',
  },
  'ab-wheel': {
    name: 'Ab wheel rollout', muscles: ['Abs', 'Core'], bw: true, std: ['reps', 3, 25],
    steps: ['Kneel on the floor holding an ab wheel under your shoulders.', 'Roll forward slowly, keeping your back flat and abs tight.', 'Pull back to the start using your abs.'],
    mistakes: ['Letting the lower back sag.', 'Rolling out farther than you can control.'],
    tip: 'Go only as far as you can come back with a flat back.',
  },
  'chin-up': {
    name: 'Chin-up', muscles: ['Lats', 'Biceps', 'Upper back'], bw: true, pattern: 'pull', std: ['reps', 1, 22],
    steps: ['Hang from a bar with your palms facing you, hands at shoulder width, arms straight.', 'Pull until your chin is over the bar, elbows driving down to your ribs.', 'Lower all the way down with control.'],
    mistakes: ['Kicking and swinging to get up.', 'Stopping halfway down.'],
    tip: 'Palms facing you put more work on the biceps: a bit easier than the pull-up.',
  },
  'machine-chest-press': {
    name: 'Machine chest press', muscles: ['Chest', 'Triceps', 'Front shoulders'], pattern: 'push', std: ['ratio', 0.4, 1.5],
    steps: ['Set the seat so the handles line up with the middle of your chest.', 'Push the handles forward until your arms are straight, without locking hard.', 'Bring them back slowly until you feel the stretch in your chest.'],
    mistakes: ['Seat too high or too low: the handles should be at mid-chest.', 'Letting the weight slam back.'],
    tip: 'Great for adding chest work safely after the bench press, even close to failure.',
  },
  'pec-deck': {
    name: 'Pec deck fly', muscles: ['Chest', 'Front shoulders'], std: ['ratio', 0.2, 1.0],
    steps: ['Sit with your back flat on the pad and grab the handles at shoulder height.', 'Bring your arms together in front of your chest, elbows slightly bent.', 'Open slowly until you feel a stretch across your chest.'],
    mistakes: ['Shoulders rolling forward at the end.', 'Opening too far and straining the shoulder.'],
    tip: 'Squeeze for a second when your hands meet: that is where the chest works hardest.',
  },
  'chest-supported-row': {
    name: 'Chest-supported row', muscles: ['Upper back', 'Lats', 'Rear shoulders'], perHand: true, pattern: 'pull', std: ['ratio', 0.15, 0.6],
    steps: ['Lie face down on a bench set to about 30 degrees, a dumbbell in each hand hanging down.', 'Row the dumbbells up beside your ribs, squeezing your shoulder blades together.', 'Lower them until your arms are straight again.'],
    mistakes: ['Lifting your chest off the pad to cheat.', 'Shrugging the shoulders up to your ears.'],
    tip: 'The bench holds your body still, so all the work goes to your back. Easy on the lower back.',
  },
  'db-pullover': {
    name: 'Dumbbell pullover', muscles: ['Lats', 'Chest', 'Triceps'], std: ['ratio', 0.12, 0.5],
    steps: ['Lie on a bench holding one dumbbell with both hands above your chest.', 'With arms almost straight, lower it back behind your head until you feel a stretch.', 'Pull it back over your chest using your lats.'],
    mistakes: ['Bending the elbows a lot: it turns into a triceps exercise.', 'Going too heavy and arching the lower back.'],
    tip: 'One of the few back exercises you can do with only one dumbbell.',
  },
  'step-up': {
    name: 'Step-up', muscles: ['Quads', 'Glutes'], perHand: true, pattern: 'squat', std: ['ratio', 0.05, 0.5],
    steps: ['Stand in front of a sturdy box or bench about knee high, a dumbbell in each hand.', 'Put one whole foot on the box and push through it to stand up tall.', 'Step down slowly with the same leg. Do all reps, then switch.'],
    mistakes: ['Pushing off with the back foot.', 'Using a box so high your knee goes past your hip.'],
    tip: 'Also works with no weight: just your body is already a good start.',
  },
  'single-leg-rdl': {
    name: 'Single-leg Romanian deadlift', muscles: ['Hamstrings', 'Glutes', 'Core'], pattern: 'hinge', std: ['ratio', 0.1, 0.6],
    steps: ['Stand on one leg holding a dumbbell in the opposite hand.', 'Lean forward from the hips and let the free leg go straight back, back flat.', 'Stop when you feel the stretch in your hamstring and stand back up.'],
    mistakes: ['Rounding the back to reach lower.', 'Opening the hips to the side.'],
    tip: 'Start light and hold a wall with your free hand if you wobble. Balance improves fast.',
  },
  'incline-curl': {
    name: 'Incline dumbbell curl', muscles: ['Biceps', 'Forearms'], perHand: true, std: ['ratio', 0.05, 0.3],
    steps: ['Sit back on a bench set to about 45 degrees, arms hanging straight down.', 'Curl both dumbbells up without moving your upper arms forward.', 'Lower them slowly all the way down.'],
    mistakes: ['Bringing the elbows forward to lift more.', 'Cutting the bottom half of the rep.'],
    tip: 'The arms hang behind your body, so the biceps work stretched: one of the best curls to grow.',
  },
  'triceps-kickback': {
    name: 'Triceps kickback', muscles: ['Triceps'], perHand: true, std: ['ratio', 0.04, 0.25],
    steps: ['One hand and knee on a bench, back flat, upper arm pinned to your side.', 'Straighten the elbow until the dumbbell is behind you and the arm is fully straight.', 'Bend back to 90 degrees slowly. Do all reps, then switch arms.'],
    mistakes: ['Swinging the upper arm to move the weight.', 'Going too heavy: this one works with light weights.'],
    tip: 'Hold the straight arm for a second at the end: that squeeze is what makes it work.',
  },
  'cable-crunch': {
    name: 'Cable crunch', muscles: ['Abs'], std: ['ratio', 0.2, 1.0],
    steps: ['Kneel in front of a high cable, holding the rope beside your head.', 'Curl your chest down toward your knees, rounding your back.', 'Come back up slowly until your torso is upright.'],
    mistakes: ['Sitting back on your heels and pulling with the arms.', 'Moving the hips instead of curling the spine.'],
    tip: 'Your abs can be trained with weight like any other muscle: add a little each week.',
  },
  'side-plank': {
    name: 'Side plank', muscles: ['Core', 'Abs'], bw: true, timed: true, std: ['secs', 15, 120],
    steps: ['Lie on your side with your elbow under your shoulder and your feet stacked.', 'Lift your hips until your body is a straight line from head to feet.', 'Hold, breathe, then do the other side.'],
    mistakes: ['Letting the hips sag toward the floor.', 'Rolling the chest forward.'],
    tip: 'Too hard? Bend your knees and rest on them.',
  },
  'decline-push-up': {
    name: 'Decline push-up', muscles: ['Upper chest', 'Front shoulders', 'Triceps'], bw: true, pattern: 'push', std: ['reps', 3, 45],
    steps: ['Put your feet on a bench or chair behind you and your hands on the floor.', 'Lower your chest close to the floor, body straight.', 'Push back up until your arms are straight.'],
    mistakes: ['Letting the hips sag.', 'Using a support so high it turns into a shoulder exercise.'],
    tip: 'The higher your feet, the harder it gets: a great next step after normal push-ups.',
  },
  'farmer-carry': {
    name: 'Farmer\'s walk', muscles: ['Forearms', 'Upper back', 'Core'], bw: true, timed: true, std: ['secs', 20, 90],
    steps: ['Pick up a heavy dumbbell in each hand like a deadlift: back flat, legs pushing.', 'Stand tall, shoulders back, and walk with short, steady steps.', 'Walk for the time, then put the weights down with the same care.'],
    mistakes: ['Leaning to one side.', 'Letting the shoulders round forward.'],
    tip: 'Use the heaviest dumbbells you can carry while standing tall. Log the seconds you walk.',
  },
  'nordic-curl': {
    name: 'Nordic curl', muscles: ['Hamstrings', 'Glutes'], bw: true, std: ['reps', 1, 15],
    steps: ['Kneel on a pad with your ankles held down under something heavy or by a partner.', 'Keeping a straight line from knees to head, lean forward as slowly as you can.', 'Catch yourself with your hands, push off the floor and come back up.'],
    mistakes: ['Bending at the hips instead of staying straight.', 'Dropping fast instead of fighting the fall.'],
    tip: 'Very hard at first: lowering slowly for 3 to 5 seconds already counts as a rep.',
  },
};

const day = (id, name, focus, items) => ({ id, name, focus, items });

// From the "Beginner Routine" article: push / pull / legs, 3 days a week, plus core.
export const PROGRAMS = {
  // Upper / lower: each muscle about twice a week, big lifts first, then the exercises with the best stretch and payoff.
  gym: {
    name: 'Upper / Lower',
    days: [
      day('upper-a', 'Upper A', 'Chest, back and arms', [['bench-press', 4, '6-10'], ['lat-pulldown', 4, '8-12'], ['incline-db-press', 3, '8-12'], ['cable-row', 3, '8-12'], ['lateral-raise', 3, '12-20'], ['oh-triceps-extension', 2, '10-12'], ['barbell-curl', 2, '8-12']]),
      day('lower-a', 'Lower A', 'Quads, hamstrings and calves', [['squat', 4, '6-10'], ['romanian-deadlift', 3, '8-10'], ['leg-press', 3, '10-12'], ['leg-curl', 3, '10-15'], ['calf-raise', 3, '10-15'], ['hanging-leg-raise', 3, '8-15']]),
      day('upper-b', 'Upper B', 'Shoulders, upper back and arms', [['incline-bench-press', 4, '6-10'], ['pull-up', 3, '5-10'], ['overhead-press', 3, '8-10'], ['db-row', 3, '8-12'], ['lateral-raise', 3, '12-20'], ['preacher-curl', 2, '10-12'], ['skull-crusher', 2, '10-12']]),
      day('lower-b', 'Lower B', 'Glutes, single leg and abs', [['deadlift', 3, '4-6'], ['bulgarian-split-squat', 3, '8-12'], ['hip-thrust', 3, '8-12'], ['leg-extension', 2, '12-15'], ['calf-raise', 3, '12-20'], ['ab-wheel', 3, '6-12']]),
    ],
  },
  dumbbells: {
    name: 'Upper / Lower with dumbbells',
    days: [
      day('upper-a', 'Upper A', 'Chest, back and arms', [['db-bench-press', 4, '8-12'], ['db-row', 4, '8-12'], ['arnold-press', 3, '8-12'], ['lateral-raise', 3, '12-20'], ['db-curl', 2, '10-12'], ['oh-triceps-extension', 2, '10-12']]),
      day('lower-a', 'Lower A', 'Quads, hamstrings and calves', [['goblet-squat', 4, '8-12'], ['db-rdl', 3, '8-12'], ['bulgarian-split-squat', 3, '8-12'], ['calf-raise', 3, '12-20'], ['crunch', 3, '12-20']]),
      day('upper-b', 'Upper B', 'Shoulders, upper back and arms', [['incline-db-press', 4, '8-12'], ['db-row', 3, '8-12'], ['db-fly', 3, '12-15'], ['rear-delt-fly', 3, '12-20'], ['hammer-curl', 2, '10-12'], ['oh-triceps-extension', 2, '10-12']]),
      day('lower-b', 'Lower B', 'Glutes, single leg and abs', [['db-rdl', 3, '8-12'], ['lunge', 3, '10'], ['goblet-squat', 3, '10-12'], ['calf-raise', 3, '12-20'], ['leg-raise', 3, '10-15']]),
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
  'inverted-row': ['back', 'reps', 5, 30],
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
  'incline-bench-press': ['chest', 'ratio', 0.4, 1.4],
  'incline-db-press': ['chest', 'ratio', 0.15, 0.6],
  'db-fly': ['chest', 'ratio', 0.06, 0.35],
  'cable-fly': ['chest', 'ratio', 0.06, 0.4],
  'parallel-dip': ['chest', 'reps', 3, 30],
  'pull-up': ['back', 'reps', 1, 20],
  'cable-row': ['back', 'ratio', 0.4, 1.2],
  'deadlift': ['hinge', 'ratio', 1.0, 2.75],
  'face-pull': ['shoulders', 'ratio', 0.1, 0.5],
  'shrug': ['back', 'ratio', 0.2, 0.8],
  'cable-lateral-raise': ['shoulders', 'ratio', 0.03, 0.2],
  'arnold-press': ['shoulders', 'ratio', 0.12, 0.45],
  'preacher-curl': ['arms', 'ratio', 0.15, 0.6],
  'cable-curl': ['arms', 'ratio', 0.15, 0.6],
  'skull-crusher': ['arms', 'ratio', 0.15, 0.6],
  'close-grip-bench': ['arms', 'ratio', 0.4, 1.4],
  'front-squat': ['legs', 'ratio', 0.6, 2.0],
  'bulgarian-split-squat': ['legs', 'ratio', 0.1, 0.6],
  'leg-extension': ['legs', 'ratio', 0.3, 1.2],
  'leg-curl': ['hinge', 'ratio', 0.2, 0.9],
  'hack-squat': ['legs', 'ratio', 0.6, 2.5],
  'hanging-leg-raise': ['core', 'reps', 3, 25],
  'ab-wheel': ['core', 'reps', 3, 25],
  'chin-up': ['back', 'reps', 1, 22],
  'machine-chest-press': ['chest', 'ratio', 0.4, 1.5],
  'pec-deck': ['chest', 'ratio', 0.2, 1.0],
  'chest-supported-row': ['back', 'ratio', 0.15, 0.6],
  'db-pullover': ['back', 'ratio', 0.12, 0.5],
  'step-up': ['legs', 'ratio', 0.05, 0.5],
  'single-leg-rdl': ['hinge', 'ratio', 0.1, 0.6],
  'incline-curl': ['arms', 'ratio', 0.05, 0.3],
  'triceps-kickback': ['arms', 'ratio', 0.04, 0.25],
  'cable-crunch': ['core', 'ratio', 0.2, 1.0],
  'side-plank': ['core', 'secs', 15, 120],
  'decline-push-up': ['chest', 'reps', 3, 45],
  'farmer-carry': ['back', 'secs', 20, 90],
  'nordic-curl': ['hinge', 'reps', 1, 15],
};

// Where each exercise can be done. Gym covers everything; dumbbells cover dumbbell and bodyweight.
const DUMBBELL = ['db-bench-press', 'db-shoulder-press', 'db-row', 'db-curl', 'db-rdl', 'lateral-raise', 'hammer-curl',
  'rear-delt-fly', 'goblet-squat', 'lunge', 'oh-triceps-extension', 'incline-db-press', 'db-fly', 'shrug', 'arnold-press', 'bulgarian-split-squat',
  'chest-supported-row', 'db-pullover', 'step-up', 'single-leg-rdl', 'incline-curl', 'triceps-kickback', 'farmer-carry'];
const HOME_ITEMS = ['backpack-curl']; // household objects, no equipment needed
export const placeOf = (id) => (DUMBBELL.includes(id) ? 'dumbbells' : EXERCISES[id].bw || HOME_ITEMS.includes(id) ? 'bodyweight' : 'gym');
export const PLACE_OK = { gym: ['gym', 'dumbbells', 'bodyweight'], dumbbells: ['dumbbells', 'bodyweight'], bodyweight: ['bodyweight'] };
// Big multi-joint lifts go first in a session.
export const COMPOUND = ['bench-press', 'db-bench-press', 'push-up', 'overhead-press', 'db-shoulder-press', 'pike-push-up',
  'lat-pulldown', 'barbell-row', 'db-row', 'inverted-row', 'squat', 'goblet-squat', 'leg-press', 'bw-squat', 'split-squat',
  'lunge', 'romanian-deadlift', 'db-rdl', 'hip-thrust', 'chair-dip', 'incline-bench-press', 'incline-db-press', 'parallel-dip', 'pull-up', 'cable-row', 'deadlift', 'arnold-press', 'close-grip-bench', 'front-squat', 'bulgarian-split-squat', 'hack-squat',
  'chin-up', 'machine-chest-press', 'chest-supported-row', 'step-up', 'single-leg-rdl', 'decline-push-up'];
export const GROUPS = ['chest', 'shoulders', 'back', 'legs', 'hinge', 'arms', 'core'];
