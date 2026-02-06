/**
 * Reset password view
 */

import { BaseView } from './base-view.js';
import { InputWithIcon } from '../components/input-with-icon.js';
import { Button } from '../components/button.js';
import { Message } from '../components/message.js';
import { createElement } from '../utils/dom.js';
import { APP_VERSION } from '../utils/config.js';

export class ResetPasswordView extends BaseView {
  constructor(container, controller, resetCode) {
    super(container);
    this.controller = controller;
    this.resetCode = resetCode;
    this.codeInputs = [];
    this.passwordInput = null;
    this.confirmPasswordInput = null;
    this.submitButton = null;
    this.messageContainer = null;
    this.currentMessage = null;
  }

  render() {
    // Clear container
    this.container.innerHTML = '';

    // Main element
    this.element = createElement('div', {
      classes: ['reset-password-view'],
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
      classes: ['reset-password-content'],
    });

    // Logo
    const logo = createElement('div', {
      classes: ['reset-password-logo'],
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
      classes: ['reset-password-form'],
      id: 'reset-password-form',
    });

    // Instructions
    const instructions = createElement('p', {
      classes: ['instructions'],
      text: 'Introduce el código de 6 dígitos que has recibido por correo',
    });
    form.appendChild(instructions);

    // Code inputs container
    const codeContainer = createElement('div', {
      classes: ['code-inputs-container'],
    });

    // Create 6 code input boxes
    for (let i = 0; i < 6; i++) {
      const input = createElement('input', {
        classes: ['code-input'],
        attributes: {
          type: 'text',
          maxlength: '1',
          pattern: '[0-9]',
          required: true,
          'data-index': i,
        },
      });

      // Auto-focus next input
      this.addEventListener(input, 'input', e => {
        if (e.target.value && i < 5) {
          this.codeInputs[i + 1].focus();
        }

        // Check if all filled
        if (this._isCodeComplete()) {
          this._showPasswordFields();
        }
      });

      // Handle backspace
      this.addEventListener(input, 'keydown', e => {
        if (e.key === 'Backspace' && !e.target.value && i > 0) {
          this.codeInputs[i - 1].focus();
        }
      });

      this.codeInputs.push(input);
      codeContainer.appendChild(input);
    }

    form.appendChild(codeContainer);

    // Password fields container (hidden initially)
    this.passwordFieldsContainer = createElement('div', {
      classes: ['password-fields', 'hidden'],
    });

    // New password input
    this.passwordInput = new InputWithIcon(this.passwordFieldsContainer, {
      type: 'password',
      id: 'new-password',
      name: 'password',
      placeholder: 'Nueva contraseña',
      leftIcon: 'lock',
      rightIcon: 'eye',
      required: true,
      onRightIconClick: () =>
        this._togglePasswordVisibility(this.passwordInput),
    });
    this.passwordInput.render();

    // Confirm password input
    this.confirmPasswordInput = new InputWithIcon(
      this.passwordFieldsContainer,
      {
        type: 'password',
        id: 'confirm-password',
        name: 'passwordConfirm',
        placeholder: 'Confirmar contraseña',
        leftIcon: 'lock',
        rightIcon: 'eye',
        required: true,
        onRightIconClick: () =>
          this._togglePasswordVisibility(this.confirmPasswordInput),
      },
    );
    this.confirmPasswordInput.render();

    // Submit button
    this.submitButton = new Button(this.passwordFieldsContainer, {
      text: 'Restablecer contraseña',
      type: 'submit',
      variant: 'primary',
    });
    this.submitButton.render();

    form.appendChild(this.passwordFieldsContainer);

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

    // Focus first input
    if (this.codeInputs[0]) {
      setTimeout(() => this.codeInputs[0].focus(), 100);
    }
  }

  _isCodeComplete() {
    return this.codeInputs.every(input => input.value.length === 1);
  }

  _getCode() {
    return this.codeInputs.map(input => input.value).join('');
  }

  _showPasswordFields() {
    this.passwordFieldsContainer.classList.remove('hidden');
  }

  _togglePasswordVisibility(inputComponent) {
    const input = inputComponent.input;
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }

  async _handleSubmit() {
    this.clearMessages();

    const code = this._getCode();
    const password = this.passwordInput.getValue();
    const confirmPassword = this.confirmPasswordInput.getValue();

    if (!this._isCodeComplete()) {
      this.showError('Por favor, introduce el código completo');
      return;
    }

    if (!password || !confirmPassword) {
      this.showError('Por favor, completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      this.showError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      this.showError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    this.submitButton.setLoading(true);

    try {
      await this.controller.resetPassword(code, password, confirmPassword);
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
    if (this.passwordInput) this.passwordInput.destroy();
    if (this.confirmPasswordInput) this.confirmPasswordInput.destroy();
    if (this.submitButton) this.submitButton.destroy();
    if (this.currentMessage) this.currentMessage.destroy();

    super.destroy();
  }
}
