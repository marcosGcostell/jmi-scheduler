/**
 * Button component
 */

import { BaseComponent } from './base-component.js';
import { createElement } from '../utils/dom.js';

export class Button extends BaseComponent {
  constructor(parentElement, options = {}) {
    super(parentElement);

    this.options = {
      text: '',
      type: 'button', // button, submit, reset
      variant: 'primary', // primary, secondary, danger, ghost
      icon: null,
      iconPosition: 'left', // left, right
      disabled: false,
      loading: false,
      onClick: null,
      classes: [],
      ...options,
    };
  }

  render() {
    this.element = createElement('button', {
      classes: ['btn', `btn-${this.options.variant}`, ...this.options.classes],
      attributes: {
        type: this.options.type,
        disabled: this.options.disabled,
      },
    });

    if (this.options.loading) {
      this.element.classList.add('loading');
    }

    // Icon (left)
    if (this.options.icon && this.options.iconPosition === 'left') {
      const icon = this._createIcon(this.options.icon);
      this.element.appendChild(icon);
    }

    // Text
    if (this.options.text) {
      const span = createElement('span', { text: this.options.text });
      this.element.appendChild(span);
    }

    // Icon (right)
    if (this.options.icon && this.options.iconPosition === 'right') {
      const icon = this._createIcon(this.options.icon);
      this.element.appendChild(icon);
    }

    // Loading spinner
    if (this.options.loading) {
      const spinner = createElement('div', { classes: ['spinner'] });
      this.element.appendChild(spinner);
    }

    // Click handler
    if (this.options.onClick) {
      this.addEventListener(this.element, 'click', this.options.onClick);
    }

    if (this.parentElement) {
      this.parentElement.appendChild(this.element);
    }

    return this.element;
  }

  _createIcon(iconId) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon');

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'xlink:href',
      `./assets/img/icons.svg#${iconId}`,
    );

    svg.appendChild(use);
    return svg;
  }

  setLoading(loading) {
    this.options.loading = loading;
    if (loading) {
      this.element.classList.add('loading');
      this.element.disabled = true;
    } else {
      this.element.classList.remove('loading');
      this.element.disabled = this.options.disabled;
    }
  }

  disable() {
    this.options.disabled = true;
    this.element.disabled = true;
  }

  enable() {
    this.options.disabled = false;
    if (!this.options.loading) {
      this.element.disabled = false;
    }
  }

  setText(text) {
    this.options.text = text;
    const span = this.element.querySelector('span');
    if (span) {
      span.textContent = text;
    }
  }
}
