/**
 * Application configuration constants
 */

// API Configuration
export const API_BASE_URL = 'http://localhost:3000/api/v1';

// Assets
export const ICONS = './assets/img/icons.svg';

// Default values
export const DEFAULT_START_TIME = 8; // 08:00
export const TIME_STEP_MINUTES = 5; // Minutes step for time selection
export const APP_VERSION = '1.0';

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'jmi_auth_token',
  USER_DATA: 'jmi_user_data',
  LAST_WORKSITE: 'jmi_last_worksite',
  LAST_DATE: 'jmi_last_date',
  CACHED_DATA: 'jmi_cached_data',
};

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Resource types
export const RESOURCE_TYPES = {
  PERSON: 'person',
  EQUIPMENT: 'equipment',
};

// Worked minutes modes
export const WORKED_MINUTES_MODES = {
  AUTO: 'auto',
  MANUAL: 'manual',
};

// Date formats
export const DATE_FORMAT = 'yyyy-MM-dd';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

// View names
export const VIEWS = {
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  TIME_CONTROL: 'time-control',
  COMPANIES: 'companies',
  WORK_SITES: 'work-sites',
  STATISTICS: 'statistics',
  USER_PROFILE: 'user-profile',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'Error de conexión. Por favor, comprueba tu conexión a internet.',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no se encuentra disponible.',
  SERVER_ERROR: 'Error del servidor. Por favor, inténtalo de nuevo más tarde.',
  VALIDATION_ERROR: 'Los datos introducidos no son válidos.',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Sesión iniciada correctamente',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
  SAVE_SUCCESS: 'Datos guardados correctamente',
  DELETE_SUCCESS: 'Registro eliminado correctamente',
  UPDATE_SUCCESS: 'Registro actualizado correctamente',
  PASSWORD_RESET_EMAIL_SENT:
    'Se ha enviado un correo con las instrucciones para restablecer tu contraseña',
  PASSWORD_CHANGED: 'Contraseña cambiada correctamente',
};
