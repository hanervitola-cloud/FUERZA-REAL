document.addEventListener('DOMContentLoaded', function () {

  // --- Animación de entrada estilo splash (solo en portada) ---
  if (document.querySelector('.hero')) {
    const intro = document.createElement('div');
    intro.id = 'intro-overlay';

    const word1 = 'FUERZA';
    const word2 = 'REAL';
    let lettersHTML = '';
    let delay = 0;
    word1.split('').forEach(function (ch) {
      lettersHTML += '<span class="ch" style="animation-delay:' + delay + 'ms">' + ch + '</span>';
      delay += 55;
    });
    word2.split('').forEach(function (ch) {
      lettersHTML += '<span class="ch ch-accent" style="animation-delay:' + delay + 'ms">' + ch + '</span>';
      delay += 55;
    });

    intro.innerHTML =
      '<div class="intro-panel intro-panel-top"></div>' +
      '<div class="intro-panel intro-panel-bottom"></div>' +
      '<div class="intro-logo-wrap"><div class="intro-logo">' + lettersHTML + '</div><div class="intro-line"></div></div>';

    document.body.prepend(intro);
    document.body.style.overflow = 'hidden';

    setTimeout(function () {
      intro.classList.add('intro-hide');
      document.body.style.overflow = '';
    }, 2600);

    setTimeout(function () {
      intro.remove();
    }, 3800);
  }

  const hasHero = !!document.querySelector('.hero');
  const introTotalTime = hasHero ? 3900 : 200;

  // --- Pregunta de nivel (solo en portada, siempre pregunta) ---
  if (document.querySelector('.feed-grid')) {

    function applyLevel(level) {
      const priority = {
        principiante: ['rutina-principiantes.html', 'mitos-gimnasio.html', 'articulo-esteroides.html', 'proteina-diaria.html', 'creatina-guia.html'],
        proceso: ['proteina-diaria.html', 'mitos-gimnasio.html', 'rutina-principiantes.html', 'creatina-guia.html', 'articulo-esteroides.html'],
        avanzado: ['creatina-guia.html', 'proteina-diaria.html', 'mitos-gimnasio.html', 'rutina-principiantes.html', 'articulo-esteroides.html']
      };
      const order = priority[level];
      if (!order) return;

      const grid = document.querySelector('.feed-grid');
      const cards = Array.from(grid.querySelectorAll('.card'));

      cards.sort(function (a, b) {
        const aHref = a.getAttribute('href');
        const bHref = b.getAttribute('href');
        return order.indexOf(aHref) - order.indexOf(bHref);
      });

      cards.forEach(function (card, i) {
        grid.appendChild(card);
        const oldBadge = card.querySelector('.recommended-badge');
        if (oldBadge) oldBadge.remove();
        if (i === 0) {
          const badge =
