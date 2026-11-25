
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


  /* intro på startsidan – visas en gång per besök (session).
     När introt är klart "reser" symbolen vidare och landar som symbolen i hero-delen. */
  (function () {
    var intro = document.getElementById('intro');
    var root = document.documentElement;
    if (!intro) { return; }
    if (!root.classList.contains('intro-active')) { intro.parentNode.removeChild(intro); return; }
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var heroArt = document.querySelector('.hero-art');
    var target = heroArt && heroArt.querySelector('.sym');
    var flyer = intro.querySelector('.intro-sym');
    var timer, finished = false;

    function cleanup() {
      if (intro.parentNode) { intro.parentNode.removeChild(intro); }
      root.classList.remove('intro-active', 'intro-out', 'intro-handoff');
    }
    function land() {
      if (heroArt) {
        heroArt.style.animation = 'none';           /* hero-symbolens egen inrullning behövs inte – den har redan landat */
        heroArt.classList.add('landed');
        if (heroArt.animate && !reduce) {
          heroArt.animate([{ transform: 'scale(.94)' }, { transform: 'scale(1.04)' }, { transform: 'none' }],
            { duration: 420, easing: 'cubic-bezier(.3,1.6,.5,1)' });
        }
      }
      if (flyer && flyer.animate) {
        flyer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, fill: 'forwards' }).onfinish = cleanup;
      } else { cleanup(); }
    }
    function finish() {
      if (finished) { return; }
      finished = true;
      clearTimeout(timer);
      try { sessionStorage.setItem('ekIntro', '1'); } catch (e) {}
      root.classList.add('intro-out');

      /* utan hero-symbol eller med reducerad rörelse: tona bara bort introt */
      if (!target || !flyer || !flyer.animate || reduce) {
        intro.classList.add('fade');
        if (heroArt) { heroArt.style.animation = 'none'; heroArt.classList.add('landed'); }
        setTimeout(cleanup, 600);
        return;
      }

      root.classList.add('intro-handoff');           /* den vita bakgrunden glider ut åt höger */
      flyer.getAnimations && flyer.getAnimations().forEach(function (a) { a.finish(); });
      var vw = window.innerWidth;
      /* bokstäverna åker iväg åt höger – sista bokstaven först */
      var letters = Array.prototype.slice.call(intro.querySelectorAll('.intro-ltr'));
      letters.forEach(function (l, i) {
        l.getAnimations && l.getAnimations().forEach(function (a) { a.finish(); });
        var order = letters.length - 1 - i;
        l.animate([
          { transform: 'none', opacity: 1 },
          { transform: 'translateX(-10px)', opacity: 1, offset: .2 },
          { transform: 'translateX(' + vw + 'px) skewX(-12deg)', opacity: 0 }
        ], { duration: 380, delay: order * 80, easing: 'cubic-bezier(.6,0,.9,.4)', fill: 'forwards' });
      });
      var slogan = intro.querySelector('.intro-slogan');
      if (slogan) {
        slogan.getAnimations && slogan.getAnimations().forEach(function (a) { a.finish(); });
        /* sloganen tonas ut på plats – bara loggan åker iväg */
        slogan.animate([{ opacity: 1 }, { opacity: 0 }],
          { duration: 500, easing: 'ease-out', fill: 'forwards' });
      }
      var a = flyer.getBoundingClientRect();
      var b = target.getBoundingClientRect();
      var dx = (b.left + b.width / 2) - (a.left + a.width / 2);
      var dy = (b.top + b.height / 2) - (a.top + a.height / 2);
      var s = b.width / a.width;
      flyer.style.transformOrigin = '50% 50%';
      flyer.style.zIndex = '2';
      /* symbolen tar sats, rullar åt höger och landar på hero-symbolens plats */
      var fly = flyer.animate([
        { transform: 'translate(0,0) rotate(0) scale(1)', offset: 0 },
        { transform: 'translate(-18px,0) rotate(-10deg) scale(1)', offset: .16 },
        { transform: 'translate(' + dx * .7 + 'px,' + dy * .25 + 'px) rotate(250deg) scale(' + (1 + (s - 1) * .6) + ')', offset: .7 },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(360deg) scale(' + s + ')', offset: 1 }
      ], { duration: 1300, delay: 580, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' });
      fly.onfinish = land;
    }
    var skip = intro.querySelector('.intro-skip');
    if (skip) { skip.addEventListener('click', finish); }
    intro.classList.add('play');
    timer = setTimeout(finish, reduce ? 1000 : 4000);
  })();

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
