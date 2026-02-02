import * as TimeEntry from '../models/time-entries.model.js';
import * as Resource from '../models/resource.model.js';
import * as WorkSite from '../models/work-site.model.js';
import * as WorkRule from '../models/work-rule.model.js';
import * as Schedule from '../models/schedule.model.js';
import resourceExists from '../domain/assertions/resource-exists.js';
import workSiteExists from '../domain/assertions/work-site-exists.js';
import workRuleExists from '../domain/assertions/work-rule-exists.js';
import companyExists from '../domain/assertions/company-exists.js';
import timeEntryExists from '../domain/assertions/time-entry-exists.js';
import { getPool } from '../db/pool.js';
import AppError from '../utils/app-error.js';
import parseTimeToMinutes from '../utils/parse-time-to-minutes.js';

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
    const companyIsMain = resource.company.is_main;
    let appliedRuleId = null;
    let mainSchedule = null;

    if (!companyIsMain) {
      const workRules = await WorkRule.getConditionedWorkRules(
        workSiteId,
        resource.company.id,
        { from: workDate, to: workDate },
        client,
      );
      appliedRuleId = workRules.shift()?.id;
    }

    if (companyIsMain)
      mainSchedule = await Schedule.getCompanySchedules(
        resource.company.id,
        workDate,
        client,
      );

    if (companyIsMain && !mainSchedule)
      throw new AppError(
        400,
        'La empresa principal debe tener siempre un horario activo. Avise a un administrador.',
      );

    const modelData = {
      workSiteId,
      resourceId,
      appliedRuleId: appliedRuleId ?? null,
      workDate,
      startTime: companyIsMain ? mainSchedule.start_time : new Date(startTime),
      endTime: companyIsMain
        ? mainSchedule.end_time
        : endTime
          ? new Date(endTime)
          : null,
      comment: comment ?? null,
      userId,
    };

    if (companyIsMain) {
      modelData.appliedRuleId = null;
      modelData.startTime = mainSchedule.start_time;
      modelData.endTime = mainSchedule.end_time;
      modelData.workedMinutes =
        parseTimeToMinutes(mainSchedule.end_time) -
        parseTimeToMinutes(mainSchedule.start_time) +
        mainSchedule.day_correction_minutes;
      modelData.workedMinutesMode = 'manual';
    }

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

    // For main company, only allow to change resource and comment
    const modelData = {
      appliedRuleId: existing.applied_rule_id,
      resourceId: resourceId || existing.resource.id,
      startTime: existing.start_time,
      endTime: existing.end_time,
      comment: comment ?? existing.comment,
    };

    if (!existing.company.is_main) {
      modelData.appliedRuleId = appliedRuleId || existing.applied_rule_id;
      modelData.startTime = startTime
        ? new Date(startTime)
        : existing.start_time;
      modelData.endTime = endTime ? new Date(endTime) : existing.end_time;
      // Allow to open the register by setting endTime to null
      if (endTime === null) modelData.endTime = null;
      // Also allow to remove a working rule already applied or a comment
      if (appliedRuleId === null) modelData.appliedRuleId = null;
    }

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
