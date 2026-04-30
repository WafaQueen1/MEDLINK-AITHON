import { pool } from '../config/db.js';

export const createPromotion = async (req, res) => {
  try {
    const { title, description, type, medicine_names, discount_percentage, special_price, expiry_date } = req.body;
    // req.user is set by authMiddleware
    const pharmacistId = req.user.id;

    const result = await pool.query(
      `INSERT INTO promotions 
       (pharmacist_id, title, description, type, medicine_names, discount_percentage, special_price, expiry_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [pharmacistId, title, description, type, medicine_names, discount_percentage, special_price, expiry_date]
    );

    res.status(201).json({ 
      success: true, 
      message: "Promotion created successfully",
      promotion: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyPromotions = async (req, res) => {
  try {
    const pharmacistId = req.user.id;
    const result = await pool.query(
      `SELECT * FROM promotions 
       WHERE pharmacist_id = $1 
       ORDER BY created_at DESC`,
      [pharmacistId]
    );
    res.json({ success: true, promotions: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActivePromotions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, ph.pharmacy_name 
       FROM promotions p
       JOIN pharmacies ph ON p.pharmacist_id = ph.user_id
       WHERE p.is_active = true 
       AND (p.expiry_date IS NULL OR p.expiry_date >= CURRENT_DATE)
       ORDER BY p.created_at DESC 
       LIMIT 10`
    );
    res.json({ success: true, promotions: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
