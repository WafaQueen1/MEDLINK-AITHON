import { query } from '../config/db.js';

export const updatePharmacyProfile = async (pharmacyId, payload) => {
  const result = await query(
    `UPDATE pharmacies
     SET pharmacy_name = $1,
         pharmacy_address = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING *`,
    [payload.pharmacyName, payload.pharmacyAddress, pharmacyId]
  );

  return result.rows[0] || null;
};

export const getPharmacyMedicines = async (pharmacyId, search = '', itemType = '') => {
  const result = await query(
    `SELECT *,
            ROUND(price * (1 - discount_percentage / 100), 2) AS final_price
     FROM pharmacy_medicines
     WHERE pharmacy_id = $1
       AND ($2 = '' OR LOWER(name) LIKE LOWER($3))
       AND ($4 = '' OR item_type = $4::stock_item_type)
     ORDER BY updated_at DESC`,
    [pharmacyId, search, `%${search}%`, itemType]
  );

  return result.rows;
};

export const createPharmacyMedicine = async (pharmacyId, payload) => {
  const result = await query(
    `INSERT INTO pharmacy_medicines (pharmacy_id, name, item_type, price, discount_percentage, quantity)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *,
               ROUND(price * (1 - discount_percentage / 100), 2) AS final_price`,
    [
      pharmacyId,
      payload.name,
      payload.itemType,
      payload.price,
      payload.discountPercentage ?? 0,
      payload.quantity,
    ]
  );

  return result.rows[0];
};

export const updatePharmacyMedicine = async (pharmacyId, medicineId, payload) => {
  const result = await query(
    `UPDATE pharmacy_medicines
     SET name = $1,
         item_type = $2,
         price = $3,
         quantity = $4,
         discount_percentage = $5,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $6 AND pharmacy_id = $7
     RETURNING *,
               ROUND(price * (1 - discount_percentage / 100), 2) AS final_price`,
    [
      payload.name,
      payload.itemType,
      payload.price,
      payload.quantity,
      payload.discountPercentage ?? 0,
      medicineId,
      pharmacyId,
    ]
  );

  return result.rows[0] || null;
};

export const deletePharmacyMedicine = async (pharmacyId, medicineId) => {
  const result = await query(
    'DELETE FROM pharmacy_medicines WHERE id = $1 AND pharmacy_id = $2 RETURNING id',
    [medicineId, pharmacyId]
  );

  return result.rows[0] || null;
};

export const getAllPrescriptions = async () => {
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
     GROUP BY pr.id, pt.first_name, pt.last_name
     ORDER BY pr.created_at DESC`
  );

  return result.rows;
};
