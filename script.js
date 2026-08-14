document.addEventListener('DOMContentLoaded', function () {

  // --- Splash simple de entrada (solo en portada) ---
  if (document.querySelector('.hero-full') && !document.querySelector('.article-hero-full')) {
    const intro = document.createElement('div');
    intro.id = 'intro-splash';
    intro.innerHTML = '<span class="intro-splash-logo">FUERZA<span>REAL</span></span>';
    document.body.prepend(intro);
    document.body.style.overflow = 'hidden';

    setTimeout(function () {
      intro.classList.add('intro-splash-hide');
      document.body.style.overflow = '';
    }, 1400);

    setTimeout(function () {
      intro.remove();
    }, 2100);
  }

  document.body.classList.add('page-loaded');

  const revealSelectors = '.card, .risk, .callout, .day-block, .table-wrap, .video-embed, .curve-block, article h2, .cover-img, .hero-img, .statement-img, .hero-full-img';
  const revealEls = document.querySelectorAll(revealSelectors);

  revealEls.forEach(function (el, i) {
    el.classList.add('js-reveal');
    el.style.transitionDelay = (i % 4) * 90 + 'ms';
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
