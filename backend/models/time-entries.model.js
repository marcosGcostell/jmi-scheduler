import { getPool } from '../db/pool.js';

export const getTimeEntriesBy = async (
  workSiteId,
  companyId,
  period,
  client = getPool(),
) => {
  const conditions = [];
  const values = [];

  if (workSiteId) {
    conditions.push(`t.work_site_id = $${values.length + 1}`);
    values.push(workSiteId);
  }
  if (companyId) {
    conditions.push(`r.company_id = $${values.length + 1}`);
    values.push(companyId);
  }
  if (period) {
    conditions.push(
      `t.work_date BETWEEN $${values.length + 1}::date AND $${values.length + 2}::date`,
    );
    values.push(period.from, period.to);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const sql = `
    SELECT t.id, t.work_date, t.start_time, t.end_time, t.worked_minutes, ru.day_correction_minutes AS correction, t.comment, t.created_by,
      json_build_object(
        'id', w.id,
        'name', w.name
      ) AS work_site,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS company,
      json_build_object(
        'id', r.id,
        'name', r.name
      ) AS resource
    FROM time_entries t
    LEFT JOIN work_sites w ON t.work_site_id = w.id
    LEFT JOIN resources r ON t.resource_id = r.id
    LEFT JOIN companies c ON r.company_id = c.id
    LEFT JOIN work_site_company_rules ru
      ON ru.company_id = c.id AND ru.work_site_id = w.id
    ${whereClause}
    ORDER BY t.work_date DESC, w.name ASC, c.is_main DESC, c.name ASC, r.resource_type DESC, r.name ASC 
    `;

  const { rows } = await client.query(sql, values);

  return rows;
};

export const getAllTimeEntries = async (period, client = getPool()) => {
  let whereClause = '';
  const values = [];

  if (period) {
    whereClause += 'WHERE t.work_date BETWEEN $1::date AND $2::date';
    values.push(period.from, period.to);
  }

  const sql = `
    SELECT t.id, t.work_date, t.start_time, t.end_time, t.worked_minutes, ru.day_correction_minutes AS correction, t.comment, t.created_by,
      json_build_object(
        'id', w.id,
        'name', w.name
      ) AS work_site,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS company,
      json_build_object(
        'id', r.id,
        'name', r.name
      ) AS resource
    FROM time_entries t
    LEFT JOIN work_sites w ON t.work_site_id = w.id
    LEFT JOIN resources r ON t.resource_id = r.id
    LEFT JOIN companies c ON r.company_id = c.id
    LEFT JOIN work_site_company_rules ru
      ON ru.company_id = c.id AND ru.work_site_id = w.id
    ${whereClause}
    ORDER BY t.work_date DESC, w.name ASC, c.is_main DESC, c.name ASC, r.resource_type DESC, r.name ASC 
    `;

  const { rows } = await client.query(sql, values);

  return rows;
};

export const getTimeEntry = async (id, client = getPool()) => {
  const { rows } = await client.query(
    `
    SELECT t.id, t.work_date, t.start_time, t.end_time, t.worked_minutes, ru.day_correction_minutes AS correction, t.comment, t.created_by,
      json_build_object(
        'id', w.id,
        'name', w.name
      ) AS work_site,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS company,
      json_build_object(
        'id', r.id,
        'name', r.name
      ) AS resource
    FROM time_entries t
    LEFT JOIN work_sites w ON t.work_site_id = w.id
    LEFT JOIN resources r ON t.resource_id = r.id
    LEFT JOIN companies c ON r.company_id = c.id
    LEFT JOIN work_site_company_rules ru
      ON ru.company_id = c.id AND ru.work_site_id = w.id
    WHERE t.id = $1
    `,
    [id],
  );

  return rows[0];
};

export const createTimeEntry = async (data, client = getPool()) => {
  try {
    const {
      workSiteId,
      resourceId,
      appliedRuleId,
      workDate,
      startTime,
      endTime,
      comment,
      userId,
    } = data;

    const { rows } = await client.query(
      `
      WITH new_time_entry AS ( 
        INSERT INTO time_entries (work_site_id, resource_id, applied_rule_id, work_date, start_time, end_time, comment, created_by)
        VALUES ($1, $2, $3, $4::date, $5, $6, $7, $8)
        RETURNING id, work_site_id, resource_id, applied_rule_id, work_date, start_time, end_time, worked_minutes, comment, created_by
      )
      SELECT nte.id, w.name as work_site_name, c.name as company_name, nte.work_date, nte.start_time, nte.end_time, nte.worked_minutes, ru.day_correction_minutes AS correction, nte.comment, nte.created_by,
        json_build_object(
          'id', r.id,
          'name', r.name
        ) AS resource
      FROM new_time_entry nte
      LEFT JOIN work_sites w ON nte.work_site_id = w.id
      LEFT JOIN resources r ON nte.resource_id = r.id
      LEFT JOIN companies c ON r.company_id = c.id
      LEFT JOIN work_site_company_rules ru
        ON ru.company_id = c.id AND ru.work_site_id = w.id
    `,
      [
        workSiteId,
        resourceId,
        appliedRuleId,
        workDate,
        startTime,
        endTime,
        comment,
        userId,
      ],
    );

    return rows[0];
  } catch (err) {
    throw err;
  }
};

// TODO special update for fix manually worked_minutes (for main company)
export const updateTimeEntry = async (id, data, client = getPool()) => {
  try {
    const { resourceId, appliedRuleId, startTime, endTime, comment } = data;

    const { rows } = await client.query(
      `
      WITH updated_time_entry AS ( 
        UPDATE time_entries
        SET resource_id = $1, applied_rule_id = $2, start_time = $3, end_time = $4, comment = $5
        WHERE id = $6
        RETURNING id, work_site_id, resource_id, applied_rule_id, work_date, start_time, end_time, worked_minutes, comment, created_by
      )
      SELECT ute.id, w.name as work_site_name, c.name as company_name, ute.work_date, ute.start_time, ute.end_time, ute.worked_minutes, ru.day_correction_minutes AS correction, ute.comment, ute.created_by,
        json_build_object(
          'id', r.id,
          'name', r.name
        ) AS resource
      FROM updated_time_entry ute
      LEFT JOIN work_sites w ON ute.work_site_id = w.id
      LEFT JOIN resources r ON ute.resource_id = r.id
      LEFT JOIN companies c ON r.company_id = c.id
      LEFT JOIN work_site_company_rules ru
        ON ru.company_id = c.id AND ru.work_site_id = w.id
  `,
      [resourceId, appliedRuleId, startTime, endTime, comment, id],
    );

    return rows[0];
  } catch (err) {
    throw err;
  }
};

export const fixWorkedMinutes = async (
  id,
  workedMinutes,
  client = getPool(),
) => {
  try {
    const { rows } = await client.query(
      `
      WITH updated_time_entry AS ( 
        UPDATE time_entries
        SET worked_minutes = $1
        WHERE id = $2
        RETURNING id, work_site_id, resource_id, applied_rule_id, work_date, start_time, end_time, worked_minutes, comment, created_by
      )
      SELECT ute.id, w.name as work_site_name, c.name as company_name, ute.work_date, ute.start_time, ute.end_time, ute.worked_minutes, ru.day_correction_minutes AS correction, ute.comment, ute.created_by,
        json_build_object(
          'id', r.id,
          'name', r.name
        ) AS resource
      FROM updated_time_entry ute
      LEFT JOIN work_sites w ON ute.work_site_id = w.id
      LEFT JOIN resources r ON ute.resource_id = r.id
      LEFT JOIN companies c ON r.company_id = c.id
      LEFT JOIN work_site_company_rules ru
        ON ru.company_id = c.id AND ru.work_site_id = w.id
  `,
      [workedMinutes, id],
    );

    return rows[0];
  } catch (err) {
    throw err;
  }
};

export const deleteTimeEntry = async (id, client = getPool()) => {
  const { rowCount, rows } = await client.query(
    `
    DELETE 
    FROM time_entries
    WHERE id = $1
    RETURNING id
  `,
    [id],
  );

  return rowCount ? { id: rows[0].id } : null;
};
