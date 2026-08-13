document.addEventListener('DOMContentLoaded', function () {

  document.body.classList.add('page-loaded');

  const revealSelectors = '.card, .risk, .callout, .day-block, .table-wrap, .video-embed, .curve-block, article h2, .cover-img, .hero-img';
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
