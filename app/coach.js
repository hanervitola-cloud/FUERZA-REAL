// The in-app coach: answers common training questions at any hour, on the phone, without internet.
// It does not "think": it scores every topic against the question (longer phrases count more, small typos are
// forgiven), answers the best one with the person's own numbers, and says so when it is not sure.
// coachReply(text, ctx) returns { text, acts: [{ act, v, label }], link }.

const SLANG = [
  [/ (q|k|ke|qe) /g, ' que '], [/ (xq|pq|porq|xk) /g, ' porque '], [/ pa /g, ' para '], [/ (tmb|tb|tambn) /g, ' tambien '],
  [/ (xfa|porfa|pls) /g, ' por favor '], [/ ante (del|de|la) /g, ' antes $1 '], [/ d /g, ' de '], [/ (kgs|kilos|kilo) /g, ' kg '],
  [/ can t /g, ' cant '], [/ don t /g, ' do not '], [/ i m /g, ' i am '], [/ u /g, ' you '],
];
export const norm = (s) => {
  let x = String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  x = x.replace(/(\d)[.,](\d)/g, '$1_$2').replace(/[^a-z0-9_\s]/g, ' ').replace(/_/g, '.');
  x = ' ' + x.replace(/\s+/g, ' ').trim() + ' ';
  for (let i = 0; i < 2; i++) for (const [re, to] of SLANG) x = x.replace(re, to);
  return x.replace(/\s+/g, ' ').trim();
};

