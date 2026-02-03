import { getPool } from '../db/pool.js';

export const getAllAttendances = async (filters, client = getPool()) => {
  const { workSiteId, contractorId, period } = filters;
  const conditions = [];
  const values = [];

  if (workSiteId) {
    conditions.push(`ca.work_site_id = $${values.length + 1}`);
    values.push(workSiteId);
  }
  if (contractorId) {
    conditions.push(`ca.contractor_id = $${values.length + 1}`);
    values.push(contractorId);
  }
  if (period) {
    conditions.push(
      `ca.work_date BETWEEN $${values.length + 1}::date AND $${values.length + 2}::date`,
    );
    values.push(period.from, period.to);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const sql = `
    SELECT ca.id, ca.work_date, ca.workers_count, 
      json_build_object(
        'id', w.id,
        'name', w.name
      ) AS work_site,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS contractor
    FROM contractor_attendance ca
    LEFT JOIN work_sites w ON ca.work_site_id = w.id
    LEFT JOIN contractors c ON ca.contractor_id = c.id
    ${whereClause}
    ORDER BY ca.work_date DESC, w.name ASC, c.name ASC
  `;

  const { rows } = await client.query(sql, values);

  return rows;
};

export const getAttendance = async (id, client = getPool()) => {
  const { rows } = await client.query(
    `
    SELECT ca.id, ca.work_date, ca.workers_count,
      json_build_object(
        'id', w.id,
        'name', w.name
      ) AS work_site,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS contractor
    FROM contractor_attendance ca
    LEFT JOIN work_sites w ON ca.work_site_id = w.id
    LEFT JOIN contractors c ON ca.contractor_id = c.id
    WHERE ca.id = $1
    `,
    [id],
  );

  return rows[0];
};

export const createAttendance = async (data, client = getPool()) => {
  try {
    const { workSiteId, contractorId, workDate, workersCount } = data;

    const { rows } = await client.query(
      `
      INSERT INTO contractor_attendance (work_site_id, contractor_id, work_date, workers_count)
      VALUES ($1, $2, $3::date, $4)
      RETURNING id, work_site_id, contractor_id, work_date, workers_count
      `,
      [workSiteId, contractorId, workDate, workersCount],
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
      UPDATE contractor_attendance
      SET workers_count = $1
      WHERE id = $2
      RETURNING id, work_site_id, contractor_id, work_date, workers_count
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
    FROM contractor_attendance
    WHERE id = $1
    RETURNING id
    `,
    [id],
  );

  return rowCount ? { id: rows[0].id } : null;
};
