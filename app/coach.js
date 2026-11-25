// The in-app coach: answers common training questions at any hour, on the phone, without internet.
// It does not "think": it recognizes the topic of the question and answers from what the site teaches.
// coachReply(text, ctx) returns { text, acts: [{ act, v, label }], link }.

export const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9\s.,]/g, ' ').replace(/\s+/g, ' ').trim();

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
  { id: 'injury', priority: true, keys: ['duele', 'dolor', 'lesion', 'lastim', 'hurt', 'pain', 'injur', 'tendon', 'articulacion', 'joint', 'crujido', 'me torci', 'esguince', 'sprain', 'mareo', 'dizzy', 'pecho me aprieta'],
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
  { id: 'results', keys: ['cuanto tiempo', 'cuando vere', 'cuando se nota', 'resultados', 'how long', 'when will i see', 'results'],
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
  { id: 'preworkout-food', keys: ['antes de entrenar', 'comer antes', 'en ayunas', 'before training', 'before workout', 'pre entrenamiento comida'],
    a: (c) => c.es
      ? 'Come algo 1 a 3 horas antes: algo con carbohidratos y un poco de proteína (arroz con pollo, avena con leche, pan con huevo, una fruta con yogur). Entrenar en ayunas no quema más grasa al final del día.'
      : 'Eat something 1 to 3 hours before: carbs plus a bit of protein (rice and chicken, oats with milk, toast and eggs, fruit and yogurt). Training fasted does not burn more fat by the end of the day.' },
  { id: 'postworkout', keys: ['despues de entrenar', 'post entreno', 'after training', 'after workout', 'ventana anabolica'], link: '/after-workout-muscles',
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

const GREET = [' hola', 'buenas', 'buenos dias', 'que tal', ' hey ', ' hi ', 'hello', 'que onda', 'saludos'];
const THANKS = ['gracias', 'thank', 'thx', 'te pasaste', 'genial', 'perfecto'];
const MOTIV = ['motiva', 'motivat', 'ganas', 'flojera', 'pereza', 'lazy', 'no quiero entrenar', 'rendirme', ' i quit', 'give up', 'cansado de todo', 'triste', 'desanim', ' sad ', 'animo'];
const HOW = ['como', 'how', 'tecnica', 'hacer', 'hago', 'se hace', 'explica', 'explain', 'paso', 'step', 'que es'];
// Extra names people use for the exercises.
const ALIAS = {
  'push-up': ['lagartija', 'flexion de pecho', 'pushup', 'push up', 'planchas de pecho'],
  'bench-press': ['press banca', 'banca', 'press de pecho', 'bench'],
  'pull-up': ['dominada', 'pull up', 'pullup', 'chin up', 'barra fija'],
  'inverted-row': ['remo invertido', 'remo australiano', 'australian row'],
  'crunch': ['abdominales', 'crunches', 'sit up', 'situp'],
  'squat': ['sentadillas'],
  'romanian-deadlift': ['rdl', 'peso muerto rumano'],
  'deadlift': ['peso muerto', 'deadlift'],
  'incline-bench-press': ['press inclinado', 'banca inclinada'],
  'bulgarian-split-squat': ['bulgara', 'bulgarian'],
  'skull-crusher': ['press frances', 'rompecraneos'],
  'parallel-dip': ['fondos en paralelas', 'paralelas'],
  'hip-thrust': ['hip thrust', 'empuje de cadera'],
  'lunge': ['zancada', 'estocada', 'lunges'],
  'overhead-press': ['press militar', 'press de hombro', 'ohp'],
  'lat-pulldown': ['jalon', 'polea al pecho'],
  'chair-dip': ['fondos en banco', 'fondos en silla', 'bench dip'],
  'plank': ['planchas', 'plank'],
  'barbell-curl': ['curl de biceps', 'curl biceps', 'biceps curl', 'curl'],
  'triceps-pushdown': ['polea triceps', 'triceps en polea'],
  'calf-raise': ['pantorrilla', 'gemelos', 'calf'],
  'leg-press': ['prensa'],
  'glute-bridge': ['puente'],
};
const GROUP_WORDS = {
  chest: ['pecho', 'pectoral', 'chest', 'pecs'], shoulders: ['hombro', 'deltoide', 'shoulder', 'delts'], back: ['espalda', 'dorsal', 'back', 'lats'],
  arms: ['brazo', 'biceps', 'triceps', ' arm'], legs: ['pierna', 'cuadricep', 'muslo', ' leg', 'quads'], hinge: ['gluteo', 'pompa', 'nalga', 'femoral', 'isquio', 'glute', 'hamstring', 'booty'],
  core: ['abdomen', ' core', 'zona media'],
};
const WHICH = ['ejercicio', 'exercise', 'que hago', 'que puedo hacer', 'como crecer', 'como agrandar', 'para el', 'para la', 'para los', 'for my', 'train my', 'entrenar', 'mejorar', 'grow', 'agrandar', 'aumentar'];

const hits = (q, keys) => keys.reduce((n, k) => n + (q.includes(k) ? 1 : 0), 0);
const steps = (list) => list.map((s, i) => `${i + 1}. ${s}`).join('\n');

export function coachReply(raw, c) {
  const q = ' ' + norm(raw) + ' ';
  const es = c.es;
  const say = (en, sp) => (es ? sp : en);
  if (!q.trim()) return { text: say('Ask me anything about training, food or fighting.', 'Pregúntame lo que quieras de entrenar, comida o pelea.'), acts: [] };

  const words = q.trim().split(' ').length;
  if (words <= 4 && hits(q, GREET) && !KB.some((k) => hits(q, k.keys))) {
    return { text: say(`Hi${c.name ? ' ' + c.name : ''}! I am your coach, here 24/7. Ask me about your workouts, food, technique or boxing.`, `¡Hola${c.name ? ' ' + c.name : ''}! Soy tu coach y estoy aquí 24/7. Pregúntame de tus entrenamientos, comida, técnica o boxeo.`), acts: [] };
  }
  if (words <= 6 && hits(q, THANKS)) return { text: say(`Anytime. Now go train. ${c.quote()}`, `Cuando quieras. Ahora a entrenar. ${c.quote()}`), acts: [] };

  // Safety first: pain or injury questions always get the careful answer.
  const injury = KB.find((k) => k.priority);
  if (hits(q, injury.keys)) return { text: injury.a(c), acts: [], link: injury.link };

  if (hits(q, MOTIV)) {
    return { text: `${c.quote()}\n\n${say('Do just the first exercise. If you still want to stop after that, stop. You almost never will.', 'Haz solo el primer ejercicio. Si después de eso todavía quieres parar, para. Casi nunca vas a querer.')}`, acts: [{ act: 'go', v: 'home', label: say('Start today’s workout', 'Empezar el entrenamiento de hoy') }] };
  }

  // Topic match.
  let best = null, bestN = 0;
  for (const k of KB) { if (k.priority) continue; const n = hits(q, k.keys); if (n > bestN) { best = k; bestN = n; } }

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
  if ((ex || ls) && (bestN < 2 || hits(q, HOW))) {
    const x = ex || ls;
    const nm = x.names[es ? 1 : 0];
    const tip = x.tip ? `\n${say('Tip', 'Consejo')}: ${x.tip}` : '';
    const miss = x.mistakes && x.mistakes.length ? `\n\n${say('Avoid', 'Evita')}: ${x.mistakes.join(' ')}` : '';
    return {
      text: `${say('How to do', 'Así se hace')} ${nm}:\n${steps(x.steps)}${miss}${tip}`,
      acts: [{ act: ex ? 'ex' : 'lesson', v: x.id, label: say('Watch the animation', 'Ver la animación') }],
    };
  }

  // "Which exercises for my chest?"
  for (const [g, gw] of Object.entries(GROUP_WORDS)) {
    if (hits(q, gw) && (hits(q, WHICH) || bestN === 0)) {
      const list = c.exercises.filter((x) => x.group === g).slice(0, 5);
      if (!list.length) break;
      return {
        text: `${say('Good exercises for that', 'Buenos ejercicios para eso')}:\n${list.map((x) => '• ' + x.names[es ? 1 : 0]).join('\n')}\n\n${say('2 or 3 of them, 3 or 4 sets each, twice a week. Add a little weight or a rep each time.', 'Haz 2 o 3 de ellos, 3 o 4 series cada uno, 2 veces por semana. Súmale un poquito de peso o una repetición cada vez.')}`,
        acts: list.slice(0, 3).map((x) => ({ act: 'ex', v: x.id, label: x.names[es ? 1 : 0] })),
      };
    }
  }

  if (best) return { text: best.a(c), acts: best.acts ? best.acts(c) : [], link: best.link };

  return {
    text: say('I am not sure I understood that. I know about: protein, calories, losing fat, building muscle, sleep, soreness, sets and reps, rest, cardio, abs, supplements, technique for every exercise and boxing. Try asking it another way.',
      'No estoy seguro de haber entendido. Sé de: proteína, calorías, bajar grasa, ganar músculo, sueño, dolor, series y repeticiones, descanso, cardio, abdomen, suplementos, técnica de cada ejercicio y boxeo. Prueba preguntarlo de otra forma.'),
    acts: [],
  };
}

// Topic buttons always shown above the input: [label EN, label ES, question EN, question ES].
export const QUICK = [
  ['Daily protein', 'Proteína diaria', 'How much protein do I need?', '¿Cuánta proteína necesito?'],
  ['Creatine', 'Creatina', 'Is creatine safe?', '¿La creatina es segura?'],
  ['Lose fat', 'Bajar grasa', 'How do I lose fat?', '¿Cómo bajo grasa?'],
  ['Joint pain', 'Dolor articular', 'My joint hurts when I train', 'Me duele una articulación al entrenar'],
  ['Pull-ups', 'Dominadas', 'How do I do pull-ups?', '¿Cómo hago dominadas?'],
  ['Boxing guard', 'Guardia de boxeo', 'How do I stand in boxing guard?', '¿Cómo es la guardia y postura de boxeo?'],
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
];
