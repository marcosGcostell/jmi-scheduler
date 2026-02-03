import * as scheduleService from '../services/schedule.service.js';

import catchAsync from '../utils/catch-async.js';

export const getAllSchedules = catchAsync(async (req, res, next) => {
  // Execute the query
  const schedule = await scheduleService.getAllSchedules(
    req.companyId,
    req.active,
    req.period,
  );

  // Send response
  res.status(200).json({
    status: 'success',
    results: schedule.length,
    data: {
      schedule,
    },
  });
});

export const getSchedule = catchAsync(async (req, res, next) => {
  // Execute the query
  const schedule = await scheduleService.getSchedule(req.params.id);

  // Send response
  res.status(200).json({
    status: 'success',
    data: {
      schedule,
    },
  });
});

export const getActiveSchedule = catchAsync(async (req, res, next) => {
  // Execute the query
  const schedule = await scheduleService.getActiveSchedule(
    req.companyId,
    req.period,
  );

  // Send response
  res.status(200).json({
    status: 'success',
    data: {
      schedule,
    },
  });
});

export const createSchedule = catchAsync(async (req, res, next) => {
  // Execute the query
  const schedule = await scheduleService.createSchedule(req.body);

  // Send response
  res.status(200).json({
    status: 'success',
    data: {
      schedule,
    },
  });
});

export const updateSchedule = catchAsync(async (req, res, next) => {
  // Execute the query
  const schedule = await scheduleService.updateSchedule(
    req.params.id,
    req.body,
  );

  // Send response
  res.status(200).json({
    status: 'success',
    data: {
      schedule,
    },
  });
});

export const deleteSchedule = catchAsync(async (req, res, next) => {
  const schedule = await scheduleService.deleteSchedule(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      schedule,
    },
  });
});
