// Earned Strength website: language (English / Spanish) and small helpers. No tracking, no ads.
(function () {
  // Copies of the site on other hosts send people to the real address.
  if (/\.github\.io$|\.workers\.dev$|\.vercel\.app$/.test(location.hostname) || (location.hostname === 'earnedstrength.online' && location.protocol === 'http:')) {
    var p = location.pathname.replace(/^\/FUERZA-REAL/i, '').replace(/\.html$/, '').replace(/\/index$/, '/');
    location.replace('https://earnedstrength.online' + (p || '/') + location.search + location.hash);
    return;
  }

  var T = {
    en: {
      navFeatures: 'Features', navChannel: 'Channel', navCalc: 'Calculator', openApp: 'Open the app',
      heroEyebrow: 'The Earned Strength app', heroTitle: 'Train natural. <em>Watch yourself grow.</em>',
      heroLead: 'Your plan, your rank, a 24/7 coach and challenges where the camera counts your reps. Free, and no ads.',
      soonSmall: 'COMING SOON ON', soonBig: 'Google Play', heroNote: 'Works today in your phone’s browser. The Android app is on its way.',
      nEx: 'exercises with the character', nCh: 'camera challenges', nRank: 'ranks to climb', nSport: 'combat and bodyweight sports',
      featTitle: 'Everything you need to train well. Nothing you don’t.',
      featLead: 'Built for people who train natural and want honest progress.',
      f1Eye: 'Compete', f1Title: 'The camera counts your reps.',
      f1Text: 'Push-ups, squats, pull-ups, bench press and more. Only real, full reps count, so nobody cheats.',
      f1a: 'Alone with your own goal, or against friends', f1b: 'Live rooms: each friend on their own phone', f1c: 'Record a video with your count on it',
      f2Eye: 'Your plan', f2Title: 'It tells you what weight to use today.',
      f2Text: 'A plan that fits your days, your time and your equipment, and grows with you every week.',
      f2a: 'Tell it how a lift felt and it adjusts', f2b: 'Supersets, machine notes and a rest timer', f2c: '30-day programs, warm-ups and stretches',
      f3Eye: 'Progress', f3Title: 'Rank up with your real strength.',
      f3Text: 'From Rookie to Natural Limit. Every lift counts toward your rank, compared fairly with your bodyweight.',
      f3a: 'Strength by muscle group and per exercise', f3b: 'Daily streak, missions and achievements', f3c: 'Monthly summary and before-and-after photos',
      f4Eye: 'Coach', f4Title: 'A coach that answers, any time.',
      f4Text: 'Ask about training, technique, food or recovery. Straight answers in plain language, based on evidence.',
      f4a: 'Knows your plan, your records and your goal', f4b: 'Warns you to stop when something hurts', f4c: 'Works offline for the basics',
      moreTitle: 'And a lot more.',
      m1t: 'Protein, water and calories', m1p: 'Three rings for your day, with simple meal ideas.',
      m2t: 'Boxing, MMA and Muay Thai', m2p: 'Lessons, combos, a round timer and guided shadowboxing.',
      m3t: 'Calisthenics', m3p: 'Levels from your first push-up to the muscle-up.',
      m4t: 'Friends and weekly league', m4p: 'Add friends with a code and see who trains the most.',
      m5t: 'Sign in with Google', m5p: 'Your account and backup on any phone. Optional.',
      m6t: 'Light and dark mode', m6p: 'In English and Spanish, with your own color and title.',
      chTitle: 'From the Earned Strength channel',
      chText: 'The app comes from the YouTube channel: natural training, no myths and no shortcuts. Watch the videos and train with the same method.',
      chBtn: 'Watch on YouTube',
      calcTitle: 'Protein and calorie calculator', calcText: 'Find out in seconds how much protein and how many calories you need for your goal.', calcBtn: 'Open the calculator',
      finalTitle: 'No myths. No shortcuts.', finalText: 'Open the app now and do your first workout today. It’s free.',
      footAbout: 'The app for natural training: your plan, your rank and your coach.',
      footApp: 'App', footSite: 'Site', footContact: 'Contact', footPrivacy: 'Privacy', footTerms: 'Terms',
      footNote: 'Informational content about training. It does not replace advice from a doctor or a certified trainer.',
      lang: 'Español'
    },
    es: {
      navFeatures: 'Funciones', navChannel: 'Canal', navCalc: 'Calculadora', openApp: 'Abrir la app',
      heroEyebrow: 'La app de Earned Strength', heroTitle: 'Entrena natural. <em>Mira cómo creces.</em>',
      heroLead: 'Tu plan, tu rango, un coach 24/7 y retos donde la cámara cuenta tus repeticiones. Gratis y sin anuncios.',
      soonSmall: 'MUY PRONTO EN', soonBig: 'Google Play', heroNote: 'Hoy ya funciona en el navegador de tu celular. La app de Android viene en camino.',
      nEx: 'ejercicios con el personaje', nCh: 'retos con cámara', nRank: 'rangos para subir', nSport: 'deportes de combate y calistenia',
      featTitle: 'Todo lo que necesitas para entrenar bien. Nada de relleno.',
      featLead: 'Hecha para quien entrena natural y quiere progreso de verdad.',
      f1Eye: 'Compite', f1Title: 'La cámara cuenta tus repeticiones.',
      f1Text: 'Flexiones, sentadillas, dominadas, press de banca y más. Solo cuentan las repeticiones completas, así nadie hace trampa.',
      f1a: 'Solo con tu propia meta, o contra tus amigos', f1b: 'Salas en vivo: cada amigo en su celular', f1c: 'Graba un video con tu conteo',
      f2Eye: 'Tu plan', f2Title: 'Te dice qué peso usar hoy.',
      f2Text: 'Un plan según tus días, tu tiempo y tu equipo, que sube contigo cada semana.',
      f2a: 'Dile cómo se sintió y se ajusta', f2b: 'Superseries, notas de máquina y descanso con reloj', f2c: 'Programas de 30 días, calentamiento y estiramiento',
      f3Eye: 'Progreso', f3Title: 'Sube de rango con tu fuerza real.',
      f3Text: 'De Rookie a Natural Limit. Cada ejercicio cuenta para tu rango, comparado de forma justa con tu peso.',
      f3a: 'Fuerza por músculo y por ejercicio', f3b: 'Racha diaria, misiones y logros', f3c: 'Resumen del mes y fotos de antes y después',
      f4Eye: 'Coach', f4Title: 'Un coach que te responde a cualquier hora.',
      f4Text: 'Pregunta de entrenamiento, técnica, comida o descanso. Respuestas claras y basadas en evidencia.',
      f4a: 'Conoce tu plan, tus récords y tu meta', f4b: 'Te dice que pares si algo duele', f4c: 'Lo básico funciona sin internet',
      moreTitle: 'Y mucho más.',
      m1t: 'Proteína, agua y calorías', m1p: 'Tres anillos para tu día, con ideas de comidas sencillas.',
      m2t: 'Boxeo, MMA y Muay Thai', m2p: 'Lecciones, combos, reloj de rounds y sombra guiada.',
      m3t: 'Calistenia', m3p: 'Niveles desde tu primera flexión hasta el muscle-up.',
      m4t: 'Amigos y liga semanal', m4p: 'Agrega amigos con un código y mira quién entrena más.',
      m5t: 'Entra con Google', m5p: 'Tu cuenta y tu respaldo en cualquier celular. Opcional.',
      m6t: 'Modo claro y oscuro', m6p: 'En español e inglés, con tu color y tu título.',
      chTitle: 'Del canal Earned Strength',
      chText: 'La app nace del canal de YouTube: entrenamiento natural, sin mitos y sin atajos. Mira los videos y entrena con el mismo método.',
      chBtn: 'Ver en YouTube',
      calcTitle: 'Calculadora de proteína y calorías', calcText: 'Descubre en segundos cuánta proteína y cuántas calorías necesitas para tu meta.', calcBtn: 'Abrir la calculadora',
      finalTitle: 'Sin mitos. Sin atajos.', finalText: 'Abre la app y haz tu primer entrenamiento hoy. Es gratis.',
      footAbout: 'La app para entrenar natural: tu plan, tu rango y tu coach.',
      footApp: 'App', footSite: 'Sitio', footContact: 'Contacto', footPrivacy: 'Privacidad', footTerms: 'Condiciones',
      footNote: 'Contenido informativo sobre entrenamiento. No reemplaza el consejo de un médico o de un entrenador certificado.',
      lang: 'English'
    }
  };
  // Pages can add their own words (the calculator does).
  window.ES_WORDS = window.ES_WORDS || { en: {}, es: {} };

  function pick() {
    try { var s = localStorage.getItem('es-site-lang'); if (s === 'es' || s === 'en') return s; } catch (e) { /* storage blocked */ }
    return /^es\b/i.test(navigator.language || '') ? 'es' : 'en';
  }
  var lang = pick();
  function apply() {
    var words = Object.assign({}, T[lang], window.ES_WORDS[lang]);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i]').forEach(function (el) { var v = words[el.getAttribute('data-i')]; if (v != null) el.innerHTML = v; });
    document.querySelectorAll('[data-shot]').forEach(function (img) { img.src = 'img/' + img.getAttribute('data-shot') + '-' + lang + '.webp'; });
    document.querySelectorAll('[data-i-ph]').forEach(function (el) { var v = words[el.getAttribute('data-i-ph')]; if (v != null) el.placeholder = v; });
    if (window.ES_TITLE) document.title = window.ES_TITLE[lang];
    document.dispatchEvent(new CustomEvent('es-lang', { detail: lang }));
  }
  window.esLang = function () { return lang; };
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = lang === 'es' ? 'en' : 'es';
      try { localStorage.setItem('es-site-lang', lang); } catch (e) { /* storage blocked */ }
      apply();
    });
  });
  apply();
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