// Topics. keys are matched inside the question (accents removed); the topic with most hits wins.
const KB = [
  { id: 'protein', keys: ['proteina', 'protein', 'whey', 'cuanta carne', 'huevo', 'pollo'], link: '/daily-protein',
    a: (c) => {
      const kg = c.weightKg;
      const lo = kg ? Math.round(kg * 1.6) : null, hi = kg ? Math.round(kg * 2.2) : null;
      return c.es
        ? `Para ganar músculo, apunta a 1,6 a 2,2 g de proteína por kilo de peso al día.${kg ? `\nCon ${Math.round(kg)} kg serían unos ${lo} a ${hi} g al día.` : ''}\nRepártela en 3 o 4 comidas: huevos, pollo, pescado, carne, lácteos, frijoles o lentejas. La proteína en polvo solo es comida práctica, no magia.`
        : `To build muscle, aim for 1.6 to 2.2 g of protein per kilo of bodyweight a day.${kg ? `\nAt ${Math.round(kg)} kg that is about ${lo} to ${hi} g a day.` : ''}\nSplit it over 3 or 4 meals: eggs, chicken, fish, meat, dairy, beans or lentils. Protein powder is just convenient food, not magic.`;
    } },
  { id: 'fat', keys: ['bajar de peso', 'perder peso', 'adelgaz', 'grasa', 'definir', 'definicion', 'deficit', 'lose weight', 'fat loss', 'lose fat', ' cut', 'barriga', 'panza'], link: '/lose-weight',
    a: (c) => c.es
      ? 'Para bajar grasa necesitas comer un poco menos de lo que gastas (un déficit pequeño, unas 300 a 500 calorías menos al día).\n1. Sigue entrenando con pesas para no perder músculo.\n2. Come bastante proteína: te llena y cuida el músculo.\n3. Camina más cada día.\n4. Baja de 0,5 a 1 % de tu peso por semana. Más rápido suele volver.'
      : 'To lose fat you need to eat a little less than you burn (a small deficit, about 300 to 500 calories a day).\n1. Keep lifting so you keep your muscle.\n2. Eat plenty of protein: it fills you up and protects muscle.\n3. Walk more every day.\n4. Lose 0.5 to 1% of your weight a week. Faster usually comes back.' },
  { id: 'gain', keys: ['ganar musculo', 'ganar masa', 'subir de peso', 'volumen', 'crecer', 'hipertrofia', 'build muscle', 'gain muscle', 'bulk', 'gain weight', 'mas grande', 'mas musculo', 'engordar', 'flaco', 'skinny'], link: '/bulking-cutting',
    a: (c) => c.es
      ? 'Para ganar músculo:\n1. Entrena cada músculo 2 veces por semana, de 10 a 20 series por músculo a la semana.\n2. Sube peso o repeticiones poco a poco (la app te lo sugiere en cada ejercicio).\n3. Come un poco más de lo que gastas (unas 200 a 300 calorías extra) y suficiente proteína.\n4. Duerme 7 a 9 horas.\nCon constancia se nota en 2 o 3 meses.'
      : 'To build muscle:\n1. Train each muscle twice a week, 10 to 20 sets per muscle a week.\n2. Add weight or reps little by little (the app suggests it on every exercise).\n3. Eat a bit more than you burn (200 to 300 extra calories) and enough protein.\n4. Sleep 7 to 9 hours.\nWith consistency you will notice it in 2 or 3 months.' },
  { id: 'calories', keys: ['caloria', 'calories', 'kcal', 'cuanto comer', 'cuanto debo comer', 'how much should i eat', 'how much to eat', 'mantenimiento'], link: '/lose-weight',
    a: (c) => c.kcal
      ? (c.es ? `Según tus datos, gastas unas ${c.kcal} calorías al día.\n• Para bajar grasa: unas ${c.kcal - 400}.\n• Para mantenerte: unas ${c.kcal}.\n• Para ganar músculo: unas ${c.kcal + 250}.\nEs una estimación: mira cómo cambia tu peso en 2 o 3 semanas y ajusta.`
        : `From your details you burn about ${c.kcal} calories a day.\n• To lose fat: about ${c.kcal - 400}.\n• To stay the same: about ${c.kcal}.\n• To build muscle: about ${c.kcal + 250}.\nIt is an estimate: watch your weight for 2 or 3 weeks and adjust.`)
      : (c.es ? 'Depende de tu peso, estatura, edad y actividad. Llena tus datos en el Perfil y te digo un número.' : 'It depends on your weight, height, age and activity. Fill in your details in Profile and I will give you a number.') },
  { id: 'creatine', keys: ['creatina', 'creatine'], link: '/creatine-guide',
    a: (c) => c.es
      ? 'La creatina monohidratada es el suplemento más estudiado: ayuda a hacer una o dos repeticiones más y a ganar fuerza.\n• 3 a 5 g al día, cualquier hora, todos los días.\n• No hace falta "cargar" ni descansar de ella.\n• Al principio puedes subir 1 o 2 kg de agua dentro del músculo: es normal.\nSi eres menor de edad o tienes algún problema de salud, habla primero con tus papás y un médico.'
      : 'Creatine monohydrate is the most studied supplement: it helps you do one or two more reps and gain strength.\n• 3 to 5 g a day, any time, every day.\n• No need to "load" it or cycle off.\n• You may gain 1 or 2 kg of water inside the muscle at first: that is normal.\nIf you are under 18 or have a health condition, talk with your parents and a doctor first.' },
  { id: 'supps', keys: ['suplemento', 'supplement', 'pre entreno', 'pre workout', 'preworkout', 'quemador', 'fat burner', 'pastilla', 'pill'], link: '/protein-powder',
    a: (c) => c.es
      ? 'La mayoría de los suplementos no hacen casi nada. Lo que sí sirve, en orden: comida con proteína, dormir bien, entrenar constante. Después, la creatina y la proteína en polvo (por comodidad). Los "quemadores de grasa" no valen la pena.\nSi eres menor de edad, habla con un adulto y un médico antes de tomar cualquier suplemento.'
      : 'Most supplements do almost nothing. What works, in order: food with protein, good sleep, consistent training. After that, creatine and protein powder (for convenience). Fat burners are not worth it.\nIf you are under 18, talk with an adult and a doctor before taking any supplement.' },
  { id: 'steroids', keys: ['esteroide', 'steroid', 'anabolic', 'anabolico', 'testosterona', 'sarms'], link: '/steroids-article',
    a: (c) => c.es
      ? 'No. Los esteroides traen problemas serios al corazón, las hormonas y el ánimo, y lo que ganas se pierde cuando los dejas. Esta app es para progresar natural: más lento, pero tuyo y sin riesgos.'
      : 'No. Steroids bring serious problems for your heart, hormones and mood, and what you gain goes away when you stop. This app is about natural progress: slower, but yours and safe.' },
  { id: 'sleep', keys: ['dormir', 'sueno', 'duermo', 'sleep', 'insomnio', 'cansado todo el dia'], link: '/sleep-recovery',
    a: (c) => c.es
      ? 'El músculo crece mientras descansas. Duerme de 7 a 9 horas (si eres adolescente, mejor 8 a 10).\nTips: misma hora cada noche, cuarto oscuro y fresco, nada de pantalla 30 minutos antes y no cafeína en la tarde.'
      : 'Muscle grows while you rest. Sleep 7 to 9 hours (teenagers, better 8 to 10).\nTips: same time every night, a dark cool room, no screens 30 minutes before, no caffeine in the afternoon.' },
  { id: 'injury', priority: true, keys: ['duele', 'dolor', 'lesion', 'lastim', 'hurt', 'pain', 'injur', 'tendon', 'articulacion', 'joint', 'crujido', 'me torci', 'esguince', 'sprain', 'pecho me aprieta'],
    a: (c) => c.es
      ? 'Ojo con esto:\n• Ardor en el músculo durante la serie o dolor muscular 1 o 2 días después (agujetas): es normal.\n• Dolor punzante, en la articulación, que no te deja moverte o que dura más de una semana: para ese ejercicio y ve con un médico o fisioterapeuta.\n• Mareo, dolor en el pecho o falta de aire: detente ya y busca ayuda.\nYo no puedo revisarte: ante la duda, un profesional.'
      : 'Careful with this:\n• Burning in the muscle during a set, or muscle soreness 1 or 2 days later: normal.\n• Sharp pain, pain in a joint, pain that stops you moving or lasts more than a week: stop that exercise and see a doctor or physio.\n• Dizziness, chest pain or shortness of breath: stop now and get help.\nI cannot examine you: when in doubt, a professional.' },
  { id: 'soreness', keys: ['agujeta', 'adolorido', 'sore', 'doms', 'tieso', 'no me puedo mover despues'], link: '/after-workout-muscles',
    a: (c) => c.es
      ? 'Las agujetas (dolor muscular 1 o 2 días después) son normales, sobre todo al empezar o al cambiar de ejercicios. Bajan solas en 2 a 4 días.\nAyuda: moverte suave, caminar, dormir bien y comer proteína. Puedes entrenar otro músculo mientras tanto. No miden qué tan bueno fue el entrenamiento.'
      : 'Soreness 1 or 2 days later is normal, especially when you start or change exercises. It fades on its own in 2 to 4 days.\nWhat helps: gentle movement, walking, good sleep and protein. You can train another muscle meanwhile. It does not measure how good the workout was.' },
  { id: 'warmup', keys: ['calentar', 'calentamiento', 'warm up', 'warmup', 'estirar antes'],
    a: (c) => c.es
      ? 'Calentamiento de 5 a 8 minutos:\n1. 2 o 3 minutos de algo suave (caminar, saltar la cuerda).\n2. Movimientos de articulaciones: círculos de brazos, cadera, tobillos.\n3. 1 o 2 series ligeras del primer ejercicio antes de las series de verdad.'
      : 'A 5 to 8 minute warm-up:\n1. 2 or 3 minutes of something easy (walking, jump rope).\n2. Joint circles: arms, hips, ankles.\n3. 1 or 2 light sets of your first exercise before the real sets.' },
  { id: 'sets', keys: ['cuantas series', 'cuantas repeticiones', 'series', 'repeticiones', 'reps', 'how many sets', 'how many reps', ' sets'], link: '/hypertrophy-strength',
    a: (c) => c.es
      ? 'Una guía simple:\n• Músculo: 3 o 4 series de 8 a 12 repeticiones, terminando a 1 o 2 repeticiones del fallo.\n• Fuerza: 3 a 5 series de 3 a 6 repeticiones, con más descanso.\n• En total, de 10 a 20 series por músculo a la semana.\nTus rutinas en la app ya vienen con esto armado.'
      : 'A simple guide:\n• Muscle: 3 or 4 sets of 8 to 12 reps, stopping 1 or 2 reps short of failure.\n• Strength: 3 to 5 sets of 3 to 6 reps, with longer rest.\n• In total, 10 to 20 sets per muscle a week.\nYour routines in the app already come set up this way.' },
  { id: 'rest', keys: ['descanso entre', 'descansar entre', 'entre series', 'cuanto descansar', 'cuanto descanso', 'rest between', 'how long to rest', 'minutos de descanso'],
    a: (c) => c.es
      ? 'Entre series:\n• Ejercicios grandes (sentadilla, banca, peso muerto): 2 a 3 minutos.\n• Ejercicios pequeños (curl, laterales): 60 a 90 segundos.\nLa app arranca el temporizador sola cuando anotas una serie.'
      : 'Between sets:\n• Big lifts (squat, bench, deadlift): 2 to 3 minutes.\n• Small lifts (curls, raises): 60 to 90 seconds.\nThe app starts the timer by itself when you log a set.' },
  { id: 'frequency', keys: ['cuantos dias', 'cuantas veces', 'dias a la semana', 'how many days', 'how often', 'todos los dias', 'every day', 'frecuencia'], link: '/beginner-routine',
    a: (c) => c.es
      ? `De 3 a 5 días a la semana está perfecto. Lo importante es poder sostenerlo por meses.${c.days ? `\nTu plan ahora es de ${c.days} días: cúmplelo y ya vas bien.` : ''}\nEntrenar el mismo músculo todos los días no deja que se recupere.`
      : `3 to 5 days a week is perfect. What matters is keeping it up for months.${c.days ? `\nYour plan is ${c.days} days right now: hit that and you are doing well.` : ''}\nTraining the same muscle every day does not let it recover.` },
  { id: 'plateau', keys: ['estancado', 'estanque', 'no avanzo', 'no subo', 'no crezco', 'stuck', 'plateau', 'no progress', 'no veo cambios', 'no veo resultados'], link: '/overtraining-signs',
    a: (c) => c.es
      ? 'Si te estancaste, revisa en este orden:\n1. ¿Duermes 7 a 9 horas?\n2. ¿Comes suficiente proteína y calorías?\n3. ¿Anotas y tratas de ganarle a la vez pasada? (una repetición o 2,5 kg más)\n4. Si llevas semanas igual, haz una semana más ligera (la mitad de series) y vuelve.\nEl progreso no es en línea recta: es normal tener semanas planas.'
      : 'If you are stuck, check in this order:\n1. Do you sleep 7 to 9 hours?\n2. Do you eat enough protein and calories?\n3. Do you log and try to beat last time? (one rep or 5 lb more)\n4. If it has been weeks, do a lighter week (half the sets) and come back.\nProgress is not a straight line: flat weeks are normal.' },
  { id: 'results', keys: ['cuanto tiempo tarda', 'cuanto tiempo para', 'en cuanto tiempo', 'cuando vere', 'cuando se nota', 'resultados', 'when will i see', 'results'],
    a: (c) => c.es
      ? 'Fuerza: la notas en 2 a 4 semanas (primero el cuerpo aprende el movimiento).\nMúsculo visible: de 2 a 3 meses con constancia.\nUn cambio grande: de 6 a 12 meses. Toma una foto hoy y otra en 8 semanas: te vas a sorprender.'
      : 'Strength: you feel it in 2 to 4 weeks (first your body learns the movement).\nVisible muscle: 2 to 3 months with consistency.\nA big change: 6 to 12 months. Take a photo today and another in 8 weeks: you will be surprised.' },
  { id: 'cardio', keys: ['cardio', 'correr', 'running', ' run ', 'bici', 'caminar', 'walk', 'aerobico'],
    a: (c) => c.es
      ? 'El cardio es bueno para el corazón y ayuda a gastar calorías. No te quita músculo si no es excesivo.\n• 2 o 3 sesiones de 20 a 30 minutos a la semana, o caminar 7.000 a 10.000 pasos al día.\n• Si es el mismo día que pesas, mejor después de las pesas.'
      : 'Cardio is good for your heart and helps burn calories. It will not cost you muscle unless it is excessive.\n• 2 or 3 sessions of 20 to 30 minutes a week, or walking 7,000 to 10,000 steps a day.\n• If it is the same day as weights, do it after the weights.' },
  { id: 'abs', keys: ['abdomen', 'abdominal', 'six pack', 'cuadritos', 'sixpack', ' abs', 'oblicuo'], link: '/lose-weight',
    a: (c) => c.es
      ? 'Todos tenemos abdominales: se ven cuando baja la grasa que los cubre. Hacer mil abdominales no quema la grasa de la panza (eso es un mito).\nLo que funciona: comer en un pequeño déficit + entrenar todo el cuerpo + 2 o 3 ejercicios de abdomen por semana (plancha, crunch, elevación de piernas).'
      : 'Everyone has abs: they show when the fat covering them goes down. A thousand crunches do not burn belly fat (that is a myth).\nWhat works: a small calorie deficit + full-body training + 2 or 3 core exercises a week (plank, crunch, leg raise).' },
  { id: 'teen', keys: ['menor de edad', 'adolescente', 'tengo 13', 'tengo 14', 'tengo 15', 'tengo 16', 'tengo 17', 'crecimiento', 'deja de crecer', 'stunt', 'teen', 'i am 15', 'i am 16', 'im 16', 'im 15'],
    a: (c) => c.es
      ? 'Entrenar con pesas no te frena el crecimiento: eso es un mito. Lo importante es la técnica y subir el peso poco a poco, sin buscar tu máximo.\nComida suficiente, dormir 8 a 10 horas y nada de suplementos raros. Si puedes, que alguien con experiencia te vea la técnica al principio.'
      : 'Lifting weights does not stunt your growth: that is a myth. What matters is good technique and adding weight slowly, without chasing max lifts.\nEnough food, 8 to 10 hours of sleep and no weird supplements. If you can, have someone experienced check your form at first.' },
  { id: 'women', keys: ['mujer', 'mujeres', 'muy grande', 'masculina', 'woman', 'women', 'bulky', 'girl'],
    a: (c) => c.es
      ? 'Las mujeres no se ponen "enormes" por levantar pesas: se ponen más fuertes y más firmes. Ganar mucho músculo es lento para todos. Entrena igual de pesado, con buena técnica.'
      : 'Women do not get "huge" from lifting: they get stronger and firmer. Gaining a lot of muscle is slow for everyone. Train just as heavy, with good form.' },
  { id: 'water', keys: [' agua ', 'water', 'hidrat', 'beber', 'litros'],
    a: (c) => c.es
      ? `Toma agua a lo largo del día${c.weightKg ? `: unos ${(c.weightKg * 0.035).toFixed(1).replace('.', ',')} litros con tu peso` : ''}, y un poco más los días que entrenas o hace calor. Si tu orina es clara, vas bien.`
      : `Drink water through the day${c.weightKg ? `: about ${(c.weightKg * 0.035).toFixed(1)} liters at your weight` : ''}, and a bit more on training or hot days. If your pee is light, you are fine.` },
  { id: 'preworkout-food', keys: ['~antes de entrenar', '~antes del entren', '~antes de entren', 'comer antes', 'que como antes', 'comida antes', '~before training', 'before workout', 'pre entrenamiento comida'],
    a: (c) => c.es
      ? 'Come algo 1 a 3 horas antes: algo con carbohidratos y un poco de proteína (arroz con pollo, avena con leche, pan con huevo, una fruta con yogur). Entrenar en ayunas no quema más grasa al final del día.'
      : 'Eat something 1 to 3 hours before: carbs plus a bit of protein (rice and chicken, oats with milk, toast and eggs, fruit and yogurt). Training fasted does not burn more fat by the end of the day.' },
  { id: 'postworkout', keys: ['~despues de entrenar', '~despues del entren', 'post entreno', 'que como despues', '~after training', '~after workout', 'ventana anabolica'], link: '/after-workout-muscles',
    a: (c) => c.es
      ? 'Después de entrenar, come una comida normal con proteína en las siguientes horas. La "ventana anabólica" de 30 minutos es un mito: importa más lo que comes en todo el día.'
      : 'After training, eat a normal meal with protein in the next few hours. The 30-minute "anabolic window" is a myth: what you eat across the whole day matters more.' },
  { id: 'diet', keys: ['dieta', 'que como', 'que comer', 'comida', 'alimentacion', 'diet', 'what to eat', 'meal'], link: '/high-protein-foods',
    a: (c) => c.es
      ? 'Un plato simple para cada comida:\n• Una porción de proteína del tamaño de tu mano (pollo, huevo, carne, pescado, frijoles).\n• Carbohidratos (arroz, papa, pan, avena, fruta), más si entrenas mucho.\n• Verduras.\n• Un poco de grasa buena (aguacate, aceite, nueces).\nNo existe comida prohibida: importa lo que haces la mayoría de los días.'
      : 'A simple plate for each meal:\n• A palm-sized portion of protein (chicken, eggs, meat, fish, beans).\n• Carbs (rice, potatoes, bread, oats, fruit), more if you train a lot.\n• Vegetables.\n• A little healthy fat (avocado, oil, nuts).\nNo food is forbidden: what you do most days matters.' },
  { id: 'home', keys: ['en casa', 'sin equipo', 'sin pesas', 'at home', 'no equipment', 'no gym', 'sin gym', 'sin gimnasio'],
    a: (c) => c.es
      ? 'Se puede ganar mucho en casa. Base: flexiones, sentadillas, zancadas, fondos en una silla, remo invertido debajo de una mesa firme, plancha y puente de glúteos. Para progresar, haz más repeticiones, más lento o versiones más difíciles. En Entrenar puedes cambiar tu plan a "Casa".'
      : 'You can build a lot at home. The basics: push-ups, squats, lunges, chair dips, inverted rows under a sturdy table, plank and glute bridge. To progress, do more reps, go slower or harder versions. In Train you can switch your plan to "Home".' },
  { id: 'stretch', keys: ['estirar', 'estiramiento', 'flexibilidad', 'stretch', 'flexib', 'movilidad', 'mobility'],
    a: (c) => c.es
      ? 'Estirar no evita las agujetas, pero mejora la movilidad. Hazlo al final o en otro momento: 30 segundos por músculo, sin rebotar y sin dolor. Antes de entrenar es mejor un calentamiento en movimiento.'
      : 'Stretching does not prevent soreness, but it improves mobility. Do it at the end or another time: 30 seconds per muscle, no bouncing, no pain. Before training, a moving warm-up is better.' },
  { id: 'breathing', keys: ['respirar', 'respiracion', 'breath', 'breathing'],
    a: (c) => c.es
      ? 'En pesas: toma aire antes de bajar, aguántalo firme en la parte difícil y suéltalo al subir. En boxeo: suelta un poco de aire con cada golpe ("tss").'
      : 'In lifting: breathe in before lowering, brace through the hard part and breathe out as you push up. In boxing: let a bit of air out with each punch ("tss").' },
  { id: 'form', keys: ['tecnica', ' form ', 'technique', 'postura correcta', 'lo estoy haciendo bien'],
    a: (c) => c.es
      ? 'Para cuidar la técnica: usa un peso con el que controles todo el movimiento, baja despacio, recorrido completo, y grábate de lado de vez en cuando. Dime qué ejercicio y te explico cómo se hace paso a paso.'
      : 'To keep good form: use a weight you control through the whole movement, lower slowly, full range, and film yourself from the side now and then. Tell me which exercise and I will explain it step by step.' },
  { id: 'boxing', keys: ['boxeo', 'boxing', 'boxear', 'pelear', 'pelea', 'golpe', 'punch', 'mma', 'artes marciales', 'martial', 'muay thai', 'kickboxing', 'patada', 'kick', 'saco'],
    a: (c) => c.es
      ? 'Para empezar en deportes de combate:\n1. Aprende la guardia y el movimiento de pies.\n2. Luego jab y recto, y únelos en combos (1-2).\n3. Practica en sombra 3 rounds de 2 minutos, 3 veces por semana.\nEn la pestaña Deportes tienes las lecciones con tu personaje, la sombra guiada y los rounds. Para hacer sparring, siempre en un gimnasio con entrenador.'
      : 'To start in combat sports:\n1. Learn the stance and footwork.\n2. Then the jab and cross, and put them together (1-2).\n3. Shadowbox 3 rounds of 2 minutes, 3 times a week.\nThe Sports tab has the lessons with your character, guided shadowboxing and rounds. For sparring, always at a gym with a coach.',
    acts: (c) => [{ act: 'go', v: 'sports', label: c.es ? 'Ir a Deportes' : 'Open Sports' }] },
  { id: 'app', keys: ['rango', 'puntos', 'puntaje', 'rank', 'score', 'points', 'como funciona la app', 'how does the app'],
    a: (c) => c.es
      ? `Tu puntaje (${c.score} de 100) mezcla tu fuerza comparada con tu peso (75 %) y tu constancia: semanas en que cumples tu meta de días (25 %). Sube de rango levantando un poco más y entrenando seguido.`
      : `Your score (${c.score} out of 100) mixes your strength compared with your bodyweight (75%) and your consistency: weeks you hit your day goal (25%). Rank up by lifting a little more and training often.`,
    acts: (c) => [{ act: 'go', v: 'rank', label: c.es ? 'Ver mi progreso' : 'See my progress' }] },
  { id: 'routine', keys: ['rutina', 'routine', 'programa', 'plan de entrenamiento', 'workout plan', 'que entreno hoy', 'what should i train'],
    a: (c) => c.es
      ? `Tu plan te dice qué toca hoy${c.nextDay ? `: ${c.nextDay}` : ''}. Si quieres algo distinto, toca el botón rojo de abajo (Rutina) y arma la tuya eligiendo los músculos.`
      : `Your plan tells you what is next${c.nextDay ? `: ${c.nextDay}` : ''}. If you want something else, tap the red button below (Routine) and build your own by picking muscles.`,
    acts: (c) => [{ act: 'go', v: 'home', label: c.es ? 'Ver el de hoy' : "See today's" }] },
  { id: 'alcohol', keys: ['alcohol', 'cerveza', 'beer', 'fiesta', 'party'],
    a: (c) => c.es
      ? 'El alcohol empeora el sueño y la recuperación, y quita ganas de entrenar al día siguiente. Si eres menor de edad, no tomes. Si eres adulto, mientras menos, mejor para tus resultados.'
      : 'Alcohol hurts your sleep and recovery, and kills the drive to train the next day. If you are under the legal age, do not drink. If you are an adult, less is better for your results.' },
];

