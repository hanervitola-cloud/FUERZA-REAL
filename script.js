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

  // --- Pregunta de nivel (solo en portada) ---
  if (document.querySelector('.feed-grid')) {
    const savedLevel = localStorage.getItem('fr_level');

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
          const badge = document.createElement('span');
          badge.className = 'recommended-badge';
          badge.textContent = 'Recomendado para ti';
          card.prepend(badge);
        }
      });
    }

    if (savedLevel) {
      applyLevel(savedLevel);
    } else {
      const modal = document.createElement('div');
      modal.className = 'level-modal';
      modal.innerHTML =
        '<div class="level-card">' +
        '<span class="level-eyebrow">Antes de empezar</span>' +
        '<h3>¿Cuál es tu nivel?</h3>' +
        '<p>Te mostramos primero lo que más te sirve.</p>' +
        '<div class="level-options">' +
        '<button data-level="principiante">Principiante</button>' +
        '<button data-level="proceso">En proceso</button>' +
        '<button data-level="avanzado">Avanzado</button>' +
        '</div>' +
        '<button class="level-skip">Saltar</button>' +
        '</div>';
      document.body.appendChild(modal);

      setTimeout(function () { modal.classList.add('show'); }, 800);

      modal.querySelectorAll('[data-level]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const level = btn.getAttribute('data-level');
          localStorage.setItem('fr_level', level);
          applyLevel(level);
          modal.classList.remove('show');
          setTimeout(function () { modal.remove(); }, 400);
        });
      });

      modal.querySelector('.level-skip').addEventListener('click', function () {
        modal.classList.remove('show');
        setTimeout(function () { modal.remove(); }, 400);
      });
    }
  }

  // --- Fade-in general al cargar la página ---
  document.body.classList.add('page-loaded');

  // --- Scroll reveal: los bloques de contenido aparecen al hacer scroll ---
  const revealSelectors = '.card, .risk, .callout, .day-block, .table-wrap, .video-embed, .curve-block, article h2, .cover-img, .hero-img';
  const revealEls = document.querySelectorAll(revealSelectors);

  revealEls.forEach(function (el) {
    el.classList.add('js-reveal');
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // --- Botón "volver arriba" ---
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Volver arriba');
  backToTop.innerHTML = '↑';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
