const html = document.documentElement;

/* =========================
   THEME
   ========================= */

const themeToggle =
  document.querySelector('[data-theme-toggle]');

const THEME_KEY = 'portfolio-theme';

const savedTheme =
  localStorage.getItem(THEME_KEY);

const systemPrefersDark =
  window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

const initialTheme =
  savedTheme ||
  (systemPrefersDark ? 'dark' : 'light');

const setTheme = (theme) => {
  html.dataset.theme = theme;

  const isDark =
    theme === 'dark';

  themeToggle?.setAttribute(
    'aria-pressed',
    String(isDark)
  );

  themeToggle?.setAttribute(
    'aria-label',
    isDark
      ? 'Aktifkan mode terang'
      : 'Aktifkan mode gelap'
  );
};

setTheme(initialTheme);

themeToggle?.addEventListener(
  'click',
  () => {
    const currentTheme =
      html.dataset.theme;

    const newTheme =
      currentTheme === 'dark'
        ? 'light'
        : 'dark';

    setTheme(newTheme);

    localStorage.setItem(
      THEME_KEY,
      newTheme
    );
  }
);


/* =========================
   LANGUAGE
   ========================= */

const languageToggle =
  document.querySelector(
    '[data-language-toggle]'
  );

const languageLabel =
  document.querySelector(
    '[data-language-label]'
  );

const LANGUAGE_KEY =
  'portfolio-language';


const translations = {

  id: {

    navProjects: 'Karya',
    navAbout: 'Tentang',
    navSkills: 'Keahlian',
    navExperience: 'Pengalaman',
    navServices: 'Layanan',
    navProcess: 'Proses',
    navFaq: 'FAQ',
    navContact: 'Hubungi saya',

    heroAvailability:
      'TERBUKA UNTUK BEKERJA · INDONESIA',

    heroIntro:
      'Frontend Developer yang mengubah ide menjadi pengalaman digital yang jelas, responsif, dan mudah digunakan.',

    heroWork:
      'Lihat karya',

    heroContact:
      'Hubungi saya',

    heroSelectedProjects:
      'TERSEDIA UNTUK PROJECT TERPILIH',

    heroIntroLabel:
      '01 / PERKENALAN'
  },


  en: {

    navProjects: 'Projects',
    navAbout: 'About',
    navSkills: 'Skills',
    navExperience: 'Experience',
    navServices: 'Services',
    navProcess: 'Process',
    navFaq: 'FAQ',
    navContact: 'Contact me',

    heroAvailability:
      'AVAILABLE FOR WORK · INDONESIA',

    heroIntro:
      'Frontend Developer turning ideas into clear, responsive, and easy-to-use digital experiences.',

    heroWork:
      'View projects',

    heroContact:
      'Contact me',

    heroSelectedProjects:
      'AVAILABLE FOR SELECTED PROJECTS',

    heroIntroLabel:
      '01 / INTRODUCTION'
  }

};


const setLanguage = (language) => {

  html.lang = language;

  document
    .querySelectorAll('[data-i18n]')
    .forEach((element) => {

      const key =
        element.dataset.i18n;

      const translation =
        translations[language]?.[key];

      if (translation) {
        element.textContent =
          translation;
      }

    });


  if (languageLabel) {

    languageLabel.textContent =
      language === 'id'
        ? 'EN'
        : 'ID';

  }


  languageToggle?.setAttribute(
    'aria-label',

    language === 'id'
      ? 'Switch to English'
      : 'Ganti ke Bahasa Indonesia'
  );
};


const savedLanguage =
  localStorage.getItem(
    LANGUAGE_KEY
  );

const initialLanguage =
  savedLanguage || 'id';

setLanguage(initialLanguage);


languageToggle?.addEventListener(
  'click',
  () => {

    const currentLanguage =
      html.lang;

    const newLanguage =
      currentLanguage === 'id'
        ? 'en'
        : 'id';

    setLanguage(newLanguage);

    localStorage.setItem(
      LANGUAGE_KEY,
      newLanguage
    );

  }
);