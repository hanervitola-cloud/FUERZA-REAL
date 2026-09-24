document.addEventListener('DOMContentLoaded', function () {

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
  backToTop.setAttribute('aria-label', 'Back to top');
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

  if (!window.location.pathname.endsWith('calculator.html')) {
    const calcBtn = document.createElement('a');
    calcBtn.href = 'calculator.html';
    calcBtn.className = 'calc-float-btn';
    calcBtn.innerHTML = '🧮 <span>Calculator</span>';
    document.body.appendChild(calcBtn);
  }

  // Cookie consent banner
  try {
    if (!localStorage.getItem('cookie_consent')) {
      const banner = document.createElement('div');
      banner.id = 'cookie-banner';
      banner.innerHTML = '<p>This site uses cookies from Google AdSense to serve ads. By continuing, you accept their use. <a href="/privacy.html">Learn more</a></p><button id="cookie-accept">Got it</button>';
      banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#1e2327;color:#ccc;font-family:Inter,sans-serif;font-size:13px;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;z-index:9999;border-top:1px solid #2a2f35;';
      banner.querySelector('a').style.cssText = 'color:#C8443B;';
      const btn = banner.querySelector('#cookie-accept');
      btn.style.cssText = 'background:#C8443B;color:#fff;border:none;padding:8px 18px;font-size:13px;font-family:Inter,sans-serif;cursor:pointer;flex-shrink:0;';
      document.body.appendChild(banner);
      btn.addEventListener('click', function () {
        try { localStorage.setItem('cookie_consent', '1'); } catch(e) {}
        banner.remove();
      });
    }
  } catch(e) {}

});
