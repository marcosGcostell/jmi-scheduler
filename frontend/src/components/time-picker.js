/**
 * Time picker component
 */

import { BaseComponent } from './base-component.js';
import { createElement } from '../utils/dom.js';
import { DEFAULT_START_TIME, TIME_STEP_MINUTES } from '../utils/config.js';
import { minutesToTime, parseTimeToMinutes } from '../utils/date-utils.js';

export class TimePicker extends BaseComponent {
  constructor(parentElement, options = {}) {
    super(parentElement);

    this.options = {
      id: '',
      value: null,
      defaultHour: DEFAULT_START_TIME,
      stepMinutes: TIME_STEP_MINUTES,
      onChange: null,
      disabled: false,
      ...options,
    };

    this.isOpen = false;
    this.selectedHour = this.options.defaultHour;
    this.selectedMinute = 0;
  }

  render() {
    this.element = createElement('div', {
      classes: ['time-picker'],
      id: this.options.id ? `${this.options.id}-container` : '',
    });

    if (this.options.disabled) {
      this.element.classList.add('disabled');
    }

    // Display
    this.displayEl = createElement('div', {
      classes: ['time-display'],
      attributes: {
        tabindex: '0',
        role: 'button',
      },
    });

    this.timeText = createElement('span', {
      classes: ['time-text'],
      text: this._formatTime(this.selectedHour, this.selectedMinute),
    });
    this.displayEl.appendChild(this.timeText);

    const icon = this._createIcon('clock');
    this.displayEl.appendChild(icon);

    this.element.appendChild(this.displayEl);

    // Picker dropdown
    this.pickerEl = createElement('div', {
      classes: ['time-picker-dropdown', 'hidden'],
    });

    this._renderPicker();

    this.element.appendChild(this.pickerEl);

    // Event listeners
    this.addEventListener(this.displayEl, 'click', () => this.toggle());

    this.addEventListener(document, 'click', e => {
      if (!this.element.contains(e.target)) {
        this.close();
      }
    });

    if (this.parentElement) {
      this.parentElement.appendChild(this.element);
    }

    // Set initial value
    if (this.options.value) {
      this.setValue(this.options.value);
    }

    return this.element;
  }

  _renderPicker() {
    this.pickerEl.innerHTML = '';

    const pickerContent = createElement('div', {
      classes: ['time-picker-content'],
    });

    // Hours column
    const hoursCol = createElement('div', {
      classes: ['time-column'],
    });

    const hoursLabel = createElement('div', {
      classes: ['time-column-label'],
      text: 'Hora',
    });
    hoursCol.appendChild(hoursLabel);

    const hoursList = createElement('div', {
      classes: ['time-list'],
    });

    for (let h = 0; h < 24; h++) {
      const hourEl = createElement('div', {
        classes: ['time-item'],
        text: String(h).padStart(2, '0'),
        attributes: { 'data-hour': h },
      });

      if (h === this.selectedHour) {
        hourEl.classList.add('selected');
      }

      this.addEventListener(hourEl, 'click', () => {
        this.selectedHour = h;
        this._updateSelection();
      });

      hoursList.appendChild(hourEl);
    }

    hoursCol.appendChild(hoursList);
    pickerContent.appendChild(hoursCol);

    // Minutes column
    const minutesCol = createElement('div', {
      classes: ['time-column'],
    });

    const minutesLabel = createElement('div', {
      classes: ['time-column-label'],
      text: 'Min',
    });
    minutesCol.appendChild(minutesLabel);

    const minutesList = createElement('div', {
      classes: ['time-list'],
    });

    for (let m = 0; m < 60; m += this.options.stepMinutes) {
      const minuteEl = createElement('div', {
        classes: ['time-item'],
        text: String(m).padStart(2, '0'),
        attributes: { 'data-minute': m },
      });

      if (m === this.selectedMinute) {
        minuteEl.classList.add('selected');
      }

      this.addEventListener(minuteEl, 'click', () => {
        this.selectedMinute = m;
        this._updateSelection();
      });

      minutesList.appendChild(minuteEl);
    }

    minutesCol.appendChild(minutesList);
    pickerContent.appendChild(minutesCol);

    this.pickerEl.appendChild(pickerContent);
  }

  _createIcon(iconId) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon');

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'xlink:href',
      `./assets/img/icons.svg#${iconId}`,
    );

    svg.appendChild(use);
    return svg;
  }

  _formatTime(hour, minute) {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  _updateSelection() {
    // Update display
    this.timeText.textContent = this._formatTime(
      this.selectedHour,
      this.selectedMinute,
    );

    // Update UI selected states
    this.pickerEl.querySelectorAll('.time-item').forEach(item => {
      item.classList.remove('selected');
    });

    const hourEl = this.pickerEl.querySelector(
      `[data-hour="${this.selectedHour}"]`,
    );
    const minuteEl = this.pickerEl.querySelector(
      `[data-minute="${this.selectedMinute}"]`,
    );

    if (hourEl) hourEl.classList.add('selected');
    if (minuteEl) minuteEl.classList.add('selected');

    // Trigger onChange
    if (this.options.onChange) {
      this.options.onChange(this.getValue());
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.options.disabled) return;

    this.isOpen = true;
    this.element.classList.add('open');
    this.pickerEl.classList.remove('hidden');
  }

  close() {
    this.isOpen = false;
    this.element.classList.remove('open');
    this.pickerEl.classList.add('hidden');
  }

  getValue() {
    return this._formatTime(this.selectedHour, this.selectedMinute);
  }

  setValue(timeStr) {
    if (!timeStr) return;

    const [hour, minute] = timeStr.split(':').map(Number);
    this.selectedHour = hour;
    this.selectedMinute = minute;

    this.timeText.textContent = this._formatTime(hour, minute);

    // Re-render picker to update selection
    if (this.pickerEl) {
      this._renderPicker();
    }
  }

  disable() {
    this.options.disabled = true;
    this.element.classList.add('disabled');
  }

  enable() {
    this.options.disabled = false;
    this.element.classList.remove('disabled');
  }
}
