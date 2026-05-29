import { Swiper } from 'swiper';

export function initReviewsSlider(): void {
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
