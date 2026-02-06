/**
 * Base API service with common HTTP methods
 */

import { API_BASE_URL, ERROR_MESSAGES } from '../utils/config.js';
import { getAuthToken } from '../utils/storage.js';

class ApiService {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get auth headers
   */
  _getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  async _handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      // Handle different error status codes
      let errorMessage = ERROR_MESSAGES.GENERIC_ERROR;

      switch (response.status) {
        case 400:
          errorMessage = data.message || ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case 401:
          errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
          break;
        case 404:
          errorMessage = ERROR_MESSAGES.NOT_FOUND;
          break;
        case 500:
        case 502:
        case 503:
          errorMessage = ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          errorMessage = data.message || ERROR_MESSAGES.GENERIC_ERROR;
      }

      throw new Error(errorMessage);
    }

    return data;
  }

  /**
   * Handle network errors
   */
  _handleError(error) {
    if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);

      // Add query parameters
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this._getHeaders(),
      });

      return await this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * POST request
   */
  async post(endpoint, body = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: JSON.stringify(body),
      });

      return await this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch(endpoint, body = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: this._getHeaders(),
        body: JSON.stringify(body),
      });

      return await this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this._getHeaders(),
      });

      return await this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }
}

export const apiService = new ApiService();