// New topics for the coach (round 2). Each: id, keys (word starts, no accents; a trailing space = whole word),
// q = an example question [en, es] (used for "related" and "did you mean" buttons), a = answer (c) => text.
const T = (en, es) => (c) => (c.es ? es : en);
const MORE = [
  { id: 'strength', keys: ['mas fuerte', 'ganar fuerza', 'subir fuerza', 'fuerza ', 'stronger', 'get strong', 'build strength'],
    q: ['How do I get stronger?', '¿Cómo me hago más fuerte?'],
    a: (c) => c.es
      ? `Para ser más fuerte:\n1. Ejercicios grandes: sentadilla, press de banca, peso muerto, dominadas y press militar.\n2. De 3 a 5 series de 3 a 6 repeticiones, descansando 2 a 3 minutos.\n3. Súbele un poco cada semana: la app te dice cuánto en cada ejercicio.\n4. Proteína y sueño: sin eso no hay fuerza nueva.\nTu rango en la app mide justo eso: tu fuerza comparada con tu peso.${c.age && c.age < 18 ? '\nComo eres menor de edad, mejor 5 a 8 repeticiones bien hechas que buscar tu máximo.' : ''}`
      : `To get stronger:\n1. Big lifts: squat, bench press, deadlift, pull-ups and overhead press.\n2. 3 to 5 sets of 3 to 6 reps, resting 2 to 3 minutes.\n3. Add a little every week: the app tells you how much on each exercise.\n4. Protein and sleep: without them there is no new strength.\nYour rank in the app measures exactly that: your strength compared with your bodyweight.${c.age && c.age < 18 ? '\nSince you are under 18, 5 to 8 clean reps beat chasing your max.' : ''}` },
  { id: 'electrolytes', keys: ['sal ', 'sales', 'sodio', 'electrolit', 'suero', 'isotonic', 'potasio', 'agua con sal', 'pizca de sal', 'bebida deportiva', 'salt', 'sodium', 'electrolyte', 'sports drink'],
    q: ['Should I drink water with salt before training?', '¿Tomar agua con sal antes de entrenar sirve?'],
    a: T(`A pinch of salt in your water before training is fine and can help if you sweat a lot, train more than an hour or it is very hot: it replaces the sodium you lose in sweat and can help you feel less tired and avoid cramps.\nFor a normal one-hour session, plain water plus your usual food (which already has salt) is enough.\nIf you do it: about 1/4 teaspoon of salt in 500 to 750 ml of water. Do not overdo it. If you have high blood pressure or kidney problems, ask a doctor first.`,
      `Una pizca de sal en el agua antes de entrenar no hace daño y puede ayudar si sudas mucho, entrenas más de una hora o hace mucho calor: repone el sodio que pierdes con el sudor y puede ayudarte a sentirte con más energía y evitar calambres.\nPara un entrenamiento normal de una hora, con agua normal y tu comida de siempre (que ya trae sal) es suficiente.\nSi lo haces: más o menos 1/4 de cucharadita de sal en 500 a 750 ml de agua. No exageres. Si tienes presión alta o problemas de riñón, pregúntale primero a un médico.`) },
  { id: 'caffeine', keys: ['cafe ', 'cafeina', 'cafecito', 'bebida energetica', 'energizante', 'energetica', 'coffee', 'caffeine', 'energy drink'],
    q: ['Is coffee good before training?', '¿El café antes de entrenar sirve?'],
    a: (c) => c.es
      ? `La cafeína sí ayuda a rendir un poco más (más energía y enfoque) si la tomas 30 a 60 minutos antes. Un café normal basta.\n• No la tomes en la tarde o noche: te quita sueño, y el sueño vale más.\n• Las bebidas energéticas traen mucha azúcar y cafeína junta: mejor no.${c.age && c.age < 18 ? '\n• Como eres menor de edad, lo mejor es evitar la cafeína fuerte y las energéticas.' : ''}`
      : `Caffeine does help you perform a bit better (more energy and focus) if you take it 30 to 60 minutes before. A normal coffee is enough.\n• Do not take it in the afternoon or evening: it costs you sleep, and sleep matters more.\n• Energy drinks pack a lot of sugar and caffeine together: better not.${c.age && c.age < 18 ? '\n• Since you are under 18, it is best to avoid strong caffeine and energy drinks.' : ''}` },
  { id: 'cramps', keys: ['calambre', 'acalambr', 'se me tensa', 'cramp'],
    q: ['Why do I get cramps?', '¿Por qué me dan calambres?'],
    a: T(`Cramps usually come from fatigue in a muscle that is not used to the work, plus not enough water or salt when you sweat a lot.\nWhat helps: drink water during the day, add a pinch of salt if you sweat a lot, warm up, and increase the work little by little. When it happens, stretch that muscle gently until it lets go.\nIf they happen often, at rest or at night, tell a doctor.`,
      `Los calambres suelen venir del cansancio de un músculo que no está acostumbrado al esfuerzo, y de poca agua o sal cuando sudas mucho.\nLo que ayuda: tomar agua durante el día, una pizca de sal si sudas mucho, calentar y subir el esfuerzo poco a poco. Cuando te dé, estira ese músculo suave hasta que se suelte.\nSi te pasan seguido, en reposo o de noche, díselo a un médico.`) },
  { id: 'sugar', keys: ['azucar', 'dulce', 'postre', 'chocolate', 'refresco', 'gaseosa', 'soda ', 'golosina', 'sugar', 'candy', 'sweets', 'dessert'],
    q: ['Can I eat sweets?', '¿Puedo comer dulces?'],
    a: T(`You can, in small amounts. The problem is not one dessert, it is soda and sweets every day: lots of calories that do not fill you up.\nSimple rule: most of what you eat should be real food (protein, rice, potatoes, fruit, vegetables). Leave sweets for a treat, and swap soda for water.`,
      `Puedes, en poca cantidad. El problema no es un postre, es el refresco y los dulces todos los días: muchas calorías que no te llenan.\nRegla simple: casi todo lo que comas que sea comida de verdad (proteína, arroz, papa, fruta, verduras). Deja los dulces para un gusto de vez en cuando y cambia el refresco por agua.`) },
  { id: 'junk', keys: ['comida chatarra', 'chatarra', 'comida rapida', 'hamburguesa', 'pizza', 'cheat', 'dia libre', 'comida trampa', 'junk food', 'fast food'],
    q: ['Can I have a cheat meal?', '¿Puedo tener una comida libre?'],
    a: T(`One free meal a week does not ruin anything. What ruins progress is a free weekend every weekend.\nEnjoy it, without guilt, and go back to normal at the next meal. If you are losing fat, keep it to one meal, not a whole day.`,
      `Una comida libre a la semana no arruina nada. Lo que frena el progreso es un fin de semana libre todos los fines de semana.\nDisfrútala sin culpa y vuelve a lo normal en la siguiente comida. Si estás bajando grasa, que sea una comida, no un día completo.`) },
  { id: 'carbs', keys: ['carbohidrato', 'carbo', 'harina', 'arroz', 'pan engorda', 'comer de noche', 'cenar', 'cena ', 'carbs', 'carbohydrate', 'eat at night', 'late night'],
    q: ['Are carbs bad at night?', '¿Los carbohidratos en la noche engordan?'],
    a: T(`Carbs do not make you fat by themselves, not even at night. What counts is the total you eat in the day.\nCarbs are your fuel for training: rice, potatoes, oats, bread, fruit. Eat more on training days, a bit less if you are losing fat. Eating dinner late is fine.`,
      `Los carbohidratos no engordan por sí solos, tampoco en la noche. Lo que cuenta es el total que comes en el día.\nSon tu gasolina para entrenar: arroz, papa, avena, pan, fruta. Come más los días que entrenas y un poco menos si estás bajando grasa. Cenar tarde está bien.`) },
  { id: 'eggs', keys: ['huevos al dia', 'cuantos huevos', 'huevo ', 'huevos', 'colesterol', 'eggs', 'cholesterol'],
    q: ['How many eggs a day?', '¿Cuántos huevos puedo comer al día?'],
    a: T(`For a healthy person, 2 to 4 eggs a day is fine: cheap, filling and great protein (about 6 g per egg). The cholesterol in eggs barely changes the cholesterol in your blood for most people. If you have a cholesterol problem, ask your doctor.`,
      `Para una persona sana, 2 a 4 huevos al día está bien: baratos, llenan y son proteína de calidad (unos 6 g por huevo). El colesterol del huevo casi no cambia el de tu sangre en la mayoría de la gente. Si tienes problemas de colesterol, pregúntale a tu médico.`) },
  { id: 'veg', keys: ['vegetarian', 'vegano', 'vegan', 'sin carne', 'no como carne', 'proteina vegetal', 'plant protein', 'no meat'],
    q: ['Can I build muscle without meat?', '¿Se puede ganar músculo sin comer carne?'],
    a: T(`Yes. You need the same total protein, from other sources: beans, lentils, chickpeas, tofu, soy, eggs and dairy if you eat them, nuts. Mix several in the day and eat a bit more protein overall (about 2 g per kilo).`,
      `Sí. Necesitas la misma proteína total, de otras fuentes: frijoles, lentejas, garbanzos, tofu, soya, huevo y lácteos si los comes, y frutos secos. Mezcla varias en el día y come un poco más de proteína en total (unos 2 g por kilo).`) },
  { id: 'meals', keys: ['cuantas comidas', 'cada cuantas horas', 'desayun', 'saltarme el desayuno', 'comidas al dia', 'meals a day', 'breakfast', 'how often should i eat'],
    q: ['How many meals a day?', '¿Cuántas comidas al día?'],
    a: T(`Eat the number of meals that fits your life: 3 or 4 is easy for most people. What matters is the total food and protein in the day. Skipping breakfast is fine if you eat well later, but try to have protein in each meal.`,
      `Come las comidas que te queden cómodas: 3 o 4 le funcionan a casi todos. Lo que importa es la comida y la proteína total del día. Saltarte el desayuno está bien si después comes bien, pero trata de tener proteína en cada comida.`) },
  { id: 'fasting', keys: ['ayuno', 'en ayunas', 'ayunar', 'intermittent', 'fasting', 'fasted'],
    q: ['Is intermittent fasting good?', '¿El ayuno intermitente sirve?'],
    a: (c) => c.es
      ? `El ayuno intermitente sirve si te ayuda a comer menos, pero no quema más grasa por arte de magia: al final cuenta lo que comes en el día.\nEntrenar en ayunas tampoco quema más grasa al final del día y puede bajar tu rendimiento.${c.age && c.age < 18 ? '\nComo estás creciendo, no te recomiendo ayunar: necesitas comer bien todos los días.' : ''}`
      : `Intermittent fasting works if it helps you eat less, but it does not burn extra fat by magic: what you eat in the day is what counts.\nTraining fasted does not burn more fat by the end of the day either, and it can lower your performance.${c.age && c.age < 18 ? '\nSince you are still growing, I do not recommend fasting: you need to eat well every day.' : ''}` },
  { id: 'nightprotein', keys: ['antes de dormir', 'caseina', 'before bed', 'casein'],
    q: ['Should I eat protein before bed?', '¿Sirve comer proteína antes de dormir?'],
    a: T(`A meal with protein before bed (milk, yogurt, eggs, cottage cheese) can help a little with recovery, especially if you did not eat enough protein in the day. It does not make you fat. It is optional, not magic.`,
      `Una comida con proteína antes de dormir (leche, yogur, huevo, queso) puede ayudar un poco a recuperarte, sobre todo si en el día no comiste suficiente proteína. No engorda. Es opcional, no magia.`) },
  { id: 'vitamins', keys: ['vitamina', 'multivitamin', 'omega', 'magnesio', 'zinc', 'hierro', 'vitamin', 'magnesium', 'fish oil'],
    q: ['Do I need vitamins?', '¿Necesito tomar vitaminas?'],
    a: T(`If you eat varied food (fruit, vegetables, protein), you probably do not need pills. Vitamin D can help if you get little sun, and omega-3 if you eat little fish, but it is better to check with a doctor, who can test you.\nPills do not replace food, sleep or training.`,
      `Si comes variado (fruta, verduras, proteína), probablemente no necesitas pastillas. La vitamina D puede ayudar si te da poco el sol, y el omega 3 si comes poco pescado, pero es mejor que lo vea un médico, que te puede hacer exámenes.\nLas pastillas no reemplazan la comida, el sueño ni el entrenamiento.`) },
  { id: 'useless-supps', keys: ['bcaa', 'aminoacido', 'glutamina', 'gainer', 'ganador de peso', 'colageno', 'termogenico', 'booster', 'amino', 'glutamine', 'collagen', 'mass gainer'],
    q: ['Are BCAAs worth it?', '¿Sirven los aminoácidos o la glutamina?'],
    a: T(`Mostly no. If you eat enough protein, amino acids (BCAAs) and glutamine add nothing. Mass gainers are mostly sugar: a homemade shake with milk, oats, banana and peanut butter does the same for less. Save your money for food.`,
      `Casi siempre no. Si comes suficiente proteína, los aminoácidos (BCAA) y la glutamina no suman nada. Los "ganadores de peso" son casi todo azúcar: un batido casero de leche, avena, plátano y crema de maní hace lo mismo por menos. Guarda tu dinero para comida.`) },
  { id: 'sick', keys: ['enfermo', 'gripe', 'resfriado', 'resfrio', 'fiebre', 'tos ', 'covid', 'sick', 'flu ', 'a cold', 'fever'],
    q: ['Can I train when I am sick?', '¿Puedo entrenar si estoy enfermo?'],
    a: T(`Simple rule: if it is only above the neck (a runny nose, a mild cold) and you feel OK, you can do a light workout. If you have fever, body aches, chest congestion or feel bad: rest until you are well. One week off does not make you lose your progress.`,
      `Regla simple: si es solo de cuello para arriba (mocos, un resfriado leve) y te sientes bien, puedes hacer algo ligero. Si tienes fiebre, dolor de cuerpo, pecho congestionado o te sientes mal: descansa hasta estar bien. Una semana sin entrenar no te hace perder tu progreso.`) },
  { id: 'restday', keys: ['dia de descanso', 'dias de descanso', 'descansar un dia', 'recuperacion activa', 'puedo entrenar dos dias seguidos', 'rest day', 'active recovery', 'day off'],
    q: ['What should I do on rest days?', '¿Qué hago los días de descanso?'],
    a: T(`Rest days are when you grow. Walk, stretch, play a sport for fun, sleep well and eat your protein. You can train two days in a row if the muscles are different (for example, upper body one day and legs the next).`,
      `Los días de descanso son cuando creces. Camina, estira, juega algún deporte por diversión, duerme bien y come tu proteína. Puedes entrenar dos días seguidos si son músculos distintos (por ejemplo, torso un día y pierna al siguiente).`) },
  { id: 'overtraining', keys: ['sobreentren', 'overtrain', 'descarga', 'deload', 'semana ligera', 'quemado', 'burnout', 'siempre cansado'],
    q: ['Am I overtraining?', '¿Estoy sobreentrenado?'],
    a: T(`Real overtraining is rare; usually it is too little sleep or food. Signs: you feel tired for weeks, your lifts go down, you sleep badly and have no motivation.\nFix: one lighter week (fewer sets, same weights), sleep more, eat enough. Your plan already includes a lighter week at the end of each 4-week block.`,
      `El sobreentrenamiento de verdad es raro; casi siempre es poco sueño o poca comida. Señales: cansancio por semanas, tus pesos bajan, duermes mal y no tienes ganas.\nSolución: una semana más ligera (menos series, mismos pesos), dormir más y comer suficiente. Tu plan ya trae una semana más suave al final de cada bloque de 4 semanas.`) },
  { id: 'failure', keys: ['al fallo', 'hasta el fallo', 'fallo muscular', 'to failure', 'failure'],
    q: ['Should I train to failure?', '¿Debo llegar al fallo?'],
    a: T(`You do not need to reach failure on every set. The sweet spot is to stop 1 or 2 reps before you could not do another one. Going to failure now and then on small exercises (curls, raises) is fine; on squats, bench or deadlifts it is riskier and tires you more.`,
      `No hace falta llegar al fallo en cada serie. Lo ideal es parar 1 o 2 repeticiones antes de no poder más. Llegar al fallo de vez en cuando en ejercicios pequeños (curl, laterales) está bien; en sentadilla, banca o peso muerto es más riesgoso y te cansa más.`) },
  { id: 'overload', keys: ['sobrecarga', 'progresar', 'cuando subir', 'subir de peso en', 'subir el peso', 'aumentar peso', 'progressive overload', 'add weight', 'progress faster'],
    q: ['When should I add weight?', '¿Cuándo debo subirle peso?'],
    a: T(`Use double progression: pick a range like 8 to 12 reps. When you can do 12 on every set with good form, add the smallest jump (2.5 kg on a bar, 1 or 2 kg on dumbbells) and start again from 8.\nThe app does this for you: on each exercise it tells you what to try today.`,
      `Usa la doble progresión: elige un rango, por ejemplo 8 a 12 repeticiones. Cuando hagas 12 en todas las series con buena técnica, sube el salto más pequeño (2,5 kg en barra, 1 o 2 kg en mancuernas) y vuelve a empezar desde 8.\nLa app lo hace por ti: en cada ejercicio te dice qué intentar hoy.`) },
  { id: 'startweight', keys: ['cuanto peso', 'que peso', 'peso debo', 'peso inicial', 'cuantos kilos', 'how much weight', 'what weight', 'how heavy'],
    q: ['How much weight should I use?', '¿Cuánto peso debo usar?'],
    a: (c) => {
      const b = c.ex && c.best ? c.best(c.ex.id) : 0;
      const nm = c.ex ? c.ex.names[c.es ? 1 : 0] : '';
      const mine = c.ex && b && !c.ex.bw
        ? (c.es ? `\nCon tus marcas en ${nm}, para series de 8 a 12 usa unos ${c.fmtW(b * 0.7)} ${c.unit}.` : `\nFrom your logs in ${nm}, for sets of 8 to 12 use about ${c.fmtW(b * 0.7)} ${c.unit}.`)
        : '';
      return c.es
        ? `Usa un peso con el que hagas las repeticiones con buena técnica y te queden 1 o 2 en reserva. Si haces todas fácil, súbele; si la técnica se rompe, bájale.${mine}\nAl empezar, mejor quedarte corto: la primera semana es para aprender el movimiento.`
        : `Use a weight you can lift for the reps with good form, with 1 or 2 left in the tank. If all are easy, add weight; if form breaks, take some off.${mine}\nWhen starting out, go lighter: the first week is for learning the movement.`;
    } },
  { id: 'max', keys: ['1rm', 'maximo', 'mi maximo', 'una repeticion maxima', 'one rep max', 'max out'],
    q: ['How do I know my max?', '¿Cómo sé mi peso máximo?'],
    a: (c) => c.es
      ? `No necesitas probar tu máximo real para saberlo: la app lo calcula con tus series (por ejemplo, 60 kg × 8 equivale a unos 76 kg a una repetición). Mira Entrenar → Herramientas → Máximo estimado.${c.age && c.age < 18 ? '\nComo eres menor de edad, mejor no probar máximos reales: es donde más lesiones pasan.' : '\nSi quieres probarlo de verdad, que sea con alguien que te cuide y con los seguros puestos.'}`
      : `You do not need to test your real max to know it: the app estimates it from your sets (for example, 60 kg × 8 is about 76 kg for one rep). See Train → Tools → One-rep max.${c.age && c.age < 18 ? '\nSince you are under 18, better not to test real maxes: that is where most injuries happen.' : '\nIf you want to test it for real, have someone spot you and use the safety bars.'}`,
    acts: (c) => [{ act: 'orm', v: '', label: c.es ? 'Calcular mi máximo' : 'Estimate my max' }] },
  { id: 'split', keys: ['split', 'rutina dividida', 'full body', 'cuerpo completo', 'torso pierna', 'torso y pierna', 'push pull', 'ppl', 'weider', 'upper lower', 'bro split', 'un musculo por dia'],
    q: ['Full body or split?', '¿Cuerpo completo o rutina dividida?'],
    a: T(`All of them work if you train each muscle about twice a week:\n• 2 or 3 days: full body.\n• 4 or 5 days: upper / lower.\n• 6 days: push / pull / legs.\nOne muscle per day (once a week) works worse for most people. In Train → Your plan → Adjust you can pick the type and the app builds it.`,
      `Todas funcionan si entrenas cada músculo unas 2 veces por semana:\n• 2 o 3 días: cuerpo completo.\n• 4 o 5 días: torso / pierna.\n• 6 días: empuje / jalón / pierna.\nUn músculo por día (una vez a la semana) le funciona peor a la mayoría. En Entrenar → Tu plan → Ajustar eliges el tipo y la app la arma.`),
    acts: (c) => [{ act: 'programs', v: '', label: c.es ? 'Ajustar mi plan' : 'Adjust my plan' }] },
  { id: 'duration', keys: ['cuanto tiempo entren', 'cuanto tiempo debo entren', 'tiempo debo entren', 'cuanto tiempo al dia', 'cuanto debe durar', 'cuanto dura', 'dos horas', '2 horas', 'una hora', 'how long should i train', 'how long should a workout', 'how long to train'],
    q: ['How long should I train?', '¿Cuánto tiempo debo entrenar?'],
    a: T(`45 to 75 minutes is plenty. Past that, quality drops and you recover worse. If you have more time, it is better to add a day than to make one session very long.`,
      `De 45 a 75 minutos es suficiente. Más que eso, baja la calidad y te recuperas peor. Si tienes más tiempo, mejor agrega un día que hacer una sesión larguísima.`) },
  { id: 'time', keys: ['manana o noche', 'mañana o tarde', 'a que hora', 'que hora es mejor', 'hora para entrenar', 'morning or night', 'best time to train', 'what time'],
    q: ['Is it better to train in the morning or at night?', '¿Es mejor entrenar en la mañana o en la noche?'],
    a: T(`The best time is the one you can keep. Results are the same morning or night. If you train late, avoid caffeine after the afternoon so you sleep well.`,
      `La mejor hora es la que puedas cumplir siempre. Los resultados son iguales en la mañana o en la noche. Si entrenas tarde, evita la cafeína después de la tarde para dormir bien.`) },
  { id: 'cardio-order', keys: ['cardio antes', 'cardio despues', 'antes o despues de las pesas', 'cardio before', 'cardio after'],
    q: ['Cardio before or after weights?', '¿Cardio antes o después de las pesas?'],
    a: T(`If your goal is muscle or strength: weights first, cardio after (or on another day). A short 5-minute easy cardio as a warm-up before is fine.`,
      `Si tu meta es músculo o fuerza: primero pesas y después cardio (o en otro día). Unos 5 minutos de cardio suave para calentar antes está bien.`) },
  { id: 'hiit', keys: ['hiit', 'intervalo', 'tabata', 'sprint'],
    q: ['Is HIIT better than normal cardio?', '¿El HIIT es mejor que el cardio normal?'],
    a: T(`HIIT (short hard bursts with rests) saves time and improves fitness, but it is tiring: 1 or 2 times a week is enough. For fat loss it is not magic: walking every day works just as well and does not hurt your leg training.`,
      `El HIIT (ráfagas cortas y fuertes con descansos) ahorra tiempo y mejora tu condición, pero cansa: con 1 o 2 veces por semana basta. Para bajar grasa no es magia: caminar todos los días funciona igual y no afecta tu entrenamiento de pierna.`) },
  { id: 'firstpullup', keys: ['no puedo hacer dominadas', 'no puedo hacer una dominada', 'ni una dominada', 'no me salen las dominadas', 'primera dominada', 'no me sale la dominada', 'cant do a pull up', 'first pull up', 'cant do pull ups'],
    q: ['I cannot do a pull-up yet', 'No puedo hacer ni una dominada'],
    a: T(`Normal at the start. Path to your first pull-up:\n1. Inverted rows under a bar or sturdy table.\n2. Slow negatives: jump up and lower yourself in 5 seconds, 3 to 5 reps.\n3. Hang from the bar as long as you can.\n4. Lat pulldown if you have a gym.\nDo it 2 or 3 times a week: most people get the first one in 4 to 8 weeks.`,
      `Es normal al empezar. Camino a tu primera dominada:\n1. Remo invertido debajo de una barra o mesa firme.\n2. Negativas lentas: salta arriba y baja en 5 segundos, 3 a 5 repeticiones.\n3. Colgarte de la barra lo más que aguantes.\n4. Jalón al pecho si tienes gimnasio.\nHazlo 2 o 3 veces por semana: casi todos sacan la primera en 4 a 8 semanas.`),
    acts: (c) => [{ act: 'ex', v: 'inverted-row', label: c.es ? 'Remo invertido' : 'Inverted row' }, { act: 'ex', v: 'pull-up', label: c.es ? 'Dominadas' : 'Pull-ups' }] },
  { id: 'firstpushup', keys: ['no puedo hacer flexiones', 'ni una flexion', 'no puedo hacer lagartijas', 'no me salen las flexiones', 'flexiones de rodillas', 'cant do push ups', 'cant do a push up'],
    q: ['I cannot do push-ups yet', 'No puedo hacer flexiones'],
    a: T(`Start with incline push-ups: hands on a table or a wall, body straight. When you can do 15, use something lower. Then knees on the floor, then full push-ups. Also do slow negatives: lower yourself in 3 to 5 seconds.`,
      `Empieza con flexiones inclinadas: manos en una mesa o en la pared y el cuerpo recto. Cuando hagas 15, usa algo más bajo. Después con rodillas en el piso y luego las normales. También haz negativas lentas: baja en 3 a 5 segundos.`),
    acts: (c) => [{ act: 'ex', v: 'push-up', label: c.es ? 'Flexiones' : 'Push-ups' }] },
  { id: 'recomp', keys: ['recomposicion', 'skinny fat', 'flaco con panza', 'delgado con grasa', 'ganar musculo y perder grasa', 'bajar grasa y ganar musculo', 'recomp', 'lose fat and build muscle'],
    q: ['Can I lose fat and build muscle at the same time?', '¿Puedo bajar grasa y ganar músculo al mismo tiempo?'],
    a: T(`Yes, especially if you are a beginner or "skinny fat". Recipe: lift weights 3 or 4 times a week, eat at maintenance or a tiny deficit, lots of protein (about 2 g per kilo) and sleep well. The scale may barely move while you look better: use photos and your lifts to measure.`,
      `Sí, sobre todo si eres principiante o "flaco con panza". La receta: pesas 3 o 4 veces por semana, comer lo que gastas o apenas un poquito menos, mucha proteína (unos 2 g por kilo) y dormir bien. La báscula casi no se mueve mientras te ves mejor: mide con fotos y con tus pesos.`) },
  { id: 'scale', keys: ['bascula', 'balanza', 'me peso', 'subi de peso de un dia', 'peso sube y baja', 'retencion de liquidos', 'scale', 'weight goes up', 'water weight'],
    q: ['Why does my weight go up and down?', '¿Por qué mi peso sube y baja?'],
    a: T(`Your weight moves 1 or 2 kg from day to day from water, salt, food in your stomach and sleep. Weigh yourself in the morning, after the bathroom, and look at the weekly average, not one day. In Progress → Body the app draws the trend.`,
      `Tu peso cambia 1 o 2 kg de un día a otro por agua, sal, comida en el estómago y el sueño. Pésate en la mañana, después de ir al baño, y mira el promedio de la semana, no un día. En Progreso → Cuerpo la app te dibuja la tendencia.`) },
  { id: 'bodyfat', keys: ['porcentaje de grasa', 'grasa corporal', 'imc', 'bmi', 'body fat', 'medir grasa'],
    q: ['How do I measure my body fat?', '¿Cómo mido mi grasa corporal?'],
    a: T(`Simple and good enough: weekly photos in the same light, your waist measured with a tape at the belly button, and your weight trend. BMI does not know if your weight is muscle or fat, and home scales that "measure fat" are not very accurate.`,
      `Lo simple funciona: fotos cada semana con la misma luz, la medida de tu cintura con una cinta a la altura del ombligo y la tendencia de tu peso. El IMC no sabe si tu peso es músculo o grasa, y las básculas que "miden grasa" no son muy exactas.`) },
  { id: 'natty-t', keys: ['subir testosterona', 'testosterona natural', 'aumentar testosterona', 'boost testosterone', 'natural testosterone', 'raise testosterone'],
    q: ['How do I raise my testosterone naturally?', '¿Cómo subo mi testosterona natural?'],
    a: T(`The natural way: sleep 7 to 9 hours, lift weights, eat enough (including healthy fats), stay at a healthy weight and move every day. "Testosterone booster" pills barely do anything. If you have real symptoms, a doctor can test you.`,
      `La forma natural: dormir 7 a 9 horas, entrenar con pesas, comer suficiente (incluyendo grasas buenas), mantener un peso sano y moverte todos los días. Las pastillas "para subir la testosterona" casi no hacen nada. Si tienes síntomas de verdad, un médico te puede hacer exámenes.`) },
  { id: 'discipline', keys: ['disciplina', 'constancia', 'constante', 'habito', 'no soy constante', 'dejo de ir', 'siempre lo dejo', 'consistency', 'discipline', 'habit', 'i always quit'],
    q: ['How do I stay consistent?', '¿Cómo soy más constante?'],
    a: (c) => c.es
      ? `La constancia se construye, no se tiene:\n1. Pon días y hora fijos, como una cita.\n2. Baja la meta: mejor 3 días que cumples que 6 que dejas.\n3. Si un día no puedes, haz 15 minutos: no rompas la racha.\n4. Mira tu progreso: cada semana que cumples suma.${c.streak ? `\nLlevas ${c.streak} semanas seguidas. No la rompas.` : ''}`
      : `Consistency is built, not born:\n1. Set fixed days and times, like an appointment.\n2. Lower the bar: 3 days you keep beat 6 you drop.\n3. On a bad day, do 15 minutes: do not break the streak.\n4. Watch your progress: every week you keep counts.${c.streak ? `\nYou are on a ${c.streak}-week streak. Keep it.` : ''}` },
  { id: 'beginner', keys: ['principiante', 'empezar en el gym', 'primer dia', 'primera vez', 'nunca he entrenado', 'como empiezo', 'quiero empezar', 'beginner', 'first day', 'never trained', 'how do i start'],
    q: ['I am a beginner, where do I start?', 'Soy principiante, ¿por dónde empiezo?'],
    a: (c) => c.es
      ? `Bienvenido. Para empezar bien:\n1. Sigue tu plan de la app (${c.days || 3} días por semana): ya trae los mejores ejercicios.\n2. La primera semana, pesos ligeros para aprender la técnica (mira la animación de cada ejercicio).\n3. Anota todo: la app te dice cuánto subir la próxima vez.\n4. Proteína en cada comida y dormir bien.\nEn 4 semanas vas a notar la fuerza.`
      : `Welcome. To start well:\n1. Follow your plan in the app (${c.days || 3} days a week): it already has the best exercises.\n2. First week, light weights to learn the form (watch each exercise's animation).\n3. Log everything: the app tells you how much to add next time.\n4. Protein in every meal and good sleep.\nIn 4 weeks you will feel stronger.`,
    acts: (c) => [{ act: 'go', v: 'train', label: c.es ? 'Ver mi plan' : 'See my plan' }] },
  { id: 'gymfear', keys: ['pena ir al gym', 'verguenza', 'me da pena', 'me miran', 'miedo al gym', 'gym anxiety', 'embarrassed', 'people stare'],
    q: ['I feel embarrassed at the gym', 'Me da pena ir al gimnasio'],
    a: T(`Almost everyone felt that at the start. The truth: people at the gym are thinking about their own workout, not about you. Tips: go at quieter hours, bring your plan in the app so you know exactly what to do, and start with machines and dumbbells. In 2 or 3 weeks it feels normal.`,
      `Casi todos lo sentimos al empezar. La verdad: en el gimnasio cada quien está pensando en su entrenamiento, no en ti. Consejos: ve en horas más tranquilas, lleva tu plan en la app para saber exactamente qué hacer y empieza con máquinas y mancuernas. En 2 o 3 semanas se siente normal.`) },
  { id: 'posture', keys: ['postura', 'joroba', 'encorvado', 'hombros adelante', 'hombros caidos', 'posture', 'hunchback', 'rounded shoulders'],
    q: ['How do I fix my posture?', '¿Cómo mejoro mi postura?'],
    a: T(`Train your back as much as your chest: rows, face pulls, rear-delt flys and pull-ups. Move often if you sit a lot, and stretch your chest in a doorway. Posture improves when the back gets stronger, not by forcing it all day.`,
      `Entrena la espalda tanto como el pecho: remos, face pulls, aperturas posteriores y dominadas. Muévete seguido si pasas mucho sentado y estira el pecho en el marco de una puerta. La postura mejora cuando la espalda se hace fuerte, no forzándola todo el día.`),
    acts: (c) => [{ act: 'ex', v: 'face-pull', label: 'Face pull' }, { act: 'ex', v: 'cable-row', label: c.es ? 'Remo en polea' : 'Cable row' }] },
  { id: 'cooldown', keys: ['enfriamiento', 'enfriar', 'vuelta a la calma', 'cool down', 'cooldown'],
    q: ['Do I need to cool down?', '¿Tengo que hacer enfriamiento?'],
    a: T(`It is optional. 5 minutes of walking and some easy stretching feel good and help you relax, but they do not prevent soreness. If you are short on time, skip it before you skip the workout.`,
      `Es opcional. 5 minutos caminando y estiramientos suaves se sienten bien y te relajan, pero no evitan las agujetas. Si tienes poco tiempo, sáltate eso antes que el entrenamiento.`) },
  { id: 'sweat', keys: ['sudar', 'sudor', 'sudo mucho', 'faja', 'sauna', 'plastico', 'sweat', 'waist trainer'],
    q: ['Does sweating more burn more fat?', '¿Sudar más quema más grasa?'],
    a: T(`No. Sweat is water, and it comes back as soon as you drink. Wearing a waist trainer or plastic to sweat more does not burn fat and can dehydrate you. Fat goes down with a small calorie deficit over weeks.`,
      `No. El sudor es agua y vuelve en cuanto tomas. Usar faja o plástico para sudar más no quema grasa y te puede deshidratar. La grasa baja con un pequeño déficit de calorías durante semanas.`) },
  { id: 'spot', keys: ['grasa de los brazos', 'grasa de la panza', 'grasa localizada', 'quemar grasa de', 'bajar solo', 'papada', 'lonjas', 'spot reduc', 'arm fat', 'belly fat only'],
    q: ['Can I burn fat in just one area?', '¿Puedo bajar grasa solo de una parte?'],
    a: T(`No, you cannot choose where you lose fat. Your body decides the order. Training that area builds the muscle under it, which helps it look better when the fat comes off with a calorie deficit.`,
      `No, no puedes elegir de dónde bajas grasa. Tu cuerpo decide el orden. Entrenar esa zona construye el músculo de abajo, y eso ayuda a que se vea mejor cuando la grasa baja con el déficit de calorías.`) },
  { id: 'fightcardio', keys: ['resistencia', 'condicion fisica', 'cardio para boxeo', 'saltar la cuerda', 'cuerda', 'me canso rapido', 'aguante', 'stamina', 'conditioning', 'jump rope', 'gas out'],
    q: ['How do I build stamina for boxing?', '¿Cómo mejoro mi resistencia para boxeo?'],
    a: T(`Mix three things each week:\n1. Rounds: shadowbox or hit the bag 3 to 6 rounds of 2 or 3 minutes (use the round timer in Sports).\n2. Jump rope: 3 rounds of 2 minutes.\n3. One easy run or long walk of 20 to 30 minutes.\nAdd one round every week. Breathing out on each punch also helps you last longer.`,
      `Mezcla tres cosas cada semana:\n1. Rounds: sombra o saco 3 a 6 rounds de 2 o 3 minutos (usa el temporizador de rounds en Deportes).\n2. Saltar la cuerda: 3 rounds de 2 minutos.\n3. Un trote suave o caminata larga de 20 a 30 minutos.\nSuma un round cada semana. Soltar aire con cada golpe también te ayuda a durar más.`),
    acts: (c) => [{ act: 'fight', v: 'rounds', label: c.es ? 'Temporizador de rounds' : 'Round timer' }] },
  { id: 'sparring', keys: ['sparring', 'guantear', 'protector bucal', 'bucal', 'casco', 'vendas', 'vendaje', 'mouthguard', 'headgear', 'hand wraps'],
    q: ['What do I need for sparring?', '¿Qué necesito para hacer sparring?'],
    a: T(`Only spar with a coach watching, at light intensity, with: mouthguard, hand wraps, 14 to 16 oz gloves and headgear. Learn to defend first. If you get a hard hit to the head and feel dizzy or have a headache, stop and tell an adult or a doctor.`,
      `Haz sparring solo con un entrenador mirando, suave, y con: protector bucal, vendas, guantes de 14 a 16 onzas y casco. Primero aprende a defenderte. Si te dan un golpe fuerte en la cabeza y sientes mareo o dolor de cabeza, para y avísale a un adulto o a un médico.`) },
  { id: 'weightcut', keys: ['dar el peso', 'bajar de categoria', 'corte de peso', 'weight cut', 'make weight'],
    q: ['How do I cut weight for a fight?', '¿Cómo bajo de peso para una pelea?'],
    a: (c) => c.es
      ? `Quitarte agua de golpe para dar el peso es peligroso, sobre todo si eres menor de edad. Pelea en la categoría que te corresponde comiendo normal. Si necesitas bajar, que sea grasa, poco a poco y con tu entrenador.`
      : `Dropping water fast to make weight is dangerous, especially if you are under 18. Fight at the weight you are when eating normally. If you need to drop, make it fat, slowly, with your coach.` },
  { id: 'compete', keys: ['competir', 'competencia', 'reto', 'retos', 'camara', 'contar repeticiones', 'duelo', 'sala en vivo', 'compete', 'challenge', 'camera'],
    q: ['How do the camera challenges work?', '¿Cómo funcionan los retos con cámara?'],
    a: T(`In Compete the camera counts your reps on your phone (nothing is uploaded) and only full reps count. You can do it alone with your own goal, in a duel passing the phone, live with a friend on their own phone, or send them your score with a code. You can also record a video with your count to show it.`,
      `En Competir la cámara cuenta tus repeticiones en tu celular (no se sube nada) y solo cuentan las completas. Puedes hacerlo solo con tu propia meta, en duelo pasándose el celular, en vivo con un amigo en su celular, o mandarle tu marca con un código. También puedes grabar un video con tu conteo para mostrarlo.`),
    acts: (c) => [{ act: 'go', v: 'vs', label: c.es ? 'Ir a Competir' : 'Open Compete' }] },
  { id: 'progress', keys: ['como voy', 'mi progreso', 'mis resultados', 'como lo estoy haciendo', 'resumen', 'how am i doing', 'my progress'],
    q: ['How am I doing?', '¿Cómo voy?'],
    a: (c) => c.es
      ? `Así vas:\n• Esta semana: ${c.week} de ${c.days || 3} entrenamientos.\n• Racha: ${c.streak} ${c.streak === 1 ? 'semana' : 'semanas'} seguidas.\n• Puntaje: ${c.score} de 100 (${c.rankName}).${c.lag ? `\n• Tu músculo con más por crecer: ${c.lag}. Tu plan ya le da una serie extra.` : ''}${c.vsN ? `\n• Retos con cámara con récord: ${c.vsN}.` : ''}\n${c.week >= (c.days || 3) ? '¡Semana cumplida! Así se construye.' : 'Cada entrenamiento de esta semana suma. Vamos.'}`
      : `Here is how you are doing:\n• This week: ${c.week} of ${c.days || 3} workouts.\n• Streak: ${c.streak} ${c.streak === 1 ? 'week' : 'weeks'} in a row.\n• Score: ${c.score} out of 100 (${c.rankName}).${c.lag ? `\n• Your muscle with the most room to grow: ${c.lag}. Your plan already gives it an extra set.` : ''}${c.vsN ? `\n• Camera challenges with a record: ${c.vsN}.` : ''}\n${c.week >= (c.days || 3) ? 'Week done! That is how it is built.' : 'Every workout this week counts. Let us go.'}`,
    acts: (c) => [{ act: 'go', v: 'rank', label: c.es ? 'Ver mi progreso' : 'See my progress' }] },
  { id: 'record', keys: ['mi record', 'mi marca', 'mi mejor', 'cuanto levanto', 'cuanto hago en', 'my record', 'my best', 'personal record', 'my pr'],
    q: ['What is my record?', '¿Cuál es mi récord?'],
    a: (c) => {
      if (!c.ex) return c.es ? 'Dime de qué ejercicio, por ejemplo: "¿cuál es mi récord en banca?"' : 'Tell me which exercise, for example: "what is my bench record?"';
      const b = c.best(c.ex.id), nm = c.ex.names[c.es ? 1 : 0];
      if (!b) return c.es ? `Todavía no tienes series anotadas de ${nm}. Cuando lo entrenes, aquí te digo tu marca.` : `You have no logged sets of ${nm} yet. Once you train it, I will tell you your best.`;
      return c.ex.bw
        ? (c.es ? `Tu mejor marca en ${nm}: ${b} repeticiones en una serie. ¡A ganarle!` : `Your best in ${nm}: ${b} reps in one set. Go beat it!`)
        : (c.es ? `Tu fuerza estimada en ${nm}: unos ${c.fmtW(b)} ${c.unit} a una repetición (calculado con tu mejor serie).` : `Your estimated strength in ${nm}: about ${c.fmtW(b)} ${c.unit} for one rep (from your best set).`);
    } },
  { id: 'grow-taller', keys: ['crecer de estatura', 'ser mas alto', 'estatura', 'grow taller', 'get taller', 'height'],
    q: ['Can lifting make me shorter?', '¿Las pesas me quitan estatura?'],
    a: T(`No. Lifting does not stop your growth or make you shorter; your height depends mostly on your genes, sleep and food. Good technique, gradual progress, 8 to 10 hours of sleep and enough food are what you need.`,
      `No. Las pesas no frenan tu crecimiento ni te hacen más bajo; tu estatura depende sobre todo de tu genética, el sueño y la comida. Lo que necesitas: buena técnica, progresar poco a poco, dormir 8 a 10 horas y comer suficiente.`) },
  { id: 'hair', keys: ['calvicie', 'caida del pelo', 'se me cae el pelo', 'acne', 'granos', 'hair loss', 'balding'],
    q: ['Does creatine make you lose hair?', '¿La creatina hace que se caiga el pelo?'],
    a: T(`There is no good evidence that creatine causes hair loss: one small study raised the idea and it was never confirmed. Acne can come from hormones, sleep, food and stress, not from training. If either worries you, a dermatologist can help.`,
      `No hay buena evidencia de que la creatina haga caer el pelo: un estudio pequeño lo sugirió y nunca se confirmó. El acné puede venir de las hormonas, el sueño, la comida o el estrés, no de entrenar. Si te preocupa, un dermatólogo te puede ayudar.`) },
  { id: 'milk', keys: ['leche', 'lacteo', 'lactosa', 'yogur', 'queso', 'milk', 'dairy', 'lactose'],
    q: ['Is milk good for building muscle?', '¿La leche sirve para ganar músculo?'],
    a: T(`Yes: milk, yogurt and cheese bring good protein and calcium. If lactose bothers you, use lactose-free milk or Greek yogurt. If you want to gain weight, a glass of milk with meals is an easy way to add calories.`,
      `Sí: la leche, el yogur y el queso traen buena proteína y calcio. Si la lactosa te cae mal, usa leche deslactosada o yogur griego. Si quieres subir de peso, un vaso de leche con las comidas es una forma fácil de sumar calorías.`) },
  { id: 'during', keys: ['durante el entren', 'tomar durante', 'beber durante', 'intra entreno', 'during training', 'during my workout'],
    q: ['What should I drink during training?', '¿Qué tomo durante el entrenamiento?'],
    a: T(`Water, in small sips, is enough for most workouts. If you train more than 75 to 90 minutes or sweat a lot in the heat, a drink with a pinch of salt (or a sports drink) helps.`,
      `Agua, a sorbos, es suficiente para casi todos los entrenamientos. Si entrenas más de 75 a 90 minutos o sudas mucho con calor, ayuda una bebida con una pizca de sal (o una bebida deportiva).`) },
  { id: 'dizzy', priority: true, keys: ['mareo', 'mareado', 'me desmaye', 'desmayo', 'nausea', 'vomit', 'ganas de vomitar', 'dolor de cabeza', 'me duele la cabeza', 'vision borrosa', 'dizzy', 'faint', 'nausea', 'throw up', 'headache'],
    q: ['I feel dizzy when I train', 'Me mareo cuando entreno'],
    a: T(`Stop, sit or lie down and drink water. Feeling dizzy or sick when training often comes from not eating, not drinking enough, holding your breath or going too hard too fast.\nNext time: eat 1 to 3 hours before, drink water, breathe out as you push, and rest longer between sets.\nIf you faint, have chest pain, a strong headache after a hit, or it keeps happening: see a doctor.`,
      `Para, siéntate o acuéstate y toma agua. Marearte o sentir náuseas al entrenar suele venir de no comer, tomar poca agua, aguantar la respiración o ir muy fuerte de golpe.\nLa próxima vez: come 1 a 3 horas antes, toma agua, suelta el aire al empujar y descansa más entre series.\nSi te desmayas, sientes dolor en el pecho, un dolor de cabeza fuerte después de un golpe, o te pasa seguido: ve con un médico.`) },
];

