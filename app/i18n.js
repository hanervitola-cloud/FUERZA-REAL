// English and Spanish for the Earned Strength app. English text lives in data.js and here;
// Spanish text lives here. t(key, vars) for interface text, the helpers below for content.

let lang = 'en';
export const getLang = () => lang;
export function setLang(l) {
  lang = l === 'es' ? 'es' : 'en';
  document.documentElement.lang = lang;
}
export function detectLang() {
  const n = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
  return n.toLowerCase().startsWith('es') ? 'es' : 'en';
}
export function defaultUnits(l) {
  const n = (navigator.language || '').toUpperCase();
  return n.endsWith('-US') || (l === 'en' && !n.includes('-')) ? 'lb' : l === 'es' ? 'kg' : 'lb';
}
export const locale = () => (lang === 'es' ? 'es' : 'en-US');

// Interface text: key -> [English, Spanish]. {name} placeholders are filled by t().
const UI = {
  tagline: ['No myths. No shortcuts.', 'Sin mitos. Sin atajos.'],
  tabHome: ['Home', 'Inicio'], tabTrain: ['Train', 'Entrenar'], tabRank: ['Rank', 'Rango'], tabLearn: ['Learn', 'Aprender'], tabMe: ['Profile', 'Perfil'],
  morning: ['Good morning', 'Buenos días'], afternoon: ['Good afternoon', 'Buenas tardes'], evening: ['Good evening', 'Buenas noches'],
  // Onboarding
  obWelcomeTitle: ['Train natural.<br>Watch yourself grow.', 'Entrena natural.<br>Mira cómo creces.'],
  obWelcomeText: ['Your workouts, your rank and the science behind it, in one place.', 'Tus entrenamientos, tu rango y la ciencia detrás, en un solo lugar.'],
  obP1: ['Log every set', 'Anota cada serie'], obP1t: ['Weights, reps and a rest timer that starts on its own.', 'Peso, repeticiones y un temporizador de descanso que arranca solo.'],
  obP2: ['Rank up for real', 'Sube de rango de verdad'], obP2t: ['Your character grows with your actual strength and consistency.', 'Tu personaje crece con tu fuerza y tu constancia reales.'],
  obP3: ['No myths', 'Sin mitos'], obP3t: ['Every tip is backed by research, in plain language.', 'Cada consejo está respaldado por estudios, en palabras simples.'],
  obNameTitle: ['What should we call you?', '¿Cómo te llamamos?'], obNameText: ['Just a first name or a nickname. It stays on your phone.', 'Solo un nombre o un apodo. Se queda en tu teléfono.'],
  name: ['Name', 'Nombre'], yourName: ['Your name', 'Tu nombre'],
  obGoalTitle: ['What is your main goal?', '¿Cuál es tu meta principal?'], obGoalText: ['This changes the tips you see. You can change it later.', 'Esto cambia los consejos que ves. Puedes cambiarlo después.'],
  obLevelTitle: ['Where are you starting from?', '¿Desde dónde empiezas?'], obLevelText: ['Be honest. Starting at the right level is how you avoid injuries.', 'Sé honesto. Empezar en el nivel correcto es como evitas lesiones.'],
  obDaysTitle: ['How many days a week can you train?', '¿Cuántos días a la semana puedes entrenar?'], obDaysText: ['Pick a number you can keep for months, not just this week. 3 is a great start.', 'Elige un número que puedas mantener por meses, no solo esta semana. 3 es un gran comienzo.'],
  obDaysNote: ['This is your weekly goal. Hit it to keep your streak. Rest days never break it.', 'Esta es tu meta semanal. Cúmplela para mantener tu racha. Los días de descanso nunca la rompen.'],
  obEquipTitle: ['What do you have to train with?', '¿Con qué vas a entrenar?'], obEquipText: ['We will build your plan around it.', 'Armamos tu plan con eso.'],
  obBodyTitle: ['Your bodyweight and age', 'Tu peso y tu edad'], obBodyText: ['Your rank compares what you lift with your bodyweight and adjusts for age, so everyone is measured fairly.', 'Tu rango compara lo que levantas con tu peso y se ajusta por tu edad, así todos se miden de forma justa.'],
  bodyweight: ['Bodyweight ({u})', 'Peso corporal ({u})'],
  obReadyTitle: ['Your plan is ready{name}.', 'Tu plan está listo{name}.'],
  obReadyText: ['{plan}, {days} days a week. Built from the Earned Strength beginner routine.', '{plan}, {days} días a la semana. Basado en la rutina para principiantes de Earned Strength.'],
  obPrivate: ['Everything stays on this phone. No account needed.', 'Todo se queda en este teléfono. No necesitas cuenta.'],
  getStarted: ['Get started', 'Empezar'], letsGo: ["Let's go", '¡Vamos!'], continue: ['Continue', 'Continuar'], back: ['Back', 'Atrás'],
  welcome: ['Welcome to Earned Strength', 'Bienvenido a Earned Strength'],
  language: ['Language', 'Idioma'],
  // Home
  inProgress: ['Workout in progress', 'Entrenamiento en curso'], resume: ['Resume', 'Seguir'],
  weekStreak: ['week streak', 'semanas de racha'], thisWeek: ['{n} of {goal} workouts this week', '{n} de {goal} entrenamientos esta semana'],
  goalDone: ['Weekly goal done. Rest well, you earned it.', 'Meta semanal cumplida. Descansa bien, te lo ganaste.'],
  goalTodo: ['Hit {goal} workouts by Sunday to keep your streak. Rest days never break it.', 'Haz {goal} entrenamientos antes del domingo para mantener tu racha. Los días de descanso nunca la rompen.'],
  nextWorkout: ['Next workout', 'Siguiente entrenamiento'], aboutMin: ['about {n} min', 'unos {n} min'], sec: ['sec', 'seg'],
  startWorkout: ['Start workout', 'Empezar entrenamiento'],
  yourRank: ['Your rank', 'Tu rango'], pointsTo: ['{n} points to {rank}', 'Te faltan {n} puntos para {rank}'], topRank: ['Top rank. Now the goal is keeping it.', 'Rango máximo. Ahora la meta es mantenerlo.'],
  mythDaily: ['Myth or fact · daily', 'Mito o verdad · del día'], myth: ['Myth', 'Mito'], fact: ['Fact', 'Verdad'],
  correct: ['Correct.', 'Correcto.'], notQuite: ['Not quite.', 'No exactamente.'], itsA: ["It's a {x}.", 'Es {x}.'], aMyth: ['myth', 'un mito'], aFact: ['fact', 'verdad'],
  readArticle: ['Read the article', 'Leer el artículo'], inEnglish: [' (in English)', ' (en inglés)'],
  tools: ['Tools', 'Herramientas'], restTimer: ['Rest timer', 'Descanso'], restTimerSub: ['1, 2 or 3 minutes between sets', '1, 2 o 3 minutos entre series'],
  calcTitle: ['Protein and calories', 'Proteína y calorías'], calcSub: ['Your daily numbers', 'Tus números del día'],
  fromChannel: ['From the channel', 'Del canal'], allVideos: ['All videos', 'Todos los videos'], video: ['Video', 'Video'],
  // Train
  yourPlan: ['Your plan', 'Tu plan'], daysWeek: ['{n} days a week', '{n} días a la semana'], comebackNote: [' · one set less while you ease back in', ' · una serie menos mientras retomas'],
  next: ['Next', 'Siguiente'], start: ['Start', 'Empezar'],
  pickWeight: ['How to pick your weight', 'Cómo elegir el peso'],
  pickWeightText: ['Choose a weight you can lift for the reps shown with good form. If you finish the top of the range with 3 or 4 reps left in the tank, go up a little next time. If you cannot reach the bottom, go down.', 'Elige un peso que puedas levantar las repeticiones indicadas con buena técnica. Si llegas al número más alto y aún te quedan 3 o 4 repeticiones, sube un poco la próxima vez. Si no llegas al número más bajo, baja el peso.'],
  readRoutine: ['Read the full routine', 'Leer la rutina completa'],
  library: ['Exercise library', 'Biblioteca de ejercicios'], nExercises: ['{n} exercises', '{n} ejercicios'],
  fAll: ['All', 'Todos'], fChest: ['Chest', 'Pecho'], fBack: ['Back', 'Espalda'], fShoulders: ['Shoulders', 'Hombros'], fArms: ['Arms', 'Brazos'], fLegs: ['Legs', 'Piernas'], fCore: ['Core', 'Abdomen'],
  history: ['History', 'Historial'], noHistory: ['Your finished workouts will show up here.', 'Aquí aparecerán tus entrenamientos terminados.'], nSets: ['{n} sets', '{n} series'],
  // Rank
  dragRotate: ['Drag to rotate. Your character grows as your rank goes up.', 'Desliza para girarlo. Tu personaje crece a medida que subes de rango.'],
  strengthScore: ['Strength score', 'Puntaje de fuerza'], reachedTop: ['You reached the top. Keep training to hold it.', 'Llegaste a la cima. Sigue entrenando para mantenerla.'],
  strength: ['Strength', 'Fuerza'], strengthSub: ['Your best lifts compared to your bodyweight', 'Tus mejores levantamientos comparados con tu peso'],
  consistency: ['Consistency', 'Constancia'], weeksHit: ['{n} weeks you hit your goal', '{n} semanas cumpliste tu meta'],
  howRank: ['How your rank works', 'Cómo funciona tu rango'],
  howRank1: ['75% comes from <b>strength</b>: your best set in every exercise, grouped by muscle group.', 'El 75% viene de tu <b>fuerza</b>: tu mejor serie en cada ejercicio, por grupo muscular.'],
  howRank2: ['25% comes from <b>consistency</b>: every week you hit your goal counts, forever.', 'El 25% viene de tu <b>constancia</b>: cada semana que cumples tu meta cuenta para siempre.'],
  howRank3: ['Your rank never drops when you take a week off. Muscle memory is real.', 'Tu rango nunca baja si descansas una semana. La memoria muscular es real.'],
  howRank4: ['The top rank is the natural limit. There is no shortcut past it.', 'El rango más alto es el límite natural. No hay atajo para pasarlo.'],
  allRanks: ['All ranks', 'Todos los rangos'],
  suggUp: ['Today: {w} {u} · up {d} {u}', 'Hoy: {w} {u} · sube {d} {u}'], suggSame: ['Today: {w} {u} · +1 rep', 'Hoy: {w} {u} · +1 repetición'],
  suggReps: ['Today: go for {r}', 'Hoy: busca {r}'],
  share: ['Share', 'Compartir'], saveImg: ['Save image', 'Guardar imagen'], shareRank: ['Share my rank', 'Compartir mi rango'],
  cardWorkout: ['Workout done', 'Entrenamiento hecho'], cardRank: ['My rank', 'Mi rango'], cardScore: ['score', 'puntaje'],
  cardWorkouts: ['workouts', 'entrenos'], cardMin: ['minutes', 'minutos'], cardSets: ['sets', 'series'],
  progress: ['Your progress', 'Tu progreso'], progressEmpty: ['Train for two weeks to see your line go up.', 'Entrena dos semanas para ver tu gráfica subir.'],
  exProgressReps: ['Best set (reps)', 'Mejor serie (repeticiones)'], exProgressW: ['Estimated max ({u})', 'Máximo estimado ({u})'],
  obStartHere: ['You start here. Every workout moves you up.', 'Aquí empiezas. Cada entrenamiento te sube.'],
  bTitle1: ['What are you training today?', '¿Qué entrenas hoy?'], bTitle2: ['Where are you training?', '¿Dónde entrenas?'], bTitle3: ['How much time do you have?', '¿Cuánto tiempo tienes?'],
  bPick: ['Pick one or more', 'Elige uno o varios'],
  fullBody: ['Full body', 'Cuerpo completo'], todayPlan: ['Today in your plan', 'Hoy en tu plan'],
  seePlan: ['My plan, exercises and history', 'Mi plan, ejercicios e historial'],
  place_gym: ['Gym', 'Gimnasio'], place_dumbbells: ['Home with dumbbells', 'Casa con mancuernas'], place_bodyweight: ['Home, no equipment', 'Casa sin equipo'],
  placeSub_gym: ['Machines, bars and dumbbells', 'Máquinas, barras y mancuernas'], placeSub_dumbbells: ['Dumbbells and your body', 'Mancuernas y tu cuerpo'], placeSub_bodyweight: ['Just your body', 'Solo tu cuerpo'],
  createWorkout: ['Create my workout', 'Crear mi rutina'], shuffle: ['Another option', 'Otra opción'], startNow: ['Start', 'Empezar'],
  nEx: ['{n} exercises · ~{m} min', '{n} ejercicios · ~{m} min'],
  noEx: ['No exercises for that combination. Try another place.', 'No hay ejercicios para esa combinación. Prueba otro lugar.'],
  myMuscles: ['Your muscles', 'Tus músculos'], readyLbl: ['Ready', 'Listos'], restingLbl: ['Recovering', 'Descansando'],
  suggest: ['Today: {g}', 'Hoy te toca: {g}'], buildBtn: ['Build a workout', 'Armar rutina'], restAll: ['Everything is recovering. Light day or rest.', 'Todo está descansando. Día suave o de descanso.'],
  moreN: ['+{n} more', '+{n} más'], fabLabel: ['Workout', 'Rutina'],
  age: ['Age', 'Edad'],
  byGroup: ['Strength by muscle group', 'Fuerza por grupo muscular'],
  byGroupNote: ['Every exercise counts. Your best set in each group, compared to your bodyweight and adjusted for age.', 'Cuenta cada ejercicio. Tu mejor serie de cada grupo, comparada con tu peso y ajustada por tu edad.'],
  g_chest: ['Chest', 'Pecho'], g_shoulders: ['Shoulders', 'Hombros'], g_back: ['Back', 'Espalda'], g_legs: ['Legs', 'Piernas'], g_hinge: ['Glutes and hamstrings', 'Glúteos y femorales'], g_arms: ['Arms', 'Brazos'], g_core: ['Core', 'Abdomen'],
  howRank5: ['Your bodyweight and age are taken into account, so everyone is measured fairly.', 'Se toman en cuenta tu peso y tu edad, así todos se miden de forma justa.'],
  badges: ['Achievements', 'Logros'],
  bFirst: ['First workout', 'Primer entreno'], bTen: ['10 workouts', '10 entrenos'], bFifty: ['50 workouts', '50 entrenos'], bStreak3: ['3-week streak', 'Racha de 3 semanas'],
  bIron: ['Reach Iron', 'Llegar a Iron'], bForged: ['Reach Forged', 'Llegar a Forged'], bBench: ['Bench your bodyweight', 'Banca con tu peso'], bLimit: ['Natural Limit', 'Natural Limit'],
  flexBtn: ['Flex', 'Flexionar'], tryAnim: ['Preview a rank up', 'Ver cómo sube de rango'],
  placeholderNote: ['Placeholder drawing: the images of your character go here.', 'Dibujo temporal: aquí van las imágenes de tu personaje.'],
  noGl: ['3D needs an internet connection for now.', 'Por ahora el 3D necesita conexión a internet.'],
  // Learn
  quizTab: ['Myth or fact', 'Mito o verdad'], articlesTab: ['Articles', 'Artículos'], videosTab: ['Videos', 'Videos'],
  questionN: ['Question {n} of {total}', 'Pregunta {n} de {total}'], nRight: ['{n} / {total} right', '{n} / {total} bien'],
  nextQuestion: ['Next question', 'Siguiente pregunta'],
  quizNote: ['Every answer comes from an Earned Strength article, with the studies listed at the end of each one.', 'Cada respuesta viene de un artículo de Earned Strength, con los estudios al final de cada uno.'],
  englishNote: ['', 'Los artículos y videos están en inglés por ahora.'],
  watch: ['Watch on YouTube', 'Ver en YouTube'],
  // Profile
  profile: ['Profile', 'Perfil'], you: ['You', 'Tú'], nLogged: ['{n} workouts logged', '{n} entrenamientos registrados'],
  units: ['Units', 'Unidades'], pounds: ['Pounds (lb)', 'Libras (lb)'], kilos: ['Kilograms (kg)', 'Kilogramos (kg)'],
  training: ['Training', 'Entrenamiento'], goal: ['Goal', 'Meta'], level: ['Level', 'Nivel'], equipment: ['Equipment', 'Equipo'],
  perWeek: ['Workouts per week', 'Entrenamientos por semana'], nDays: ['{n} days', '{n} días'],
  restDefault: ['Default rest time', 'Descanso por defecto'], nSeconds: ['{n} seconds', '{n} segundos'], nMinutes: ['{n} minutes', '{n} minutos'],
  reminders: ['Motivation reminders', 'Recordatorios de motivación'], remindersSub: ['One message a day at the time you choose. Arrives with the Android app.', 'Un mensaje al día a la hora que elijas. Llega con la app de Android.'],
  yourData: ['Your data', 'Tus datos'], dataNote: ['Everything is saved on this phone only. Save a backup file before changing phones.', 'Todo se guarda solo en este teléfono. Guarda una copia antes de cambiar de teléfono.'],
  saveBackup: ['Save backup', 'Guardar copia'], loadBackup: ['Load backup', 'Cargar copia'],
  demo: ['Fill with sample workouts (preview)', 'Llenar con entrenamientos de ejemplo (vista previa)'],
  intro: ['Replay the intro animation', 'Ver otra vez la animación de entrada'],
  deleteAll: ['Delete all my data', 'Borrar todos mis datos'],
  website: ['Website', 'Página web'], channel: ['YouTube channel', 'Canal de YouTube'], privacy: ['Privacy policy', 'Política de privacidad'], terms: ['Terms', 'Términos'],
  footer: ['Earned Strength · app prototype 0.2<br>Not medical advice. Check with a doctor before starting a new program.', 'Earned Strength · prototipo 0.2<br>No es consejo médico. Consulta a un médico antes de empezar un programa nuevo.'],
  saved: ['Saved', 'Guardado'],
  // Sheets
  howTo: ['How to do it', 'Cómo hacerlo'], stepByStep: ['Step by step', 'Paso a paso'], mistakes: ['Common mistakes', 'Errores comunes'], tip: ['Tip.', 'Consejo.'],
  perDumbbell: ['Log the weight of one dumbbell.', 'Anota el peso de una sola mancuerna.'],
  yourBest: ['Your best', 'Tu mejor marca'], bestReps: ['{n} reps in one set', '{n} repeticiones en una serie'], bestSecs: ['{n} seconds in one set', '{n} segundos en una serie'], best1rm: ['{w} {u} estimated one-rep max', '{w} {u} de máximo estimado a una repetición'],
  tool: ['Tool', 'Herramienta'], activity: ['Activity', 'Actividad'],
  maintain: ['Maintain', 'Mantener'], bulk: ['Build muscle (bulk)', 'Ganar músculo (volumen)'], cut: ['Lose fat (cut)', 'Bajar grasa (definición)'],
  protein: ['Protein', 'Proteína'], calories: ['Calories', 'Calorías'], gramsDay: ['grams a day', 'gramos al día'], kcalDay: ['kcal a day', 'kcal al día'],
  calcNote: ['Protein: 1.8 g per kg of bodyweight. Calories: your weight times an activity factor, plus 15% to build muscle or minus 20% to lose fat. Same formulas as the website calculator. These are starting points: adjust after 2 or 3 weeks based on your scale.', 'Proteína: 1.8 g por kg de peso. Calorías: tu peso por un factor de actividad, más 15% para ganar músculo o menos 20% para bajar grasa. Son las mismas fórmulas de la calculadora de la página. Son un punto de partida: ajusta después de 2 o 3 semanas según tu báscula.'],
  whyNumbers: ['Why these numbers', 'Por qué estos números'],
  cancel: ['Cancel', 'Cancelar'],
  // Rest timer
  restTitle: ['Rest timer', 'Descanso'], skip: ['Skip', 'Saltar'], keepRunning: ['Keep running in the background', 'Seguir contando en segundo plano'],
  restNote: ['Big lifts like squats and presses: 2 to 3 minutes. Smaller exercises: 1 to 2 minutes. Resting long enough lets you keep your reps up, which builds more muscle.', 'Ejercicios grandes como sentadilla y press: de 2 a 3 minutos. Ejercicios pequeños: de 1 a 2 minutos. Descansar lo suficiente te deja mantener las repeticiones, y eso construye más músculo.'],
  restOver: ['Rest is over. Next set.', 'Se acabó el descanso. Siguiente serie.'], rest: ['Rest', 'Descanso'],
  // Workout
  woHint: ['Tap a name to see how. Check each set when done.', 'Toca el nombre para ver cómo se hace. Marca cada serie al terminarla.'],
  target: ['Target: {sets} × {reps} {what}', 'Meta: {sets} × {reps} {what}'], reps: ['reps', 'repeticiones'], seconds: ['seconds', 'segundos'],
  oneDumbbell: [' · weight of one dumbbell', ' · peso de una mancuerna'],
  set: ['Set', 'Serie'], lastTime: ['Last time', 'La vez pasada'], repsShort: ['Reps', 'Reps'], secShort: ['Sec', 'Seg'], body: ['body', 'cuerpo'],
  addSet: ['Add set', 'Agregar serie'], finish: ['Finish workout', 'Terminar entrenamiento'],
  setsDone: ['{n} of {total} sets', '{n} de {total} series'],
  enterReps: ['Enter your reps first', 'Primero escribe tus repeticiones'], enterBoth: ['Enter the weight and reps first', 'Primero escribe el peso y las repeticiones'],
  allDone: ['All sets done. Tap Finish workout.', 'Todas las series listas. Toca Terminar entrenamiento.'],
  discardTitle: ['Discard this workout?', '¿Descartar este entrenamiento?'], discardText: ['You have not checked any sets yet, so there is nothing to save.', 'Todavía no marcas ninguna serie, así que no hay nada que guardar.'], discard: ['Discard', 'Descartar'],
  // Summary
  complete: ['Workout complete', 'Entrenamiento terminado'], niceWork: ['Nice work{name}.', 'Buen trabajo{name}.'],
  minutes: ['minutes', 'minutos'], setsWord: ['sets', 'series'], lifted: ['{u} lifted', '{u} levantados'],
  rankUp: ['Rank up', 'Subiste de rango'], prs: ['Personal records', 'Récords personales'], newBest: ['new best', 'nueva mejor marca'],
  noPrs: ['No new records today. Showing up is what gets you there.', 'Hoy no hubo récords. Presentarte es lo que te lleva ahí.'],
  musclesWorked: ['Muscles worked', 'Músculos trabajados'], yourScore: ['Your score', 'Tu puntaje'], thisWeekTitle: ['This week', 'Esta semana'],
  weekDone: ['{n} of {goal} workouts. Weekly goal done. Your streak is safe.', '{n} de {goal} entrenamientos. Meta semanal cumplida. Tu racha está a salvo.'],
  weekTodo: ['{n} of {goal} workouts. {left} more to keep your streak.', '{n} de {goal} entrenamientos. Te faltan {left} para mantener tu racha.'],
  done: ['Done', 'Listo'],
  // Data
  demoTitle: ['Fill with sample workouts?', '¿Llenar con entrenamientos de ejemplo?'], demoText: ['This adds about 10 weeks of example workouts so you can see how the app looks with real history. Your own workouts stay.', 'Esto agrega unas 10 semanas de entrenamientos de ejemplo para que veas cómo se ve la app con historial. Tus entrenamientos se quedan.'], demoYes: ['Add sample workouts', 'Agregar ejemplos'], demoAdded: ['Sample workouts added', 'Ejemplos agregados'],
  resetTitle: ['Delete all your data?', '¿Borrar todos tus datos?'], resetText: ['This erases your profile, workouts and rank from this phone. It cannot be undone.', 'Esto borra tu perfil, tus entrenamientos y tu rango de este teléfono. No se puede deshacer.'], resetYes: ['Delete everything', 'Borrar todo'],
  backupLoaded: ['Backup loaded', 'Copia cargada'], badBackup: ['That file is not an Earned Strength backup', 'Ese archivo no es una copia de Earned Strength'],
  // Round 4: logger extras, history, comparisons, challenge, plates
  exOptions: ['Exercise options', 'Opciones del ejercicio'], swapFor: ['Swap for', 'Cambiar por'],
  swapLocked: ['You already logged sets here, so it can\'t be swapped.', 'Ya anotaste series aquí, así que no se puede cambiar.'],
  noAlts: ['No other exercises for this here.', 'No hay otros ejercicios para esto aquí.'],
  removeEx: ['Remove exercise', 'Quitar ejercicio'], removed: ['Exercise removed', 'Ejercicio quitado'],
  removeTitle: ['Remove this exercise?', '¿Quitar este ejercicio?'], removeText: ['The sets you logged for it will be lost.', 'Se pierden las series que anotaste.'],
  swapped: ['Swapped to {name}', 'Cambiado por {name}'], added: ['{name} added', '{name}: agregado'],
  addExercise: ['Add exercise', 'Agregar ejercicio'], pickTitle: ['Pick an exercise', 'Elige un ejercicio'], allGroups: ['All', 'Todos'],
  prevMonth: ['Previous month', 'Mes anterior'], nextMonth: ['Next month', 'Mes siguiente'],
  monthCount: ['{n} workouts this month', '{n} entrenamientos este mes'], nWorkouts: ['{n} workouts', '{n} entrenamientos'],
  prTag: ['Record', 'Récord'], repeat: ['Repeat', 'Repetir'], delWorkout: ['Delete', 'Borrar'],
  delTitle: ['Delete this workout?', '¿Borrar este entrenamiento?'], delText: ['It leaves your history and your score. It cannot be undone.', 'Se quita de tu historial y de tu puntaje. No se puede deshacer.'],
  deleted: ['Workout deleted', 'Entrenamiento borrado'], finishFirst: ['Finish the workout you have open first.', 'Primero termina el entrenamiento que tienes abierto.'],
  repsWord: ['reps', 'repeticiones'],
  likeLifting: ['That\'s like lifting {n} {thing}', 'Es como levantar {n} {thing}'],
  approxBw: ['Bodyweight reps count as about 60% of your weight.', 'Las repeticiones con tu cuerpo cuentan como un 60% de tu peso.'],
  lifetime: ['Lifted in total', 'Levantado en total'],
  th_dog: ['dog|dogs', 'perro|perros'], th_kangaroo: ['kangaroo|kangaroos', 'canguro|canguros'], th_piano: ['piano|pianos', 'piano|pianos'],
  th_horse: ['horse|horses', 'caballo|caballos'], th_car: ['car|cars', 'carro|carros'], th_rhino: ['rhino|rhinos', 'rinoceronte|rinocerontes'],
  th_elephant: ['elephant|elephants', 'elefante|elefantes'], th_trex: ['T. rex|T. rexes', 'T. rex|T. rex'], th_bus: ['bus|buses', 'bus|buses'],
  th_whale: ['humpback whale|humpback whales', 'ballena jorobada|ballenas jorobadas'], th_bluewhale: ['blue whale|blue whales', 'ballena azul|ballenas azules'],
  th_station: ['space station|space stations', 'estación espacial|estaciones espaciales'],
  chTitle: ['Daily challenge', 'Reto del día'], chLeft: ['{n} to go, in as many sets as you like', 'Te faltan {n}, en las series que quieras'],
  chDone: ['Done. A new one comes tomorrow.', 'Cumplido. Mañana hay otro.'], chToast: ['Challenge done!', '¡Reto cumplido!'],
  chStreak: ['{n} days in a row', '{n} días seguidos'], chStreak1: ['1 day', '1 día'], minute: ['minute', 'minuto'], undo: ['Undo', 'Deshacer'],
  platesTool: ['Plates', 'Discos'], platesTitle: ['Plate calculator', 'Calculadora de discos'], platesSub: ['What goes on each side', 'Qué poner a cada lado'],
  totalW: ['Total weight ({u})', 'Peso total ({u})'], barW: ['Bar', 'Barra'], perSide: ['Each side', 'Cada lado'], barOnly: ['Just the bar', 'Solo la barra'],
  closest: ['Closest you can load: {w} {u}', 'Lo más cercano que puedes armar: {w} {u}'],
  ormTitle: ['Your max', 'Tu máximo'], ormSub: ['Your best single rep', 'Tu mejor repetición'], ormW: ['Weight ({u})', 'Peso ({u})'], ormR: ['Reps', 'Repeticiones'],
  ormRes: ['Estimated max for 1 rep', 'Máximo estimado a 1 repetición'], aboutReps: ['about {n} reps', 'unas {n} repeticiones'],
  ormNote: ['An estimate, not a test. It works best with sets of 10 reps or less.', 'Es un cálculo aproximado, no una prueba. Funciona mejor con 10 repeticiones o menos.'],
  close: ['Close', 'Cerrar'],
};
export function t(key, vars) {
  const pair = UI[key];
  let s = pair ? pair[lang === 'es' ? 1 : 0] : key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));
  return s;
}

