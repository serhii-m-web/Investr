import { Swiper } from 'swiper';
import { EffectCreative } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { initTabs } from './components/tabs';

const changesSliderOptions: SwiperOptions = {
  modules: [EffectCreative],
  effect: 'creative',
  slidesPerView: 1,
  grabCursor: true,
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

function getOrInitChangesSlider(element: HTMLElement): Swiper {
  let swiper = changesSliders.get(element);

  if (!swiper) {
    swiper = new Swiper(element, changesSliderOptions);
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

  initReviewsSlider();
  initChangesSection();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

function initReviewsSlider(): void {
  document.querySelectorAll<HTMLElement>('.reviews__slider').forEach((el) => {
    new Swiper(el, {
      slidesPerView: 1.9,
      spaceBetween: 32,
      grabCursor: true,
      speed: 1350,
    });
  });
}
