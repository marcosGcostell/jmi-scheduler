import { getPool } from '../db/pool.js';

export const getAllTimeEntries = async (period, date, client = getPool()) => {
  const whereString = { text: '', count: 0 };
  const values = [];

  if (period) {
    whereString.text += 't.work_date BETWEEN $1::date AND $2::date';
    values.push(period.from, period.to);
    whereString.count = 2;
  }
  if (date) {
    whereString.text += whereString.count ? ' OR ' : '';
    whereString.text += `t.work_date = $${++whereString.count}::date`;
    values.push(date);
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
    WHERE ${whereString.text}
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

export const getResolveTimeEntries = async (
  workSiteId,
  companyId,
  period,
  date,
  client = getPool(),
) => {
  const resolveString = { text: '', count: 0 };
  const resolveValues = [];

  if (workSiteId) {
    resolveString.text += `t.work_site_id = $${++resolveString.count}`;
    resolveValues.push(workSiteId);
  }
  if (companyId) {
    resolveString.text += resolveString.count ? ' AND ' : '';
    resolveString.text += `r.company_id = $${++resolveString.count}`;
    resolveValues.push(companyId);
  }

  const periodString = { text: '(', count: resolveString.count };
  const periodValues = [];

  if (period) {
    periodString.text += `t.work_date BETWEEN $${++periodString.count}::date AND $${++periodString.count}::date`;
    periodValues.push(period.from, period.to);
    if (date) periodString.text += ' OR ';
  }
  if (date) {
    periodString.text += `t.work_date = $${++periodString.count}::date`;
    periodValues.push(date);
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
    WHERE t.work_site_id = $1 AND (${periodString.text})
    ORDER BY t.work_date DESC, w.name ASC, c.is_main DESC, c.name ASC, r.resource_type DESC, r.name ASC 
    `;

  const { rows } = await client.query(sql, [...resolveValues, ...periodValues]);

  return rows;
};

export const createTiemEntry = async (data, client = getPool()) => {
  try {
    const {
      workSiteId,
      resourceId,
      applied_rule_id,
      work_date,
      start_time,
      end_time,
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
        applied_rule_id,
        work_date,
        start_time,
        end_time,
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
    const {
      workSiteId,
      resourceId,
      applied_rule_id,
      work_date,
      start_time,
      end_time,
      comment,
    } = data;

    const { rows } = await client.query(
      `
      WITH updated_time_entry AS ( 
        UPDATE time_entries
        SET work_site_id= $1, resource_id = $2, applied_rule_id = $3, work_date = $4::date, start_time = $5, end_time = $6, comment = $7, 
        WHERE id = $8
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
      [
        workSiteId,
        resourceId,
        applied_rule_id,
        work_date,
        start_time,
        end_time,
        comment,
        id,
      ],
    );

    return rows[0];
  } catch (err) {
    throw err;
  }
};

export const deleteWorkRule = async (id, client = getPool()) => {
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
