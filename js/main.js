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

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const PRELOADER_DURATION = 980;
const PRELOADER_FALLBACK = 1300;
let preloaderFrame = null;
let preloaderFinished = false;

const completePreloader = (instant = false) => {
  if (!preloader || preloaderFinished) return;
  preloaderFinished = true;
  if (preloaderFrame) {
    if (window.cancelAnimationFrame) window.cancelAnimationFrame(preloaderFrame);
    else window.clearTimeout(preloaderFrame);
  }

  const counter = document.getElementById('preloaderCounter');
  if (counter) counter.textContent = '100';
  preloader.setAttribute('aria-label', 'Portfolio siap');
  preloader.classList.add('is-complete');

  if (instant) {
    preloader.classList.add('is-hidden');
    return;
  }

  window.setTimeout(() => preloader.classList.add('is-hidden'), 340);
};

if (preloader) {
  if (reducedMotionQuery.matches) {
    completePreloader(true);
  } else {
    const counter = document.getElementById('preloaderCounter');
    const requestFrame = window.requestAnimationFrame || ((callback) => window.setTimeout(() => callback(performance.now()), 16));
    const startedAt = performance.now();

    const updateCounter = (now) => {
      const progress = Math.min((now - startedAt) / PRELOADER_DURATION, 1);
      const value = Math.min(100, Math.max(1, Math.floor(1 + progress * 99)));
      if (counter) counter.textContent = String(value).padStart(2, '0');
      if (progress < 1 && !preloaderFinished) {
        preloaderFrame = requestFrame(updateCounter);
      }
    };

    preloaderFrame = requestFrame(updateCounter);
    window.setTimeout(() => completePreloader(), PRELOADER_DURATION);
    window.setTimeout(() => completePreloader(true), PRELOADER_FALLBACK);

    // Keep the fallback cancellable for browsers with a partial animation API.
    window.addEventListener('pagehide', () => {
      if (preloaderFrame) {
        if (window.cancelAnimationFrame) window.cancelAnimationFrame(preloaderFrame);
        else window.clearTimeout(preloaderFrame);
      }
    }, { once: true });
  }
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

//lightbox modal
document.addEventListener('DOMContentLoaded', () => {

  const lightbox = document.querySelector('#imageLightbox');

  const lightboxImage = document.querySelector(
    '.image-lightbox__image'
  );

  const lightboxClose = document.querySelector(
    '.image-lightbox__close'
  );

  const lightboxTriggers = document.querySelectorAll(
    '[data-lightbox]'
  );


  // Cek apakah elemen berhasil ditemukan
  if (!lightbox || !lightboxImage || !lightboxClose) {
    console.error('Lightbox element tidak ditemukan.');
    return;
  }


  const openLightbox = (image) => {

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightbox.classList.add('is-active');

    lightbox.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.style.overflow = 'hidden';

  };


  const closeLightbox = () => {

    lightbox.classList.remove('is-active');

    lightbox.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.style.overflow = '';

    // kosongkan gambar setelah modal ditutup
    setTimeout(() => {
      lightboxImage.src = '';
    }, 300);

  };


  lightboxTriggers.forEach((image) => {

    image.addEventListener('click', () => {

      openLightbox(image);

    });

  });


  lightboxClose.addEventListener(
    'click',
    closeLightbox
  );


  lightbox.addEventListener(
    'click',
    (event) => {

      if (
        event.target === lightbox ||
        event.target.classList.contains(
          'image-lightbox__content'
        )
      ) {
        closeLightbox();
      }

    }
  );


  document.addEventListener(
    'keydown',
    (event) => {

      if (
        event.key === 'Escape' &&
        lightbox.classList.contains('is-active')
      ) {
        closeLightbox();
      }

    }
  );

});
