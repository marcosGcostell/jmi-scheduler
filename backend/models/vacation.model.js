import { getPool } from '../db/pool.js';

export const getAllVacations = async (filters, client = getPool()) => {
  const { resourceId, onlyActive, period } = filters;
  const conditions = [];
  const values = [];

  if (resourceId) {
    conditions.push(`v.resource_id = $${values.length + 1}`);
    values.push(resourceId);
  }
  if (onlyActive) {
    conditions.push(`r.active = $${values.length + 1}`);
    values.push(onlyActive);
  }
  if (period) {
    conditions.push(
      `v.start_date <= $${values.length + 1}::date AND (v.end_date IS NULL OR v.end_date >= $${values.length + 2}::date)`,
    );
    values.push(period.to, period.from);
  }
  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const sql = `
    SELECT v.id, v.resource_id, r.name AS name, v.start_date, v.end_date
    FROM vacations v
    INNER JOIN resources r ON v.resource_id = r.id
    ${whereClause}
    ORDER BY v.start_date DESC
    `;

  const { rows } = await client.query(sql, values);

  return rows;
};

export const getVacation = async (id, client = getPool()) => {
  const { rows } = await client.query(
    `
    SELECT v.id, v.resource_id, r.name AS name, v.start_date, v.end_date
    FROM vacations v
    INNER JOIN resources r ON v.resource_id = r.id
    WHERE v.id = $1
    `,
    [id],
  );

  return rows[0];
};

export const createVacation = async (data, client = getPool()) => {
  try {
    const { resourceId, startDate, endDate } = data;

    const { rows } = await client.query(
      `
    INSERT INTO vacations (resource_id, start_date, end_date)
    VALUES ($1, $2::date, $3::date)
    RETURNING id, resource_id, start_date, end_date
  `,
      [resourceId, startDate, endDate],
    );

    return rows[0];
  } catch (err) {
    throw err;
  }
};

export const updateVacation = async (id, data, client = getPool()) => {
  try {
    const { resourceId, startDate, endDate } = data;

    const { rows } = await client.query(
      `
    UPDATE vacations
    SET resource_id = $1, start_date = $2::date, end_date = $3::date
    WHERE id = $4
    RETURNING id, resource_id, start_date, end_date
  `,
      [resourceId, startDate, endDate, id],
    );

    return rows[0];
  } catch (err) {
    throw err;
  }
};

export const deleteVacation = async (id, client = getPool()) => {
  const { rowCount, rows } = await client.query(
    `
    DELETE 
    FROM vacations
    WHERE id = $1
    RETURNING id
  `,
    [id],
  );

  return rowCount ? { id: rows[0].id } : null;
};
