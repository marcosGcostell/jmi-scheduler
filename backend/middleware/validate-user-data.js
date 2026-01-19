import validator from 'validator';

import catchAsync from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';

const validateUserData = catchAsync(async (req, res, next) => {
  const { email, full_name, password } = req.body;

  if (!email || !full_name || !password) {
    return next(
      new AppError(
        400,
        'Se necesita un email, un nombre y una contraseña para crear un usuario',
      ),
    );
  }

  if (!validator.isEmail(email.toLowerCase())) {
    return next(new AppError(400, 'Por favor, introduce un email válido'));
  }

  next();
});

export default validateUserData;
