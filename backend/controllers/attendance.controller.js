import * as companyAttendanceService from '../services/attendance.service.js';
import catchAsync from '../utils/catch-async.js';

export const getCompanyAttendance = catchAsync(async (req, res, next) => {
  const attendance = await companyAttendanceService.getCompanyAttendance(
    req.params.id,
  );

  res.status(200).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});

export const getCompanyAttendanceBy = catchAsync(async (req, res, next) => {
  const attendances = await companyAttendanceService.getCompanyAttendanceBy(
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

export const createCompanyAttendance = catchAsync(async (req, res, next) => {
  const data = { ...req.body, userId: req.user.id };
  const attendance =
    await companyAttendanceService.createCompanyAttendance(data);

  res.status(200).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});

export const updateCompanyAttendance = catchAsync(async (req, res, next) => {
  const attendance = await companyAttendanceService.updateCompanyAttendance(
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

export const deleteCompanyAttendance = catchAsync(async (req, res, next) => {
  const attendance = await companyAttendanceService.deleteCompanyAttendance(
    req.params.id,
  );

  res.status(200).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});
