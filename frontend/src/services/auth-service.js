/**
 * Authentication API service
 */

import { apiService } from './api-service.js';

class AuthService {
  /**
   * Login
   */
  async login(email, password) {
    return await apiService.post('/users/login', { email, password });
  }

  /**
   * Forgot password
   */
  async forgotPassword(email) {
    return await apiService.post('/users/forgot-password', { email });
  }

  /**
   * Reset password
   */
  async resetPassword(code, password, passwordConfirm) {
    return await apiService.post(`/users/reset-password/${code}`, {
      password,
      passwordConfirm,
    });
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    return await apiService.get('/users/me');
  }

  /**
   * Update current user
   */
  async updateCurrentUser(data) {
    return await apiService.patch('/users/me', data);
  }

  /**
   * Update current user password
   */
  async updatePassword(currentPassword, newPassword, passwordConfirm) {
    return await apiService.patch('/users/me/password', {
      currentPassword,
      newPassword,
      passwordConfirm,
    });
  }
}

export const authService = new AuthService();
