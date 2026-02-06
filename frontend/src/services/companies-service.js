/**
 * Companies API service
 */

import { apiService } from './api-service.js';

class CompaniesService {
  /**
   * Get all companies
   */
  async getCompanies() {
    return await apiService.get('/companies');
  }

  /**
   * Get a single company
   */
  async getCompany(id) {
    return await apiService.get(`/companies/${id}`);
  }

  /**
   * Create a company
   */
  async createCompany(data) {
    return await apiService.post('/companies', data);
  }

  /**
   * Update a company
   */
  async updateCompany(id, data) {
    return await apiService.patch(`/companies/${id}`, data);
  }

  /**
   * Delete a company (admin only)
   */
  async deleteCompany(id) {
    return await apiService.delete(`/companies/${id}`);
  }

  /**
   * Get company resources
   */
  async getCompanyResources(id) {
    return await apiService.get(`/companies/${id}/resources`);
  }

  /**
   * Get company categories
   */
  async getCompanyCategories(id) {
    return await apiService.get(`/companies/${id}/categories`);
  }
}

export const companiesService = new CompaniesService();