// Common joints: one extra line in the pain answer with the usual form cause.
const JOINTS = [
  [['rodilla', 'knee'], 'Knee: keep your knees in line with your toes, do not let them cave in, and use a depth you control.', 'Rodilla: mantén las rodillas en línea con la punta de los pies, que no se vayan hacia adentro, y baja hasta donde controles.'],
  [['hombro', 'shoulder'], 'Shoulder: on presses keep your elbows a bit closer to your body (not flared to the sides) and do not go deeper than you control.', 'Hombro: en los press lleva los codos un poco más pegados al cuerpo (no abiertos a los lados) y no bajes más de lo que controlas.'],
  [['espalda baja', 'lumbar', 'cintura', 'lower back'], 'Lower back: keep your back flat on deadlifts and rows, brace your abs, and lower the weight.', 'Espalda baja: mantén la espalda plana en peso muerto y remos, aprieta el abdomen y baja el peso.'],
  [['muneca', 'wrist'], 'Wrist: keep your wrist straight under the bar (not bent back) and try wrist wraps.', 'Muñeca: mantén la muñeca recta debajo de la barra (no doblada hacia atrás) y prueba con muñequeras.'],
  [['codo', 'elbow'], 'Elbow: lower the weight on curls and triceps work, and do not lock out with a snap.', 'Codo: baja el peso en curl y tríceps y no estires el brazo de golpe.'],
];

