import { query } from '../config/db.js';

export const findUserByEmail = async (email) => {
  const result = await query(
    `SELECT
       u.*,
       d.id AS doctor_id,
       d.medical_specialty,
       p.id AS pharmacy_id,
       p.pharmacy_name,
       p.pharmacy_address,
       p.latitude,
       p.longitude,
       pp.id AS patient_profile_id,
       pp.age,
       pp.sex,
       pp.has_chronic_disease,
       pp.chronic_disease_name,
       pp.chifa_number
     FROM users u
     LEFT JOIN doctors d ON d.user_id = u.id
     LEFT JOIN pharmacies p ON p.user_id = u.id
     LEFT JOIN patient_profiles pp ON pp.user_id = u.id
     WHERE u.email = $1`,
    [email]
  );

  return result.rows[0] || null;
};

export const findUserById = async (id) => {
  const result = await query(
    `SELECT
       u.*,
       d.id AS doctor_id,
       d.medical_specialty,
       p.id AS pharmacy_id,
       p.pharmacy_name,
       p.pharmacy_address,
       p.latitude,
       p.longitude,
       pp.id AS patient_profile_id,
       pp.age,
       pp.sex,
       pp.has_chronic_disease,
       pp.chronic_disease_name,
       pp.chifa_number
     FROM users u
     LEFT JOIN doctors d ON d.user_id = u.id
     LEFT JOIN pharmacies p ON p.user_id = u.id
     LEFT JOIN patient_profiles pp ON pp.user_id = u.id
     WHERE u.id = $1`,
    [id]
  );

  return result.rows[0] || null;
};
