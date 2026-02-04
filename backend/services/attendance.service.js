import * as Attendance from '../models/attendance.model.js';
import workSiteExists from '../domain/assertions/work-site-exists.js';
import contractorExists from '../domain/assertions/contractor-exists.js';
import attendanceExists from '../domain/assertions/attendance-exists.js';
import isMyWorkSite from '../domain/helpers/is-my-work-site.js ';
import { getPool } from '../db/pool.js';
import AppError from '../utils/app-error.js';

export const getAttendance = async id => {
  return attendanceExists(id);
};

export const getAllAttendances = async (
  user,
  workSiteId,
  contractorId,
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
    if (contractorId) await contractorExists(contractorId, client);

    const attendances = await Attendance.getAllAttendances(
      { workSiteId, contractorId, period },
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

export const createAttendance = async data => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    await workSiteExists(data.workSiteId, client);
    await contractorExists(data.contractorId, client);

    const attendance = await Attendance.createAttendance(data, client);

    await client.query('COMMIT');
    return attendance;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateAttendance = async (id, data) => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    await attendanceExists(id, client);

    const workersCount = data.workersCount ?? 0;

    const attendance = await Attendance.updateAttendance(id, workersCount, client);

    await client.query('COMMIT');
    return attendance;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const deleteAttendance = async id => {
  const attendance = await Attendance.deleteAttendance(id);
  if (!attendance) {
    throw new AppError(400, 'No se encuentra este registro de asistencia.');
  }

  return attendance;
};
