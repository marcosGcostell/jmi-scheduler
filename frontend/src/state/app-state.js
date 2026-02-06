/**
 * Central application state management
 * Extends EventTarget to provide observable state
 */

import { VIEWS, STORAGE_KEYS } from '../utils/config.js';
import { getFromStorage, saveToStorage } from '../utils/storage.js';
import { getToday } from '../utils/date-utils.js';

class AppState extends EventTarget {
  constructor() {
    super();

    // Initialize state
    this.state = {
      // Authentication
      isAuthenticated: false,
      currentUser: null,
      authToken: null,

      // Navigation
      currentView: VIEWS.LOGIN,
      previousView: null,

      // Time control view
      timeControl: {
        selectedWorkSite: null,
        selectedDate: getToday(),
        timeEntries: [],
        attendanceRecords: [],
        isLoading: false,
      },

      // Companies view
      companies: {
        list: [],
        selectedCompany: null,
        resources: [],
        categories: [],
        isLoading: false,
      },

      // Work sites view
      workSites: {
        list: [],
        selectedWorkSite: null,
        selectedCompany: null,
        rules: [],
        isLoading: false,
      },

      // Statistics view
      statistics: {
        filters: {},
        results: [],
        isLoading: false,
      },

      // Contractors
      contractors: {
        list: [],
        isLoading: false,
      },

      // Global data (cached)
      globalData: {
        userWorkSites: [],
        allCompanies: [],
        allCategories: [],
      },

      // UI state
      ui: {
        isMobile: window.innerWidth <= 768,
        menuOpen: false,
        notifications: [],
      },
    };

    // Load persisted state
    this._loadPersistedState();

    // Listen to window resize
    window.addEventListener('resize', () => {
      this._updateState('ui', {
        ...this.state.ui,
        isMobile: window.innerWidth <= 768,
      });
    });
  }

  /**
   * Get current state
   */
  getState() {
    return this.state;
  }

  /**
   * Get specific part of state
   */
  get(path) {
    const keys = path.split('.');
    let value = this.state;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  }

  /**
   * Update state and dispatch event
   */
  _updateState(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;

    this.dispatchEvent(
      new CustomEvent('statechange', {
        detail: { key, value, oldValue },
      }),
    );
  }

  /**
   * Set authentication data
   */
  setAuth(token, user) {
    this.state.authToken = token;
    this.state.currentUser = user;
    this.state.isAuthenticated = true;

    saveToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
    saveToStorage(STORAGE_KEYS.USER_DATA, user);

    this.dispatchEvent(
      new CustomEvent('auth:login', {
        detail: { user },
      }),
    );

    this._updateState('isAuthenticated', true);
    this._updateState('currentUser', user);
  }

  /**
   * Clear authentication
   */
  clearAuth() {
    this.state.authToken = null;
    this.state.currentUser = null;
    this.state.isAuthenticated = false;

    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);

    this.dispatchEvent(new CustomEvent('auth:logout'));

