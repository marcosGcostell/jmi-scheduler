import * as User from '../models/user.model.js';
import * as authService from './auth.service.js';
import AppError from '../utils/app-error.js';

export const createUser = async data => {
  const { email, full_name, password, role } = data;

  const userAlreadyExist = User.getUserByEmail(email.toLowerCase());
  if (userAlreadyExist?.id) {
    throw new AppError(409, 'Ya hay un usuario registrado con este email');
  }

  if (!validatedPassword(password)) {
    throw new AppError(422, 'La contraseña no es segura');
  }
};
