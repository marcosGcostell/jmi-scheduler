import pool from '../db/pool.js';

export const findUserToLogIn = async email => {
  const { rows } = await pool.query(
    `
    SELECT id, email, full_name, password, role, active
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  return rows[0];
};

export const findUserToAuth = async id => {
  const { rows } = await pool.query(
    `
    SELECT id, email, full_name, password, role, active
    FROM users
    WHERE id = $1
    `,
    [id],
  );

  return rows[0];
};

export const saveResetCode = async (id, data) => {
  const { resetCodeHash, expirationTime } = data;

  const { rows } = await pool.query(
    `
    UPDATE users
    SET reset_code_hash = $1, reset_code_expires = NOW() + ($2 * INTERVAL '1 minute')
    WHERE id = $3
    RETURNING id, email, full_name, role
    `,
    [resetCodeHash, expirationTime, id],
  );

  return rows[0];
};