// ---------- Spanish content ----------
const MUSCLES = {
  Chest: 'Pecho', Triceps: 'Tríceps', 'Front shoulders': 'Hombro frontal', Shoulders: 'Hombros', 'Upper chest': 'Pecho alto', 'Side shoulders': 'Hombro lateral',
  Lats: 'Dorsales', 'Upper back': 'Espalda alta', Biceps: 'Bíceps', Forearms: 'Antebrazos', Quads: 'Cuádriceps', Glutes: 'Glúteos', 'Inner thighs': 'Aductores',
  Hamstrings: 'Isquiotibiales', 'Lower back': 'Espalda baja', Calves: 'Pantorrillas', Abs: 'Abdomen', Core: 'Zona media', 'Rear shoulders': 'Hombro posterior',
};
const EX = {
  'bench-press': ['Press de banca', ['Acuéstate con los ojos debajo de la barra, los pies en el piso y los omóplatos hacia atrás y abajo.', 'Agarra la barra un poco más ancho que los hombros y bájala con control hasta la mitad del pecho.', 'Empuja hacia arriba y un poco hacia atrás hasta estirar los brazos.'], ['Rebotar la barra en el pecho.', 'Abrir los codos totalmente hacia los lados.'], 'Usa un compañero o los seguros del rack cuando subas de peso.'],
  'overhead-press': ['Press militar', ['Empieza con la barra sobre la parte delantera de los hombros, manos un poco más afuera que los hombros.', 'Aprieta el abdomen y los glúteos y empuja hacia arriba, moviendo la cabeza un poco hacia atrás para que pase la barra.', 'Termina con la barra sobre la mitad del pie y los brazos estirados.'], ['Echarte muy hacia atrás para empujar.', 'Empujar la barra hacia adelante en vez de hacia arriba.'], 'Aprieta los glúteos: así no se te arquea la espalda baja.'],
  'lateral-raise': ['Elevaciones laterales', ['Sostén mancuernas ligeras a los lados con los codos un poco doblados.', 'Sube los brazos hacia los lados hasta más o menos la altura de los hombros.', 'Baja despacio, sin dejar caer el peso.'], ['Balancear el cuerpo para subir el peso.', 'Usar mucho peso y encoger los hombros.'], 'Aquí funciona mejor poco peso y buena técnica que mucho peso.'],
  'triceps-pushdown': ['Extensión de tríceps en polea', ['Párate frente a la polea con barra o cuerda, con los codos pegados a los lados.', 'Empuja hacia abajo hasta estirar los brazos.', 'Deja que suba con control sin mover los codos.'], ['Mover los codos hacia adelante.', 'Inclinarte sobre el peso y empujar con el cuerpo.'], 'Haz una pausa de un segundo abajo en cada repetición.'],
  'lat-pulldown': ['Jalón al pecho', ['Siéntate con los muslos bajo el soporte y agarra la barra un poco más ancho que los hombros.', 'Jala la barra hacia la parte alta del pecho, guiando con los codos.', 'Deja que la barra suba despacio hasta estirar los brazos.'], ['Echarte muy atrás y convertirlo en un remo.', 'Jalar la barra por detrás de la nuca.'], 'Piensa en llevar los codos hacia los bolsillos de atrás.'],
  'barbell-row': ['Remo con barra', ['Inclínate desde la cadera con la espalda recta y la barra colgando cerca de las rodillas.', 'Jala la barra hacia las costillas de abajo.', 'Bájala con control sin enderezarte.'], ['Encorvar la espalda baja.', 'Subir el peso de un tirón con la cadera.'], 'Mantén el mismo ángulo del torso en cada repetición.'],
  'barbell-curl': ['Curl con barra', ['Párate derecho y agarra la barra al ancho de los hombros, palmas hacia arriba.', 'Sube la barra sin despegar los codos de los lados.', 'Bájala completa con control.'], ['Balancear la espalda para subir la barra.', 'No bajar del todo.'], 'Si tienes que balancearte, el peso es demasiado.'],
  'hammer-curl': ['Curl martillo', ['Sostén las mancuernas con las palmas mirándose entre sí.', 'Sube sin girar las muñecas.', 'Baja despacio.'], ['Mover los codos hacia adelante.', 'Bajar demasiado rápido.'], 'Ayuda a que los brazos se vean más gruesos de frente.'],
  'squat': ['Sentadilla', ['Barra sobre la parte alta de la espalda, pies al ancho de los hombros y puntas un poco hacia afuera.', 'Aprieta el abdomen y baja hacia atrás hasta que los muslos queden al menos paralelos, con las rodillas siguiendo las puntas de los pies.', 'Sube empujando con todo el pie.'], ['Rodillas que se van hacia adentro.', 'Talones que se despegan del piso.'], 'Toma una respiración profunda y sostenla antes de cada repetición.'],
  'romanian-deadlift': ['Peso muerto rumano', ['Párate con la barra en las manos y las rodillas un poco dobladas.', 'Lleva la cadera hacia atrás y baja la barra pegada a los muslos con la espalda recta.', 'Para cuando sientas un buen estiramiento atrás de los muslos y sube empujando la cadera hacia adelante.'], ['Encorvar la espalda para bajar más.', 'Doblar tanto las rodillas que se vuelve una sentadilla.'], 'Mantén la barra pegada a las piernas todo el tiempo.'],
  'hip-thrust': ['Empuje de cadera (hip thrust)', ['Espalda alta apoyada en un banco, barra con protector sobre la cadera y pies en el piso.', 'Sube la cadera hasta que el cuerpo quede recto de hombros a rodillas.', 'Aprieta un segundo arriba y baja con control.'], ['Arquear la espalda baja arriba.', 'Pies muy adelante o muy cerca.'], 'Mete la barbilla y mira al frente, no al techo.'],
  'leg-press': ['Prensa de piernas', ['Siéntate con la espalda pegada al respaldo y los pies al ancho de los hombros.', 'Baja hasta que las rodillas queden más o menos en 90 grados.', 'Empuja de vuelta sin bloquear las rodillas de golpe.'], ['Despegar la espalda baja del respaldo.', 'Repeticiones muy cortas con demasiado peso.'], 'Repeticiones completas y controladas valen más que media repetición pesada.'],
  'calf-raise': ['Elevación de pantorrillas', ['Párate con la punta de los pies en un escalón.', 'Baja los talones hasta sentir un buen estiramiento.', 'Sube lo más alto que puedas y haz una pausa.'], ['Rebotar abajo.', 'Moverte muy poco.'], 'Haz una pausa de un segundo arriba y abajo.'],
  'plank': ['Plancha', ['Antebrazos en el piso, codos debajo de los hombros.', 'Mantén el cuerpo recto de la cabeza a los talones.', 'Aprieta glúteos y abdomen, y sigue respirando.'], ['Dejar caer la cadera.', 'Subir demasiado la cadera.'], 'Valen más segundos bien hechos que aguantar mucho tiempo mal.'],
  'db-bench-press': ['Press de banca con mancuernas', ['Acuéstate en un banco con una mancuerna en cada mano a la altura del pecho.', 'Empuja hasta estirar los brazos, juntando un poco las mancuernas.', 'Baja despacio hasta sentir estiramiento en el pecho.'], ['Dejar caer las mancuernas muy rápido abajo.', 'Arquear la espalda y despegarla del banco.'], '¿No tienes banco? Hazlo en el piso. Se llama press de piso y también funciona.'],
  'db-shoulder-press': ['Press de hombros con mancuernas', ['Sentado o de pie, con las mancuernas a la altura de los hombros y las palmas al frente.', 'Empuja hacia arriba hasta estirar los brazos.', 'Baja a los hombros con control.'], ['Arquear la espalda baja.', 'Bajar solo hasta la mitad.'], 'Aprieta el abdomen como si alguien te fuera a picar la panza.'],
  'oh-triceps-extension': ['Extensión de tríceps sobre la cabeza', ['Sostén una mancuerna con las dos manos encima de la cabeza.', 'Bájala por detrás de la cabeza doblando los codos.', 'Estira los brazos de nuevo.'], ['Abrir mucho los codos.', 'Arquear la espalda.'], 'El estiramiento de abajo es lo que hace que este ejercicio funcione.'],
  'db-row': ['Remo con mancuerna a una mano', ['Una mano y una rodilla en el banco, espalda recta y la mancuerna en la otra mano.', 'Jala la mancuerna hacia la cadera.', 'Bájala hasta estirar el brazo.'], ['Girar el torso para subir el peso.', 'Jalar hacia el hombro en vez de hacia la cadera.'], 'Imagina que arrancas una podadora, pero lento y con control.'],
  'rear-delt-fly': ['Aperturas para hombro posterior', ['Inclínate hacia adelante con la espalda recta y mancuernas ligeras colgando.', 'Abre los brazos hacia los lados con los codos un poco doblados.', 'Baja despacio.'], ['Usar impulso.', 'Apretar tanto los omóplatos que trabajan más los trapecios.'], 'Ayuda a que los hombros se vean llenos de lado.'],
  'db-curl': ['Curl con mancuernas', ['De pie con las mancuernas a los lados y las palmas al frente.', 'Sube sin despegar los codos de los lados.', 'Baja hasta abajo.'], ['Balancear las mancuernas.', 'Mover los codos hacia adelante.'], 'Gira un poco el meñique hacia arriba al final para apretar más.'],
  'goblet-squat': ['Sentadilla goblet', ['Sostén una mancuerna pegada al pecho.', 'Baja entre las rodillas hasta que los muslos queden al menos paralelos.', 'Sube empujando con todo el pie.'], ['Rodillas hacia adentro.', 'Inclinarte mucho hacia adelante.'], 'El peso adelante te ayuda a mantenerte derecho. Es ideal para aprender a hacer sentadilla.'],
  'db-rdl': ['Peso muerto rumano con mancuernas', ['Sostén las mancuernas frente a los muslos con las rodillas un poco dobladas.', 'Lleva la cadera hacia atrás y baja las mancuernas pegadas a las piernas con la espalda recta.', 'Sube empujando la cadera hacia adelante.'], ['Encorvar la espalda.', 'Dejar que las mancuernas se alejen de las piernas.'], 'Mueve la cadera hacia atrás, no el pecho hacia abajo.'],
  'lunge': ['Zancadas', ['Da un paso adelante y baja hasta que las dos rodillas queden en unos 90 grados.', 'Mantén el torso derecho.', 'Empuja para volver al inicio. Las repeticiones son por pierna.'], ['La rodilla de adelante se va hacia adentro.', 'Pasos demasiado cortos.'], 'Cuando se te haga fácil, agarra mancuernas a los lados.'],
  'push-up': ['Flexiones', ['Manos un poco más anchas que los hombros, cuerpo recto de la cabeza a los talones.', 'Baja hasta que el pecho casi toque el piso, con los codos a unos 45 grados.', 'Empuja de vuelta hacia arriba.'], ['Dejar caer la cadera.', 'Bajar solo hasta la mitad.'], '¿Muy difícil por ahora? Apoya las manos en un banco o una mesa.'],
  'pike-push-up': ['Flexiones en pica', ['Empieza en posición de flexión y camina con los pies hacia las manos para subir la cadera.', 'Dobla los codos y baja la cabeza hacia el piso.', 'Empuja de vuelta.'], ['Bajar la cadera durante la repetición.', 'Abrir mucho los codos.'], 'Entre más alta la cadera, más trabajan los hombros.'],
  'chair-dip': ['Fondos en banco', ['Manos en el borde de un banco o una silla firme detrás de ti.', 'Baja doblando los codos hasta unos 90 grados.', 'Empuja de vuelta hacia arriba.'], ['Bajar tanto que te duelan los hombros.', 'Subir los hombros hacia las orejas.'], 'Dobla las rodillas para hacerlo más fácil y estira las piernas para hacerlo más difícil.'],
  'inverted-row': ['Dominadas o remo invertido', ['Dominada: cuélgate de una barra y sube el pecho hacia ella.', '¿No tienes barra? Acuéstate debajo de una mesa firme, agarra el borde y sube el pecho hacia ella.', 'Baja completo con control.'], ['Repeticiones a medias.', 'Patear con las piernas para subir.'], 'Anota la versión que puedas hacer al menos 6 veces bien hecha.'],
  'bw-squat': ['Sentadilla sin peso', ['Pies al ancho de los hombros y puntas un poco hacia afuera.', 'Baja hacia atrás hasta que los muslos queden al menos paralelos.', 'Sube empujando con todo el pie.'], ['Despegar los talones.', 'Rodillas hacia adentro.'], 'Baja más lento para hacerla más difícil.'],
  'split-squat': ['Sentadilla dividida', ['Un pie adelante y otro atrás, como un paso largo.', 'Baja la rodilla de atrás hacia el piso.', 'Sube empujando con el pie de adelante. Las repeticiones son por pierna.'], ['Despegar el talón de adelante.', 'Inclinarte mucho hacia adelante.'], 'Pon el pie de atrás sobre una silla para hacerla mucho más difícil.'],
  'backpack-curl': ['Curl con mochila', ['Llena una mochila con libros o botellas de agua y agárrala de las correas con las dos manos.', 'Súbela hacia el pecho con los codos pegados a los lados.', 'Bájala despacio.'], ['Balancear la mochila.', 'Mover los codos hacia adelante.'], 'Pesa la mochila en una báscula para poder anotar el peso.'],
  'crunch': ['Crunch abdominal', ['Acuéstate boca arriba, rodillas dobladas y manos junto a las orejas.', 'Despega los hombros del piso apretando el abdomen.', 'Baja despacio. La espalda baja no se despega del piso.'], ['Jalar la cabeza con las manos.', 'Usar impulso.'], 'Bota el aire al subir.'],
  'leg-raise': ['Elevación de piernas acostado', ['Acuéstate boca arriba, piernas estiradas y manos debajo de la cadera.', 'Sube las piernas hasta que apunten al techo.', 'Bájalas despacio sin tocar el piso.'], ['Arquear la espalda baja.', 'Dejar caer las piernas rápido.'], 'Dobla un poco las rodillas para hacerlo más fácil.'],
  'superman': ['Superman', ['Acuéstate boca abajo con los brazos estirados al frente.', 'Levanta los brazos, el pecho y las piernas unos centímetros del piso.', 'Aguanta un segundo y baja.'], ['Subir tanto que se te fuerce el cuello.', 'Aguantar la respiración.'], 'Aprieta glúteos y omóplatos arriba.'],
  'diamond-push-up': ['Flexiones diamante', ['Posición de flexión con las manos juntas debajo del pecho, formando un diamante.', 'Baja el pecho hacia las manos con los codos pegados al cuerpo.', 'Empuja de vuelta hacia arriba.'], ['Abrir los codos.', 'Dejar caer la cadera.'], '¿Muy difícil por ahora? Hazlas con las rodillas en el piso.'],
  'glute-bridge': ['Puente de glúteos', ['Acuéstate boca arriba, con las rodillas dobladas y los pies en el piso.', 'Sube la cadera hasta que el cuerpo quede recto de hombros a rodillas.', 'Aprieta un segundo y baja.'], ['Arquear la espalda baja.', 'Empujar con las puntas de los pies.'], 'Cuando se te haga fácil, prueba con una pierna a la vez.'],
};
const PROG = { gym: 'Empuje / Jalón / Piernas', dumbbells: 'Empuje / Jalón / Piernas con mancuernas', bodyweight: 'Cuerpo completo en casa' };
const DAYS = { push: ['Empuje', 'Pecho, hombros y tríceps'], pull: ['Jalón', 'Espalda y bíceps'], legs: ['Piernas', 'Piernas completas'], a: ['Cuerpo completo A', 'Flexiones, sentadillas y remos'], b: ['Cuerpo completo B', 'Hombros, piernas y glúteos'] };
const OPTS = {
  muscle: ['Ganar músculo', 'Verte más grande y definido'], strength: ['Ser más fuerte', 'Levantar más en los ejercicios principales'], fat: ['Bajar grasa', 'Mantener el músculo mientras te defines'], habit: ['Crear el hábito', 'Entrenar constante, semana tras semana'],
  beginner: ['Principiante', 'Menos de 1 año entrenando'], intermediate: ['Intermedio', 'De 1 a 3 años'], advanced: ['Avanzado', 'Más de 3 años'], comeback: ['Regresando', 'Vuelves después de un descanso'],
  gym: ['Gimnasio completo', 'Barras, máquinas y poleas'], dumbbells: ['Solo mancuernas', 'En casa o en un gimnasio pequeño'], bodyweight: ['Sin equipo', 'Solo tu cuerpo'],
};
const RANK_LINES = ['Todos empiezan aquí.', 'El hábito se está formando.', 'La fuerza real ya se nota.', 'Años de trabajo, y se nota.', 'Nivel alto, construido como se debe.', 'Hasta donde llega lo natural. Sin atajos.'];
const RANK_EX = ['Registra tu primer entrenamiento', 'Press de banca de unas 0.75 veces tu peso, o 15 flexiones seguidas', 'Press de banca de 1 vez tu peso, o 25 flexiones seguidas', 'Press de banca de unas 1.25 veces tu peso, o 35 flexiones seguidas', 'Press de banca de unas 1.5 veces tu peso, o 45 flexiones seguidas', 'Press de banca de unas 1.75 veces tu peso, o 60 flexiones seguidas'];
const MYTHS = [
  ['Sin dolor no hay ganancia.', 'El esfuerzo debe sentirse duro, pero un dolor agudo o en las articulaciones es una señal para parar, no de progreso.'],
  ['El peso muerto daña la espalda.', 'Con buena técnica y pesos razonables, el peso muerto hace tu espalda más fuerte.'],
  ['Si no quedas adolorido, el músculo no creció.', 'El dolor muscular baja a medida que tu cuerpo se adapta. No mide el crecimiento.'],
  ['El cardio hace que pierdas el músculo que ganaste.', 'Un cardio moderado no borra tus avances si sigues entrenando con pesas y comes suficiente proteína.'],
  ['Entrenar todos los días sin descanso da mejores resultados.', 'El músculo crece mientras te recuperas. Los días de descanso son parte del plan.'],
  ['La proteína en polvo es casi lo mismo que los esteroides.', 'Es proteína de alimentos en forma de polvo, no una droga. Solo es una opción práctica.'],
  ['Los abdominales queman la grasa de la panza.', 'No puedes quemar grasa de un solo lugar. Bajar grasa depende de toda tu alimentación y actividad.'],
  ['Sin suplementos no vas a progresar.', 'El entrenamiento, la comida y el sueño hacen casi todo el trabajo. Los suplementos son el pequeño extra.'],
  ['El músculo crece mientras descansas, no mientras entrenas.', 'Entrenar es la señal. La construcción pasa en las horas y los días después, mientras te recuperas.'],
  ['El músculo que perdiste en un descanso regresa más rápido de lo que tardó en crecer.', 'La memoria muscular es real: recuperar el tamaño perdido suele ser más rápido que construirlo la primera vez.'],
  ['El sueño afecta cuánto músculo construyes.', 'Dormir mal empeora la recuperación, la fuerza y el control del apetito. Dormir es parte del entrenamiento.'],
  ['Puedes llegar a tu meta de proteína con comida normal.', 'El polvo es opcional. El pollo, los huevos, el pescado, los lácteos y las legumbres cuentan.'],
];
const ART_CATS = { Training: 'Entrenamiento', Nutrition: 'Nutrición', 'Supplements and health': 'Suplementos y salud', Recovery: 'Recuperación', Mindset: 'Mentalidad' };
const ART = {
  '/beginner-routine': 'Rutina para principiantes: tus primeros 3 meses', '/hypertrophy-strength': 'Hipertrofia vs fuerza', '/gym-myths': '8 mitos del gym que te frenan', '/stop-training-muscles': 'Qué pasa cuando dejas de entrenar',
  '/daily-protein': 'Cuánta proteína necesitas de verdad', '/high-protein-foods': 'Alimentos altos en proteína que valen la pena', '/bulking-cutting': 'Volumen vs definición', '/lose-weight': 'Cómo bajar de peso de verdad',
  '/creatine-guide': 'Guía de creatina', '/protein-powder': '¿La proteína en polvo es mala?', '/steroids-article': 'Por qué los esteroides no valen la pena',
  '/after-workout-muscles': 'Dentro de tus músculos después de entrenar', '/sleep-recovery': 'Sueño y recuperación', '/overtraining-signs': 'Señales de sobreentrenamiento',
  '/discipline-motivation': 'Disciplina vs motivación', '/social-media-comparison': 'Compararte en redes sociales',
};
const VIDEOS = {
  oLVFBchiFKA: 'Dentro de tus músculos después de entrenar', '3CfapTScHrk': 'Cuando dejas de entrenar', b267VCsazdo: 'Errores con la creatina que te hacen gastar de más',
  MP6o4UZB7Fk: 'Mitos del gym que te frenan', gdqlqDKMqJw: 'Cuánta proteína necesitas', rha9o3nnS_0: 'La misma proteína, comidas muy distintas',
  rWNc7ValMv4: 'Proteína en polvo: el riesgo real', c2rZHOzhl3c: 'Esteroides: por qué no valen la pena',
};
const ACT = { 24: ['Sedentario', 'Poco o nada de ejercicio'], 27: ['Ligero', 'Entrenas de 1 a 3 días por semana'], 30: ['Moderado', 'Entrenas de 3 a 5 días por semana'], 33: ['Intenso', 'Entrenas de 6 a 7 días por semana'] };

