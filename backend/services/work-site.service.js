import * as WorkSite from '../models/work-site.model.js';
import workSiteExists from '../domain/assertions/work-site-exists.js';
import { getPool } from '../db/pool.js';
import AppError from '../utils/app-error.js';

export const getAllWorkSites = async onlyActive => {
  return WorkSite.getAllWorkSites(onlyActive);
};

export const getWorkSite = async id => {
  return workSiteExists(id);
};

export const createWorkSite = async data => {
  const client = await getPool().connect();
  const { name, code, userIds, startDate } = data;

  try {
    await client.query('BEGIN');
    const WorkSiteAlreadyExist = await WorkSite.getWorkSiteByCode(
      code?.trim(),
      client,
    );
    if (WorkSiteAlreadyExist?.id) {
      throw new AppError(400, 'Ya hay una obra registrada con este código.');
    }

    const modelData = {
      name: name?.trim(),
      code: code?.trim(),
      startDate,
    };

    const workSite = await WorkSite.createWorkSite(modelData, userIds, client);

    await client.query('COMMIT');
    return workSite;
  } catch (err) {
    await client.query('ROLLBACK');
    if (err?.code === '23503') {
      throw new AppError(
        400,
        'Uno de los usuarios que se intenta asignar, no existe.',
      );
    }
    throw err;
  } finally {
    client.release();
  }
};

export const updateWorkSite = async (id, data) => {
  const client = await getPool().connect();
  const { name, code, userIds, startDate, endDate } = data;

  try {
    await client.query('BEGIN');
    const existing = await workSiteExists(id, client);

    const modelData = {
      name: name?.trim() || existing.name,
      code: code?.trim() || existing.code,
      startDate: startDate ?? existing.start_date ?? null,
      endDate: endDate ?? existing.end_date ?? null,
    };

    // This allows to set the endDate to null after is set
    if (data.endDate === null) modelData.endDate = null;

    const workSite = await WorkSite.updateWorkSite(
      id,
      modelData,
      userIds,
      client,
    );

    await client.query('COMMIT');
    return workSite;
  } catch (err) {
    await client.query('ROLLBACK');
    if (err?.code === '23503') {
      throw new AppError(
        400,
        'Uno de los usuarios que se intenta asignar no existe.',
      );
    } else throw err;
  } finally {
    client.release();
  }
};
