import * as Contractor from '../models/contractor.model.js';
import contractorExists from '../domain/assertions/contractor-exists.js';
import { getPool } from '../db/pool.js';
import AppError from '../utils/app-error.js';

export const getAllContractors = async onlyActive => {
  return Contractor.getAllContractors(onlyActive);
};

export const getContractor = async id => {
  return contractorExists(id);
};

export const createContractor = async data => {
  const { name, fullName } = data;
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const contractorAlreadyExist = await Contractor.findContractor(
      name.trim(),
      client,
    );

    if (contractorAlreadyExist?.id) {
      throw new AppError(
        400,
        'Ya hay una subcontrata registrada con este nombre',
      );
    }

    const contractor = await Contractor.createContractor(
      {
        name: name.trim(),
        fullName: fullName?.trim() || null,
      },
      client,
    );

    await client.query('COMMIT');
    return contractor;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateContractor = async (id, data) => {
  const client = await getPool().connect();
  const { name, fullName, active } = data;

  try {
    await client.query('BEGIN');
    const existing = await contractorExists(id, client);

    const modelData = {
      name: name?.trim() || existing.name,
      fullName: fullName?.trim() || existing.full_name,
      active: active ?? existing.active ?? true,
    };

    const contractor = await Contractor.updateContractor(id, modelData, client);

    await client.query('COMMIT');
    return contractor;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const deleteContractor = async id => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const existing = await contractorExists(id, client);

    if (!existing?.active)
      throw new AppError(400, 'La subcontrata ya está deshabilitada.');

    const contractor = await Contractor.disableContractor(existing.id, client);

    await client.query('COMMIT');
    return contractor;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
