// ===== NAV =====
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

// Close drawer when a nav link is clicked
nav?.addEventListener('click', (e) => {
  if (e.target.closest('.nav-link')) setNav(false);
});

// Close on Escape
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

// Add subtle shadow after scroll
const shadow = () => header?.classList.toggle('scrolled', window.scrollY > 4);
shadow();
window.addEventListener('scroll', shadow, { passive: true });

// Active link highlighting on scroll
const sections = links
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

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

// Prevent body scroll jump when resizing from mobile to desktop with menu open
window.addEventListener('resize', () => {
  if (window.innerWidth >= 821 && body.classList.contains('nav-open')) setNav(false);
}, { passive: true });

// ===== Back-to-top =====
// Footer link now targets #home, which is below the sticky header.
// No JS required, but keep smooth UX if user is already near top.
document.getElementById('back-to-top')?.addEventListener('click', () => {
  // If already near top, ensure a small scroll so users see feedback
  if (window.scrollY < 10) window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Year in footer =====
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// ===== (Optional) Form: placeholder UX only — we’ll wire later =====
const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  form.reset();
  if (note){ note.textContent = 'Thanks! We will get back to you shortly.'; note.style.color = 'green'; }
});
