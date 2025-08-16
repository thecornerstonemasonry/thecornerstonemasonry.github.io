// ===== NAV (compact dropdown) =====
const body = document.body;
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
const links = [...document.querySelectorAll('.nav-link')];

function setNav(open){
  if(!nav || !navToggle) return;
  body.classList.toggle('nav-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  nav.setAttribute('aria-hidden', String(!open));
}
navToggle?.addEventListener('click', () => setNav(!body.classList.contains('nav-open')));
nav?.addEventListener('click', (e) => { if (e.target.closest('.nav-link')) setNav(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

// Auto-close dropdown if user starts scrolling (prevents odd positions)
let closedOnScroll = false;
window.addEventListener('scroll', () => {
  if (body.classList.contains('nav-open')) {
    setNav(false);
    closedOnScroll = true;
  } else if (closedOnScroll && window.scrollY < 4) {
    closedOnScroll = false;
  }
}, { passive: true });

// Header shadow after scroll
const shadow = () => header?.classList.toggle('scrolled', window.scrollY > 4);
shadow();
window.addEventListener('scroll', shadow, { passive: true });

// Active link highlighting on scroll
const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if (sections.length){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 });
  sections.forEach(sec => io.observe(sec));
}

// Close menu if resizing to desktop while open
window.addEventListener('resize', () => {
  if (window.innerWidth >= 821 && body.classList.contains('nav-open')) setNav(false);
}, { passive: true });

// ===== BACK TO TOP (anchors to #home) =====
document.getElementById('back-to-top')?.addEventListener('click', () => {
  if (window.scrollY < 10) window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== GALLERY (Carousel) =====
(() => {
  const viewport = document.getElementById('carousel');
  if (!viewport) return;

  const slides = [...viewport.querySelectorAll('.slide')];
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  let index = 0;
  let userInteracted = false;

  // helpers
  const width = () => viewport.clientWidth;
  const clamp = (i) => Math.max(0, Math.min(i, slides.length - 1));
  const goTo = (i) => {
    index = clamp(i);
    viewport.scrollTo({ left: index * width(), behavior: 'smooth' });
  };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Buttons
  nextBtn?.addEventListener('click', () => { userInteracted = true; next(); });
  prevBtn?.addEventListener('click', () => { userInteracted = true; prev(); });

  // Keyboard (when viewport has focus)
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { userInteracted = true; next(); }
    if (e.key === 'ArrowLeft')  { userInteracted = true; prev(); }
  });

  // Update index after user scrolls
  let t;
  viewport.addEventListener('scroll', () => {
    clearTimeout(t);
    t = setTimeout(() => { index = Math.round(viewport.scrollLeft / width()); }, 100);
  }, { passive: true });

  // Handle resize
  window.addEventListener('resize', () => goTo(index), { passive: true });

  // Auto-advance (respect reduced motion)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let auto;
  const startAuto = () => {
    if (prefersReduced) return;
    stopAuto();
    auto = setInterval(() => { if (!userInteracted) next(); }, 5000);
  };
  const stopAuto = () => { if (auto) clearInterval(auto); };
  startAuto();

  // Pause on hover/focus, resume on leave/blur, pause in background
  ['pointerenter', 'focusin'].forEach(ev => viewport.addEventListener(ev, stopAuto));
  ['pointerleave', 'focusout'].forEach(ev => viewport.addEventListener(ev, startAuto));
  document.addEventListener('visibilitychange', () => document.hidden ? stopAuto() : startAuto());
})();

// ===== Year in footer =====
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// ===== (Optional) Form UX placeholder =====
const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  form.reset();
  if (note){ note.textContent = 'Thanks! We will get back to you shortly.'; note.style.color = 'green'; }
});
