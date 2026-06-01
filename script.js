/* ═══════════════════════════════════════════════════════════
   FeBelajar — script.js  (Phase 1: Navbar & Hero)
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─────────────────────────────────────
     ELEMENTS
  ───────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const burger    = document.getElementById('burgerBtn');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = navMenu ? navMenu.querySelectorAll('.navbar__link') : [];
  const ctaBtn    = document.getElementById('ctaBtn');
  const reveals   = document.querySelectorAll('[data-reveal]');

  /* ─────────────────────────────────────
     1. NAVBAR — scroll shadow + active link
  ───────────────────────────────────── */
  function onScroll() {
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);

    const scrollPos = window.scrollY + 150;

    const heroSection = document.getElementById('hero');
    const materialsSection = document.getElementById('materials');
    const contactSection = document.getElementById('contact');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      let isActive = false;

      if (href === '#hero' && heroSection) {
        isActive = scrollPos >= heroSection.offsetTop && (!materialsSection || scrollPos < materialsSection.offsetTop);
      } else if (href === '#materials' && materialsSection) {
        isActive = scrollPos >= materialsSection.offsetTop && (!contactSection || scrollPos < contactSection.offsetTop);
      } else if (href === '#contact' && contactSection) {
        isActive = scrollPos >= contactSection.offsetTop;
      }

      link.classList.toggle('is-active', isActive);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ─────────────────────────────────────
     2. MOBILE BURGER MENU
  ───────────────────────────────────── */
  if (burger && navMenu) {
    burger.addEventListener('click', function () {
      const isOpen = burger.classList.toggle('is-open');
      navMenu.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
      // Prevent body scroll when menu is open on mobile
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('is-open');
        navMenu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Buka menu');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (
        navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        burger.classList.remove('is-open');
        navMenu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Buka menu');
        document.body.style.overflow = '';
      }
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        burger.classList.remove('is-open');
        navMenu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Buka menu');
        document.body.style.overflow = '';
        burger.focus();
      }
    });
  }

  /* ─────────────────────────────────────
     3. HERO CTA — smooth scroll to #materials
  ───────────────────────────────────── */
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function (e) {
      const target = document.getElementById('materials');
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 64;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  }

  /* ─────────────────────────────────────
     4. REVEAL ANIMATION — IntersectionObserver
     Elements with [data-reveal] fade up when
     they enter the viewport.
  ───────────────────────────────────── */
  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback — show all immediately if IntersectionObserver unavailable
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ─────────────────────────────────────
     5. HERO CARD — subtle parallax on mouse move
     Lightweight, RAF-throttled; desktop only.
  ───────────────────────────────────── */
  var card = document.querySelector('.hero__card');

  if (card && window.matchMedia('(pointer: fine)').matches) {
    var rafId   = null;
    var mouseX  = 0;
    var mouseY  = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(function () {
          var rect    = card.getBoundingClientRect();
          var cx      = rect.left + rect.width  / 2;
          var cy      = rect.top  + rect.height / 2;
          var dx      = (mouseX - cx) / window.innerWidth;
          var dy      = (mouseY - cy) / window.innerHeight;
          var rotateX = -(dy * 6).toFixed(2);
          var rotateY =  (dx * 6).toFixed(2);

          card.style.transform =
            'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
          rafId = null;
        });
      }
    });

    // Reset on mouse leave hero section
    var heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    }
  }


  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — MATERIALS: FILTER + SEARCH + EXPAND
  ═══════════════════════════════════════════════════════════ */

  /* ─────────────────────────────────────
     Elements
  ───────────────────────────────────── */
  var searchInput   = document.getElementById('searchInput');
  var searchClear   = document.getElementById('searchClear');
  var filterTagsEl  = document.getElementById('filterTags');
  var matGrid       = document.getElementById('matGrid');
  var matEmpty      = document.getElementById('matEmpty');

  /* State */
  var activeFilter  = 'semua';
  var searchQuery   = '';

  /* All cards as array for fast iteration */
  var allCards = matGrid
    ? Array.prototype.slice.call(matGrid.querySelectorAll('.mcard'))
    : [];

  /* ─────────────────────────────────────
     Core filter function
     Uses CSS class toggling so transitions
     are handled entirely in CSS (no reflow loop).
  ───────────────────────────────────── */
  function runFilter() {
    var q   = searchQuery.toLowerCase().trim();
    var visible = 0;

    allCards.forEach(function (card) {
      var cats    = (card.getAttribute('data-category') || '').toLowerCase();
      var kws     = (card.getAttribute('data-keywords') || '').toLowerCase();
      var title   = (card.getAttribute('data-title')    || '').toLowerCase();

      var catMatch  = activeFilter === 'semua' || cats.indexOf(activeFilter) !== -1;
      var kwMatch   = q === '' || title.indexOf(q) !== -1 || kws.indexOf(q) !== -1;

      if (catMatch && kwMatch) {
        card.classList.remove('is-hidden');
        visible++;
      } else {
        card.classList.add('is-hidden');
      }
    });

    /* Show/hide empty state */
    if (matEmpty) {
      if (visible === 0) {
        matEmpty.removeAttribute('hidden');
      } else {
        matEmpty.setAttribute('hidden', '');
      }
    }
  }

  /* ─────────────────────────────────────
     6. SEARCH INPUT — real-time filtering
  ───────────────────────────────────── */
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchQuery = searchInput.value;
      /* show/hide clear button */
      if (searchClear) {
        if (searchQuery.length > 0) {
          searchClear.removeAttribute('hidden');
        } else {
          searchClear.setAttribute('hidden', '');
        }
      }
      runFilter();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      searchQuery = '';
      searchClear.setAttribute('hidden', '');
      searchInput.focus();
      runFilter();
    });
  }

  /* ─────────────────────────────────────
     7. CATEGORY TAG FILTER
  ───────────────────────────────────── */
  if (filterTagsEl) {
    filterTagsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.stag');
      if (!btn) return;

      /* Update active state */
      var allTags = filterTagsEl.querySelectorAll('.stag');
      allTags.forEach(function (t) { t.classList.remove('is-active'); });
      btn.classList.add('is-active');

      activeFilter = btn.getAttribute('data-filter') || 'semua';
      runFilter();
    });
  }

  /* ─────────────────────────────────────
     8. MATERI LIST EXPAND/COLLAPSE
     CSS grid-template-rows trick for smooth
     height animation without measuring.
  ───────────────────────────────────── */
  if (matGrid) {
    matGrid.addEventListener('click', function (e) {
      var toggleBtn = e.target.closest('.mcard__toggle');
      if (!toggleBtn) return;

      var card   = toggleBtn.closest('.mcard');
      var extras = card ? card.querySelectorAll('.mcard__item--extra') : [];
      var isOpen = toggleBtn.classList.contains('is-open');

      /* Toggle each hidden item */
      extras.forEach(function (item) {
        item.classList.toggle('is-open', !isOpen);
      });

      /* Toggle button state */
      toggleBtn.classList.toggle('is-open', !isOpen);
      toggleBtn.setAttribute('aria-expanded', String(!isOpen));

      /* Update label text */
      var label = toggleBtn.querySelector('.mcard__toggle-text');
      if (label) {
        label.textContent = isOpen ? 'Lihat Semua' : 'Sembunyikan';
      }
    });
  }

  /* ─────────────────────────────────────
     9. SIDEBAR REVEAL on scroll (reuse observer)
  ───────────────────────────────────── */
  var sidebarEl = document.getElementById('sidebar');
  if (sidebarEl && 'IntersectionObserver' in window) {
    sidebarEl.setAttribute('data-reveal', '');
    var sideObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          sideObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    sideObs.observe(sidebarEl);
  }

  /* Card staggered reveal */
  if ('IntersectionObserver' in window) {
    var cardObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          cardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    allCards.forEach(function (card, i) {
      card.style.transitionDelay = (i * 55) + 'ms';
      card.setAttribute('data-reveal', '');
      cardObs.observe(card);
    });
  }

  /* Run initial filter pass (shows all by default) */
  runFilter();

})();


/* ═══════════════════════════════════════════════════════════
     PHASE 3 — CONTRIBUTION FORM VALIDATION
  ═══════════════════════════════════════════════════════════ */
  var cForm = document.getElementById('contributionForm');

  if (cForm) {
    cForm.addEventListener('submit', function (e) {
      var inputs   = cForm.querySelectorAll('[required]');
      var isValid  = true;

      inputs.forEach(function (input) {
        // Clear old visual error if running multiple checks
        input.classList.remove('input-shake-error');

        // Check value trim completeness
        if (!input.value || input.value.trim() === '') {
          isValid = false;
          input.classList.add('input-shake-error');

          // Strip animation after duration finishes so user can retry cleanly
          setTimeout(function () {
            input.classList.remove('input-shake-error');
          }, 450);
        }
      });

      // Prevent Formspree submission process if client validation fails
      if (!isValid) {
        e.preventDefault();
        
        // Focus first invalid element softly
        var firstError = cForm.querySelector('.input-shake-error');
        if (firstError) {
          firstError.focus();
        }
      }
    });
  }