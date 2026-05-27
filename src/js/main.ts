import { Swiper } from 'swiper';
import 'swiper/css';

function init(): void {
  document.documentElement.classList.add('js');

  const year = String(new Date().getFullYear());
  document.querySelectorAll<HTMLElement>('[data-year]').forEach((el) => {
    el.textContent = year;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

function initReviewsSlider(): void {
  new Swiper('.reviews__slider', {
    slidesPerView: 1.9,
    spaceBetween: 32,
    grabCursor: true,
  });
}

initReviewsSlider();
