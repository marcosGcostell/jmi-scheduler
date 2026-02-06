/**
 * Work sites API service
 */

import { apiService } from './api-service.js';

class WorkSitesService {
  /**
   * Get all work sites (admin only gets all, users get their assigned ones)
   */
  async getWorkSites() {
    return await apiService.get('/work-sites');
  }

  /**
   * Get a single work site
   */
  async getWorkSite(id) {
    return await apiService.get(`/work-sites/${id}`);
  }

  /**
   * Create a work site (admin only)
   */
  async createWorkSite(data) {
    return await apiService.post('/work-sites', data);
  }

  /**
   * Update a work site (admin only)
   */
  async updateWorkSite(id, data) {
    return await apiService.patch(`/work-sites/${id}`, data);
  }
}

export const workSitesService = new WorkSitesService();
