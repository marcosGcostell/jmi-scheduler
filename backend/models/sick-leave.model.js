import { getPool } from '../db/pool.js';

export const getAllSickLeaves = async (filters, client = getPool()) => {
  const { resourceId, onlyActive, period } = filters;
  const conditions = [];
  const values = [];

  if (resourceId) {
    conditions.push(`s.resource_id = $${values.length + 1}`);
    values.push(resourceId);
  }
  if (onlyActive) {
    conditions.push(`r.active = $${values.length + 1}`);
    values.push(onlyActive);
  }
  if (period) {
    conditions.push(
      `s.start_date <= $${values.length + 1}::date AND (s.end_date IS NULL OR s.end_date >= $${values.length + 2}::date)`,
    );
    values.push(period.to, period.from);
  }
  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const sql = `
    SELECT s.id, s.resource_id, r.name AS name, s.start_date, s.end_date
    FROM sick_leaves s
    INNER JOIN resources r ON s.resource_id = r.id
    ${whereClause}
    ORDER BY s.start_date DESC
    `;

  const { rows } = await client.query(sql, values);

  return rows;
};

export const getSickLeave = async (id, client = getPool()) => {
  const { rows } = await client.query(
    `
    SELECT s.id, s.resource_id, r.name AS name, s.start_date, s.end_date
    FROM sick_leaves s
    INNER JOIN resources r ON s.resource_id = r.id
    WHERE s.id = $1
    `,
    [id],
  );

  return rows[0];
};

export const createSickLeave = async (data, client = getPool()) => {
  try {
    const { resourceId, startDate, endDate } = data;

    const { rows } = await client.query(
      `
    INSERT INTO sick_leaves (resource_id, start_date, end_date)
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

export const updateSickLeave = async (id, data, client = getPool()) => {
  try {
    const { resourceId, startDate, endDate } = data;

    const { rows } = await client.query(
      `
    UPDATE sick_leaves
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

export const deleteSickLeave = async (id, client = getPool()) => {
  const { rowCount, rows } = await client.query(
    `
    DELETE 
    FROM sick_leaves
    WHERE id = $1
    RETURNING id
  `,
    [id],
  );

  return rowCount ? { id: rows[0].id } : null;
};
