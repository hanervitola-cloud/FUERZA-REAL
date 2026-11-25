// Motivation lines for the coach card and the end of a workout. [English, Spanish]
// The app picks them at random and does not repeat one until it has shown the others.
export const QUOTES = [
  // Showing up
  ['Every rep you log today is strength you keep tomorrow.', 'Cada repetición que anotas hoy es fuerza que te llevas mañana.'],
  ["You don't need to feel like it. Show up, and the drive comes after.", 'No necesitas tener ganas. Preséntate y las ganas llegan después.'],
  ['Four weeks of showing up beat one perfect week.', 'Cuatro semanas presentándote valen más que una semana perfecta.'],
  ['Your body adapts to what you do often, not to what you do once.', 'Tu cuerpo se adapta a lo que haces seguido, no a lo que haces una vez.'],
  ['A short workout today beats no workout.', 'Un entrenamiento corto hoy vale más que ninguno.'],
  ['The hardest part is the first set. Start there.', 'Lo más difícil es la primera serie. Empieza por ahí.'],
  ['You are one workout closer than yesterday.', 'Hoy estás un entrenamiento más cerca que ayer.'],
  ['Twenty minutes still counts. Go.', 'Veinte minutos también cuentan. Ve.'],
  ['Put your shoes on. The rest gets easier.', 'Ponte los tenis. Lo demás se vuelve más fácil.'],
  ['Motivation comes and goes. The habit stays.', 'La motivación va y viene. El hábito se queda.'],
  ['Show up on the days you do not want to. Those are the ones that count.', 'Preséntate los días que no quieres. Esos son los que cuentan.'],
  ['Done is better than perfect.', 'Hecho es mejor que perfecto.'],
  ['Train today so you can be proud tonight.', 'Entrena hoy para dormir orgulloso esta noche.'],
  // Progress
  ['Strength is built slowly. That is why it lasts.', 'La fuerza se construye despacio. Por eso dura.'],
  ['Beat last week, not other people.', 'Gánale a tu semana pasada, no a los demás.'],
  ['One more rep than last time. That is the whole secret.', 'Una repetición más que la vez pasada. Ese es todo el secreto.'],
  ['Small progress is still progress.', 'Avanzar poco sigue siendo avanzar.'],
  ['Consistency turns effort into muscle.', 'La constancia convierte el esfuerzo en músculo.'],
  ['A month from now you will be glad you started today.', 'En un mes vas a agradecer haber empezado hoy.'],
  ['Train for the person you will be in a year.', 'Entrena por la persona que vas a ser en un año.'],
  ['Compare yourself with who you were, never with someone else.', 'Compárate con quien eras, nunca con otra persona.'],
  ['Slow progress is still faster than standing still.', 'Avanzar lento sigue siendo más rápido que quedarte quieto.'],
  ['You will not see it in a day. You will see it in a season.', 'No lo vas a ver en un día. Lo vas a ver en unos meses.'],
  ['The mirror changes last. Your numbers change first. Trust them.', 'El espejo cambia de último. Tus números cambian primero. Créeles.'],
  ['Nobody sees the first workouts. Everybody sees the results.', 'Nadie ve los primeros entrenamientos. Todos ven los resultados.'],
  ['I know you can do better than last time. So do you.', 'Yo sé que puedes mejorar lo de la vez pasada. Y tú también lo sabes.'],
  ['You are stronger than the last time you doubted yourself.', 'Eres más fuerte que la última vez que dudaste de ti.'],
  // Weights and numbers
  ['5 lb more in three months. That is how a body gets built.', '5 kg más en tres meses. Así se construye un cuerpo.'],
  ['Add a little each time. Nobody is asking for more.', '2,5 kg cada vez. Nadie te pide más.'],
  ['The empty bar weighs 45 lb. Your excuse weighs less.', 'La barra vacía pesa 20 kg. Tu excusa pesa menos.'],
  ['An ounce of consistency beats a pound of motivation.', 'Un gramo de constancia vale más que un kilo de motivación.'],
  ['You do not need a huge lift today. You need a little more than last week.', 'No necesitas 100 kg hoy. Necesitas medio kilo más que la semana pasada.'],
  ['Every pound you add to the bar is a pound of doubt you drop.', 'Cada kilo que le subes a la barra es un kilo de duda que te quitas.'],
  ['10 lb a month is 120 lb a year. Do the math and do the work.', '2,5 kg cada dos semanas son 60 kg en un año. Haz la cuenta y haz el trabajo.'],
  ['The weight does not know you are tired.', 'El peso no sabe que estás cansado.'],
  ['The bar is honest: it is either up or it is not.', 'La barra es honesta: o subió o no subió.'],
  ['Heavy is just a number you have not beaten yet.', 'Pesado es solo un número que todavía no has superado.'],
  ['Every rep is a vote for the person you want to be.', 'Cada repetición es un voto por la persona que quieres ser.'],
  ['The plates do not care about your mood. Lift them anyway.', 'A los discos no les importa tu humor. Levántalos igual.'],
  ['Write the number down. Beat it next time.', 'Anota el número. La próxima vez, supéralo.'],
  ['Three sets today are three sets you will not have to make up.', 'Tres series hoy son tres series que no vas a tener que recuperar.'],
  // Technique and health
  ['Good form first. Heavy weight later.', 'Primero buena técnica. El peso pesado viene después.'],
  ['Rest days count too: muscle grows while you recover.', 'Los días de descanso también cuentan: el músculo crece mientras te recuperas.'],
  ['Sleep, eat protein, train. Repeat.', 'Duerme, come proteína, entrena. Repite.'],
  ['Control the weight. Do not let it control you.', 'Controla el peso. Que no te controle él a ti.'],
  ['Ego lifts hurt. Smart lifts grow.', 'Levantar por ego lastima. Levantar con cabeza hace crecer.'],
  ['Pain in the joint means stop. Burn in the muscle means keep going.', 'Dolor en la articulación es para parar. Ardor en el músculo es para seguir.'],
  ['Water, sleep and food are part of the workout.', 'Agua, sueño y comida también son parte del entrenamiento.'],
  ['Warm up for five minutes. Your joints will thank you for years.', 'Calienta cinco minutos. Tus articulaciones te lo van a agradecer por años.'],
  ['Protein at every meal. Simple and it works.', 'Proteína en cada comida. Simple y funciona.'],
  ['A full range of motion builds more than a heavy half rep.', 'Un movimiento completo construye más que media repetición pesada.'],
  // Discipline
  ['Discipline is remembering what you want.', 'La disciplina es acordarte de lo que quieres.'],
  ['No shortcuts. That is what makes it yours.', 'Sin atajos. Por eso es tuyo.'],
  ['Discipline is choosing between what you want now and what you want most.', 'La disciplina es elegir entre lo que quieres ahora y lo que más quieres.'],
  ['You will not always be motivated. Be disciplined instead.', 'No siempre vas a tener motivación. Ten disciplina.'],
  ['Make it so normal that skipping feels strange.', 'Hazlo tan normal que saltártelo se sienta raro.'],
  ['The habit you build today does the work tomorrow.', 'El hábito que construyes hoy hace el trabajo mañana.'],
  ['Win the morning, win the day.', 'Gana la mañana y ganas el día.'],
  ['Keep the promise you made to yourself.', 'Cumple la promesa que te hiciste a ti mismo.'],
  ['Hard choices, easy life. Easy choices, hard life.', 'Decisiones difíciles, vida fácil. Decisiones fáciles, vida difícil.'],
  ['Be the one who did it, not the one who almost did.', 'Sé el que lo hizo, no el que casi lo hace.'],
  ['You do not rise to your goals. You fall to your habits.', 'No subes al nivel de tus metas. Bajas al nivel de tus hábitos.'],
  ['Focus on the next set, not the whole year.', 'Enfócate en la próxima serie, no en todo el año.'],
  ['Effort is the only part that is completely yours.', 'El esfuerzo es la única parte que es completamente tuya.'],
  // Raw
  ['If you do not save yourself, nobody will.', 'Si no te salvas tú mismo, nadie lo hará.'],
  ['Nobody is coming to do it for you.', 'Nadie va a venir a hacerlo por ti.'],
  ['Tired passes. Quitting stays.', 'El cansancio pasa. Rendirte se queda.'],
  ['Your excuse does not lift weight.', 'Tu excusa no levanta peso.'],
  ['Nobody remembers the ones who almost did it.', 'Nadie se acuerda de los que casi lo hicieron.'],
  ['If it were easy, everybody would have the body they want.', 'Si fuera fácil, todos tendrían el cuerpo que quieren.'],
  ['It hurts now or it hurts later, when you regret it.', 'Duele ahora o duele después, cuando te arrepientas.'],
  ['Nobody is watching you today. That is exactly why it counts.', 'Hoy nadie te está mirando. Justo por eso cuenta.'],
  ['You will not get there with feelings. You will get there with discipline.', 'No vas a llegar con ganas. Vas a llegar con disciplina.'],
  ['Your muscles do not listen to excuses.', 'Tus músculos no escuchan excusas.'],
  ['You can be tired and train anyway.', 'Puedes estar cansado y entrenar igual.'],
  ['Nobody owes you anything. Earn it.', 'Nadie te debe nada. Gánatelo.'],
  ['Comfortable is not the same as happy.', 'Cómodo no es lo mismo que feliz.'],
  ['What you avoid today follows you tomorrow.', 'Lo que evitas hoy te persigue mañana.'],
  ['Discipline weighs ounces. Regret weighs tons.', 'La disciplina pesa gramos. El arrepentimiento pesa toneladas.'],
  ['The couch never made anyone stronger.', 'El sofá nunca hizo fuerte a nadie.'],
  ['You said "tomorrow" yesterday too.', 'Ayer también dijiste "mañana".'],
  ['Stop waiting for Monday.', 'Deja de esperar al lunes.'],
  ['Nobody cares how tired you are. Do it anyway.', 'A nadie le importa lo cansado que estés. Hazlo igual.'],
  ['The version of you that quits is not the real you.', 'La versión de ti que se rinde no es la de verdad.'],
  ['Results do not come to visit. You go and get them.', 'Los resultados no vienen de visita. Tú vas por ellos.'],
  ['Pain is temporary. The body you build is not.', 'El dolor es temporal. El cuerpo que construyes no.'],
  ['Either you run the day or the day runs you.', 'O tú mandas en el día, o el día manda en ti.'],
  ['You have been "about to start" for too long.', 'Llevas demasiado tiempo "a punto de empezar".'],
  ['Talking about it lifts nothing.', 'Hablar de eso no levanta nada.'],
  ['Wanting it is not enough. Doing it is.', 'Quererlo no alcanza. Hacerlo sí.'],
  ['Nobody gets strong by accident.', 'Nadie se pone fuerte por accidente.'],
  ['Your future self is watching what you do right now.', 'Tu yo del futuro está viendo lo que haces ahora mismo.'],
  ['Sweat now, or make excuses later.', 'Suda ahora o pon excusas después.'],
  ['The only bad workout is the one you skipped.', 'El único mal entrenamiento es el que te saltaste.'],
  // Fighters
  ['Champions are made in the rounds nobody sees.', 'Los campeones se hacen en los rounds que nadie ve.'],
  ['Hands up, chin down, keep moving. In the ring and in life.', 'Manos arriba, mentón abajo y muévete. En el ring y en la vida.'],
  ['Getting hit is part of it. Staying down is a choice.', 'Que te peguen es parte. Quedarte en el piso es decisión tuya.'],
  ['The last round is where you find out who you are.', 'En el último round descubres quién eres.'],
  ['Tired fighters lose. Train your lungs.', 'El peleador cansado pierde. Entrena tus pulmones.'],
  ['Shadowbox like someone is in front of you.', 'Haz sombra como si alguien estuviera enfrente.'],
  // Calm and long term
  ['Be patient. Muscle is slow, but it is loyal.', 'Ten paciencia. El músculo es lento, pero es fiel.'],
  ['One bad day does not ruin a good month.', 'Un mal día no arruina un buen mes.'],
  ['Missed a day? Do not miss two.', '¿Fallaste un día? No falles dos.'],
  ['You are not behind. You are on your own path.', 'No vas atrasado. Vas por tu propio camino.'],
  ['Progress is not a straight line. Keep walking.', 'El progreso no es una línea recta. Sigue caminando.'],
  ['Be proud of the reps nobody clapped for.', 'Siéntete orgulloso de las repeticiones que nadie aplaudió.'],
  ['Strong is a skill. You get better by practicing.', 'Ser fuerte es una habilidad. Mejoras practicando.'],
  ['Take care of your body. It is the only place you have to live.', 'Cuida tu cuerpo. Es el único lugar donde vas a vivir.'],
  ['Start where you are. Use what you have. Do what you can.', 'Empieza donde estás. Usa lo que tienes. Haz lo que puedas.'],
  ['The best time to start was a year ago. The second best is today.', 'El mejor momento para empezar fue hace un año. El segundo mejor es hoy.'],
];

