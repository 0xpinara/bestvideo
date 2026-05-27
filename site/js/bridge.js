/**
 * Sends “Sign in”, “Get started”, and article CTAs to the web app subdomain.
 * Marketing pages stay on the main domain for SEO.
 */
(function () {
  var cfg = window.LUMEN_URLS || {};
  var app = String(cfg.app || '').replace(/\/$/, '');
  if (!app) return;

  document.querySelectorAll('a[href="/signup.html"], a[href="/login.html"]').forEach(function (a) {
    a.href = app + '/';
    a.setAttribute('rel', 'noopener');
  });

  document.querySelectorAll('a[data-app-href]').forEach(function (a) {
    var path = a.getAttribute('data-app-href') || '/';
    a.href = app + (path.startsWith('/') ? path : '/' + path);
    a.setAttribute('rel', 'noopener');
  });
})();
