import * as Resource from '../models/resource.model.js';
import * as Vacation from '../models/vacation.model.js';
import * as SickLeave from '../models/sick-leave.model.js';
import resourceExists from '../domain/assertions/resource-exists.js';
import { getPool } from '../db/pool.js';
import AppError from '../utils/app-error.js';

export const getAllResources = async onlyActive => {
  return Resource.getAllResources(onlyActive);
};

export const getResource = async id => {
  return resourceExists(id);
};

export const getWorkerVacations = async (id, period) => {
  const vacations = await Vacation.getAllVacations(id, null, period);

  if (!vacations) {
    throw new AppError(400, 'Este trabajador no tiene registradas vacaciones.');
  }

  return vacations;
};

export const getWorkerSickLeaves = async (id, period) => {
  const sickLeaves = await SickLeave.getWorkerSickLeaves(id, period);

  if (!sickLeaves) {
    throw new AppError(400, 'Este trabajador no tiene registradas bajas.');
  }

  return sickLeaves;
};

export const createResource = async data => {
  const client = await getPool().connect();
  const { companyId, categoryId, name, resourceType } = data;

  try {
    await client.query('BEGIN');
    const resourceAlreadyExist = await Resource.findResource(
      companyId,
      name.trim(),
      client,
    );
    if (resourceAlreadyExist)
      throw new AppError(
        400,
        'Ya hay un trabajador o equipo registrado con este nombre en esta empresa.',
      );

    const resource = await Resource.createResource(
      {
        companyId,
        categoryId,
        name: name.trim(),
        resourceType: resourceType || 'person',
      },
      client,
    );

    await client.query('COMMIT');
    return resource;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateResource = async (id, data, userRole) => {
  const client = await getPool().connect();
  const { name, userId, companyId, categoryId, resourceType, active } = data;

  try {
    await client.query('BEGIN');
    const existing = await resourceExists(id, client);

    // Users can only change the name, type and categoy fields
    const modelData = {
      name: name?.trim() || existing.name,
      userId: existing.user_id,
      companyId: existing.company.id,
      categoryId: categoryId || existing.category.id,
      resourceType: resourceType || existing.resource_type,
      active: existing.active,
    };

    if (userRole === 'admin') {
      modelData.userId = userId ?? existing.user_id;
      modelData.companyId = companyId || existing.company.id;
      modelData.active = active ?? existing.active ?? true;
    }

    const resource = await Resource.updateResource(id, modelData, client);

    await client.query('COMMIT');
    return resource;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const deleteResource = async id => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const existing = await resourceExists(id, client);

    if (!existing?.active)
      throw new AppError(400, 'El trabajador o equipo ya está deshabilitado.');

    const resource = await Resource.disableResource(existing.id, client);

    await client.query('COMMIT');
    return resource;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
