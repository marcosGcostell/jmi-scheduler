/**
 * Main application entry point
 */

import { appState } from './state/app-state.js';
import { isAuthenticated } from './utils/storage.js';
import { VIEWS } from './utils/config.js';

// Import views
import { LoginView } from './views/login-view.js';
import { ResetPasswordView } from './views/reset-password-view.js';
import { TimeControlView } from './views/time-control-view.js';

// Import controllers
import { AuthController } from './controllers/auth-controller.js';
import { TimeControlController } from './controllers/time-control-controller.js';

class App {
  constructor() {
    this.container = document.getElementById('app');
    this.currentView = null;

    // Initialize controllers
    this.authController = new AuthController();
    this.timeControlController = new TimeControlController();

    // Register service worker
    this._registerServiceWorker();

    // Listen to navigation events
    this._setupNavigationListeners();

    // Handle browser back/forward
    this._setupHistoryListener();

    // Initial navigation
    this._initialNavigation();
  }

  /**
   * Register service worker for PWA
   */
  async _registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  /**
   * Setup navigation event listeners
   */
  _setupNavigationListeners() {
    appState.addEventListener('navigation', event => {
      const { view, data } = event.detail;
      this._renderView(view, data);
    });

    appState.addEventListener('auth:login', () => {
      // User logged in, navigate to main view
      this._renderView(VIEWS.TIME_CONTROL);
    });

    appState.addEventListener('auth:logout', () => {
      // User logged out, navigate to login
      this._renderView(VIEWS.LOGIN);
    });
  }

  /**
   * Setup browser history listener
   */
  _setupHistoryListener() {
    window.addEventListener('popstate', event => {
      if (event.state && event.state.view) {
        this._renderView(event.state.view);
      }
    });
  }

  /**
   * Initial navigation based on authentication state
   */
  _initialNavigation() {
    // Check authentication
    if (isAuthenticated()) {
      // Check URL for specific view
      const path = window.location.pathname;

      if (path.includes('reset-password')) {
        const code = new URLSearchParams(window.location.search).get('code');
        this._renderView(VIEWS.RESET_PASSWORD, { code });
      } else {
        this._renderView(VIEWS.TIME_CONTROL);
      }
    } else {
      // Check if reset password link
      if (window.location.pathname.includes('reset-password')) {
        const code = new URLSearchParams(window.location.search).get('code');
        this._renderView(VIEWS.RESET_PASSWORD, { code });
      } else {
        this._renderView(VIEWS.LOGIN);
      }
    }
  }

  /**
   * Render a view
   */
  _renderView(viewName, data = {}) {
    // Destroy current view
    if (this.currentView && this.currentView.destroy) {
      this.currentView.destroy();
    }

    // Create and render new view
    switch (viewName) {
      case VIEWS.LOGIN:
        this.currentView = new LoginView(this.container, this.authController);
        break;

      case VIEWS.RESET_PASSWORD:
        this.currentView = new ResetPasswordView(
          this.container,
          this.authController,
          data.code,
        );
        break;

      case VIEWS.TIME_CONTROL:
        if (!isAuthenticated()) {
          this._renderView(VIEWS.LOGIN);
          return;
        }
        this.currentView = new TimeControlView(
          this.container,
          this.timeControlController,
        );
        this.timeControlController.setView(this.currentView);
        break;

      case VIEWS.COMPANIES:
        // TODO: Implement companies view
        console.log('Companies view not implemented yet');
        break;

      case VIEWS.WORK_SITES:
        // TODO: Implement work sites view
        console.log('Work sites view not implemented yet');
        break;

      case VIEWS.STATISTICS:
        // TODO: Implement statistics view
        console.log('Statistics view not implemented yet');
        break;

      default:
        this._renderView(VIEWS.LOGIN);
        return;
    }

    // Render the view
    if (this.currentView && this.currentView.render) {
      this.currentView.render();
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new App();
  });
} else {
  new App();
}