// Example question for the older topics, used for the "related" and "did you mean" buttons.
const QS = {
  protein: ['How much protein do I need?', '¿Cuánta proteína necesito?'], fat: ['How do I lose fat?', '¿Cómo bajo grasa?'],
  gain: ['How do I build muscle?', '¿Cómo gano músculo?'], calories: ['How many calories should I eat?', '¿Cuántas calorías debo comer?'],
  creatine: ['Is creatine safe?', '¿La creatina es segura?'], supps: ['Which supplements are worth it?', '¿Qué suplementos sirven?'],
  steroids: ['Are steroids worth it?', '¿Valen la pena los esteroides?'], sleep: ['How much should I sleep?', '¿Cuánto debo dormir?'],
  injury: ['Something hurts when I train', 'Me duele algo al entrenar'], soreness: ['Why am I so sore?', '¿Por qué tengo agujetas?'],
  warmup: ['How do I warm up?', '¿Cómo caliento?'], sets: ['How many sets and reps?', '¿Cuántas series y repeticiones?'],
  rest: ['How long should I rest between sets?', '¿Cuánto descanso entre series?'], frequency: ['How many days a week should I train?', '¿Cuántos días a la semana entreno?'],
  plateau: ['I am not making progress', 'Estoy estancado'], results: ['When will I see results?', '¿Cuándo veré resultados?'],
  cardio: ['Does cardio kill gains?', '¿El cardio quita músculo?'], abs: ['How do I get abs?', '¿Cómo saco cuadritos?'],
  teen: ['Can I lift weights as a teenager?', '¿Puedo hacer pesas siendo adolescente?'], women: ['Will lifting make women bulky?', '¿Las mujeres se ponen muy grandes?'],
  water: ['How much water should I drink?', '¿Cuánta agua debo tomar?'], 'preworkout-food': ['What should I eat before training?', '¿Qué como antes de entrenar?'],
  postworkout: ['What should I eat after training?', '¿Qué como después de entrenar?'], diet: ['What should I eat?', '¿Qué debo comer?'],
  home: ['Can I train at home without equipment?', '¿Puedo entrenar en casa sin equipo?'], stretch: ['Should I stretch?', '¿Debo estirar?'],
  breathing: ['How should I breathe when lifting?', '¿Cómo respiro al levantar?'], form: ['How do I improve my technique?', '¿Cómo mejoro mi técnica?'],
  boxing: ['How do I start boxing?', '¿Cómo empiezo en boxeo?'], app: ['How does my score work?', '¿Cómo funciona mi puntaje?'],
  routine: ['What should I train today?', '¿Qué entreno hoy?'], alcohol: ['Does alcohol affect my gains?', '¿El alcohol afecta mis resultados?'],
};
KB.push(...MORE);
for (const k of KB) {
  k.keys = k.keys.map((x) => { const ctx = x[0] === '~'; const v = norm(x.replace(/^[\s~]+/, '')) + (/\s$/.test(x) ? ' ' : ''); if (!ctx) return v; const o = new String(v); o.ctx = true; return o; });
  if (!k.q && QS[k.id]) k.q = QS[k.id];
}

