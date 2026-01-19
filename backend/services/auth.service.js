import bcrypt from 'bcryptjs';

import AppError from '../utils/app-error.js';
import { PASSWORD_MIN_LENGTH, ENCRYPT_STRENGTH } from '../utils/config.js';

const FORBIDDEN_CHARS_REGEX = /[\s\x00-\x1F\x7F]/;
const LOWERCASE_REGEX = /[a-z]/;
const UPPERCASE_REGEX = /[A-Z]/;
const NUMBER_OR_SYMBOL_REGEX = /[0-9!@#$%^&*()[\]{}\-_=+;:,.<>?]/;

export const validatePasswordPolicy = password => {
  if (typeof password !== 'string') {
    throw new AppError(400, 'El formato de la contraseña no es correcto');
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new AppError(
      400,
      `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`,
    );
  }

  if (FORBIDDEN_CHARS_REGEX.test(password)) {
    throw new AppError(
      400,
      'La contraseña tiene caracteres prohibidos (espacios o caracteres de control)',
    );
  }

  if (!LOWERCASE_REGEX.test(password)) {
    throw new AppError(
      400,
      'La contraseña debe contener al menos una letra minúscula',
    );
  }

  if (!UPPERCASE_REGEX.test(password)) {
    throw new AppError(
      400,
      'La contraseña debe contener al menos una letra mayúscula',
    );
  }

  if (!NUMBER_OR_SYMBOL_REGEX.test(password)) {
    throw new AppError(
      400,
      'La contraseña debe contener al menos un número o un símbolo',
    );
  }

  return true;
};

export const hashPassword = async plainPassword => {
  return bcrypt.hash(plainPassword, ENCRYPT_STRENGTH);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
