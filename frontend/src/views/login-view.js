/**
 * Login view
 */

import { BaseView } from './base-view.js';
import { InputWithIcon } from '../components/input-with-icon.js';
import { Button } from '../components/button.js';
import { Message } from '../components/message.js';
import { createElement } from '../utils/dom.js';
import { APP_VERSION } from '../utils/config.js';

export class LoginView extends BaseView {
  constructor(container, controller) {
    super(container);
    this.controller = controller;
    this.emailInput = null;
    this.passwordInput = null;
    this.submitButton = null;
    this.messageContainer = null;
    this.currentMessage = null;
  }

  render() {
    // Clear container
    this.container.innerHTML = '';

    // Main element
    this.element = createElement('div', {
      classes: ['login-view'],
    });

    // Header bar
    const header = createElement('div', {
      classes: ['app-header'],
    });

    const appTitle = createElement('h1', {
      classes: ['app-title'],
      text: `JMI Tracker v${APP_VERSION}`,
    });
    header.appendChild(appTitle);

    this.element.appendChild(header);

    // Content
    const content = createElement('div', {
      classes: ['login-content'],
    });

    // Logo
    const logo = createElement('div', {
      classes: ['login-logo'],
    });

    const logoImg = createElement('img', {
      attributes: {
        src: './assets/img/logo.svg',
        alt: 'JMI Logo',
      },
    });
    logo.appendChild(logoImg);
    content.appendChild(logo);

    // Form
    const form = createElement('form', {
      classes: ['login-form'],
      id: 'login-form',
    });

    // Email input
    this.emailInput = new InputWithIcon(form, {
      type: 'email',
      id: 'email',
      name: 'email',
      placeholder: 'Correo electrónico',
      leftIcon: 'mail',
      required: true,
    });
    this.emailInput.render();

    // Password input
    this.passwordInput = new InputWithIcon(form, {
      type: 'password',
      id: 'password',
      name: 'password',
      placeholder: 'Contraseña',
      leftIcon: 'lock',
      rightIcon: 'eye',
      required: true,
      onRightIconClick: () => this._togglePasswordVisibility(),
    });
    this.passwordInput.render();

    // Forgot password link
    const forgotPasswordContainer = createElement('div', {
      classes: ['forgot-password-container'],
    });

    const forgotPasswordLink = createElement('a', {
      classes: ['forgot-password-link'],
      text: '¿Olvidaste tu contraseña?',
      attributes: { href: '#' },
    });

    this.addEventListener(forgotPasswordLink, 'click', e => {
      e.preventDefault();
      this.controller.navigateToForgotPassword();
    });

    forgotPasswordContainer.appendChild(forgotPasswordLink);
    form.appendChild(forgotPasswordContainer);

    // Submit button
    this.submitButton = new Button(form, {
      text: 'Iniciar sesión',
      type: 'submit',
      variant: 'primary',
    });
    this.submitButton.render();

    // Message container
    this.messageContainer = createElement('div', {
      classes: ['message-container'],
    });
    form.appendChild(this.messageContainer);

    // Form submit handler
    this.addEventListener(form, 'submit', e => {
      e.preventDefault();
      this._handleSubmit();
    });

    content.appendChild(form);
    this.element.appendChild(content);

    // Footer
    const footer = createElement('div', {
      classes: ['app-footer'],
    });

    const copyright = createElement('p', {
      classes: ['copyright'],
      text: '© 2026 Kuantik Software',
    });
    footer.appendChild(copyright);

    this.element.appendChild(footer);

    // Add to container
    this.container.appendChild(this.element);
  }

  _togglePasswordVisibility() {
    const input = this.passwordInput.input;
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }

  async _handleSubmit() {
    this.clearMessages();

    const email = this.emailInput.getValue().trim();
    const password = this.passwordInput.getValue();

    if (!email || !password) {
      this.showError('Por favor, completa todos los campos');
      return;
    }

    this.submitButton.setLoading(true);

    try {
      await this.controller.login(email, password);
    } catch (error) {
      this.showError(error.message);
      this.submitButton.setLoading(false);
    }
  }

  showError(message) {
    this.clearMessages();

    this.currentMessage = new Message(this.messageContainer, {
      text: message,
      type: 'error',
      dismissible: true,
    });
    this.currentMessage.render();
  }

  showSuccess(message) {
    this.clearMessages();

    this.currentMessage = new Message(this.messageContainer, {
      text: message,
      type: 'success',
      dismissible: true,
    });
    this.currentMessage.render();
  }

  clearMessages() {
    if (this.currentMessage) {
      this.currentMessage.destroy();
      this.currentMessage = null;
    }
  }

  destroy() {
    if (this.emailInput) this.emailInput.destroy();
    if (this.passwordInput) this.passwordInput.destroy();
    if (this.submitButton) this.submitButton.destroy();
    if (this.currentMessage) this.currentMessage.destroy();

    super.destroy();
  }
}
