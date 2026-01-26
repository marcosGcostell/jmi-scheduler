import { getPool } from '../db/pool.js';

const pool = () => getPool();

export const _assignUsers = async (client, workSiteId, userIds) => {
  const values = userIds.map((_, i) => `($1, $${i + 2})`).join(',');

  await client.query(
    `
    INSERT INTO user_work_sites (work_site_id, user_id)
    VALUES ${values}
    ON CONFLICT DO NOTHING
    `,
    [workSiteId, ...userIds],
  );
};

export const getAllWorkSites = async onlyActive => {
  const { rows } = await pool().query(
    `
    SELECT id, name, code, is_open, star_date, end_date
    FROM work_sites
    WHERE ($1::BOOLEAN IS NULL OR is_open = $1)
    ORDER BY star_date DESC NULLS LAST, name ASC
    `,
    [onlyActive],
  );

  return rows;
};

export const getWorkSite = async id => {
  const { rows } = await pool().query(
    `
    SELECT id, name, code, is_open, star_date, end_date
    FROM work_sites
    WHERE id = $1
    `,
    [id],
  );

  return rows[0];
};

export const createWorkSite = async (data, userIds) => {
  const client = await pool().connect();

  try {
    await client.query('BEGIN');

    const { name, code, starDate } = data;
    const { rows } = await client.query(
      `
    INSERT INTO work_sites (name, code, star_date)
    VALUES ($1, $2, $3)
    RETURNING id, name, code, is_open, star_date, end_date
  `,
      [name, code, starDate],
    );

    if (userIds?.length) {
      await _assignUsers(client, rows[0].id, data.users);
    }

    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateWorkSite = async (id, data) => {
  const { name, code, starDate, endDate } = data;

  const { rows } = await pool().query(
    `
    UPDATE work_sites
    SET name = $1, code = $2, star_date = $3, end_date = $4
    WHERE id = $5
    RETURNING id, name, code, is_open, star_date, end_date
  `,
    [name, code, starDate, endDate, id],
  );

  return rows[0];
};
