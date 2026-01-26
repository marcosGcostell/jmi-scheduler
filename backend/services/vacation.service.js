import * as Vacation from '../models/vacation.model.js';
import * as Worker from '../models/worker.model.js';
import AppError from '../utils/app-error.js';

export const getAllVacations = async onlyActive => {
  return Vacation.getAllVacations(onlyActive);
};

export const getVacation = async id => {
  const vacation = await Vacation.getVacation(id);
  if (!vacation) {
    throw new AppError(400, 'No se encuentra el registro de vacaciones.');
  }

  return vacation;
};

export const createVacation = async data => {
  const worker = await Worker.getWorker(data.workerId);
  if (!worker?.id) {
    throw new AppError(400, 'El trabajador no existe.');
  }
  const newData = {
    workerId: data.workerId,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
  };

  try {
    return Vacation.createVacation(newData);
  } catch (err) {
    if (err.code === '23P01') {
      throw new AppError(
        409,
        'El trabajador ya tiene vacaciones en ese periodo',
      );
    } else throw err;
  }
};

export const updateVacation = async (id, data) => {
  const vacation = await Vacation.getVacation(id);
  if (!vacation) {
    throw new AppError(400, 'No se encuentra este registro de vacaciones.');
  }

  const { workerId } = data;
  const startDate = data.startDate ? new Date(data.startDate) : null;
  const endDate = data.endDate ? new Date(data.endDate) : null;

  if (
    (startDate && !validateDate(startDate)) ||
    (endDate && !validateDate(endDate))
  ) {
    throw new AppError(400, 'Las fechas no están en el formato correcto.');
  }

  const newData = {
    workerId,
    startDate: startDate ?? workSite.start_date,
    endDate: startDate ?? workSite.start_date,
  };

  try {
    return Vacation.updateVacation(id, newData);
  } catch (err) {
    if (err.code === '23P01') {
      throw new AppError(
        400,
        'El trabajador ya tiene vacaciones en ese periodo.',
      );
    } else throw err;
  }
};

export const deleteVacation = async id => {
  return Vacation.deleteVacation(id);
};
