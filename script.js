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

  if (!/\/calculator(\.html)?$/.test(window.location.pathname)) {
    const calcBtn = document.createElement('a');
    calcBtn.href = '/calculator';
    calcBtn.className = 'calc-float-btn';
    calcBtn.innerHTML = '🧮 <span>Calculator</span>';
    document.body.appendChild(calcBtn);
  }

});
