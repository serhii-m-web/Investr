export type TabsOptions = {
  root: HTMLElement;
  buttonSelector?: string;
  panelSelector?: string;
  activeClass?: string;
  initialIndex?: number;
  onChange?: (index: number, panel: HTMLElement) => void;
};

export class Tabs {
  private readonly root: HTMLElement;
  private readonly buttons: HTMLButtonElement[];
  private readonly panels: HTMLElement[];
  private readonly activeClass: string;
  private readonly onChange?: TabsOptions['onChange'];
  private activeIndex: number;
  private readonly handleClick: (event: Event) => void;
  private readonly handleKeydown: (event: KeyboardEvent) => void;

  constructor(options: TabsOptions) {
    const {
      root,
      buttonSelector = '[data-tabs-button]',
      panelSelector = '[data-tabs-panel]',
      activeClass = 'active',
      initialIndex = 0,
      onChange,
    } = options;

    this.root = root;
    this.activeClass = activeClass;
    this.onChange = onChange;

    const buttons = Array.from(
      root.querySelectorAll<HTMLButtonElement>(buttonSelector),
    );
    const panels = Array.from(root.querySelectorAll<HTMLElement>(panelSelector));

    if (!buttons.length || buttons.length !== panels.length) {
      throw new Error(
        `[Tabs] Mismatch: ${buttons.length} buttons and ${panels.length} panels`,
      );
    }

    this.buttons = buttons;
    this.panels = panels;
    this.activeIndex = -1;

    this.handleClick = (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
        buttonSelector,
      );
      if (!button) return;

      const index = this.buttons.indexOf(button);
      if (index >= 0) {
        this.activate(index);
      }
    };

    this.handleKeydown = (event) => {
      const { key } = event;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;

      event.preventDefault();

      const lastIndex = this.buttons.length - 1;
      let nextIndex = this.activeIndex;

      if (key === 'ArrowLeft') {
        nextIndex = this.activeIndex <= 0 ? lastIndex : this.activeIndex - 1;
      } else if (key === 'ArrowRight') {
        nextIndex = this.activeIndex >= lastIndex ? 0 : this.activeIndex + 1;
      } else if (key === 'Home') {
        nextIndex = 0;
      } else if (key === 'End') {
        nextIndex = lastIndex;
      }

      this.activate(nextIndex);
      this.buttons[nextIndex]?.focus();
    };

    this.root.addEventListener('click', this.handleClick);

    const buttonsContainer =
      root.querySelector<HTMLElement>('[data-tabs-buttons]') ?? root;
    buttonsContainer.addEventListener('keydown', this.handleKeydown);

    this.activate(initialIndex, true);
  }

  activate(index: number, silent = false): void {
    if (index < 0 || index >= this.panels.length || index === this.activeIndex) {
      return;
    }

    this.activeIndex = index;

    this.buttons.forEach((button, i) => {
      const isActive = i === index;
      button.classList.toggle(this.activeClass, isActive);
      button.setAttribute('aria-selected', String(isActive));
      button.tabIndex = isActive ? 0 : -1;
    });

    this.panels.forEach((panel, i) => {
      const isActive = i === index;
      panel.classList.toggle(this.activeClass, isActive);
      panel.toggleAttribute('hidden', !isActive);
    });

    if (!silent) {
      this.onChange?.(index, this.panels[index]);
    }
  }

  destroy(): void {
    this.root.removeEventListener('click', this.handleClick);

    const buttonsContainer =
      this.root.querySelector<HTMLElement>('[data-tabs-buttons]') ?? this.root;
    buttonsContainer.removeEventListener('keydown', this.handleKeydown);
  }
}

export function initTabs(
  selector = '[data-tabs]',
  options?: Omit<TabsOptions, 'root'>,
): Tabs[] {
  return Array.from(document.querySelectorAll<HTMLElement>(selector)).map(
    (root) => new Tabs({ root, ...options }),
  );
}
