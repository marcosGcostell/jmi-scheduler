/**
 * Work rules API service
 */

import { apiService } from './api-service.js';

class WorkRulesService {
  /**
   * Get all work rules (admin only)
   */
  async getWorkRules() {
    return await apiService.get('/work-rules');
  }

  /**
   * Get a single work rule
   */
  async getWorkRule(id) {
    return await apiService.get(`/work-rules/${id}`);
  }

  /**
   * Resolve work rule for a work site, company and date
   */
  async resolveWorkRule(workSiteId, companyId, date) {
    return await apiService.get('/work-rules/resolve', {
      workSiteId,
      companyId,
      date,
    });
  }

  /**
   * Resolve work rules (POST with body)
   */
  async resolveWorkRules(data) {
    return await apiService.post('/work-rules/resolve', data);
  }

  /**
   * Create a work rule (admin only)
   */
  async createWorkRule(data) {
    return await apiService.post('/work-rules', data);
  }

  /**
   * Update a work rule
   */
  async updateWorkRule(id, data) {
    return await apiService.patch(`/work-rules/${id}`, data);
  }

  /**
   * Delete a work rule (admin only)
   */
  async deleteWorkRule(id) {
    return await apiService.delete(`/work-rules/${id}`);
  }
}

export const workRulesService = new WorkRulesService();
