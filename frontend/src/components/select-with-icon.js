/**
 * Select component with icon
 */

import { BaseComponent } from './base-component.js';
import { createElement } from '../utils/dom.js';

export class SelectWithIcon extends BaseComponent {
  constructor(parentElement, options = {}) {
    super(parentElement);

    this.options = {
      placeholder: 'Seleccionar...',
      leftIcon: null,
      id: '',
      name: '',
      required: false,
      disabled: false,
      options: [], // [{value, label, icon, disabled}]
      value: null,
      onChange: null,
      searchable: false,
      ...options,
    };

    this.isOpen = false;
    this.selectedOption = null;
  }

  render() {
    // Container
    this.element = createElement('div', {
      classes: ['select-with-icon'],
      id: this.options.id ? `${this.options.id}-container` : '',
    });

    // Left icon
    if (this.options.leftIcon) {
      const leftIconEl = this._createIcon(this.options.leftIcon, 'icon-left');
      this.element.appendChild(leftIconEl);
    }

    // Selected display
    this.displayEl = createElement('div', {
      classes: ['select-display'],
      attributes: {
        tabindex: '0',
        role: 'button',
        'aria-haspopup': 'listbox',
      },
    });

    this.displayText = createElement('span', {
      classes: ['select-text'],
      text: this.options.placeholder,
    });
    this.displayEl.appendChild(this.displayText);

    // Dropdown icon
    const dropdownIcon = this._createIcon('chevron-down', 'icon-dropdown');
    this.displayEl.appendChild(dropdownIcon);

    this.element.appendChild(this.displayEl);

    // Options dropdown
    this.dropdownEl = createElement('div', {
      classes: ['select-dropdown', 'hidden'],
      attributes: { role: 'listbox' },
    });

    this._renderOptions();

    this.element.appendChild(this.dropdownEl);

    // Event listeners
    this.addEventListener(this.displayEl, 'click', () => this.toggle());
    this.addEventListener(this.displayEl, 'keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });

    // Close on outside click
    this.addEventListener(document, 'click', e => {
      if (!this.element.contains(e.target)) {
        this.close();
      }
    });

    if (this.parentElement) {
      this.parentElement.appendChild(this.element);
    }

    // Set initial value
    if (this.options.value) {
      this.setValue(this.options.value);
    }

    return this.element;
  }

  _renderOptions() {
    this.dropdownEl.innerHTML = '';

    this.options.options.forEach(option => {
      const optionEl = createElement('div', {
        classes: ['select-option'],
        attributes: {
          'data-value': option.value,
          role: 'option',
        },
      });

      if (option.disabled) {
        optionEl.classList.add('disabled');
      }

      if (option.icon) {
        const icon = this._createIcon(option.icon, 'option-icon');
        optionEl.appendChild(icon);
      }

      const label = createElement('span', { text: option.label });
      optionEl.appendChild(label);

      if (!option.disabled) {
        this.addEventListener(optionEl, 'click', () => {
          this.selectOption(option);
        });
      }

      this.dropdownEl.appendChild(optionEl);
    });
  }

  _createIcon(iconId, className = '') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon');
    if (className) svg.classList.add(className);

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'xlink:href',
      `./assets/img/icons.svg#${iconId}`,
    );

    svg.appendChild(use);
    return svg;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.options.disabled) return;

    this.isOpen = true;
    this.element.classList.add('open');
    this.dropdownEl.classList.remove('hidden');
  }

  close() {
    this.isOpen = false;
    this.element.classList.remove('open');
    this.dropdownEl.classList.add('hidden');
  }

  selectOption(option) {
    this.selectedOption = option;
    this.displayText.textContent = option.label;
    this.close();

    if (this.options.onChange) {
      this.options.onChange(option.value, option);
    }
  }

  getValue() {
    return this.selectedOption?.value || null;
  }

  setValue(value) {
    const option = this.options.options.find(opt => opt.value === value);
    if (option) {
      this.selectOption(option);
    }
  }

  setOptions(options) {
    this.options.options = options;
    this._renderOptions();
  }

  clear() {
    this.selectedOption = null;
    this.displayText.textContent = this.options.placeholder;
  }

  disable() {
    this.options.disabled = true;
    this.element.classList.add('disabled');
  }

  enable() {
    this.options.disabled = false;
    this.element.classList.remove('disabled');
  }
}
