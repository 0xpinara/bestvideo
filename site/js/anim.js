/* Lumen Studio — small, dependency-free animation helpers.
 * Honours prefers-reduced-motion. ~1 KB minified. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- Scroll-reveal -------- */
  var faders = document.querySelectorAll('.fade-up');
  if (faders.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '-40px 0px' });
    faders.forEach(function (el) { io.observe(el); });
  } else {
    faders.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* -------- Parallax layers -------- */
  if (!reduceMotion) {
    var layers = document.querySelectorAll('.parallax');
    var ticking = false;
    function update() {
      var y = window.scrollY;
      layers.forEach(function (el) {
        var depth = parseFloat(el.getAttribute('data-depth') || '0.2');
        el.style.transform = 'translate3d(0,' + (y * depth) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  /* -------- Falling sakura petals (hero only) -------- */
  var field = document.querySelector('.petal-field');
  if (field && !reduceMotion) {
    var COLORS = ['#F4B6C2', '#F6C6A7', '#E89478', '#C7B8E0'];
    function spawn() {
      var p = document.createElement('div');
      p.className = 'petal';
      var size = 8 + Math.random() * 14;
      var dur  = 12 + Math.random() * 10;
      var delay = Math.random() * 3;
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.animationDuration = dur + 's';
      p.style.animationDelay = delay + 's';
      var c = COLORS[Math.floor(Math.random() * COLORS.length)];
      p.style.background =
        'radial-gradient(ellipse at 30% 30%, ' + c + ' 0%, ' +
        'color-mix(in srgb, ' + c + ' 60%, transparent) 70%, transparent 100%)';
      p.style.borderRadius = '60% 40% 70% 30% / 60% 40% 60% 40%';
      field.appendChild(p);
      setTimeout(function () { p.remove(); }, (dur + delay) * 1000 + 200);
    }
    for (var i = 0; i < 18; i++) setTimeout(spawn, i * 220);
    setInterval(spawn, 800);
  }

  /* -------- Subtle hover-tilt on .tilt-card -------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width  - 0.5;
        var y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform =
          'perspective(800px) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 4) + 'deg) translateY(-3px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* -------- Year stamp in footer -------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
