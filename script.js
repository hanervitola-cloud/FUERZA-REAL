if (/\.github\.io$|\.workers\.dev$/.test(location.hostname) ||
    (location.hostname === 'earnedstrength.online' && location.protocol === 'http:')) {
  var esPath = location.pathname.replace(/^\/FUERZA-REAL/i, '').replace(/\.html$/, '').replace(/\/index$/, '/');
  location.replace('https://earnedstrength.online' + (esPath || '/') + location.search + location.hash);
}

document.addEventListener('DOMContentLoaded', function () {

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

  if (document.querySelector('.article-hero-full')) {
    const calcBtn = document.createElement('a');
    calcBtn.href = '/calculator';
    calcBtn.className = 'calc-float-btn';
    calcBtn.innerHTML = '🧮 <span>Calculator</span>';
    document.body.appendChild(calcBtn);
  }

  const drop = document.querySelector('.nav-drop');
  if (drop) {
    const toggle = drop.querySelector('.nav-drop-toggle');
    const touch = window.matchMedia('(hover: none)');
    const close = function () { drop.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', function (e) {
      if (touch.matches || window.innerWidth <= 700) {
        e.preventDefault();
        toggle.setAttribute('aria-expanded', drop.classList.toggle('open'));
      }
    });
    document.addEventListener('click', function (e) { if (!drop.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  const article = document.querySelector('article.article');
  if (article && document.querySelector('.article-hero-full')) {
    const bar = document.createElement('div');
    bar.className = 'read-progress';
    document.body.appendChild(bar);
    const update = function () {
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const done = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.style.transform = 'scaleX(' + done + ')';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

});
