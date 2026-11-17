
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }


  /* fade-in on load and scroll */
  (function () {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    var els = document.querySelectorAll('main .wrap > *');
    if (!els.length) { return; }
    document.documentElement.classList.add('rv-on');
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
          setTimeout(function () { e.target.classList.remove('rv'); e.target.classList.remove('in'); e.target.style.removeProperty('--rv-d'); }, 1200);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el, i) {
      el.classList.add('rv');
      var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--rv-d', Math.min(sib, 4) * 0.08 + 's');
      io.observe(el);
    });
  })();

  /* service cards */
  var slots = document.querySelectorAll('.svc-slot');
  if (slots.length) {
    var measure = function () {
      slots.forEach(function (sl) {
        var c = sl.querySelector('.svc-card');
        sl.classList.remove('js'); sl.style.height = '';
        var canHover = window.matchMedia('(hover:hover)').matches;
        var extra = 0;
        if (canHover) { c.querySelectorAll('.d > span').forEach(function (d) { extra = Math.max(extra, d.scrollHeight); }); }
        sl.style.height = (c.offsetHeight + extra) + 'px';
        sl.classList.add('js');
      });
    };
    measure();
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(measure); }
    window.addEventListener('load', measure);
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(measure, 120); });

    document.querySelectorAll('.svc-open').forEach(function (btn) {
      var dlg = document.getElementById(btn.getAttribute('data-dialog'));
      if (!dlg || typeof dlg.showModal !== 'function') { btn.hidden = true; return; }
      btn.closest('.svc-card').addEventListener('click', function () {
        dlg.showModal();
        document.documentElement.classList.add('modal-open');
      });
      dlg.addEventListener('close', function () { document.documentElement.classList.remove('modal-open'); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) { dlg.close(); } });
      dlg.querySelector('.dlg-close').addEventListener('click', function () { dlg.close(); });
    });
  }

  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-msg');
      var d = form.dataset;
      var name = form.elements['name'].value.trim();
      var email = form.elements['email'].value.trim();
      var message = form.elements['message'] ? form.elements['message'].value.trim() : '';
      var needs = Array.prototype.map.call(form.querySelectorAll('input[name=need]:checked'), function (i) { return i.value; });
      var to = d.mailto;
      function show(text) { msg.textContent = text; msg.classList.add('show'); }
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
        show(d.invalid);
        (!name ? form.elements['name'] : form.elements['email']).focus();
        return;
      }
      var subject = d.subject + ' ' + name;
      var body = d.lblName + ': ' + name + '\n' + d.lblEmail + ': ' + email + '\n' + d.lblNeed + ': ' + (needs.join(', ') || '-') + (message ? '\n\n' + message : '');
      show(d.ok.replace('{e}', to));
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  });
})();
