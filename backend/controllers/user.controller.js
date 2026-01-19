import * as userService from '../services/user.service.js';

import catchAsync from '../utils/catch-async.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  // Execute the query
  const users = await User.find();

  // Send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const createUser = catchAsync(async (req, res, next) => {
  const user = await userService.createUser(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const allowedFields = ['name', 'username', 'email', 'data', 'config'];
  const filteredBody = _filterFields(req.body, allowedFields);

  // Nested fields shoud be flattened and use $set operator
  // in order to not loose all the missing data
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: filteredBody },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {});
