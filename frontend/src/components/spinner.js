/**
 * Spinner/Loader component
 */

import { BaseComponent } from './base-component.js';
import { createElement } from '../utils/dom.js';

export class Spinner extends BaseComponent {
  constructor(parentElement, options = {}) {
    super(parentElement);

    this.options = {
      size: 'medium', // small, medium, large
      text: '',
      overlay: false,
      ...options,
    };
  }

  render() {
    this.element = createElement('div', {
      classes: ['spinner-container', `spinner-${this.options.size}`],
    });

    if (this.options.overlay) {
      this.element.classList.add('spinner-overlay');
    }

    const spinner = createElement('div', {
      classes: ['spinner'],
    });

    this.element.appendChild(spinner);

    if (this.options.text) {
      const text = createElement('p', {
        classes: ['spinner-text'],
        text: this.options.text,
      });
      this.element.appendChild(text);
    }

    if (this.parentElement) {
      this.parentElement.appendChild(this.element);
    }

    return this.element;
  }
}