    this._updateState('isAuthenticated', false);
    this._updateState('currentUser', null);
  }

  /**
   * Navigate to a view
   */
  navigateTo(view, data = {}) {
    const previousView = this.state.currentView;
    this.state.previousView = previousView;
    this.state.currentView = view;

    // Update URL without reloading
    if (history.pushState) {
      const url = view === VIEWS.TIME_CONTROL ? '/' : `/${view}`;
      history.pushState({ view }, '', url);
    }

    this.dispatchEvent(
      new CustomEvent('navigation', {
        detail: { view, previousView, data },
      }),
    );

    this._updateState('currentView', view);
  }

  /**
   * Go back to previous view
   */
  goBack() {
    if (this.state.previousView) {
      this.navigateTo(this.state.previousView);
    }
  }

  /**
   * Update time control data
   */
  setTimeControlData(data) {
    this._updateState('timeControl', {
      ...this.state.timeControl,
      ...data,
    });
  }

  /**
   * Set selected work site for time control
   */
  setSelectedWorkSite(workSite) {
    this.state.timeControl.selectedWorkSite = workSite;
    saveToStorage(STORAGE_KEYS.LAST_WORKSITE, workSite?.id);

    this.dispatchEvent(
      new CustomEvent('timecontrol:worksitechanged', {
        detail: { workSite },
      }),
    );

    this._updateState('timeControl', this.state.timeControl);
  }

  /**
   * Set selected date for time control
   */
  setSelectedDate(date) {
    this.state.timeControl.selectedDate = date;
    saveToStorage(STORAGE_KEYS.LAST_DATE, date);

    this.dispatchEvent(
      new CustomEvent('timecontrol:datechanged', {
        detail: { date },
      }),
    );

    this._updateState('timeControl', this.state.timeControl);
  }

  /**
   * Set time entries
   */
  setTimeEntries(entries) {
    this.state.timeControl.timeEntries = entries;

    this.dispatchEvent(
      new CustomEvent('timecontrol:entriesloaded', {
        detail: { entries },
      }),
    );

    this._updateState('timeControl', this.state.timeControl);
  }

  /**
   * Add a time entry
   */
  addTimeEntry(entry) {
    this.state.timeControl.timeEntries.push(entry);

    this.dispatchEvent(
      new CustomEvent('timecontrol:entryadded', {
        detail: { entry },
      }),
    );

    this._updateState('timeControl', this.state.timeControl);
  }

  /**
   * Update a time entry
   */
  updateTimeEntry(id, updates) {
    const index = this.state.timeControl.timeEntries.findIndex(
      e => e.id === id,
    );
    if (index !== -1) {
      this.state.timeControl.timeEntries[index] = {
        ...this.state.timeControl.timeEntries[index],
        ...updates,
      };

      this.dispatchEvent(
        new CustomEvent('timecontrol:entryupdated', {
          detail: { id, entry: this.state.timeControl.timeEntries[index] },
        }),
      );

      this._updateState('timeControl', this.state.timeControl);
    }
  }

  /**
   * Remove a time entry
   */
  removeTimeEntry(id) {
    this.state.timeControl.timeEntries =
      this.state.timeControl.timeEntries.filter(e => e.id !== id);

    this.dispatchEvent(
      new CustomEvent('timecontrol:entryremoved', {
        detail: { id },
      }),
    );

    this._updateState('timeControl', this.state.timeControl);
  }

  /**
   * Set attendance records
   */
  setAttendanceRecords(records) {
    this.state.timeControl.attendanceRecords = records;

    this.dispatchEvent(
      new CustomEvent('timecontrol:attendanceloaded', {
        detail: { records },
      }),
    );

    this._updateState('timeControl', this.state.timeControl);
  }

  /**
   * Update companies data
   */
  setCompaniesData(data) {
    this._updateState('companies', {
      ...this.state.companies,
      ...data,
    });
  }

  /**
   * Update work sites data
   */
  setWorkSitesData(data) {
    this._updateState('workSites', {
      ...this.state.workSites,
      ...data,
    });
  }

  /**
   * Update statistics data
   */
  setStatisticsData(data) {
    this._updateState('statistics', {
      ...this.state.statistics,
      ...data,
    });
  }

  /**
   * Set global data
   */
  setGlobalData(data) {
    this._updateState('globalData', {
      ...this.state.globalData,
      ...data,
    });
  }

  /**
   * Set loading state for a section
   */
  setLoading(section, isLoading) {
    if (this.state[section]) {
      this._updateState(section, {
        ...this.state[section],
        isLoading,
      });
    }
  }

  /**
   * Add a notification
   */
  addNotification(message, type = 'info', duration = 3000) {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    };

    this.state.ui.notifications.push(notification);

    this.dispatchEvent(
      new CustomEvent('notification:added', {
        detail: { notification },
      }),
    );

    this._updateState('ui', this.state.ui);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }
  }

  /**
   * Remove a notification
   */
  removeNotification(id) {
    this.state.ui.notifications = this.state.ui.notifications.filter(
      n => n.id !== id,
    );

    this.dispatchEvent(
      new CustomEvent('notification:removed', {
        detail: { id },
      }),
    );

    this._updateState('ui', this.state.ui);
  }

  /**
   * Toggle menu
   */
  toggleMenu() {
    this.state.ui.menuOpen = !this.state.ui.menuOpen;

    this.dispatchEvent(
      new CustomEvent('menu:toggled', {
        detail: { isOpen: this.state.ui.menuOpen },
      }),
    );

    this._updateState('ui', this.state.ui);
  }

  /**
   * Load persisted state from storage
   */
  _loadPersistedState() {
    // Load last selected work site
    const lastWorkSiteId = getFromStorage(STORAGE_KEYS.LAST_WORKSITE);
    if (lastWorkSiteId) {
      this.state.timeControl.lastWorkSiteId = lastWorkSiteId;
    }

    // Load last selected date
    const lastDate = getFromStorage(STORAGE_KEYS.LAST_DATE);
    if (lastDate) {
      this.state.timeControl.selectedDate = lastDate;
    }
  }
}

// Export singleton instance
export const appState = new AppState();