const GREET = ['hola', 'buenas', 'buenos dias', 'que tal', 'hey ', 'hi ', 'hello', 'que onda', 'saludos', 'que hay'];
const THANKS = ['gracias', 'thank', 'thx', 'te pasaste', 'genial', 'perfecto', 'excelente', 'ok gracias'];
const MOTIV = ['motiva', 'motivat', 'ganas', 'flojera', 'pereza', 'lazy', 'no quiero entrenar', 'rendirme', 'i quit', 'give up', 'cansado de todo', 'triste', 'desanim', 'sad ', 'animo', 'deprim'];
const HOW = ['como se hace', 'como hago', 'como hacer', 'como es', 'tecnica', 'explica', 'explain', 'paso a paso', 'how do i do', 'how to do', 'how do you do', 'form for', 'que trabaja', 'what does'];
// Extra names people use for the exercises.
const ALIAS = {
  'push-up': ['lagartija', 'flexion de pecho', 'pushup', 'push up', 'planchas de pecho'],
  'bench-press': ['press banca', 'banca', 'press de pecho', 'bench'],
  'pull-up': ['dominada', 'pull up', 'pullup', 'barra fija'],
  'inverted-row': ['remo invertido', 'remo australiano', 'australian row'],
  'crunch': ['abdominales', 'crunches', 'sit up', 'situp'],
  'squat': ['sentadillas', 'sentadilla con barra'],
  'romanian-deadlift': ['rdl', 'peso muerto rumano'],
  'deadlift': ['peso muerto', 'deadlift'],
  'incline-bench-press': ['press inclinado', 'banca inclinada'],
  'bulgarian-split-squat': ['bulgara', 'bulgarian'],
  'skull-crusher': ['press frances', 'rompecraneos'],
  'parallel-dip': ['fondos en paralelas', 'paralelas', 'fondos'],
  'hip-thrust': ['hip thrust', 'empuje de cadera'],
  'lunge': ['zancada', 'estocada', 'lunges'],
  'overhead-press': ['press militar', 'press de hombro', 'ohp'],
  'lat-pulldown': ['jalon', 'polea al pecho'],
  'chair-dip': ['fondos en banco', 'fondos en silla', 'bench dip'],
  'plank': ['planchas', 'plank'],
  'barbell-curl': ['curl de biceps', 'curl biceps', 'biceps curl', 'curl con barra'],
  'triceps-pushdown': ['polea triceps', 'triceps en polea'],
  'calf-raise': ['pantorrilla', 'gemelos', 'calf'],
  'leg-press': ['prensa'],
  'glute-bridge': ['puente'],
  'chin-up': ['dominada supina', 'chin up', 'chinup'],
  'pec-deck': ['pec deck', 'contractora', 'peck deck', 'aperturas en maquina'],
  'machine-chest-press': ['press en maquina', 'press de pecho en maquina'],
  'chest-supported-row': ['remo apoyado', 'remo con pecho apoyado'],
  'db-pullover': ['pullover', 'pull over'],
  'step-up': ['subidas al cajon', 'step up', 'subir al cajon'],
  'single-leg-rdl': ['peso muerto a una pierna', 'rdl a una pierna'],
  'incline-curl': ['curl inclinado'],
  'triceps-kickback': ['patada de triceps', 'kickback'],
  'cable-crunch': ['crunch en polea', 'abdominales en polea'],
  'side-plank': ['plancha lateral', 'side plank'],
  'decline-push-up': ['flexiones declinadas', 'lagartijas declinadas'],
  'farmer-carry': ['caminata del granjero', 'farmer walk', 'farmers walk', 'paseo del granjero'],
  'nordic-curl': ['curl nordico', 'nordico', 'nordic'],
};
const GROUP_WORDS = {
  chest: ['pecho', 'pectoral', 'chest', 'pecs'], shoulders: ['hombro', 'deltoide', 'shoulder', 'delts'], back: ['espalda', 'dorsal', 'back ', 'lats'],
  arms: ['brazo', 'biceps', 'triceps', 'arm '], legs: ['pierna', 'cuadricep', 'muslo', 'leg ', 'legs', 'quads'], hinge: ['gluteo', 'pompa', 'nalga', 'femoral', 'isquio', 'glute', 'hamstring', 'booty'],
  core: ['abdomen', 'core ', 'zona media'],
};
const WHICH = ['ejercicio', 'exercise', 'que hago', 'que puedo hacer', 'como crecer', 'como agrandar', 'para el ', 'para la ', 'para los ', 'for my', 'train my', 'mejorar', 'grow', 'agrandar', 'aumentar', 'crecer'];

