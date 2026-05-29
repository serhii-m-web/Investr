import { Swiper } from 'swiper';

const differentSliders = new WeakMap<HTMLElement, Swiper>();
const differentSliderMq = window.matchMedia('(min-width: 769px)');

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

export function setupDifferentSlider(): void {
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
