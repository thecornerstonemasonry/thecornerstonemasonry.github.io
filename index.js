// ===== NAV (compact dropdown + scroll lock) =====
const body = document.body;
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
const links = [...document.querySelectorAll('.nav-link')];

let scrollLockY = 0;
function lockScroll() {
  scrollLockY = window.scrollY || document.documentElement.scrollTop || 0;
  body.style.position = 'fixed';
  body.style.top = `-${scrollLockY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
}
function unlockScroll() {
  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.width = '';
  window.scrollTo(0, scrollLockY);
}
function setNav(open){
  if(!nav || !navToggle) return;
  if (open) lockScroll(); else unlockScroll();
  body.classList.toggle('nav-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  nav.setAttribute('aria-hidden', String(!open));
}
navToggle?.addEventListener('click', (e) => { e.preventDefault(); setNav(!body.classList.contains('nav-open')); });
nav?.addEventListener('click', (e) => { if (e.target.closest('.nav-link')) setNav(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

// Header shadow
const shadow = () => header?.classList.toggle('scrolled', window.scrollY > 4);
shadow(); window.addEventListener('scroll', shadow, { passive: true });

// Active link highlight
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

// ===== BACK TO TOP =====
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

  const width = () => viewport.clientWidth;
  const clamp = (i) => Math.max(0, Math.min(i, slides.length - 1));
  const goTo = (i) => { index = clamp(i); viewport.scrollTo({ left: index * width(), behavior: 'smooth' }); };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  nextBtn?.addEventListener('click', () => { userInteracted = true; next(); });
  prevBtn?.addEventListener('click', () => { userInteracted = true; prev(); });

  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { userInteracted = true; next(); }
    if (e.key === 'ArrowLeft')  { userInteracted = true; prev(); }
  });

  let t;
  viewport.addEventListener('scroll', () => {
    clearTimeout(t);
    t = setTimeout(() => { index = Math.round(viewport.scrollLeft / width()); }, 100);
  }, { passive: true });

  window.addEventListener('resize', () => goTo(index), { passive: true });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let auto;
  const startAuto = () => { if (prefersReduced) return; stopAuto(); auto = setInterval(() => { if (!userInteracted) next(); }, 5000); };
  const stopAuto  = () => { if (auto) clearInterval(auto); };
  startAuto();
  ['pointerenter', 'focusin'].forEach(ev => viewport.addEventListener(ev, stopAuto));
  ['pointerleave', 'focusout'].forEach(ev => viewport.addEventListener(ev, startAuto));
  document.addEventListener('visibilitychange', () => document.hidden ? stopAuto() : startAuto());
})();

// ===== YEAR =====
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

/* ========= I18N ========= */
const i18n = {
  en: {
    'nav.home': 'Home', 'nav.about': 'About', 'nav.services': 'Services', 'nav.contact': 'Contact',
    'hero.title': 'Built to last. Done right.',
    'hero.tagline': 'Family-owned masonry craftsmanship—brick, stone, chimneys, tuckpointing, and concrete work across Central Illinois.',
    'cta.quote': 'Get a Free Quote', 'cta.services': 'See Our Services',
    'about.title': 'About Us',
    'about.body': 'We’re a family shop that treats every project like it’s our own home. From new builds to repairs, we focus on clean lines, solid structure, and details that hold up for decades.',
    'about.b1': 'Licensed & insured', 'about.b2': 'Residential & light commercial', 'about.b3': 'Free, no-pressure estimates',
    'services.title': 'Services',
    'services.brick.h': 'Brickwork', 'services.brick.p': 'Walls, facades, steps, lintels, and arches with crisp joints and proper drainage.',
    'services.veneer.h': 'Stone Veneer', 'services.veneer.p': 'Natural or manufactured stone installations that elevate curb appeal and durability.',
    'services.chimney.h': 'Chimneys & Fireplaces', 'services.chimney.p': 'Rebuilds, crowns, caps, liners, and leak repairs to keep your home safe.',
    'services.tuck.h': 'Tuckpointing & Repair', 'services.tuck.p': 'Match mortar, stop water intrusion, and stabilize aging work the right way.',
    'services.retaining.h': 'Retaining Walls', 'services.retaining.p': 'Block and stone retaining walls built with proper base, drainage, and reinforcement.',
    'services.concrete.h': 'Concrete & Pavers', 'services.concrete.p': 'Sidewalks, patios, approaches, and paver installs with clean finishes.',
    'gallery.title': 'Recent Work', 'gallery.subtitle': 'Springfield • Chatham • Jacksonville',
    'gallery.c1': 'Brick steps • Springfield', 'gallery.c2': 'Stone veneer entry • Chatham', 'gallery.c3': 'Chimney rebuild • Jacksonville',
    'gallery.c4': 'Tuckpointing • Springfield', 'gallery.c5': 'Retaining wall • Chatham', 'gallery.c6': 'Concrete patio • Springfield',
    'testimonials.title': 'What Customers Say', 'testimonials.quote': '“On time, on budget, and the work looks fantastic. We’ll be calling again.”', 'testimonials.cite': '— Homeowner in Springfield, IL',
    'contact.title': 'Contact Us',
    'contact.intro': 'Tell us a little about your project and the best way to reach you. We typically reply within one business day.',
    'contact.phoneLabel': 'Phone:', 'contact.emailLabel': 'Email:', 'contact.hoursLabel': 'Hours:', 'contact.hoursValue': 'Mon–Fri 8–5',
    'form.firstLabel': 'First name', 'form.firstPh': 'First name',
    'form.lastLabel': 'Last name', 'form.lastPh': 'Last name',
    'form.emailLabel': 'Email', 'form.emailPh': 'Email',
    'form.phoneLabel': 'Phone', 'form.phonePh': 'Phone',
    'form.locationLabel': 'Project location', 'form.locationPh': 'Project location (city)',
    'form.messageLabel': 'Message', 'form.messagePh': 'Tell us about the work you need',
    'form.submit': 'Submit',
    'footer.backToTop': 'Back to top'
  },
  es: {
    'nav.home': 'Inicio', 'nav.about': 'Nosotros', 'nav.services': 'Servicios', 'nav.contact': 'Contacto',
    'hero.title': 'Construido para durar. Bien hecho.',
    'hero.tagline': 'Artesanía de albañilería familiar—ladrillo, piedra, chimeneas, resane y concreto en el centro de Illinois.',
    'cta.quote': 'Solicita una cotización gratuita', 'cta.services': 'Ver nuestros servicios',
    'about.title': 'Sobre nosotros',
    'about.body': 'Somos un equipo familiar que trata cada proyecto como si fuera nuestra propia casa. De obra nueva a reparaciones, cuidamos las líneas, la estructura y los detalles que duran décadas.',
    'about.b1': 'Con licencia y asegurados', 'about.b2': 'Residencial y comercial ligero', 'about.b3': 'Cotizaciones gratuitas y sin compromiso',
    'services.title': 'Servicios',
    'services.brick.h': 'Trabajo en ladrillo', 'services.brick.p': 'Muros, fachadas, escalones, dinteles y arcos con juntas limpias y drenaje adecuado.',
    'services.veneer.h': 'Revestimiento de piedra', 'services.veneer.p': 'Instalaciones de piedra natural o manufacturada que mejoran la durabilidad y la apariencia.',
    'services.chimney.h': 'Chimeneas y hogares', 'services.chimney.p': 'Reconstrucciones, coronas, caperuzas, liners y reparaciones de filtraciones para mantener tu hogar seguro.',
    'services.tuck.h': 'Resane y reparaciones', 'services.tuck.p': 'Igualamos el mortero, detenemos la intrusión de agua y estabilizamos trabajos envejecidos de la manera correcta.',
    'services.retaining.h': 'Muros de contención', 'services.retaining.p': 'Muros de bloque y piedra con base, drenaje y refuerzo adecuados.',
    'services.concrete.h': 'Concreto y adoquines', 'services.concrete.p': 'Banquetas, patios, accesos y colocación de adoquines con acabados limpios.',
    'gallery.title': 'Trabajos recientes', 'gallery.subtitle': 'Springfield • Chatham • Jacksonville',
    'gallery.c1': 'Escalones de ladrillo • Springfield', 'gallery.c2': 'Entrada con revestimiento de piedra • Chatham', 'gallery.c3': 'Reconstrucción de chimenea • Jacksonville',
    'gallery.c4': 'Resane (tuckpointing) • Springfield', 'gallery.c5': 'Muro de contención • Chatham', 'gallery.c6': 'Patio de concreto • Springfield',
    'testimonials.title': 'Lo que dicen nuestros clientes', 'testimonials.quote': '“A tiempo, dentro del presupuesto y el trabajo se ve fantástico. Volveremos a llamar.”', 'testimonials.cite': '— Propietario en Springfield, IL',
    'contact.title': 'Contáctanos',
    'contact.intro': 'Cuéntanos un poco sobre tu proyecto y la mejor manera de contactarte. Normalmente respondemos en un día hábil.',
    'contact.phoneLabel': 'Teléfono:', 'contact.emailLabel': 'Correo:', 'contact.hoursLabel': 'Horario:', 'contact.hoursValue': 'Lun–Vie 8–5',
    'form.firstLabel': 'Nombre', 'form.firstPh': 'Nombre',
    'form.lastLabel': 'Apellido', 'form.lastPh': 'Apellido',
    'form.emailLabel': 'Correo electrónico', 'form.emailPh': 'Correo electrónico',
    'form.phoneLabel': 'Teléfono', 'form.phonePh': 'Teléfono',
    'form.locationLabel': 'Ubicación del proyecto', 'form.locationPh': 'Ubicación del proyecto (ciudad)',
    'form.messageLabel': 'Mensaje', 'form.messagePh': 'Cuéntanos el trabajo que necesitas',
    'form.submit': 'Enviar',
    'footer.backToTop': 'Volver arriba'
  }
};

function applyLang(lang){
  const dict = i18n[lang] || i18n.en;
  document.documentElement.lang = lang === 'es' ? 'es' : 'en';

  // Text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key in dict) el.textContent = dict[key];
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key in dict) el.setAttribute('placeholder', dict[key]);
  });

  // (If needed) aria-labels
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (key in dict) el.setAttribute('aria-label', dict[key]);
  });
}

function setLang(lang){
  localStorage.setItem('site-lang', lang);
  applyLang(lang);
  // Toggle button UI
  document.querySelectorAll('.lang-switch [data-lang]').forEach(btn => {
    const active = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

// Wire the buttons
document.querySelectorAll('.lang-switch [data-lang]').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
});

// Init
setLang(localStorage.getItem('site-lang') || 'en');

// ===== Form placeholder UX =====
const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  form.reset();
  const lang = localStorage.getItem('site-lang') || 'en';
  note.textContent = lang === 'es' ? '¡Gracias! Te contactaremos pronto.' : 'Thanks! We will get back to you shortly.';
  note.style.color = 'green';
});
