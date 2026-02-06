/**
 * Time control controller
 */

import { timeEntriesService } from '../services/time-entries-service.js';
import { attendanceService } from '../services/attendance-service.js';
import { workSitesService } from '../services/work-sites-service.js';
import { companiesService } from '../services/companies-service.js';
import { contractorsService } from '../services/contractors-service.js';
import { appState } from '../state/app-state.js';
import { VIEWS, SUCCESS_MESSAGES } from '../utils/config.js';

export class TimeControlController {
  constructor() {
    this.currentView = null;
  }

  /**
   * Set the view instance
   */
  setView(view) {
    this.currentView = view;
  }

  /**
   * Initialize the view with data
   */
  async initializeView() {
    try {
      this.currentView?.showLoading();

      // Load work sites
      const workSites = await workSitesService.getWorkSites();

      if (workSites.data) {
        appState.setGlobalData({ userWorkSites: workSites.data });
        this.currentView?.setWorkSites(workSites.data);

        // Set last selected work site or first one
        const state = appState.getState();
        const lastWorkSiteId = state.timeControl.lastWorkSiteId;
        const selectedWorkSite =
          workSites.data.find(ws => ws.id === lastWorkSiteId) ||
          workSites.data[0];

        if (selectedWorkSite) {
          appState.setSelectedWorkSite(selectedWorkSite);
          await this.loadTimeControlData();
        }
      }

      this.currentView?.hideLoading();
    } catch (error) {
      this.currentView?.hideLoading();
      this.currentView?.showError(error.message);
    }
  }

  /**
   * Load time control data for selected work site and date
   */
  async loadTimeControlData() {
    try {
      this.currentView?.showLoading();

      const state = appState.getState();
      const workSiteId = state.timeControl.selectedWorkSite?.id;
      const date = state.timeControl.selectedDate;

      if (!workSiteId || !date) {
        this.currentView?.hideLoading();
        return;
      }

      // Load time entries
      // TODO: API might need to support these filters
      const timeEntries = await timeEntriesService.getTimeEntries({
        workSiteId,
        workDate: date,
      });

      if (timeEntries.data) {
        appState.setTimeEntries(timeEntries.data);
        this.currentView?.renderTimeEntries(timeEntries.data);
      }

      // Load attendance records
      const attendance = await attendanceService.getAttendance({
        workSiteId,
        workDate: date,
      });

      if (attendance.data) {
        appState.setAttendanceRecords(attendance.data);
        this.currentView?.renderAttendance(attendance.data);
      }

      this.currentView?.hideLoading();
    } catch (error) {
      this.currentView?.hideLoading();
      this.currentView?.showError(error.message);
    }
  }

  /**
   * Handle work site change
   */
  async onWorkSiteChange(workSiteId) {
    const state = appState.getState();
    const workSite = state.globalData.userWorkSites.find(
      ws => ws.id === workSiteId,
    );

    if (workSite) {
      appState.setSelectedWorkSite(workSite);
      await this.loadTimeControlData();
    }
  }

  /**
   * Handle date change
   */
  async onDateChange(date) {
    appState.setSelectedDate(date);
    await this.loadTimeControlData();
  }

  /**
   * Add new time entry
   */
  async addNewTimeEntry() {
    // TODO: Implement adding new time entry
    // This would show a form/modal to create a new entry
    console.log('Add new time entry');
  }

  /**
   * Create time entry
   */
  async createTimeEntry(data) {
    try {
      const response = await timeEntriesService.createTimeEntry(data);

      if (response.data) {
        appState.addTimeEntry(response.data);
        appState.addNotification(SUCCESS_MESSAGES.SAVE_SUCCESS, 'success');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update time entry
   */
  async updateTimeEntry(id, data) {
    try {
      const response = await timeEntriesService.updateTimeEntry(id, data);

      if (response.data) {
        appState.updateTimeEntry(id, response.data);
        appState.addNotification(SUCCESS_MESSAGES.UPDATE_SUCCESS, 'success');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete time entry
   */
  async deleteTimeEntry(id) {
    try {
      await timeEntriesService.deleteTimeEntry(id);
      appState.removeTimeEntry(id);
      appState.addNotification(SUCCESS_MESSAGES.DELETE_SUCCESS, 'success');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add new attendance record
   */
  async addNewAttendance() {
    // TODO: Implement adding new attendance
    console.log('Add new attendance');
  }

  /**
   * Create attendance record
   */
  async createAttendance(data) {
    try {
      const response = await attendanceService.createAttendance(data);

      if (response.data) {
        // Reload attendance data
        await this.loadTimeControlData();
        appState.addNotification(SUCCESS_MESSAGES.SAVE_SUCCESS, 'success');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update attendance record
   */
  async updateAttendance(id, data) {
    try {
      await attendanceService.updateAttendance(id, data);
      await this.loadTimeControlData();
      appState.addNotification(SUCCESS_MESSAGES.UPDATE_SUCCESS, 'success');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete attendance record
   */
  async deleteAttendance(id) {
    try {
      await attendanceService.deleteAttendance(id);
      await this.loadTimeControlData();
      appState.addNotification(SUCCESS_MESSAGES.DELETE_SUCCESS, 'success');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Navigate to another view
   */
  navigateTo(viewName) {
    appState.navigateTo(viewName);
  }
}
