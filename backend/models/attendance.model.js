import { getPool } from '../db/pool.js';

export const getAllAttendances = async (filters, client = getPool()) => {
  const { workSiteId, companyId, period } = filters;
  const conditions = [];
  const values = [];

  if (workSiteId) {
    conditions.push(`ca.work_site_id = $${values.length + 1}`);
    values.push(workSiteId);
  }
  if (companyId) {
    conditions.push(`ca.company_id = $${values.length + 1}`);
    values.push(companyId);
  }
  if (period) {
    conditions.push(
      `ca.date BETWEEN $${values.length + 1}::date AND $${values.length + 2}::date`,
    );
    values.push(period.from, period.to);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const sql = `
    SELECT ca.id, ca.date, ca.workers_count, ca.created_by, 
      json_build_object(
        'id', w.id,
        'name', w.name
      ) AS work_site,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS company
    FROM company_attendance ca
    LEFT JOIN work_sites w ON ca.work_site_id = w.id
    LEFT JOIN companies c ON ca.company_id = c.id
    ${whereClause}
    ORDER BY ca.date DESC, w.name ASC, c.name ASC
  `;

  const { rows } = await client.query(sql, values);

  return rows;
};

export const getAttendance = async (id, client = getPool()) => {
  const { rows } = await client.query(
    `
    SELECT ca.id, ca.date, ca.workers_count, ca.created_by,
      json_build_object(
        'id', w.id,
        'name', w.name
      ) AS work_site,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS company
    FROM company_attendance ca
    LEFT JOIN work_sites w ON ca.work_site_id = w.id
    LEFT JOIN companies c ON ca.company_id = c.id
    WHERE ca.id = $1
    `,
    [id],
  );

  return rows[0];
};

export const createAttendance = async (data, client = getPool()) => {
  try {
    const { workSiteId, companyId, date, workersCount, userId } = data;

    const { rows } = await client.query(
      `
      INSERT INTO company_attendance (work_site_id, company_id, date, workers_count, created_by)
      VALUES ($1, $2, $3::date, $4, $5)
      RETURNING id, work_site_id, company_id, date, workers_count, created_by, created_at
      `,
      [workSiteId, companyId, date, workersCount, userId],
    );

    const attendance = rows[0];

    // Fetch full data with joins
    const fullAttendance = await getAttendance(attendance.id, client);

    return fullAttendance;
  } catch (err) {
    throw err;
  }
};

export const updateAttendance = async (id, data, client = getPool()) => {
  try {
    const { workersCount } = data;

    const { rows } = await client.query(
      `
      UPDATE company_attendance
      SET workers_count = $1
      WHERE id = $2
      RETURNING id, work_site_id, company_id, date, workers_count, created_by, created_at
      `,
      [workersCount, id],
    );

    const attendance = rows[0];

    // Fetch full data with joins
    const fullAttendance = await getAttendance(attendance.id, client);

    return fullAttendance;
  } catch (err) {
    throw err;
  }
};

export const deleteAttendance = async (id, client = getPool()) => {
  const { rowCount, rows } = await client.query(
    `
    DELETE 
    FROM company_attendance
    WHERE id = $1
    RETURNING id
    `,
    [id],
  );

  return rowCount ? { id: rows[0].id } : null;
};
