/* =========================================================
   Portafolio · Anggie Alcedo
   Interacciones y animaciones en JavaScript puro
   ========================================================= */
(function () {
  'use strict';

  // ¿El usuario pidió reducir el movimiento?
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ---------- 1. Tema claro / oscuro ---------- */
  var themeBtn = document.getElementById('themeToggle');

  function updateThemeButton() {
    var dark = root.getAttribute('data-theme') !== 'light';
    themeBtn.innerHTML = dark ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>' : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
    themeBtn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }

  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('aa-theme', next); } catch (e) { /* almacenamiento no disponible */ }
    updateThemeButton();
    network.refreshColor();
  });

  /* ---------- 2. Navegación: desenfoque al hacer scroll y menú móvil ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');
  var menu = document.getElementById('navMenu');

  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
  }

  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Resalta el enlace de la sección visible
  var links = document.querySelectorAll('.nav__link');
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { sectionObserver.observe(s); });

  /* ---------- 3. Aparición de secciones al hacer scroll ---------- */
  var revealObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Retraso escalonado para elementos hermanos en la misma cuadrícula
  document.querySelectorAll('.reveal').forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
    var index = siblings.indexOf(el);
    if (!reduceMotion && index > 0) el.style.transitionDelay = Math.min(index * 90, 450) + 'ms';
    revealObserver.observe(el);
  });

  /* ---------- 4. Efecto máquina de escribir ---------- */
  var roles = ['QA Automation Engineer', 'Desarrolladora Python / Backend', 'Especialista en WordPress', 'Ingeniera de Sistemas'];
  var typeEl = document.getElementById('typewriter');

  if (reduceMotion) {
    // Sin animación: cambia el texto cada 3 segundos
    var r = 0;
    setInterval(function () { r = (r + 1) % roles.length; typeEl.textContent = roles[r]; }, 3000);
  } else {
    var roleIndex = 0, charIndex = roles[0].length, deleting = true;
    (function type() {
      var word = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      typeEl.textContent = word.slice(0, charIndex);
      var delay = deleting ? 45 : 85;
      if (!deleting && charIndex === word.length) { deleting = true; delay = 1800; }
      else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
      setTimeout(type, delay);
    })();
  }

  /* ---------- 5. Contadores animados ---------- */
  var counterObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.dataset.target, 10);
      obs.unobserve(el);
      if (reduceMotion) { el.textContent = target; return; }
      var start = null, duration = 1600;
      requestAnimationFrame(function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); // easing cúbico
        if (p < 1) requestAnimationFrame(step);
      });
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.counter').forEach(function (c) { counterObserver.observe(c); });

  /* ---------- 6. Foto de perfil: si no carga se muestran las iniciales ---------- */
  var photo = document.getElementById('profilePhoto');
  function hidePhoto() { photo.style.display = 'none'; }
  photo.addEventListener('error', hidePhoto);
  if (photo.complete && photo.naturalWidth === 0) hidePhoto();

  /* ---------- 7. Carruseles de proyectos ---------- */
  function makePlaceholder(title, icon) {
    var div = document.createElement('div');
    div.className = 'placeholder';
    div.setAttribute('role', 'img');
    div.setAttribute('aria-label', 'Vista previa de ' + title);
    div.innerHTML = '<i class="fa-solid ' + icon + '" aria-hidden="true"></i><strong></strong><small>Capturas próximamente</small>';
    div.querySelector('strong').textContent = title;
    return div;
  }

  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel__track');
    var title = carousel.dataset.title || 'Proyecto';
    var icon = carousel.dataset.icon || 'fa-code';
    var slides = Array.prototype.slice.call(track.children);
    var current = 0, timer = null, hovering = false, inView = false;

    // Reemplaza imágenes rotas por un placeholder elegante
    slides.forEach(function (img, i) {
      function swap() {
        var ph = makePlaceholder(title, icon);
        if (img.parentNode) img.parentNode.replaceChild(ph, img);
        slides[i] = ph;
      }
      img.addEventListener('error', swap);
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) swap();
    });

    // Con una sola imagen no hacen falta flechas ni puntos
    if (slides.length < 2) return;

    // Flechas y puntos
    var prev = document.createElement('button');
    prev.type = 'button'; prev.className = 'carousel__btn carousel__btn--prev';
    prev.setAttribute('aria-label', 'Imagen anterior de ' + title);
    prev.innerHTML = '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>';
    var next = prev.cloneNode(true);
    next.className = 'carousel__btn carousel__btn--next';
    next.setAttribute('aria-label', 'Imagen siguiente de ' + title);
    next.innerHTML = '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>';
    var dots = document.createElement('div');
    dots.className = 'carousel__dots';
    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button'; d.className = 'carousel__dot';
      d.setAttribute('aria-label', 'Ir a la imagen ' + (i + 1));
      d.addEventListener('click', function () { go(i); restart(); });
      dots.appendChild(d);
    });
    carousel.append(prev, next, dots);

    function go(i) {
      current = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-100 * current) + '%)';
      Array.prototype.forEach.call(dots.children, function (d, k) {
        d.classList.toggle('is-active', k === current);
        d.setAttribute('aria-current', k === current ? 'true' : 'false');
      });
    }
    function stop() { clearInterval(timer); timer = null; }
    function start() {
      if (reduceMotion || hovering || !inView || timer) return;
      timer = setInterval(function () { go(current + 1); }, 3000);
    }
    function restart() { stop(); start(); }

    prev.addEventListener('click', function () { go(current - 1); restart(); });
    next.addEventListener('click', function () { go(current + 1); restart(); });

    // Pausa al pasar el mouse o al enfocar con teclado
    var card = carousel.closest('.project') || carousel;
    card.addEventListener('mouseenter', function () { hovering = true; stop(); });
    card.addEventListener('mouseleave', function () { hovering = false; start(); });
    card.addEventListener('focusin', function () { hovering = true; stop(); });
    card.addEventListener('focusout', function () { hovering = false; start(); });

    // Deslizar con el dedo en móviles
    var touchX = null;
    carousel.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) { go(current + (dx < 0 ? 1 : -1)); restart(); }
      touchX = null;
    });

    // Solo se mueve cuando está visible en pantalla
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) start(); else stop();
    }, { threshold: 0.3 }).observe(carousel);

    go(0);
  });

  /* ---------- 8. Filtros de proyectos ---------- */
  var filterBtns = document.querySelectorAll('.filter');
  var projects = document.querySelectorAll('.project');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      filterBtns.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      // 1) desvanecer todo  2) ocultar/mostrar  3) aparecer
      projects.forEach(function (p) { p.classList.add('is-filtering'); });
      setTimeout(function () {
        projects.forEach(function (p) {
          var match = f === 'all' || p.dataset.category.split(' ').indexOf(f) !== -1;
          p.classList.toggle('is-hidden', !match);
          p.classList.add('is-visible');
        });
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { projects.forEach(function (p) { p.classList.remove('is-filtering'); }); });
        });
      }, reduceMotion ? 0 : 300);
    });
  });

  /* ---------- 9. Efecto tilt 3D en tarjetas de proyecto ---------- */
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover && !reduceMotion) {
    projects.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        if (!card.classList.contains('is-visible')) return;
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transitionDelay = '0ms';
        card.style.transform = 'rotateX(' + (-y * 10).toFixed(2) + 'deg) rotateY(' + (x * 12).toFixed(2) + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- 10. Fondo animado: red de datos en canvas ---------- */
  var network = (function () {
    var canvas = document.getElementById('network');
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, points = [], color = '56, 189, 248', rafId = null;
    var mouse = { x: -9999, y: -9999 };
    var LINK = 140; // distancia máxima para unir puntos

    function refreshColor() {
      color = getComputedStyle(root).getPropertyValue('--net-color').trim() || color;
      if (reduceMotion) draw();
    }

    function resize() {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Cantidad de puntos proporcional al área (menos en móviles)
      var count = Math.max(28, Math.min(90, Math.round((w * h) / 16000)));
      points = [];
      for (var i = 0; i < count; i++) {
        points.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.8 });
      }
      if (reduceMotion) draw();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        for (var j = i + 1; j < points.length; j++) {
          var q = points[j];
          var dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = 'rgba(' + color + ',' + (0.22 * (1 - d / LINK)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        // Conexión con el cursor
        var mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
        if (md < LINK * 1.3) {
          ctx.strokeStyle = 'rgba(' + color + ',' + (0.4 * (1 - md / (LINK * 1.3))).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(' + color + ', 0.75)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    function tick() {
      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      draw();
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', function () { clearTimeout(resize.t); resize.t = setTimeout(resize, 150); });
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('mouseout', function () { mouse.x = mouse.y = -9999; });

    // Pausa la animación cuando la pestaña no está visible (ahorra batería)
    document.addEventListener('visibilitychange', function () {
      if (reduceMotion) return;
      if (document.hidden) { cancelAnimationFrame(rafId); rafId = null; }
      else if (!rafId) tick();
    });

    refreshColor();
    resize();
    if (!reduceMotion) tick();

    return { refreshColor: refreshColor };
  })();

  updateThemeButton();
})();
