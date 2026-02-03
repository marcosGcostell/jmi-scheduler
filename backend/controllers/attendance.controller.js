import * as companyAttendanceService from '../services/attendance.service.js';
import catchAsync from '../utils/catch-async.js';

export const getAttendance = catchAsync(async (req, res, next) => {
  const attendance = await companyAttendanceService.getAttendance(
    req.params.id,
  );

  res.status(200).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});

export const getAllAttendances = catchAsync(async (req, res, next) => {
  const attendances = await companyAttendanceService.getAllAttendances(
    req.user,
    req.workSiteId,
    req.companyId,
    req.period,
  );

  res.status(200).json({
    status: 'success',
    results: attendances.length,
    data: {
      attendances,
    },
  });
});

export const createAttendance = catchAsync(async (req, res, next) => {
  const data = { ...req.body, userId: req.user.id };
  const attendance = await companyAttendanceService.createAttendance(data);

  res.status(200).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});

export const updateAttendance = catchAsync(async (req, res, next) => {
  const attendance = await companyAttendanceService.updateAttendance(
    req.params.id,
    req.body,
  );

  res.status(200).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});

export const deleteAttendance = catchAsync(async (req, res, next) => {
  const attendance = await companyAttendanceService.deleteAttendance(
    req.params.id,
  );

  res.status(200).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});
