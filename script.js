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
