/**
 * Base component class
 */

export class BaseComponent {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.element = null;
    this.listeners = [];
  }

  /**
   * Render the component
   */
  render() {
    throw new Error('render() must be implemented by subclass');
  }

  /**
   * Update the component
   */
  update(data) {
    // Override in subclass if needed
  }

  /**
   * Destroy the component and cleanup
   */
  destroy() {
    // Remove all event listeners
    this.listeners.forEach(cleanup => cleanup());
    this.listeners = [];

    // Remove element from DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element = null;
  }

  /**
   * Add event listener with automatic cleanup tracking
   */
  addEventListener(element, event, handler, options) {
    element.addEventListener(event, handler, options);
    this.listeners.push(() =>
      element.removeEventListener(event, handler, options),
    );
  }

  /**
   * Show component
   */
  show() {
    if (this.element) {
      this.element.classList.remove('hidden');
    }
  }

  /**
   * Hide component
   */
  hide() {
    if (this.element) {
      this.element.classList.add('hidden');
    }
  }

  /**
   * Toggle visibility
   */
  toggle() {
    if (this.element) {
      this.element.classList.toggle('hidden');
    }
  }
}
