import validator from 'validator';

import catchAsync from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';

const validateEmailFormat = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
    return next(new AppError(400, 'Por favor, introduce un email válido'));
  }

  next();
});

export default validateEmailFormat;