// Lines built from the person's own numbers. c comes from the app (see quoteCtx in app.js);
// every value can be missing, so each line checks what it needs first.
export function personalQuotes(c, es) {
  const out = [];
  const add = (key, en, sp) => out.push([key, es ? sp : en]);
  const nm = c.name || '';
  if (c.top) {
    add('p-best', `Your best ${c.top.ex}: ${c.top.w} ${c.u}. Next stop: ${c.top.next} ${c.u}.`, `Tu mejor marca en ${c.top.ex}: ${c.top.w} ${c.u}. La próxima parada: ${c.top.next} ${c.u}.`);
    if (c.top.prev && c.top.prev < c.top.w) add('p-grow', `A month ago your ${c.top.ex} was ${c.top.prev} ${c.u}. Now it is ${c.top.w} ${c.u}. That is not luck, that is work.`, `Hace un mes tu ${c.top.ex} era ${c.top.prev} ${c.u}. Hoy es ${c.top.w} ${c.u}. Eso no es suerte, es trabajo.`);
  }
  if (c.week > 0) add('p-week', `You have moved ${c.week} ${c.u} this week. Every pound counts.`, `Esta semana ya moviste ${c.week} ${c.u}. Cada kilo cuenta.`);
  else if (c.workouts > 0) add('p-zero', `This week you are still at 0 ${c.u}. Fix that today.`, `Esta semana todavía vas en 0 ${c.u}. Arréglalo hoy.`);
  if (c.month > 0) add('p-month', `${c.month} ${c.u} lifted in the last 30 days. Imagine the next 30.`, `${c.month} ${c.u} levantados en los últimos 30 días. Imagínate los próximos 30.`);
  if (c.daysOff >= 3) add('p-off', `${c.daysOff} days without training. The weight will not lift itself.`, `Llevas ${c.daysOff} días sin entrenar. El peso no se va a levantar solo.`);
  if (c.daysOff >= 2 && nm) add('p-off2', `${nm}, I know you can do better. Today, not tomorrow.`, `${nm}, yo sé que puedes mejorar. Pero hoy, no mañana.`);
  if (nm) {
    add('p-name1', `${nm}, nobody is going to train for you.`, `${nm}, nadie va a entrenar por ti.`);
    add('p-name2', `I know you can improve, ${nm}. Prove it to yourself.`, `Yo sé que puedes mejorar, ${nm}. Demuéstratelo a ti mismo.`);
    add('p-name3', `${nm}, if you do not save yourself, nobody will.`, `${nm}, si no te salvas tú mismo, nadie lo hará.`);
  }
  if (c.workouts > 0) add('p-count', `${c.workouts} workouts logged. Number ${c.workouts + 1} is today's.`, `${c.workouts} entrenamientos anotados. El número ${c.workouts + 1} es el de hoy.`);
  else add('p-first', 'Your first workout is the hardest one. After that it is all adding up.', 'Tu primer entrenamiento es el más difícil. Después todo es sumar.');
  if (c.streak > 0) add('p-streak', `${c.streak} week${c.streak === 1 ? '' : 's'} in a row hitting your goal. Do not break the chain.`, `${c.streak} semana${c.streak === 1 ? '' : 's'} seguida${c.streak === 1 ? '' : 's'} cumpliendo. No rompas la cadena.`);
  if (c.rank) add('p-rank', `${c.rank.pts} points to ${c.rank.name}. They are in your next sessions.`, `Te faltan ${c.rank.pts} puntos para ${c.rank.name}. Están en tus próximas sesiones.`);
  if (c.target) add('p-target', `${c.target.left} ${c.u} to go until ${c.target.goal} ${c.u}. One week at a time.`, `Te faltan ${c.target.left} ${c.u} para llegar a ${c.target.goal} ${c.u}. Semana a semana.`);
  return out;
}
