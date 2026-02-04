import * as attendanceService from '../services/attendance.service.js';
import catchAsync from '../utils/catch-async.js';

export const getAttendance = catchAsync(async (req, res, next) => {
  const attendance = await attendanceService.getAttendance(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});

export const getAllAttendances = catchAsync(async (req, res, next) => {
  const attendances = await attendanceService.getAllAttendances(
    req.user,
    req.workSiteId,
    req.contractorId,
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
  const attendance = await attendanceService.createAttendance(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});

export const updateAttendance = catchAsync(async (req, res, next) => {
  const attendance = await attendanceService.updateAttendance(
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
  const attendance = await attendanceService.deleteAttendance(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});