// A key matches when a word in the question starts with it ("electrolit" matches "electrolitos").
// Longer phrases weigh more, so "agua con sal" beats "agua".
const has = (q, k) => q.includes(' ' + k);
const weight = (k) => (k.ctx ? 0.8 : 1 + (k.trim().split(' ').length - 1) * 1.25);
const hits = (q, keys) => keys.reduce((n, k) => n + (has(q, k) ? 1 : 0), 0);
// One wrong, missing or extra letter still counts (a little), for words of 5 letters or more.
function near(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  const d = [];
  for (let i = 0; i <= a.length; i++) { d[i] = [i]; for (let j = 1; j <= b.length; j++) d[i][j] = i ? 0 : j; }
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[a.length][b.length] <= 1;
}
function score(q, words, keys) {
  let s = 0, n = 0, ctx = false;
  for (const k of keys) {
    // Context phrases ("before training") count once, and less than the subject of the question.
    if (has(q, k)) { if (k.ctx) { if (!ctx) s += weight(k); ctx = true; } else { s += weight(k); n++; } continue; }
    const kk = k.trim();
    if (kk.length >= 5 && !kk.includes(' ') && words.some((w) => w.length >= 5 && near(w, kk))) { s += 0.6; n++; }
  }
  return s + n * 0.01;
}
const steps = (list) => list.map((s, i) => `${i + 1}. ${s}`).join('\n');
const ask = (k, es) => ({ act: 'coach-ask', v: k.q[es ? 1 : 0], label: k.q[es ? 1 : 0] });

