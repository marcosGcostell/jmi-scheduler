/**
 * Authentication controller
 */

import { authService } from '../services/auth-service.js';
import { appState } from '../state/app-state.js';
import { saveAuthToken, saveUserData } from '../utils/storage.js';
import { VIEWS, SUCCESS_MESSAGES } from '../utils/config.js';

export class AuthController {
  /**
   * Login
   */
  async login(email, password) {
    try {
      const response = await authService.login(email, password);

      if (response.token && response.data.user) {
        // Save auth data
        appState.setAuth(response.token, response.data.user);

        // Navigate to main view
        appState.navigateTo(VIEWS.TIME_CONTROL);

        // Show success notification
        appState.addNotification(SUCCESS_MESSAGES.LOGIN_SUCCESS, 'success');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout
   */
  logout() {
    appState.clearAuth();
    appState.navigateTo(VIEWS.LOGIN);
    appState.addNotification(SUCCESS_MESSAGES.LOGOUT_SUCCESS, 'info');
  }

  /**
   * Forgot password
   */
  async forgotPassword(email) {
    try {
      await authService.forgotPassword(email);
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(code, password, passwordConfirm) {
    try {
      await authService.resetPassword(code, password, passwordConfirm);

      // Navigate to login
      appState.navigateTo(VIEWS.LOGIN);
      appState.addNotification(SUCCESS_MESSAGES.PASSWORD_CHANGED, 'success');

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data) {
    try {
      const response = await authService.updateCurrentUser(data);

      if (response.data.user) {
        // Update state
        appState.setAuth(appState.state.authToken, response.data.user);
        appState.addNotification(SUCCESS_MESSAGES.UPDATE_SUCCESS, 'success');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update password
   */
  async updatePassword(currentPassword, newPassword, passwordConfirm) {
    try {
      await authService.updatePassword(
        currentPassword,
        newPassword,
        passwordConfirm,
      );
      appState.addNotification(SUCCESS_MESSAGES.PASSWORD_CHANGED, 'success');
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Navigate to forgot password
   */
  navigateToForgotPassword() {
    appState.navigateTo(VIEWS.FORGOT_PASSWORD);
  }

  /**
   * Navigate to reset password
   */
  navigateToResetPassword(code) {
    appState.navigateTo(VIEWS.RESET_PASSWORD, { code });
  }
}
