import * as TimeEntry from '../models/time-entries.model.js';
import * as Resource from '../models/resource.model.js';
import * as WorkSite from '../models/work-site.model.js';
import * as WorkRule from '../models/work-rule.model.js';
import resourceExists from '../domain/assertions/resource-exists.js';
import workSiteExists from '../domain/assertions/work-site-exists.js';
import workRuleExists from '../domain/assertions/work-rule-exists.js';
import companyExists from '../domain/assertions/company-exists.js';
import timeEntryExists from '../domain/assertions/time-entry-exists.js';
import { getPool } from '../db/pool.js';
import AppError from '../utils/app-error.js';

const _allowQuery = async (userId, workSiteId, client) => {
  if (!workSiteId) return false;

  const userWorkSites = await WorkSite.findMyWorkSites(userId, null, client);
  const userWorkSitesIds = userWorkSites.map(ws => ws.id);
  return userWorkSitesIds.includes(workSiteId);
};

export const getTimeEntry = async id => {
  return timeEntryExists(id);
};

export const getTimeEntriesBy = async (user, workSiteId, companyId, period) => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');

    if (user.role !== 'admin') {
      const isAllowed = await _allowQuery(user.id, workSiteId, client);
      if (!isAllowed)
        throw new AppError(
          403,
          'Solo estás autorizado a obtener registros de obras en las que estás asignado.',
        );
    } else if (workSiteId) await workSiteExists(workSiteId, client);
    if (companyId) await companyExists(companyId, 'regular', client);

    const timeEntries = await TimeEntry.getTimeEntriesBy(
      workSiteId,
      companyId,
      period,
      client,
    );

    await client.query('COMMIT');
    return timeEntries;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const createTimeEntry = async data => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');

    const {
      workSiteId,
      resourceId,
      workDate,
      startTime,
      endTime,
      comment,
      userId,
    } = data;

    await workSiteExists(workSiteId, client);
    await resourceExists(resourceId, client);

    // Get the work rule from resource for this work site
    const resource = await Resource.getResource(resourceId, client);
    const appliedRuleId = await WorkRule.getConditionedWorkRules(
      workSiteId,
      resource.company.id,
      { from: workDate, to: workDate },
      client,
    );

    const modelData = {
      workSiteId,
      resourceId,
      appliedRuleId: appliedRuleId ?? null,
      workDate,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      comment: comment ?? null,
      userId,
    };

    const timeEntry = await TimeEntry.createTimeEntry(modelData, client);

    await client.query('COMMIT');
    return timeEntry;
  } catch (err) {
    await client.query('ROLLBACK');
    if (err?.code === '23514') {
      throw new AppError(
        400,
        'La hora de fin debe ser posterior a la de comienzo.',
      );
    } else throw err;
  } finally {
    client.release();
  }
};

export const updateTimeEntry = async (id, data) => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const existing = await timeEntryExists(id, client);

    const { resourceId, appliedRuleId, startTime, endTime, comment } = data;

    if (resourceId) {
      const newResource = await resourceExists(resourceId, client);
      if (newResource.company.name !== existing.company.name) {
        throw new AppError(
          400,
          'Al actualizar un registro no se puede elegir un trabajador o recurso de otra empresa.',
        );
      }
    }

    if (appliedRuleId) await workRuleExists(appliedRuleId, client);

    const modelData = {
      resourceId: resourceId || existing.resource.id,
      appliedRuleId: appliedRuleId || existing.applied_rule_id,
      startTime: startTime ? new Date(startTime) : existing.start_time,
      endTime: endTime ? new Date(endTime) : existing.end_time,
      comment: comment ?? existing.comment,
    };

    // Allow to open the register by setting endTime to null
    if (endTime === null) modelData.endTime = null;
    // Also allow to remove a working rule already applied or a comment
    if (appliedRuleId === null) modelData.appliedRuleId = null;

    const timeEntry = await TimeEntry.updateTimeEntry(id, modelData, client);

    await client.query('COMMIT');
    return timeEntry;
  } catch (err) {
    await client.query('ROLLBACK');
    if (err?.code === '23514') {
      throw new AppError(
        400,
        'La hora de fin debe ser posterior a la de comienzo.',
      );
    } else throw err;
  } finally {
    client.release();
  }
};

export const fixWorkedMinutes = async (id, workedMinutes) => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    await timeEntryExists(id, client);

    const timeEntry = await TimeEntry.fixWorkedMinutes(
      id,
      workedMinutes,
      client,
    );

    await client.query('COMMIT');
    return timeEntry;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const deleteTimeEntry = async id => {
  const timeEntry = await TimeEntry.deleteTimeEntry(id);
  if (!timeEntry) {
    throw new AppError(400, 'No se encuentra este registro horario.');
  }

  return timeEntry;
};
