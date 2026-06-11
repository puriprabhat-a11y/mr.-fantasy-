/* ================================================================
   PRABHAT PURI — PORTFOLIO JS
   Features: Scroll reveal, Counter animation, Lazy loading,
             Navbar scroll, Mobile menu, FAQ accordion, Tab switcher
   ================================================================ */

'use strict';

/* ── UTILITY ──────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ── 1. NAVBAR SCROLL EFFECT ──────────────────────────────────── */
(function initNavbar() {
  const navbar = $('.navbar');
  if (!navbar) return;

  const toggle = () =>
    navbar.classList.toggle('scrolled', window.scrollY > 40);

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();


/* ── 2. MOBILE MENU ───────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = $('.navbar__hamburger');
  const menu      = $('.mobile-menu');
  const closeBtn  = $('.mobile-menu__close');
  if (!hamburger || !menu) return;

  const open  = () => { menu.classList.add('open');    document.body.style.overflow = 'hidden'; };
  const close = () => { menu.classList.remove('open'); document.body.style.overflow = ''; };

  hamburger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  $$('.mobile-menu a', menu).forEach(a => a.addEventListener('click', close));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();


/* ── 3. SCROLL REVEAL ─────────────────────────────────────────── */
(function initScrollReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => io.observe(el));
})();


/* ── 4. ANIMATED COUNTER ──────────────────────────────────────── */
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const raw      = el.dataset.count;        // e.g. "214", "4.2", "42"
    const suffix   = el.dataset.suffix || ''; // e.g. "%", "×", "+"
    const prefix   = el.dataset.prefix || ''; // e.g. "₹", "↓"
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
    const target   = parseFloat(raw);
    const duration = 1800;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = target * easeOut(progress);
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => io.observe(el));
})();


/* ── 5. LAZY IMAGE LOADING ────────────────────────────────────── */
(function initLazyImages() {
  const images = $$('img[data-src], img.lazy[loading="lazy"]');

  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy load supported — just swap data-src → src
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      img.addEventListener('load', () => img.classList.add('loaded'));
      if (img.complete) img.classList.add('loaded');
    });
    return;
  }

  // Fallback: IntersectionObserver
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
          io.unobserve(img);
        }
      });
    },
    { rootMargin: '200px' }
  );

  images.forEach(img => io.observe(img));
})();


/* ── 6. FAQ ACCORDION ─────────────────────────────────────────── */
(function initFAQ() {
  const items = $$('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = $('.faq-q', item);
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => i.classList.remove('open'));

      // Open clicked (unless it was already open)
      if (!isOpen) item.classList.add('open');
    });

    // Keyboard
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
})();


/* ── 7. SKILLS TAB SWITCHER ───────────────────────────────────── */
(function initTabs() {
  const nav = $('.tab-nav');
  if (!nav) return;

  const btns   = $$('.tab-btn', nav);
  const panels = $$('.tab-panel');

  function activate(idx) {
    btns.forEach((b, i)   => b.classList.toggle('active',   i === idx));
    panels.forEach((p, i) => p.classList.toggle('active',   i === idx));
  }

  btns.forEach((btn, i) => btn.addEventListener('click', () => activate(i)));
  activate(0);
})();


/* ── 8. ACTIVE NAV LINK (scrollspy) ──────────────────────────── */
(function initScrollspy() {
  const sections = $$('section[id]');
  const links    = $$('.navbar__links a[href^="#"]');
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          link.classList.toggle(
            'active-nav',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => io.observe(s));
})();


/* ── 9. SMOOTH ANCHOR SCROLL ──────────────────────────────────── */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    const navH = $('.navbar')?.offsetHeight || 70;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();


/* ── 10. CONTACT FORM ─────────────────────────────────────────── */
(function initForm() {
  const form = $('.contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const orig = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate async (replace with real fetch/FormData call)
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#10B981';
      form.reset();

      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1200);
  });
})();


/* ── 11. BACK-TO-TOP ──────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.createElement('button');
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  btn.className = 'btt-btn';

  Object.assign(btn.style, {
    position:   'fixed',
    bottom:     '2rem',
    right:      '2rem',
    width:      '44px',
    height:     '44px',
    borderRadius:'50%',
    background: 'var(--accent)',
    color:      '#fff',
    fontSize:   '1.1rem',
    fontWeight: '700',
    cursor:     'pointer',
    border:     'none',
    boxShadow:  '0 4px 20px rgba(99,102,241,.4)',
    opacity:    '0',
    transform:  'translateY(12px)',
    transition: 'opacity .3s ease, transform .3s ease',
    zIndex:     '90',
  });

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    btn.style.opacity   = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
