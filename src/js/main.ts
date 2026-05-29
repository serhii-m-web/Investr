import { Swiper } from 'swiper';
import { EffectCreative, Autoplay, Navigation } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { initTabs } from './components/tabs';

const changesSliderOptions: SwiperOptions = {
  modules: [EffectCreative, Autoplay, Navigation],
  effect: 'creative',
  slidesPerView: 1,
  grabCursor: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  speed: 700,
  creativeEffect: {
    limitProgress: 1,
    perspective: true,
    prev: {
      translate: [0, 0, -120],
      opacity: 0,
      scale: 0.92,
    },
    next: {
      translate: ['110%', 0, 0],
      opacity: 0,
      scale: 0.92,
    },
  },
};

const changesSliders = new WeakMap<HTMLElement, Swiper>();
const differentSliders = new WeakMap<HTMLElement, Swiper>();

const differentSliderMq = window.matchMedia('(min-width: 769px)');

function getOrInitChangesSlider(element: HTMLElement): Swiper {
  let swiper = changesSliders.get(element);

  if (!swiper) {
    const prevEl = element.querySelector<HTMLElement>(
      '.changes__slider-arrow--prev',
    );
    const nextEl = element.querySelector<HTMLElement>(
      '.changes__slider-arrow--next',
    );

    swiper = new Swiper(element, {
      ...changesSliderOptions,
      navigation:
        prevEl && nextEl
          ? {
              prevEl,
              nextEl,
            }
          : undefined,
    });
    changesSliders.set(element, swiper);
  }

  swiper.update();
  return swiper;
}

function initChangesSection(): void {
  initTabs('[data-tabs]', {
    onChange: (_index, panel) => {
      const slider = panel.querySelector<HTMLElement>('.changes__slider');
      if (slider) {
        getOrInitChangesSlider(slider);
      }
    },
  });

  const activePanel = document.querySelector<HTMLElement>(
    '[data-tabs] [data-tabs-panel].active',
  );
  const slider = activePanel?.querySelector<HTMLElement>('.changes__slider');
  if (slider) {
    getOrInitChangesSlider(slider);
  }
}

function init(): void {
  document.documentElement.classList.add('js');

  const year = String(new Date().getFullYear());
  document.querySelectorAll<HTMLElement>('[data-year]').forEach((el) => {
    el.textContent = year;
  });

  initHeaderMenu();
  initReviewsSlider();
  initChangesSection();
  setupDifferentSlider();
  initFaq();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

function initHeaderMenu(): void {
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

  const closeMenu = (): void => {
    header.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-menu-open');
    burger.querySelector('.visually-hidden')!.textContent = 'Open menu';
  };

  const openMenu = (): void => {
    header.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-menu-open');
    burger.querySelector('.visually-hidden')!.textContent = 'Close menu';
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

function initReviewsSlider(): void {
  document.querySelectorAll<HTMLElement>('.reviews__slider').forEach((el) => {
    new Swiper(el, {
      slidesPerView: 1.9,
      spaceBetween: 32,
      grabCursor: true,
      speed: 1350,
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 16,
        },
        768: {
          slidesPerView: 1.9,
          spaceBetween: 32,
        },
      },
    });
  });
}
function initDifferentSlider(): void {
  document.querySelectorAll<HTMLElement>('.different__slider').forEach((el) => {
    if (differentSliders.has(el)) {
      return;
    }

    const swiper = new Swiper(el, {
      slidesPerView: 1.9,
      spaceBetween: 32,
      grabCursor: true,
      speed: 1350,
    });
    differentSliders.set(el, swiper);
  });
}

function destroyDifferentSlider(): void {
  document.querySelectorAll<HTMLElement>('.different__slider').forEach((el) => {
    const swiper = differentSliders.get(el);
    if (!swiper) {
      return;
    }

    swiper.destroy(true, true);
    differentSliders.delete(el);
  });
}

function setupDifferentSlider(): void {
  const update = (): void => {
    if (differentSliderMq.matches) {
      initDifferentSlider();
      return;
    }

    destroyDifferentSlider();
  };

  update();
  differentSliderMq.addEventListener('change', update);
}

function initFaq(): void {
  document
    .querySelectorAll<HTMLButtonElement>('.faq__item-trigger')
    .forEach((button) => {
      const item = button.closest('.faq__item');
      const panel = document.getElementById(
        button.getAttribute('aria-controls') ?? '',
      );

      if (!item || !panel) {
        return;
      }

      button.addEventListener('click', () => {
        const isOpen = item.classList.toggle('active');
        button.setAttribute('aria-expanded', String(isOpen));
        panel.toggleAttribute('hidden', !isOpen);
      });
    });
}
