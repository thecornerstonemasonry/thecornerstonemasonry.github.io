// ===== NAV =====
const body = document.body;
// Support either my new markup or your original
const toggler = document.querySelector('.nav-toggle') || document.querySelector('.hamburger');
const menu    = document.querySelector('.primary-nav') || document.querySelector('.nav-menu');
const header  = document.querySelector('.site-header');

const isOpen = () =>
  body.classList.contains('nav-open') ||
  menu?.classList.contains('active') ||
  toggler?.classList.contains('active');

function setOpen(open) {
  if (!toggler || !menu) return;
  body.classList.toggle('nav-open', open);      // new approach
  menu.classList.toggle('active', open);        // legacy fallback
  toggler.classList.toggle('active', open);     // legacy fallback
  if (toggler.matches('.nav-toggle')) {
    toggler.setAttribute('aria-expanded', String(open));
  }
}

toggler?.addEventListener('click', () => setOpen(!isOpen()));
menu?.addEventListener('click', e => {
  if (e.target.closest('.nav-link')) setOpen(false);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

// subtle header shadow on scroll
const onScrollShadow = () => header?.classList.toggle('scrolled', window.scrollY > 4);
onScrollShadow();
window.addEventListener('scroll', onScrollShadow, { passive: true });

// active link highlighting with IntersectionObserver (works with either nav)
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = navLinks
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

if (sections.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 });

  sections.forEach(sec => io.observe(sec));
}

// ===== CONTACT FORM =====
// Preferred: handle form submit (new markup)
const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.first && !data.fname) { note.textContent = 'Please enter your name.'; note.style.color = '#b00020'; return; }
    if (!data.email) { note.textContent = 'Please enter a valid email.'; note.style.color = '#b00020'; return; }
    if (!data.message) { note.textContent = 'Please include a message.'; note.style.color = '#b00020'; return; }
    // TODO: integrate with backend/Formspree/Netlify
    form.reset();
    note.textContent = 'Thanks! Your message has been sent.';
    note.style.color = 'green';
  });
} else {
  // Legacy: button click (original markup)
  const contactButton = document.getElementById('button1');
  contactButton?.addEventListener('click', e => {
    e.preventDefault?.();
    alert('Thank you for your inquiry. We will reach out to you as soon as possible.');
    // Clear whichever fields exist (supports both old/new IDs)
    ['fname','lname','name1','email','email1','phone','message','message1','location','first','last']
      .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  });
}

// ===== Footer year =====
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