const es = () => lang === 'es';
export const muscleName = (m) => (es() && MUSCLES[m]) || m;
export function exText(id, e) {
  const x = es() && EX[id];
  return x ? { name: x[0], steps: x[1], mistakes: x[2], tip: x[3] } : { name: e.name, steps: e.steps, mistakes: e.mistakes, tip: e.tip };
}
export const programName = (key, p) => (es() && PROG[key]) || p.name;
export const dayName = (d) => (es() && DAYS[d.id] ? DAYS[d.id][0] : d.name);
export const dayFocus = (d) => (es() && DAYS[d.id] ? DAYS[d.id][1] : d.focus);
export const optText = (o) => (es() && OPTS[o.id] ? { name: OPTS[o.id][0], note: OPTS[o.id][1] } : o);
export const rankLine = (i, r) => (es() ? RANK_LINES[i] : r.line);
export const rankExample = (i, en) => (es() ? RANK_EX[i] : en);
export const mythText = (i, m) => (es() && MYTHS[i] ? { q: MYTHS[i][0], a: MYTHS[i][1] } : { q: m.q, a: m.a });
export const articleCat = (c) => (es() && ART_CATS[c]) || c;
export const articleTitle = (href, title) => (es() && ART[href]) || title;
export const videoTopic = (v) => (es() && VIDEOS[v.id]) || v.topic;
export const activityText = (a) => (es() && ACT[a.f] ? { name: ACT[a.f][0], note: ACT[a.f][1] } : a);
