import pool from '../db/pool.js';

export const getAllUsers = async () => {
  const { rows } = await pool.query(`
    SELECT id, email, full_name, role
    FROM users
    ORDER BY created_at DESC
    `);

  return rows;
};

export const getUser = async id => {
  const { rows } = await pool.query(
    `
    SELECT id, email, full_name, role
    FROM users
    WHERE id = $1
    `,
    [id],
  );

  return rows[0];
};

export const createUser = async data => {
  const { email, full_name, password, role } = data;

  const { rows } = await pool.query(
    `
    INSERT INTO users (email, full_name, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, full_name, role
  `,
    [email, full_name, password, role],
  );

  return rows[0];
};

export const updateUser = async (id, data) => {
  const { email, full_name, role, active } = data;

  const { rows } = await pool.query(
    `
    UPDATE users
    SET email = $1, full_name = $2, role = $3, active = $4
    WHERE id = $5
    RETURNING id, email, full_name, role
    `,
    [email, full_name, role, active, id],
  );

  return rows[0];
};

export const disableUser = async id => {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET active = false
    WHERE id = $1
    RETURNING id, email, full_name, role
    `,
    [id],
  );

  return rows[0];
};
