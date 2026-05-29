export function initFaq(): void {
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
