/**
 * Time control view (main app view)
 */

import { BaseView } from './base-view.js';
import { SelectWithIcon } from '../components/select-with-icon.js';
import { TimePicker } from '../components/time-picker.js';
import { Spinner } from '../components/spinner.js';
import { Message } from '../components/message.js';
import { createElement } from '../utils/dom.js';
import { formatDateForDisplay, getToday } from '../utils/date-utils.js';
import { APP_VERSION } from '../utils/config.js';

export class TimeControlView extends BaseView {
  constructor(container, controller) {
    super(container);
    this.controller = controller;
    this.workSiteSelect = null;
    this.dateInput = null;
    this.timeEntriesContainer = null;
    this.attendanceContainer = null;
    this.loadingSpinner = null;
    this.messageContainer = null;
  }

  render() {
    // Clear container
    this.container.innerHTML = '';

    // Main element
    this.element = createElement('div', {
      classes: ['time-control-view'],
    });

    // Header with pulldown menu
    const header = this._renderHeader();
    this.element.appendChild(header);

    // Filters section
    const filters = this._renderFilters();
    this.element.appendChild(filters);

    // Loading spinner container
    const loadingContainer = createElement('div', {
      classes: ['loading-container', 'hidden'],
      id: 'time-control-loading',
    });
    this.element.appendChild(loadingContainer);

    // Message container
    this.messageContainer = createElement('div', {
      classes: ['message-container'],
    });
    this.element.appendChild(this.messageContainer);

    // Content (table with two sections)
    const content = createElement('div', {
      classes: ['time-control-content'],
    });

    // Time entries section
    const timeEntriesSection = createElement('div', {
      classes: ['time-entries-section'],
    });

    const timeEntriesTitle = createElement('h2', {
      classes: ['section-title'],
      text: 'Control Horario',
    });
    timeEntriesSection.appendChild(timeEntriesTitle);

    this.timeEntriesContainer = createElement('div', {
      classes: ['time-entries-list'],
    });
    timeEntriesSection.appendChild(this.timeEntriesContainer);

    content.appendChild(timeEntriesSection);

    // Separator
    const separator = createElement('div', {
      classes: ['section-separator'],
    });
    content.appendChild(separator);

    // Attendance section
    const attendanceSection = createElement('div', {
      classes: ['attendance-section'],
    });

    const attendanceTitle = createElement('h2', {
      classes: ['section-title'],
      text: 'Asistencia Subcontratas',
    });
    attendanceSection.appendChild(attendanceTitle);

    this.attendanceContainer = createElement('div', {
      classes: ['attendance-list'],
    });
    attendanceSection.appendChild(this.attendanceContainer);

    content.appendChild(attendanceSection);

    this.element.appendChild(content);

    // Add to container
    this.container.appendChild(this.element);

    // Initialize
    this._initialize();
  }

  _renderHeader() {
    const header = createElement('div', {
      classes: ['pulldown-header'],
    });

    const topBar = createElement('div', {
      classes: ['header-top-bar'],
    });

    const appTitle = createElement('h1', {
      classes: ['app-title'],
      text: `JMI Tracker v${APP_VERSION}`,
    });
    topBar.appendChild(appTitle);

    const pullIcon = this._createIcon('chevron-down', ['pull-icon']);
    topBar.appendChild(pullIcon);

    header.appendChild(topBar);

    // Menu content (hidden by default)
    const menuContent = createElement('div', {
      classes: ['menu-content', 'hidden'],
    });

    const menuItems = [
      {
        id: 'time-control',
        icon: 'clock',
        label: 'Control Horario',
        active: true,
      },
      { id: 'companies', icon: 'briefcase', label: 'Empresas', active: false },
      { id: 'work-sites', icon: 'map-pin', label: 'Obras', active: false },
      {
        id: 'statistics',
        icon: 'bar-chart',
        label: 'Estadísticas',
        active: false,
      },
    ];

    menuItems.forEach(item => {
      const menuItem = createElement('div', {
        classes: ['menu-item', item.active ? 'active' : ''],
        attributes: { 'data-view': item.id },
      });

      const icon = this._createIcon(item.icon);
      menuItem.appendChild(icon);

      const label = createElement('span', {
        classes: ['menu-label'],
        text: item.label,
      });
      menuItem.appendChild(label);

      this.addEventListener(menuItem, 'click', () => {
        this.controller.navigateTo(item.id);
      });

      menuContent.appendChild(menuItem);
    });

    header.appendChild(menuContent);

    // Toggle menu on click
    this.addEventListener(topBar, 'click', () => {
      menuContent.classList.toggle('hidden');
      pullIcon.classList.toggle('rotated');
    });

    return header;
  }

