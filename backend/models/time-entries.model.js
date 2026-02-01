import { getPool } from '../db/pool.js';

export const getAllWorkRules = async (period, date, client = getPool()) => {
  const whereString = { text: '', count: 0 };
  const values = [];

  if (period) {
    whereString.text = 't.work_date BETWEEN $1 AND $2';
    values.push(period.from, period.to);
    whereString.count = 2;
  }
  if (date) {
    whereString.text += whereString.count ? ' OR ' : '';
    whereString.text += `t.work_date = $${++whereString.count}`;
    values.push(date);
  }

  const sql = `
    SELECT t.id, t.start_time, t.end_time, t_work_date, t_worked_minutes, t_comment, t_created_by
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
    WHERE ${whereString.text}
    ORDER BY t.valid_from DESC
    `;

  const { rows } = await client.query(sql, values);

  return rows;
};

export const getWorkRule = async (id, client = getPool()) => {
  const { rows } = await client.query(
    `
    SELECT t.id, t.day_correction_minutes, t.valid_from, t.valid_to,
      json_build_object(
        'id', w.id,
        'name', w.name
      ) AS work_site,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS company
    FROM time_entries t
    LEFT JOIN work_sites w ON t.work_site_id = w.id
    LEFT JOIN companies c ON t.company_id = c.id
    WHERE t.id = $1
    `,
    [id],
  );

  return rows[0];
};

export const getConditionedWorkRules = async (
  workSiteId,
  companyId,
  period,
  client = getPool(),
) => {
  const whereString = { text: '', count: 0 };
  const values = [];

  if (workSiteId) {
    whereString.text += `t.work_site_id = $${++whereString.count}`;
    values.push(workSiteId);
  }
  if (companyId) {
    whereString.text += whereString.count ? ' AND ' : '';
    whereString.text += `t.company_id = $${++whereString.count}`;
    values.push(companyId);
  }
  if (period) {
    whereString.text += whereString.count ? ' AND ' : '';
    whereString.text += `t.valid_from <= $${whereString.count + 1}::date AND (t.valid_to IS NULL OR t.valid_to >= $${whereString.count + 2}::date)`;
    values.push(period.to, period.from);
  }

  const sql = `
    SELECT t.id, t.day_correction_minutes, t.valid_from, t.valid_to,
      json_build_object(
        'id', w.id,
        'name', w.name
      ) AS work_site,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS company
    FROM time_entries t
    LEFT JOIN work_sites w ON t.work_site_id = w.id
    LEFT JOIN companies c ON t.company_id = c.id
    WHERE ${whereString.text}
    `;

  const { rows } = await client.query(sql, values);

  return rows;
};

export const createWorkRule = async (data, client = getPool()) => {
  try {
    const { workSiteId, companyId, dayCorrection, validFrom, validTo } = data;

    const { rows } = await client.query(
      `
    INSERT INTO time_entries (work_site_id, company_id, day_correction_minutes, valid_from, valid_to)
    VALUES ($1, $2, $3, $4::date, $5::date)
    RETURNING id, work_site_id, company_id, day_correction_minutes, valid_from, valid_to
  `,
      [workSiteId, companyId, dayCorrection, validFrom, validTo],
    );

    return rows[0];
  } catch (err) {
    throw err;
  }
};

export const updateWorkRule = async (id, data, client = getPool()) => {
  try {
    const { workSiteId, companyId, dayCorrection, validFrom, validTo } = data;

    const { rows } = await client.query(
      `
    UPDATE time_entries
    SET work_site_id= $1, company_id = $2, day_correction_minutes = $3, valid_from = $4::date, valid_to = $5::date
    WHERE id = $6
    RETURNING id, work_site_id, company_id, day_correction_minutes, valid_from, valid_to
  `,
      [workSiteId, companyId, dayCorrection, validFrom, validTo, id],
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
