document.addEventListener('DOMContentLoaded', function () {

  // --- Animación de entrada estilo splash (solo en portada) ---
  if (document.querySelector('.hero')) {
    const intro = document.createElement('div');
    intro.id = 'intro-overlay';
    intro.innerHTML = '<div class="intro-logo">FUERZA<span>REAL</span></div><div class="intro-line"></div>';
    document.body.prepend(intro);
    document.body.style.overflow = 'hidden';

    setTimeout(function () {
      intro.classList.add('intro-hide');
      document.body.style.overflow = '';
    }, 4500);

    setTimeout(function () {
      intro.remove();
    }, 5400);
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
