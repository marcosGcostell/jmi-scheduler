/**
 * Contractors API service
 */

import { apiService } from './api-service.js';

class ContractorsService {
  /**
   * Get all contractors
   */
  async getContractors() {
    return await apiService.get('/contractors');
  }

  /**
   * Get a single contractor
   */
  async getContractor(id) {
    return await apiService.get(`/contractors/${id}`);
  }

  /**
   * Create a contractor
   */
  async createContractor(data) {
    return await apiService.post('/contractors', data);
  }

  /**
   * Update a contractor
   */
  async updateContractor(id, data) {
    return await apiService.patch(`/contractors/${id}`, data);
  }

  /**
   * Delete a contractor (admin only)
   */
  async deleteContractor(id) {
    return await apiService.delete(`/contractors/${id}`);
  }
}

export const contractorsService = new ContractorsService();
