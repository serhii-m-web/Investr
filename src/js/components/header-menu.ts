export function initHeaderMenu(): void {
  const header = document.querySelector<HTMLElement>(
    '.header:not(.header--legal)',
  );
  if (!header) {
    return;
  }

  const burger = header.querySelector<HTMLButtonElement>('.header__burger');
  const menu = header.querySelector<HTMLElement>('.header__menu');
  const overlay = header.querySelector<HTMLElement>('.header__overlay');

  if (!burger || !menu) {
    return;
  }

  const label = burger.querySelector('.visually-hidden');

  const closeMenu = (): void => {
    header.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-menu-open');
    if (label) {
      label.textContent = 'Open menu';
    }
  };

  const openMenu = (): void => {
    header.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-menu-open');
    if (label) {
      label.textContent = 'Close menu';
    }
  };

  const toggleMenu = (): void => {
    if (header.classList.contains('is-open')) {
      closeMenu();
      return;
    }

    openMenu();
  };

  burger.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', closeMenu);

  menu.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('is-open')) {
      closeMenu();
      burger.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 861px)').matches) {
      closeMenu();
    }
  });
}
