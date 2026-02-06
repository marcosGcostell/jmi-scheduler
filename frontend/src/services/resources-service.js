/**
 * Resources API service
 */

import { apiService } from './api-service.js';

class ResourcesService {
  /**
   * Get all resources (admin only)
   */
  async getResources() {
    return await apiService.get('/resources');
  }

  /**
   * Get a single resource
   */
  async getResource(id) {
    return await apiService.get(`/resources/${id}`);
  }

  /**
   * Create a resource
   */
  async createResource(data) {
    return await apiService.post('/resources', data);
  }

  /**
   * Update a resource
   */
  async updateResource(id, data) {
    return await apiService.patch(`/resources/${id}`, data);
  }

  /**
   * Delete a resource (admin only)
   */
  async deleteResource(id) {
    return await apiService.delete(`/resources/${id}`);
  }

  /**
   * Get resource vacations
   */
  async getResourceVacations(id) {
    return await apiService.get(`/resources/${id}/vacations`);
  }

  /**
   * Get resource sick leaves
   */
  async getResourceSickLeaves(id) {
    return await apiService.get(`/resources/${id}/sick-leaves`);
  }
}

export const resourcesService = new ResourcesService();
