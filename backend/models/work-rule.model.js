import { getPool } from '../db/pool.js';

export const getAllWorkRules = async (filters, client = getPool()) => {
  const { workSiteId, companyId, period, onlyActive } = filters;
  const conditions = [];
  const whereString = { text: '', count: 0 };
  const values = [];

  if (workSiteId) {
    conditions.push(`r.work_site_id = $${values.length + 1}`);
    values.push(workSiteId);
  }
  if (companyId) {
    conditions.push(`r.company_id = $${values.length + 1}`);
    values.push(companyId);
  }
  if (onlyActive) {
    conditions.push(`c.active = $${values.length + 1}`);
    values.push(onlyActive);
  }
  if (period) {
    conditions.push(
      `r.valid_from <= $${values.length + 1}::date AND (r.valid_to IS NULL OR r.valid_to >= $${values.length + 2}::date)`,
    );
    values.push(period.to, period.from);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const sql = `
    SELECT r.id, r.day_correction_minutes, r.valid_from, r.valid_to,
      json_build_object(
        'id', w.id,
        'name', w.name
      ) AS work_site,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS company
    FROM work_site_company_rules r
    LEFT JOIN work_sites w ON r.work_site_id = w.id
    LEFT JOIN companies c ON r.company_id = c.id
    ${whereClause}
    ORDER BY r.valid_from DESC
    `;

  const { rows } = await client.query(sql, values);

  return rows;
};

export const getWorkRule = async (id, client = getPool()) => {
  const { rows } = await client.query(
    `
    SELECT r.id, r.day_correction_minutes, r.valid_from, r.valid_to,
      json_build_object(
        'id', w.id,
        'name', w.name
      ) AS work_site,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS company
    FROM work_site_company_rules r
    LEFT JOIN work_sites w ON r.work_site_id = w.id
    LEFT JOIN companies c ON r.company_id = c.id
    WHERE r.id = $1
    `,
    [id],
  );

  return rows[0];
};

export const createWorkRule = async (data, client = getPool()) => {
  try {
    const { workSiteId, companyId, dayCorrection, validFrom, validTo } = data;

    const { rows } = await client.query(
      `
    INSERT INTO work_site_company_rules (work_site_id, company_id, day_correction_minutes, valid_from, valid_to)
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
    UPDATE work_site_company_rules
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
    FROM work_site_company_rules
    WHERE id = $1
    RETURNING id
  `,
    [id],
  );

  return rowCount ? { id: rows[0].id } : null;
};
