import * as contractorService from '../services/contractor.service.js';
import catchAsync from '../utils/catch-async.js';

export const getAllContractors = catchAsync(async (req, res, next) => {
  const contractors = await contractorService.getAllContractors(req.active);

  res.status(200).json({
    status: 'success',
    results: contractors.length,
    data: {
      contractors,
    },
  });
});

export const getContractor = catchAsync(async (req, res, next) => {
  const contractor = await contractorService.getContractor(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      contractor,
    },
  });
});

export const createContractor = catchAsync(async (req, res, next) => {
  const contractor = await contractorService.createContractor(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      contractor,
    },
  });
});

export const updateContractor = catchAsync(async (req, res, next) => {
  const contractor = await contractorService.updateContractor(
    req.params.id,
    req.body,
  );

  res.status(200).json({
    status: 'success',
    data: {
      contractor,
    },
  });
});

export const deleteContractor = catchAsync(async (req, res, next) => {
  const contractor = await contractorService.deleteContractor(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      contractor,
    },
  });
});
