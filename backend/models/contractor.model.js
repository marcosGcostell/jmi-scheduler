import { getPool } from '../db/pool.js';

export const getAllContractors = async (onlyActive, client = getPool()) => {
  const { rows } = await client.query(
    `
    SELECT id, name, full_name, active
    FROM contractors
    WHERE ($1::BOOLEAN IS NULL OR active = $1)
    ORDER BY name ASC
    `,
    [onlyActive],
  );

  return rows;
};

export const getContractor = async (id, client = getPool()) => {
  const { rows } = await client.query(
    `
    SELECT id, name, full_name, active
    FROM contractors
    WHERE id = $1
    `,
    [id],
  );

  return rows[0];
};

export const findContractor = async (name, client = getPool()) => {
  const { rows } = await client.query(
    `
    SELECT id, name, full_name, active
    FROM contractors
    WHERE name = $1
    `,
    [name],
  );

  return rows[0];
};

export const createContractor = async (data, client = getPool()) => {
  const { name, fullName } = data;

  const { rows } = await client.query(
    `
    INSERT INTO contractors (name, full_name)
    VALUES ($1, $2)
    RETURNING id, name, full_name, active
    `,
    [name, fullName],
  );

  return rows[0];
};

export const updateContractor = async (id, data, client = getPool()) => {
  const { name, fullName, active } = data;

  const { rows } = await client.query(
    `
    UPDATE contractors
    SET name = $1, full_name = $2, active = $3
    WHERE id = $4
    RETURNING id, name, full_name, active
    `,
    [name, fullName, active, id],
  );

  return rows[0];
};

export const disableContractor = async (id, client = getPool()) => {
  const { rows } = await client.query(
    `
    UPDATE contractors
    SET active = false
    WHERE id = $1
    RETURNING id, name, full_name, active
    `,
    [id],
  );

  return rows[0];
};
