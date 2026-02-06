/**
 * Base view class
 */

export class BaseView {
  constructor(container) {
    this.container = container;
    this.element = null;
    this.listeners = [];
  }

  /**
   * Render the view
   */
  render() {
    throw new Error('render() must be implemented by subclass');
  }

  /**
   * Destroy the view and cleanup
   */
  destroy() {
    // Remove all event listeners
    this.listeners.forEach(cleanup => cleanup());
    this.listeners = [];

    // Clear container
    if (this.container) {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
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
   * Show loading state
   */
  showLoading() {
    // Override in subclass
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    // Override in subclass
  }

  /**
   * Show error message
   */
  showError(message) {
    // Override in subclass
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    // Override in subclass
  }

  /**
   * Clear messages
   */
  clearMessages() {
    // Override in subclass
  }
}
