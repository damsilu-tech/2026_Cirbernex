(function () {
  const STORAGE_KEY = 'edm-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) return saved;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  applyTheme(getInitialTheme());

  document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // THEME TOGGLE
    // =========================

    const themeBtn = document.getElementById('themeToggle');

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current =
          document.documentElement.getAttribute('data-theme');

        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }


    // =========================
    // MOBILE NAVIGATION
    // =========================

    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', (event) => {
      event.stopPropagation();

      const isOpen = navLinks.classList.toggle('open');

      menuBtn.setAttribute('aria-expanded', isOpen);
    });


    // Close when clicking outside
    document.addEventListener('click', (event) => {
      if (
        !navLinks.contains(event.target) &&
        !menuBtn.contains(event.target)
      ) {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });


    // Close after clicking a navigation link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });


    // Close with Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();