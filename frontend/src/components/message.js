/**
 * Message/Notification component
 */

import { BaseComponent } from './base-component.js';
import { createElement } from '../utils/dom.js';

export class Message extends BaseComponent {
  constructor(parentElement, options = {}) {
    super(parentElement);

    this.options = {
      text: '',
      type: 'info', // info, success, warning, error
      dismissible: true,
      onDismiss: null,
      ...options,
    };
  }

  render() {
    this.element = createElement('div', {
      classes: ['message', `message-${this.options.type}`],
    });

    // Icon based on type
    const iconMap = {
      info: 'info-circle',
      success: 'check-circle',
      warning: 'warning',
      error: 'x-circle',
    };

    const icon = this._createIcon(iconMap[this.options.type]);
    this.element.appendChild(icon);

    // Message text
    const text = createElement('p', {
      classes: ['message-text'],
      text: this.options.text,
    });
    this.element.appendChild(text);

    // Dismiss button
    if (this.options.dismissible) {
      const dismissBtn = createElement('button', {
        classes: ['message-dismiss'],
        attributes: {
          type: 'button',
          'aria-label': 'Cerrar mensaje',
        },
      });

      const closeIcon = this._createIcon('x');
      dismissBtn.appendChild(closeIcon);

      this.addEventListener(dismissBtn, 'click', () => {
        this.dismiss();
      });

      this.element.appendChild(dismissBtn);
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

  dismiss() {
    this.element.classList.add('fadeOut');

    setTimeout(() => {
      if (this.options.onDismiss) {
        this.options.onDismiss();
      }
      this.destroy();
    }, 300);
  }

  setText(text) {
    const textEl = this.element.querySelector('.message-text');
    if (textEl) {
      textEl.textContent = text;
    }
  }
}
