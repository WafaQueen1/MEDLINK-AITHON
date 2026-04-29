import { query } from '../config/db.js';

export const createPatientForDoctor = async (doctorId, payload) => {
  const result = await query(
    `INSERT INTO patients (doctor_id, first_name, last_name, age, sex, chronic_disease)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      doctorId,
      payload.firstName,
      payload.lastName,
      payload.age,
      payload.sex,
      payload.chronicDisease || null,
    ]
  );

  return result.rows[0];
};

export const getPatientsByDoctor = async (doctorId, search = '') => {
  const result = await query(
    `SELECT *
     FROM patients
     WHERE doctor_id = $1
       AND (
         $2 = ''
         OR LOWER(first_name || ' ' || last_name) LIKE LOWER($3)
         OR LOWER(COALESCE(chronic_disease, '')) LIKE LOWER($3)
       )
     ORDER BY created_at DESC`,
    [doctorId, search, `%${search}%`]
  );

  return result.rows;
};

export const getPatientByIdForDoctor = async (doctorId, patientId) => {
  const result = await query(
    'SELECT * FROM patients WHERE id = $1 AND doctor_id = $2',
    [patientId, doctorId]
  );

  return result.rows[0] || null;
};

export const createPrescriptionWithItems = async (client, doctorId, payload) => {
  const prescriptionResult = await client.query(
    `INSERT INTO prescriptions (doctor_id, patient_id, notes)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [doctorId, payload.patientId, payload.notes || null]
  );

  const prescription = prescriptionResult.rows[0];
  const items = [];

  for (const item of payload.medicines) {
    const itemResult = await client.query(
      `INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [prescription.id, item.medicineName, item.dosage, item.frequency, item.duration]
    );

    items.push(itemResult.rows[0]);
  }

  return { ...prescription, medicines: items };
};

export const getPrescriptionsByDoctor = async (doctorId, filters = {}) => {
  const result = await query(
    `SELECT
       pr.id,
       pr.notes,
       pr.created_at,
       pt.first_name AS patient_first_name,
       pt.last_name AS patient_last_name,
       COALESCE(
         json_agg(
           json_build_object(
             'id', pi.id,
             'medicineName', pi.medicine_name,
             'dosage', pi.dosage,
             'frequency', pi.frequency,
             'duration', pi.duration
           )
         ) FILTER (WHERE pi.id IS NOT NULL),
         '[]'::json
       ) AS medicines
     FROM prescriptions pr
     INNER JOIN patients pt ON pt.id = pr.patient_id
     LEFT JOIN prescription_items pi ON pi.prescription_id = pr.id
     WHERE pr.doctor_id = $1
       AND ($2::uuid IS NULL OR pr.patient_id = $2::uuid)
       AND ($3::date IS NULL OR DATE(pr.created_at) = $3::date)
     GROUP BY pr.id, pt.first_name, pt.last_name
     ORDER BY pr.created_at DESC`,
    [doctorId, filters.patientId || null, filters.date || null]
  );

  return result.rows;
};
