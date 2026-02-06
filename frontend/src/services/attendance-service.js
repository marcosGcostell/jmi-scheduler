/**
 * Attendance API service
 */

import { apiService } from './api-service.js';

class AttendanceService {
  /**
   * Get attendance records with filters
   */
  async getAttendance(filters = {}) {
    return await apiService.get('/attendance', filters);
  }

  /**
   * Get a single attendance record
   */
  async getAttendanceRecord(id) {
    return await apiService.get(`/attendance/${id}`);
  }

  /**
   * Create an attendance record
   */
  async createAttendance(data) {
    return await apiService.post('/attendance', data);
  }

  /**
   * Update an attendance record
   */
  async updateAttendance(id, data) {
    return await apiService.patch(`/attendance/${id}`, data);
  }

  /**
   * Delete an attendance record
   */
  async deleteAttendance(id) {
    return await apiService.delete(`/attendance/${id}`);
  }
}

export const attendanceService = new AttendanceService();
