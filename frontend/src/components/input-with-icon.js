/**
 * Input component with icon
 */

import { BaseComponent } from './base-component.js';
import { createElement } from '../utils/dom.js';

export class InputWithIcon extends BaseComponent {
  constructor(parentElement, options = {}) {
    super(parentElement);

    this.options = {
      type: 'text',
      placeholder: '',
      leftIcon: null,
      rightIcon: null,
      id: '',
      name: '',
      required: false,
      disabled: false,
      value: '',
      onInput: null,
      onChange: null,
      onRightIconClick: null,
      ...options,
    };
  }

  render() {
    // Container
    this.element = createElement('div', {
      classes: ['input-with-icon'],
      id: this.options.id ? `${this.options.id}-container` : '',
    });

    // Left icon
    if (this.options.leftIcon) {
      const leftIconEl = this._createIcon(this.options.leftIcon, 'icon-left');
      this.element.appendChild(leftIconEl);
    }

    // Input
    this.input = createElement('input', {
      classes: ['input-field'],
      id: this.options.id,
      attributes: {
        type: this.options.type,
        name: this.options.name,
        placeholder: this.options.placeholder,
        required: this.options.required,
        disabled: this.options.disabled,
      },
    });

    if (this.options.value) {
      this.input.value = this.options.value;
    }

    // Event listeners
    if (this.options.onInput) {
      this.addEventListener(this.input, 'input', e => {
        this.options.onInput(e.target.value, e);
      });
    }

    if (this.options.onChange) {
      this.addEventListener(this.input, 'change', e => {
        this.options.onChange(e.target.value, e);
      });
    }

    this.element.appendChild(this.input);

    // Right icon
    if (this.options.rightIcon) {
      const rightIconEl = this._createIcon(
        this.options.rightIcon,
        'icon-right',
      );

      if (this.options.onRightIconClick) {
        rightIconEl.classList.add('clickable');
        this.addEventListener(
          rightIconEl,
          'click',
          this.options.onRightIconClick,
        );
      }

      this.element.appendChild(rightIconEl);
    }

    if (this.parentElement) {
      this.parentElement.appendChild(this.element);
    }

    return this.element;
  }

  _createIcon(iconId, className) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon', className);

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'xlink:href',
      `./assets/img/icons.svg#${iconId}`,
    );

    svg.appendChild(use);
    return svg;
  }

  getValue() {
    return this.input?.value || '';
  }

  setValue(value) {
    if (this.input) {
      this.input.value = value;
    }
  }

  clear() {
    this.setValue('');
  }

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  disable() {
    if (this.input) {
      this.input.disabled = true;
      this.element.classList.add('disabled');
    }
  }

  enable() {
    if (this.input) {
      this.input.disabled = false;
      this.element.classList.remove('disabled');
    }
  }
}
