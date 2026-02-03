import * as CompanyAttendance from '../models/attendance.model.js';

import workSiteExists from '../domain/assertions/work-site-exists.js';
import companyExists from '../domain/assertions/company-exists.js';
import companyAttendanceExists from '../domain/assertions/attendance-exists.js';
import isMyWorkSite from '../domain/helpers/is-my-work-site.js ';
import { getPool } from '../db/pool.js';
import AppError from '../utils/app-error.js';

export const getCompanyAttendance = async id => {
  return companyAttendanceExists(id);
};

export const getCompanyAttendanceBy = async (
  user,
  workSiteId,
  companyId,
  period,
) => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');

    if (user.role !== 'admin') {
      const isAllowed = await isMyWorkSite(user.id, workSiteId, client);
      if (!isAllowed)
        throw new AppError(
          403,
          'Solo estás autorizado a obtener registros de obras en las que estás asignado.',
        );
    } else if (workSiteId) await workSiteExists(workSiteId, client);
    if (companyId) await companyExists(companyId, 'regular', client);

    const attendances = await CompanyAttendance.getCompanyAttendanceBy(
      workSiteId,
      companyId,
      period,
      client,
    );

    await client.query('COMMIT');
    return attendances;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const createCompanyAttendance = async data => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');

    const { workSiteId, companyId, date, workersCount, userId } = data;

    await workSiteExists(workSiteId, client);
    const company = await companyExists(companyId, 'regular', client);

    // Do not allow to create records for the main company
    if (company.is_main) {
      throw new AppError(
        400,
        'No se permite registrar asistencia para la empresa principal.',
      );
    }

    const modelData = {
      workSiteId,
      companyId,
      date,
      workersCount,
      userId,
    };

    const attendance = await CompanyAttendance.createCompanyAttendance(
      modelData,
      client,
    );

    await client.query('COMMIT');
    return attendance;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateCompanyAttendance = async (id, data) => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    await companyAttendanceExists(id, client);

    const { workersCount } = data;

    const modelData = {
      workersCount,
    };

    const attendance = await CompanyAttendance.updateCompanyAttendance(
      id,
      modelData,
      client,
    );

    await client.query('COMMIT');
    return attendance;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const deleteCompanyAttendance = async id => {
  const attendance = await CompanyAttendance.deleteCompanyAttendance(id);
  if (!attendance) {
    throw new AppError(400, 'No se encuentra este registro de asistencia.');
  }

  return attendance;
};
