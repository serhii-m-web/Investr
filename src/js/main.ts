import 'swiper/css';
import 'swiper/css/effect-creative';

import { initChangesSection } from './components/changes-section';
import { setupDifferentSlider } from './components/different-slider';
import { initFaq } from './components/faq';
import { initHeaderMenu } from './components/header-menu';
import { initReviewsSlider } from './components/reviews-slider';

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
