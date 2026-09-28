// Progressive enhancement for navigation, FAQ, and the short preloader.

document.documentElement.classList.replace('no-js', 'js');

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');
const preloader = document.getElementById('preloader');

const setNavbarState = () => {
  navbar?.classList.toggle('is-scrolled', window.scrollY > 24);
};

setNavbarState();
window.addEventListener('scroll', setNavbarState, { passive: true });

const closeMenu = ({ returnFocus = false } = {}) => {
  if (!navToggle || !navLinks) return;
  navLinks.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Buka menu');
  if (returnFocus) navToggle.focus();
};

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Buka menu' : 'Tutup menu');
  navLinks?.classList.toggle('is-open', !isOpen);

  if (!isOpen) {
    navLinks?.querySelector('a')?.focus();
  }
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => closeMenu({ returnFocus: true }));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navToggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu({ returnFocus: true });
  }
});

document.addEventListener('click', (event) => {
  if (!navToggle || !navLinks || navToggle.getAttribute('aria-expanded') !== 'true') return;
  if (!(event.target instanceof Node)) return;
  if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) closeMenu();
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

const faqButtons = document.querySelectorAll('[data-faq-toggle]');

faqButtons.forEach((button, index) => {
  const panelId = button.getAttribute('aria-controls');
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!panel) return;

  const open = index === 0;
  button.setAttribute('aria-expanded', String(open));
  panel.hidden = !open;

  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    panel.hidden = isExpanded;
  });
});
