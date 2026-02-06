/**
 * Categories API service
 */

import { apiService } from './api-service.js';

class CategoriesService {
  /**
   * Get all categories (admin only)
   */
  async getCategories() {
    return await apiService.get('/categories');
  }

  /**
   * Get a single category
   */
  async getCategory(id) {
    return await apiService.get(`/categories/${id}`);
  }

  /**
   * Create a category
   */
  async createCategory(data) {
    return await apiService.post('/categories', data);
  }

  /**
   * Update a category
   */
  async updateCategory(id, data) {
    return await apiService.patch(`/categories/${id}`, data);
  }

  /**
   * Delete a category (admin only)
   */
  async deleteCategory(id) {
    return await apiService.delete(`/categories/${id}`);
  }
}

export const categoriesService = new CategoriesService();
