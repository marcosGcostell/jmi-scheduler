/**
 * Local storage utilities
 */

import { STORAGE_KEYS } from './config.js';

/**
 * Save data to local storage
 */
export function saveToStorage(key, data) {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
}

/**
 * Get data from local storage
 */
export function getFromStorage(key) {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
}

/**
 * Remove data from local storage
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from storage:', error);
    return false;
  }
}

/**
 * Clear all app data from local storage
 */
export function clearAllStorage() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

/**
 * Save auth token
 */
export function saveAuthToken(token) {
  return saveToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * Get auth token
 */
export function getAuthToken() {
  return getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Remove auth token
 */
export function removeAuthToken() {
  return removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Save user data
 */
export function saveUserData(userData) {
  return saveToStorage(STORAGE_KEYS.USER_DATA, userData);
}

/**
 * Get user data
 */
export function getUserData() {
  return getFromStorage(STORAGE_KEYS.USER_DATA);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getAuthToken();
}
