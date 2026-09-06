/* ============================================================
   ADITYA — AERODYNAMICS ENGINEER
   Portfolio behaviour: nav, scrollspy, galleries, lightbox,
   expandable projects, counters, desktop-view toggle.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* -------- tiny safe storage wrapper -------- */
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ============================================================
     1. Scroll progress bar
     ============================================================ */
  var progress = $('#progress');
  var topBtn = $('#top-btn');

  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (progress) progress.style.width = p + '%';
    if (topBtn) topBtn.classList.toggle('on', window.scrollY > 600);
    spy();
  }

  /* ============================================================
     2. Mobile menu
     ============================================================ */
  var burger = $('#burger');
  var navLinks = $('#nav-links');

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (navLinks) {
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
  }
  document.addEventListener('click', function (e) {
    if (!document.body.classList.contains('menu-open')) return;
    if (e.target.closest('nav')) return;
    closeMenu();
  });

  /* ============================================================
     3. Scrollspy
     ============================================================ */
  var spyLinks = $$('.nav-links a[href^="#"]');
  var spyTargets = spyLinks
    .map(function (a) { return { link: a, el: document.getElementById(a.getAttribute('href').slice(1)) }; })
    .filter(function (t) { return t.el; });

  function spy() {
    var y = window.scrollY + (window.innerHeight * 0.28);
    var current = null;
    for (var i = 0; i < spyTargets.length; i++) {
      if (spyTargets[i].el.offsetTop <= y) current = spyTargets[i];
    }
    spyTargets.forEach(function (t) { t.link.classList.toggle('active', t === current); });
  }

  /* ============================================================
     4. Reveal on scroll
     ============================================================ */
  var revealEls = $$('.rv');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          ro.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ============================================================
     5. Stat count-up
     ============================================================ */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var dur = 1100, t0 = null;
    var node = el.firstChild;
    if (!node || node.nodeType !== 3) { node = document.createTextNode(''); el.insertBefore(node, el.firstChild); }

    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - k, 3);
      node.nodeValue = String(Math.round(target * eased));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = $$('[data-count]');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    counters.forEach(function (el) {
      var n = el.firstChild;
      if (n && n.nodeType === 3) n.nodeValue = el.getAttribute('data-count');
    });
  } else if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(countUp);
  }

  /* ============================================================
     6. Gallery strips — drag to scroll + arrows
     ============================================================ */
  $$('.gstrip').forEach(function (strip) {
    var down = false, startX = 0, startLeft = 0, moved = false;

    strip.addEventListener('mousedown', function (e) {
      down = true; moved = false;
      startX = e.pageX - strip.offsetLeft;
      startLeft = strip.scrollLeft;
      strip.classList.add('dragging');
    });
    ['mouseleave', 'mouseup'].forEach(function (evt) {
      strip.addEventListener(evt, function () { down = false; strip.classList.remove('dragging'); });
    });
    strip.addEventListener('mousemove', function (e) {
      if (!down) return;
      e.preventDefault();
      var walk = (e.pageX - strip.offsetLeft - startX) * 1.4;
      if (Math.abs(walk) > 6) moved = true;
      strip.scrollLeft = startLeft - walk;
    });
    // Swallow the click that ends a drag so it doesn't open the lightbox
    strip.addEventListener('click', function (e) {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
    }, true);

    var wrap = strip.closest('.gwrap');
    if (!wrap) return;
    var prev = $('.garrow.prev', wrap);
    var next = $('.garrow.next', wrap);

    function stepSize() {
      var item = strip.querySelector('.gitem');
      return item ? item.offsetWidth + 14 : 320;
    }
    function syncArrows() {
      var max = strip.scrollWidth - strip.clientWidth - 2;
      if (prev) prev.disabled = strip.scrollLeft <= 2;
      if (next) next.disabled = strip.scrollLeft >= max;
    }
    if (prev) prev.addEventListener('click', function () { strip.scrollLeft -= stepSize(); });
    if (next) next.addEventListener('click', function () { strip.scrollLeft += stepSize(); });
    strip.addEventListener('scroll', syncArrows);
    window.addEventListener('resize', syncArrows);
    syncArrows();
    setTimeout(syncArrows, 400);
  });

  /* ============================================================
     7. Expandable project cards
     ============================================================ */
  $$('.proj-toggle').forEach(function (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var card = btn.closest('.proj-card');
      var open = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.childNodes[0].nodeValue = open ? 'Less ' : 'Details ';
    });
  });

  /* ============================================================
     8. Lightbox
     ============================================================ */
  var lb = $('#lightbox');
  var lbImg = $('#lb-img');
  var lbTitle = $('#lb-title');
  var lbSub = $('#lb-sub');
  var lbCount = $('#lb-count');
  var group = [];
  var index = 0;
  var lastFocus = null;

  function zoomData(el) {
    var img = el.querySelector('img');
    return {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : '',
      title: el.getAttribute('data-caption') || '',
      sub: el.getAttribute('data-sub') || ''
    };
  }

  function render() {
    var d = group[index];
    if (!d) return;
    lbImg.setAttribute('src', d.src);
    lbImg.setAttribute('alt', d.alt);
    lbTitle.textContent = d.title;
    lbSub.textContent = d.sub;
    lbCount.textContent = (index + 1) + ' / ' + group.length;
  }

  function openLb(el) {
    var container = el.closest('[data-gallery]') || el.closest('.img-row') ||
                    el.closest('.intro-img-stack') || el.closest('.proj-grid') ||
                    el.closest('section') || document;
    group = $$('.js-zoom', container).map(zoomData);
    var all = $$('.js-zoom', container);
    index = Math.max(0, all.indexOf(el));
    render();
    lastFocus = document.activeElement;
    lb.classList.add('on');
    document.body.style.overflow = 'hidden';
    $('#lb-close').focus();
  }

  function closeLb() {
    lb.classList.remove('on');
    document.body.style.overflow = '';
    lbImg.setAttribute('src', '');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function move(step) {
    if (!group.length) return;
    index = (index + step + group.length) % group.length;
    render();
  }

  $$('.js-zoom').forEach(function (el) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Open image: ' + (el.getAttribute('data-caption') || 'full size'));
    el.addEventListener('click', function () { openLb(el); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(el); }
    });
  });

  if (lb) {
    $('#lb-close').addEventListener('click', closeLb);
    $('#lb-prev').addEventListener('click', function (e) { e.stopPropagation(); move(-1); });
    $('#lb-next').addEventListener('click', function (e) { e.stopPropagation(); move(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') move(-1);
      else if (e.key === 'ArrowRight') move(1);
    });

    // Swipe on touch
    var tx = 0;
    lb.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 55) move(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ============================================================
     9. Back to top
     ============================================================ */
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ============================================================
     10. Desktop-view toggle (mobile)
     ============================================================ */
  var viewBtn = $('#view-toggle');
  var vp = $('#viewport-meta');
  var MOBILE_VP = 'width=device-width, initial-scale=1.0';
  var DESKTOP_VP = 'width=1280';

  function applyView(forced) {
    document.body.classList.toggle('force-desktop', forced);
    if (vp) vp.setAttribute('content', forced ? DESKTOP_VP : MOBILE_VP);
    if (viewBtn) viewBtn.textContent = forced ? 'Switch to Mobile View' : 'Switch to Desktop View';
    if (forced) closeMenu();
  }

  if (viewBtn) {
    applyView(store.get('view') === 'desktop');
    viewBtn.addEventListener('click', function () {
      var forced = !document.body.classList.contains('force-desktop');
      applyView(forced);
      store.set('view', forced ? 'desktop' : 'mobile');
      window.scrollTo({ top: window.scrollY, behavior: 'auto' });
    });
  }

  /* ============================================================
     11. Boot
     ============================================================ */
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
