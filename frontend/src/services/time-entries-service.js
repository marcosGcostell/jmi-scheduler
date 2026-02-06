/**
 * Time entries API service
 */

import { apiService } from './api-service.js';

class TimeEntriesService {
  /**
   * Get time entries with filters
   */
  async getTimeEntries(filters = {}) {
    return await apiService.get('/time-entries', filters);
  }

  /**
   * Get a single time entry
   */
  async getTimeEntry(id) {
    return await apiService.get(`/time-entries/${id}`);
  }

  /**
   * Create a time entry
   */
  async createTimeEntry(data) {
    return await apiService.post('/time-entries', data);
  }

  /**
   * Update a time entry
   */
  async updateTimeEntry(id, data) {
    return await apiService.patch(`/time-entries/${id}`, data);
  }

  /**
   * Delete a time entry
   */
  async deleteTimeEntry(id) {
    return await apiService.delete(`/time-entries/${id}`);
  }

  /**
   * Fix worked minutes for a time entry
   */
  async fixWorkedMinutes(id) {
    return await apiService.patch(`/time-entries/${id}/fix-worked-minutes`);
  }
}

export const timeEntriesService = new TimeEntriesService();
