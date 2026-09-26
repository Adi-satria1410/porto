// main.js — interaksi dasar: toggle menu mobile

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');

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
