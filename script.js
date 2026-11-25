
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


  /* intro på startsidan – visas vid nytt besök och omladdning, men inte när man klickar sig hit från en annan sida på hemsidan.
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
    var timer, finished = false, heroAnims = [];

    function cleanup() {
      if (intro.parentNode) { intro.parentNode.removeChild(intro); }
      root.classList.remove('intro-active', 'intro-out', 'intro-handoff');
    }
    function land() {
      if (heroArt) { heroArt.style.animation = 'none'; heroArt.classList.add('landed'); }
      cleanup();
      /* släpp flyg-animationen (symbolen står redan exakt på sin plats) och lämna tillbaka z-index */
      heroAnims.forEach(function (a) { a.cancel(); });
      if (heroArt) { heroArt.style.zIndex = ''; }
    }
    /* hero-symbolens synliga yta på skärmen (inte hela svg-rutan) */
    function drawnRect(svg) {
      try {
        var bb = svg.getBBox(), m = svg.getScreenCTM();
        if (bb.width && m) { return { left: m.e + bb.x * m.a, top: m.f + bb.y * m.d, width: bb.width * m.a, height: bb.height * m.d }; }
      } catch (e) {}
      return svg.getBoundingClientRect();
    }
    function finish() {
      if (finished) { return; }
      finished = true;
      clearTimeout(timer);
      root.classList.add('intro-out');

      /* utan hero-symbol eller med reducerad rörelse: tona bara bort introt */
      if (!target || !flyer || !flyer.animate || reduce) {
        intro.classList.add('fade');
        if (heroArt) { heroArt.style.animation = 'none'; heroArt.classList.add('landed'); }
        setTimeout(cleanup, 600);
        return;
      }

      /* mobil: symbolen rullar upp till sidhuvudets logga, sedan kommer bokstäverna en och en */
      var brandImg = document.querySelector('.site-header .brand img');
      if (window.matchMedia('(max-width: 860px)').matches && brandImg && flyer && flyer.animate) {
        root.classList.add('intro-handoff');
        var mLetters = Array.prototype.slice.call(intro.querySelectorAll('.intro-ltr'));
        flyer.getAnimations && flyer.getAnimations().forEach(function (an) { an.finish(); });
        mLetters.forEach(function (l) {
          l.getAnimations && l.getAnimations().forEach(function (an) { an.finish(); });
          l.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-14px) scale(.9)' }],
            { duration: 300, delay: (mLetters.length - 1 - mLetters.indexOf(l)) * 35, easing: 'ease-in', fill: 'forwards' });
        });
        var sl = intro.querySelector('.intro-slogan');
        if (sl) {
          sl.getAnimations && sl.getAnimations().forEach(function (an) { an.finish(); });
          sl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-out', fill: 'forwards' });
        }
        /* loggans synliga yta i sidhuvudets png (filen har luft runt sig) */
        var br = brandImg.getBoundingClientRect();
        var cl = br.left + br.width * 37 / 640, cw = br.width * 572 / 640, cy = br.top + br.height * 99.5 / 211;
        var tb = { left: cl, width: cw * 114 / 572, top: br.top + br.height * 45 / 211, height: br.height * 108 / 211 };
        var fr = flyer.getBoundingClientRect();
        var fa = { left: fr.left + fr.width * .0224, top: fr.top + fr.height * .0231, width: fr.width * .9602, height: fr.height * .9538 };
        var mdx = (tb.left + tb.width / 2) - (fa.left + fa.width / 2);
        var mdy = (tb.top + tb.height / 2) - (fa.top + fa.height / 2);
        var ms = (tb.width / fa.width + tb.height / fa.height) / 2;
        flyer.style.transformOrigin = '50% 50%';
        /* tar sats, rullar och snurrar upp, glider sista biten in på plats */
        var roll = flyer.animate([
          { offset: 0, transform: 'none' },
          { offset: .14, transform: 'translate(10px,12px) rotate(25deg) scale(1.04)' },
          { offset: .62, transform: 'translate(' + mdx * .72 + 'px,' + mdy * .9 + 'px) rotate(-560deg) scale(' + (1 + (ms - 1) * .85) + ')' },
          { offset: .86, transform: 'translate(' + (mdx + 6) + 'px,' + mdy + 'px) rotate(-725deg) scale(' + ms + ')' },
          { offset: 1, transform: 'translate(' + mdx + 'px,' + mdy + 'px) rotate(-720deg) scale(' + ms + ')' }
        ], { duration: 1350, delay: 280, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'both' });
        roll.onfinish = function () {
          /* bokstäverna dyker upp en och en bredvid symbolen, på exakt loggans plats */
          var box = document.createElement('div');
          var bh = cw / (1928 / 390);
          box.style.cssText = 'position:fixed;z-index:1002;pointer-events:none;left:' + cl + 'px;top:' + (cy - bh / 2) + 'px;width:' + cw + 'px;height:' + bh + 'px';
          var last;
          mLetters.forEach(function (l, i) {
            var c = document.createElement('img');
            c.src = l.getAttribute('src'); c.alt = '';
            c.style.cssText = 'position:absolute;top:0;height:100%;left:' + l.style.left + ';width:' + l.style.width + ';opacity:0';
            box.appendChild(c);
            last = c.animate([{ opacity: 0, transform: 'translateX(-8px) scale(.85)' }, { opacity: 1, transform: 'none' }],
              { duration: 380, delay: 60 + i * 85, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'both' });
          });
          document.body.appendChild(box);
          intro.style.background = 'transparent';
          last.onfinish = function () {
            if (heroArt) { heroArt.style.animation = 'none'; heroArt.classList.add('landed'); }
            cleanup();
            brandImg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: 'both' });
            box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'both' }).onfinish = function () { box.remove(); };
          };
        };
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
      var r = flyer.getBoundingClientRect();
      /* själva symbolen i bilden (bilden har lite luft runt sig) */
      var a = { left: r.left + r.width * .0224, top: r.top + r.height * .0231, width: r.width * .9602, height: r.height * .9538 };
      var b = drawnRect(target);
      var dx = (b.left + b.width / 2) - (a.left + a.width / 2);
      var dy = (b.top + b.height / 2) - (a.top + a.height / 2);
      var s = (b.width / a.width + b.height / a.height) / 2;
      flyer.style.transformOrigin = '50% 50%';
      flyer.style.zIndex = '2';

      /* Rörelsen: tar sats, rullar åt höger och landar på hero-symbolens plats.
         [andel av tiden, x, y, vridning, skala] för den platta symbolen. */
      var path = [
        [0, 0, 0, 0, 1],
        [.16, -18, 0, -10, 1],
        [.7, dx * .7, dy * .25, 250, 1 + (s - 1) * .6],
        [1, dx, dy, 360, s]
      ];
      var timing = { duration: 1300, delay: 580, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'both' };
      function frames(offX, offY, div) {
        return path.map(function (p) {
          return { offset: p[0], transform: 'translate(' + (p[1] - offX) + 'px,' + (p[2] - offY) + 'px) rotate(' + p[3] + 'deg) scale(' + (p[4] / div) + ')' };
        });
      }

      /* Den platta symbolen ritas i landningsstorlek och skalas ned i början,
         så att den är skarp under hela resan i stället för att förstoras upp. */
      var lw = flyer.offsetWidth, lh = flyer.offsetHeight;
      flyer.style.width = lw * s + 'px';
      flyer.style.height = lh * s + 'px';
      flyer.style.left = (flyer.offsetLeft - lw * (s - 1) / 2) + 'px';
      flyer.style.top = (flyer.offsetTop - lh * (s - 1) / 2) + 'px';
      var fly = flyer.animate(frames(0, 0, s), timing);

      /* Startsidans riktiga symbol flyger med i exakt samma bana – ingen kopia och inget byte vid
         landningen. Den lyfts ovanför introt och tonas in ovanpå den platta symbolen under resan. */
      var t = target.getBoundingClientRect();
      heroArt.style.zIndex = '1001';
      heroArt.classList.add('landed');
      target.style.transformOrigin = (b.left + b.width / 2 - t.left) + 'px ' + (b.top + b.height / 2 - t.top) + 'px';
      heroAnims.push(target.animate(frames(dx, dy, s), timing));
      var fade = { duration: 1300, delay: 580, fill: 'both' };
      heroAnims.push(target.animate([{ opacity: 0, offset: 0 }, { opacity: 0, offset: .4 }, { opacity: 1, offset: .72 }, { opacity: 1, offset: 1 }], fade));
      flyer.animate([{ opacity: 1, offset: 0 }, { opacity: 1, offset: .6 }, { opacity: 0, offset: .9 }, { opacity: 0, offset: 1 }], fade);
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
