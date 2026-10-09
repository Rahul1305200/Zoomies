/* Gallery carousel: arrows scroll the track by one slide; arrows disable at the ends. */
(function () {
  function state(car) {
    var t = car.querySelector('.gal-track');
    var prev = car.querySelector('[data-gal="prev"]'), next = car.querySelector('[data-gal="next"]');
    if (!t || !prev || !next) return;
    prev.disabled = t.scrollLeft <= 2;
    next.disabled = t.scrollLeft + t.clientWidth >= t.scrollWidth - 2;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-gal]');
    if (!b) return;
    var car = b.closest('.gal-car'), t = car && car.querySelector('.gal-track');
    var s = t && t.querySelector('.gal-slide');
    if (!s) return;
    var step = s.getBoundingClientRect().width + (parseFloat(getComputedStyle(t).columnGap) || 0);
    t.scrollBy({ left: b.getAttribute('data-gal') === 'next' ? step : -step, behavior: 'smooth' });
  });
  function init() {
    document.querySelectorAll('.gal-car').forEach(function (car) {
      var t = car.querySelector('.gal-track');
      if (!t) return;
      if (!car._galInit) {
        car._galInit = true;
        t.addEventListener('scroll', function () { state(car); }, { passive: true });
      }
      state(car);
    });
  }
  window.addEventListener('resize', init);
  window.addEventListener('load', init);
  document.addEventListener('DOMContentLoaded', init);
  setTimeout(init, 500);
  setTimeout(init, 1500);
})();
