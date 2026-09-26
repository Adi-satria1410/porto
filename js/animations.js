window.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  hero?.classList.add('is-loaded');

  const revealSections = document.querySelectorAll('.section, .contact');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  revealSections.forEach((section) => {
    Array.from(section.children).forEach((child) => child.classList.add('reveal-item'));
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealSections.forEach((section) => section.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  revealSections.forEach((section) => observer.observe(section));
});