export function coachReply(raw, c) {
  const q = ' ' + norm(raw) + ' ';
  const words = q.trim().split(' ').filter(Boolean);
  const es = c.es;
  const say = (en, sp) => (es ? sp : en);
  if (!q.trim()) return { text: say('Ask me anything about training, food or fighting.', 'Pregúntame lo que quieras de entrenar, comida o pelea.'), acts: [] };

  const ranked = KB.map((k) => ({ k, s: score(q, words, k.keys) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  const top = ranked[0];
  if (words.length <= 4 && hits(q, GREET) && !top) {
    return { text: say(`Hi${c.name ? ' ' + c.name : ''}! I am your coach, here 24/7. Ask me about your workouts, food, technique, boxing or the camera challenges.`, `¡Hola${c.name ? ' ' + c.name : ''}! Soy tu coach y estoy aquí 24/7. Pregúntame de tus entrenamientos, comida, técnica, boxeo o los retos con cámara.`), acts: [] };
  }
  if (words.length <= 6 && hits(q, THANKS) && !top) return { text: say(`Anytime. Now go train. ${c.quote()}`, `Cuando quieras. Ahora a entrenar. ${c.quote()}`), acts: [] };

  // Safety first: pain, dizziness or feeling sick always get the careful answer.
  const urgent = ranked.find((x) => x.k.priority);
  if (urgent) {
    let text = urgent.k.a(c);
    if (urgent.k.id === 'injury') {
      const lines = JOINTS.filter(([keys]) => keys.some((k) => has(q, norm(k)))).map((j) => (es ? j[2] : j[1]));
      if (lines.length) text += `\n\n${lines.join('\n')}`;
    }
    return { text, acts: [], link: urgent.k.link };
  }
  if (hits(q, MOTIV) && (!top || top.s < 2)) {
    return { text: `${c.quote()}\n\n${say('Do just the first exercise. If you still want to stop after that, stop. You almost never will.', 'Haz solo el primer ejercicio. Si después de eso todavía quieres parar, para. Casi nunca vas a querer.')}`, acts: [{ act: 'go', v: 'home', label: say("Today's workout", 'Entreno de hoy') }] };
  }

  // Exercise named in the question.
  const exMatch = (list) => {
    let found = null, len = 0;
    for (const x of list) {
      for (const nm of [...x.names, ...(ALIAS[x.id] || [])]) {
        const n = norm(nm);
        if (n.length > 2 && q.includes(' ' + n) && n.length > len) { found = x; len = n.length; }
      }
    }
    return found;
  };
  const ex = exMatch(c.exercises), ls = exMatch(c.lessons);
  const usesEx = top && ['startweight', 'record', 'max'].includes(top.k.id);
  if ((ex || ls) && !usesEx && (!top || top.s < 2.2 || (hits(q, HOW) && top.s < 3.4))) {
    const x = ex || ls;
    const nm = x.names[es ? 1 : 0];
    const tip = x.tip ? `\n${say('Tip', 'Consejo')}: ${x.tip}` : '';
    const miss = x.mistakes && x.mistakes.length ? `\n\n${say('Avoid', 'Evita')}: ${x.mistakes.join(' ')}` : '';
    const b = ex && c.best ? c.best(ex.id) : 0;
    const mine = b ? `\n${ex.bw ? say(`Your best: ${b} reps.`, `Tu mejor marca: ${b} repeticiones.`) : say(`Your estimated max: ${c.fmtW(b)} ${c.unit}.`, `Tu máximo estimado: ${c.fmtW(b)} ${c.unit}.`)}` : '';
    return {
      text: `${say('How to do', 'Así se hace')} ${nm}:\n${steps(x.steps)}${miss}${tip}${mine}`,
      acts: [{ act: ex ? 'ex' : 'lesson', v: x.id, label: say('Watch the animation', 'Ver la animación') }],
    };
  }

  // "Which exercises for my chest?"
  for (const [g, gw] of Object.entries(GROUP_WORDS)) {
    if (hits(q, gw) && (hits(q, WHICH) || !top)) {
      const list = c.exercises.filter((x) => x.group === g).slice(0, 6);
      if (!list.length) break;
      return {
        text: `${say('Good exercises for that', 'Buenos ejercicios para eso')}:\n${list.map((x) => '• ' + x.names[es ? 1 : 0]).join('\n')}\n\n${say('Pick 2 or 3, do 3 or 4 sets each, twice a week, and add a little weight or reps each time.', 'Elige 2 o 3, haz 3 o 4 series de cada uno, 2 veces por semana, y súbele un poco de peso o repeticiones cada vez.')}${c.lagGroup === g ? say('\nThis is your muscle with the most room to grow: good choice.', '\nEste es tu músculo con más por crecer: buena elección.') : ''}`,
        acts: list.slice(0, 3).map((x) => ({ act: 'ex', v: x.id, label: x.names[es ? 1 : 0] })),
      };
    }
  }

  if (top) {
    const k = top.k, cx = { ...c, ex };
    const acts = k.acts ? k.acts(cx) : [];
    // A second topic that also fits: offer it as a button.
    const second = ranked.find((x) => x.k !== k && x.k.q && x.s >= 1 && !x.k.priority);
    if (second && acts.length < 3) acts.push(ask(second.k, es));
    return { text: k.a(cx), acts, link: k.link };
  }

  // Not sure: say so, and offer the closest topics instead of guessing.
  const POPULAR = ['protein', 'gain', 'fat', 'beginner', 'electrolytes', 'sets', 'compete'];
  const offer = POPULAR.map((id) => KB.find((k) => k.id === id)).filter((k) => k && k.q).sort(() => Math.random() - 0.5).slice(0, 3);
  return {
    text: say("I am not sure I understood. Try asking it another way, or tap one of these. I know about food, supplements, training, technique for every exercise, injuries, boxing and the camera challenges.",
      'No estoy seguro de haber entendido. Pregúntamelo de otra forma o toca una de estas. Sé de comida, suplementos, entrenamiento, técnica de cada ejercicio, lesiones, boxeo y los retos con cámara.'),
    acts: offer.map((k) => ask(k, es)),
  };
}

// Topic buttons always shown above the input: [label EN, label ES, question EN, question ES].
export const QUICK = [
  ['Daily protein', 'Proteína diaria', 'How much protein do I need?', '¿Cuánta proteína necesito?'],
  ['Creatine', 'Creatina', 'Is creatine safe?', '¿La creatina es segura?'],
  ['Lose fat', 'Bajar grasa', 'How do I lose fat?', '¿Cómo bajo grasa?'],
  ['Joint pain', 'Dolor articular', 'My joint hurts when I train', 'Me duele una articulación al entrenar'],
  ['Pull-ups', 'Dominadas', 'How do I do pull-ups?', '¿Cómo hago dominadas?'],
  ['How am I doing?', '¿Cómo voy?', 'How am I doing?', '¿Cómo voy?'],
  ['First pull-up', 'Primera dominada', 'I cannot do a pull-up yet', 'No puedo hacer ni una dominada'],
  ['Water with salt', 'Agua con sal', 'Should I drink water with salt before training?', '¿Tomar agua con sal antes de entrenar sirve?'],
  ['Sets and reps', 'Series y reps', 'How many sets and reps?', '¿Cuántas series y repeticiones?'],
  ['Motivate me', 'Motívame', 'I do not feel like training', 'No tengo ganas de entrenar'],
];

// Questions shown as chips when the chat is empty.
export const SUGGEST = [
  ['How much protein do I need?', '¿Cuánta proteína necesito?'],
  ['How do I do a squat?', '¿Cómo hago una sentadilla?'],
  ['Exercises for my chest', 'Ejercicios para pecho'],
  ['How do I lose belly fat?', '¿Cómo bajo la panza?'],
  ['I do not feel like training', 'No tengo ganas de entrenar'],
  ['How do I start boxing?', '¿Cómo empiezo en boxeo?'],
  ['Is creatine safe?', '¿La creatina es segura?'],
  ['How many sets and reps?', '¿Cuántas series y repeticiones?'],
  ['How am I doing?', '¿Cómo voy?'],
  ['Should I drink water with salt before training?', '¿Tomar agua con sal antes de entrenar sirve?'],
  ['I am a beginner, where do I start?', 'Soy principiante, ¿por dónde empiezo?'],
];
