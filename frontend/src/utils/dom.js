/**
 * DOM manipulation utilities
 */

/**
 * Create an element with optional classes, attributes, and text content
 */
export function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.classes) {
    if (Array.isArray(options.classes)) {
      element.classList.add(...options.classes);
    } else {
      element.classList.add(options.classes);
    }
  }

  if (options.id) {
    element.id = options.id;
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (options.text) {
    element.textContent = options.text;
  }

  if (options.html) {
    element.innerHTML = options.html;
  }

  return element;
}

/**
 * Clear all children from an element
 */
export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Show element (remove hidden class)
 */
export function show(element) {
  element.classList.remove('hidden');
}

/**
 * Hide element (add hidden class)
 */
export function hide(element) {
  element.classList.add('hidden');
}

/**
 * Toggle element visibility
 */
export function toggle(element) {
  element.classList.toggle('hidden');
}

/**
 * Add event listener with automatic cleanup
 */
export function addListener(element, event, handler, options = {}) {
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

/**
 * Query selector helper
 */
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Query selector all helper
 */
export function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Create SVG icon from sprite
 */
export function createIcon(iconId, classes = []) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('icon', ...classes);

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'xlink:href',
    `#${iconId}`,
  );

  svg.appendChild(use);
  return svg;
}

/**
 * Animate element with CSS class
 */
export function animate(element, animationClass, onComplete) {
  element.classList.add(animationClass);

  const handleAnimationEnd = () => {
    element.classList.remove(animationClass);
    element.removeEventListener('animationend', handleAnimationEnd);
    if (onComplete) onComplete();
  };

  element.addEventListener('animationend', handleAnimationEnd);
}

/**
 * Debounce function calls
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
