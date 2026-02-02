import * as SickLeave from '../models/sick-leave.model.js';
import sickLeaveExists from '../domain/assertions/sick-leave-exists.js';
import resourceExists from '../domain/assertions/resource-exists.js';
import { getPool } from '../db/pool.js';
import AppError from '../utils/app-error.js';

export const getAllSickLeaves = async (onlyActive, period) => {
  return SickLeave.getAllSickLeaves(onlyActive, period);
};

export const getSickLeave = async id => {
  return sickLeaveExists(id);
};

export const createSickLeave = async data => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    await resourceExists(data.resourceId, client);

    const { resourceId, startDate, endDate } = data;

    const modelData = {
      resourceId,
      startDate,
      endDate: endDate ?? null,
    };

    const sickLeave = await SickLeave.createSickLeave(modelData, client);

    await client.query('COMMIT');
    return sickLeave;
  } catch (err) {
    await client.query('ROLLBACK');
    if (err?.code === '23P01') {
      throw new AppError(409, 'El trabajador ya tiene una baja en ese periodo');
    }
    if (err?.code === '23514') {
      throw new AppError(
        400,
        'La fecha de finalización debe ser posterior a la de comienzo.',
      );
    } else throw err;
  } finally {
    client.release();
  }
};

export const updateSickLeave = async (id, data) => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const existing = await sickLeaveExists(id, client);

    const { resourceId, startDate, endDate } = data;

    const modelData = {
      resourceId: resourceId || existing.resource_id,
      startDate: startDate || existing.start_date,
      endDate: endDate || existing.end_date,
    };

    // Allows to set end_date to null
    if (endDate === null) modelData.endDate = null;

    const sickLeave = await SickLeave.updateSickLeave(id, modelData, client);

    await client.query('COMMIT');
    return sickLeave;
  } catch (err) {
    await client.query('ROLLBACK');
    if (err?.code === '23P01') {
      throw new AppError(400, 'El trabajador ya está de baja en ese periodo.');
    } else throw err;
  } finally {
    client.release();
  }
};

export const deleteSickLeave = async id => {
  const sickLeave = await SickLeave.deleteSickLeave(id);
  if (!sickLeave) {
    throw new AppError(400, 'No se encuentra la baja en el registro.');
  }

  return sickLeave;
};
