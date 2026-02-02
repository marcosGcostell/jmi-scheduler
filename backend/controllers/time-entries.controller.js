import * as timeEntryService from '../services/time-entries.service.js';
import catchAsync from '../utils/catch-async.js';

export const getTimeEntry = catchAsync(async (req, res, next) => {
  const timeEntry = await timeEntryService.getTimeEntry(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      timeEntry,
    },
  });
});

export const getTimeEntriesBy = catchAsync(async (req, res, next) => {
  const timeEntries = await timeEntryService.getTimeEntriesBy(
    req.user,
    req.workSiteId,
    req.companyId,
    req.period,
  );

  res.status(200).json({
    status: 'success',
    results: timeEntries.length,
    data: {
      timeEntries,
    },
  });
});

export const createTimeEntry = catchAsync(async (req, res, next) => {
  const data = { ...req.body, userId: req.user.id };
  const timeEntry = await timeEntryService.createTimeEntry(data);

  res.status(200).json({
    status: 'success',
    data: {
      timeEntry,
    },
  });
});

export const updateTimeEntry = catchAsync(async (req, res, next) => {
  const timeEntry = await timeEntryService.updateTimeEntry(
    req.params.id,
    req.body,
  );

  res.status(200).json({
    status: 'success',
    data: {
      timeEntry,
    },
  });
});

export const fixWorkedMinutes = catchAsync(async (req, res, next) => {
  const timeEntry = await timeEntryService.fixWorkedMinutes(
    req.params.id,
    req.body.workedMinutes,
  );

  res.status(200).json({
    status: 'success',
    data: {
      timeEntry,
    },
  });
});

export const deleteTimeEntry = catchAsync(async (req, res, next) => {
  const timeEntry = await timeEntryService.deleteTimeEntry(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      timeEntry,
    },
  });
});