  _renderFilters() {
    const filters = createElement('div', {
      classes: ['filters-section'],
    });

    // Work site selector
    // TODO: Load work sites from API
    this.workSiteSelect = new SelectWithIcon(filters, {
      id: 'worksite-select',
      placeholder: 'Seleccionar obra...',
      leftIcon: 'map-pin',
      options: [], // Will be populated by controller
      onChange: value => this.controller.onWorkSiteChange(value),
    });
    this.workSiteSelect.render();

    // Date selector
    const dateContainer = createElement('div', {
      classes: ['date-selector'],
    });

    const dateIcon = this._createIcon('calendar', ['icon-left']);
    dateContainer.appendChild(dateIcon);

    this.dateInput = createElement('input', {
      classes: ['date-input'],
      id: 'work-date',
      attributes: {
        type: 'date',
        value: getToday(),
      },
    });

    this.addEventListener(this.dateInput, 'change', e => {
      this.controller.onDateChange(e.target.value);
    });

    dateContainer.appendChild(this.dateInput);
    filters.appendChild(dateContainer);

    return filters;
  }

  _createIcon(iconId, classes = []) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon', ...classes);

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'xlink:href',
      `./assets/img/icons.svg#${iconId}`,
    );

    svg.appendChild(use);
    return svg;
  }

  async _initialize() {
    // Load initial data
    await this.controller.initializeView();
  }

  setWorkSites(workSites) {
    const options = workSites.map(ws => ({
      value: ws.id,
      label: ws.name,
      disabled: !ws.is_open,
    }));

    this.workSiteSelect.setOptions(options);
  }

  renderTimeEntries(entries) {
    this.timeEntriesContainer.innerHTML = '';

    if (entries.length === 0) {
      const empty = createElement('p', {
        classes: ['empty-state'],
        text: 'No hay registros para esta fecha',
      });
      this.timeEntriesContainer.appendChild(empty);
      return;
    }

    // TODO: Render time entry rows
    entries.forEach(entry => {
      const row = this._renderTimeEntryRow(entry);
      this.timeEntriesContainer.appendChild(row);
    });

    // Add new entry button
    const addButton = this._renderAddEntryButton();
    this.timeEntriesContainer.appendChild(addButton);
  }

  _renderTimeEntryRow(entry) {
    // TODO: Implement full time entry row rendering
    const row = createElement('div', {
      classes: ['time-entry-row'],
      attributes: { 'data-entry-id': entry.id },
    });

    row.textContent = `Entry: ${entry.resource_id} - ${entry.start_time}`;

    return row;
  }

  _renderAddEntryButton() {
    const button = createElement('button', {
      classes: ['add-entry-button'],
      attributes: { type: 'button' },
    });

    const icon = this._createIcon('plus');
    button.appendChild(icon);

    this.addEventListener(button, 'click', () => {
      this.controller.addNewTimeEntry();
    });

    return button;
  }

  renderAttendance(records) {
    this.attendanceContainer.innerHTML = '';

    if (records.length === 0) {
      const empty = createElement('p', {
        classes: ['empty-state'],
        text: 'No hay registros de asistencia',
      });
      this.attendanceContainer.appendChild(empty);
      return;
    }

    // TODO: Render attendance rows
    records.forEach(record => {
      const row = this._renderAttendanceRow(record);
      this.attendanceContainer.appendChild(row);
    });

    // Add new attendance button
    const addButton = this._renderAddAttendanceButton();
    this.attendanceContainer.appendChild(addButton);
  }

  _renderAttendanceRow(record) {
    // TODO: Implement full attendance row rendering
    const row = createElement('div', {
      classes: ['attendance-row'],
      attributes: { 'data-record-id': record.id },
    });

    row.textContent = `Attendance: ${record.contractor_id} - ${record.workers_count} workers`;

    return row;
  }

  _renderAddAttendanceButton() {
    const button = createElement('button', {
      classes: ['add-attendance-button'],
      attributes: { type: 'button' },
    });

    const icon = this._createIcon('plus');
    button.appendChild(icon);

    this.addEventListener(button, 'click', () => {
      this.controller.addNewAttendance();
    });

    return button;
  }

  showLoading() {
    const loadingContainer = this.element.querySelector(
      '#time-control-loading',
    );
    if (loadingContainer) {
      loadingContainer.classList.remove('hidden');

      if (!this.loadingSpinner) {
        this.loadingSpinner = new Spinner(loadingContainer, {
          size: 'medium',
          text: 'Cargando...',
        });
        this.loadingSpinner.render();
      }
    }
  }

  hideLoading() {
    const loadingContainer = this.element.querySelector(
      '#time-control-loading',
    );
    if (loadingContainer) {
      loadingContainer.classList.add('hidden');
    }

    if (this.loadingSpinner) {
      this.loadingSpinner.destroy();
      this.loadingSpinner = null;
    }
  }

  showError(message) {
    const msg = new Message(this.messageContainer, {
      text: message,
      type: 'error',
      dismissible: true,
    });
    msg.render();
  }

  showSuccess(message) {
    const msg = new Message(this.messageContainer, {
      text: message,
      type: 'success',
      dismissible: true,
    });
    msg.render();
  }

  destroy() {
    if (this.workSiteSelect) this.workSiteSelect.destroy();
    if (this.loadingSpinner) this.loadingSpinner.destroy();

    super.destroy();
  }
}
