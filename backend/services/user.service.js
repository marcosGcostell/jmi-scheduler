import validator from 'validator';

import * as User from '../models/user.model.js';

const validateEmailFormat = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  // Continue to validate other fields if no data
  if (!username) return next();

  const result = _isValidUserName(username);

  if (!result.valid) {
    return next(new AppError(400, result.message));
  }

  next();
});

export default validateEmailFormat;
