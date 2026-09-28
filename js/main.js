// main.js — interaksi dasar: toggle menu mobile

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');
const preloader = document.getElementById('preloader');

const updateNavbar = () => {
  navbar?.classList.toggle('is-scrolled', window.scrollY > 24);
};

updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Tutup menu mobile setelah klik salah satu link
navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const hidePreloader = () => preloader?.classList.add('is-hidden');

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hidePreloader();
} else if (document.readyState === 'complete') {
  hidePreloader();
} else {
  window.addEventListener('load', hidePreloader, { once: true });
  window.setTimeout(hidePreloader, 800);
}

document.querySelectorAll('[data-faq-toggle]').forEach((button, index, buttons) => {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  if (!panel) return;

  if (index > 0) {
    button.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  }

  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    panel.hidden = isExpanded;
  });
});
