import * as Company from '../models/company.model.js';
import * as Resource from '../models/resource.model.js';
import * as Category from '../models/category.model.js';
import companyExists from '../domain/assertions/company-exists.js';
import { getPool } from '../db/pool.js';
import AppError from '../utils/app-error.js';

export const getAllCompanies = async onlyActive => {
  return Company.getAllCompanies(onlyActive);
};

export const getCompany = async id => {
  return companyExists(id);
};

export const getCompanyResources = async (id, onlyActive, date) => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const company = await companyExists(id, null, client);

    if (company.is_main && date) {
      return Resource.getCompanyResourcesWithStatus(
        id,
        onlyActive,
        date,
        client,
      );
    }

    const resources = await Resource.getCompanyResources(
      id,
      onlyActive,
      client,
    );

    if (!resources.length) {
      throw new AppError(400, 'La empresa no tiene trabajadores.');
    }

    await client.query('COMMIT');
    return resources;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const getCompanyCategories = async (id, plusGlobal) => {
  const categories = await Category.getCompanyCategories(id, plusGlobal);

  if (!categories) {
    throw new AppError(
      400,
      'Esta empresa no tiene ninguna categoría registrada.',
    );
  }

  return categories;
};

export const createCompany = async name => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const companyAlreadyExist = await Company.getCompanyByName(
      name.trim(),
      client,
    );

    if (companyAlreadyExist?.id) {
      throw new AppError(400, 'Ya hay un empresa registrada con este nombre');
    }

    const company = await Company.createCompany({
      name: name.trim(),
      client,
    });

    await client.query('COMMIT');
    return company;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateCompany = async (id, data, isAdmin) => {
  const client = await getPool().connect();
  const { name, isMain, active } = data;

  try {
    await client.query('BEGIN');
    const existing = await companyExists(id, null, client);

    if (existing.is_main && !isAdmin) {
      throw new AppError(
        403,
        'No tiene permiso para modificar la empresa principal.',
      );
    }

    const modelData = {
      name: name?.trim() || existing.name,
      isMain: isMain ?? existing.is_main ?? false,
      active: active ?? existing.active ?? true,
    };

    const company = await Company.updateCompany(id, modelData, client);

    await client.query('COMMIT');
    return company;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const deleteCompany = async id => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const existing = await companyExists(id, 'regular', client);

    if (!existing?.active)
      throw new AppError(400, 'La empresa ya está deshabilitada.');

    const company = await Company.disableCompany(existing.id);

    await client.query('COMMIT');
    return company;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
