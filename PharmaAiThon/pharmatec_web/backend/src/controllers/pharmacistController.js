import { pool } from '../config/db.js';
import {
  createPharmacyMedicine,
  deletePharmacyMedicine,
  getPharmacyMedicines,
  updatePharmacyMedicine,
  updatePharmacyProfile,
  getAllPrescriptions,
} from '../models/pharmacistModel.js';
import { findUserById } from '../models/userModel.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getPharmacyDashboard = asyncHandler(async (req, res) => {
  const currentUser = await findUserById(req.user.id);
  const medicines = await getPharmacyMedicines(req.user.pharmacyId);
  const complements = medicines.filter((item) => item.item_type === 'complement');
  const pureMedicines = medicines.filter((item) => item.item_type === 'medicine');

  res.json({
    profile: {
      pharmacyId: currentUser.pharmacy_id,
      pharmacyName: currentUser.pharmacy_name,
      pharmacyAddress: currentUser.pharmacy_address,
      pharmacistName: `${currentUser.first_name} ${currentUser.last_name}`,
    },
    stats: {
      totalMedicines: pureMedicines.length,
      totalComplements: complements.length,
      totalUnits: medicines.reduce((total, item) => total + item.quantity, 0),
    },
    medicines,
    complements,
  });
});

export const editPharmacyProfile = asyncHandler(async (req, res) => {
  const pharmacy = await updatePharmacyProfile(req.user.pharmacyId, req.body);

  if (!pharmacy) {
    throw new ApiError(404, 'Pharmacy profile not found');
  }

  res.json({ pharmacy });
});

export const listMedicines = asyncHandler(async (req, res) => {
  const medicines = await getPharmacyMedicines(
    req.user.pharmacyId,
    req.query.search || '',
    req.query.itemType || ''
  );
  res.json({ medicines });
});

export const addMedicine = asyncHandler(async (req, res) => {
  const medicine = await createPharmacyMedicine(req.user.pharmacyId, req.body);
  res.status(201).json({ medicine });
});

export const editMedicine = asyncHandler(async (req, res) => {
  const medicine = await updatePharmacyMedicine(req.user.pharmacyId, req.params.medicineId, req.body);

  if (!medicine) {
    throw new ApiError(404, 'Medicine not found');
  }

  res.json({ medicine });
});

export const removeMedicine = asyncHandler(async (req, res) => {
  const deleted = await deletePharmacyMedicine(req.user.pharmacyId, req.params.medicineId);

  if (!deleted) {
    throw new ApiError(404, 'Medicine not found');
  }

  res.json({ message: 'Medicine deleted successfully' });
});

export const listPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await getAllPrescriptions();
  res.json({ prescriptions });
});

// @route POST /api/pharmacist/verify-chifa/:request_id
export const verifyChifa = async (req, res) => {
    const { request_id } = req.params;
    const { chifa_type } = req.body; // Frontend sends '100', '80', or 'NONE'

    try {
        // 1. Get the Request details
        const reqRes = await pool.query('SELECT * FROM prescription_requests WHERE id = $1', [request_id]);
        
        if (reqRes.rows.length === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        const request = reqRes.rows[0];
        const standardPrice = parseFloat(request.standard_price);
        let finalPay = 0;

        // 2. Calculate Final Price
        if (chifa_type === '100') {
            finalPay = 0; // Fully covered
        } else if (chifa_type === '80') {
            finalPay = standardPrice * 0.20; // Patient pays remaining 20%
        } else {
            // 'NONE' or Inactive Card -> Patient pays Standard Price
            finalPay = standardPrice; 
        }

        // 3. Update Database
        await pool.query(
            `UPDATE prescription_requests 
             SET chifa_coverage_type = $1, final_patient_pay = $2, status = 'READY' 
             WHERE id = $3`,
            [chifa_type, finalPay, request_id]
        );

        res.json({
            success: true,
            original_price: standardPrice,
            final_price: finalPay,
            message: `Price updated. Patient needs to pay ${finalPay} DZD`
        });

    } catch (err) {
        console.error("verifyChifa Error:", err);
        res.status(500).json({ message: "Verification failed", error: err.message });
    }
};

// @route POST /api/pharmacist/request-stock
export const createOrder = async (req, res) => {
    const { supplier_id, total_amount } = req.body;
    const pharmacy_id = req.user?.pharmacyId;

    try {
        const result = await pool.query(
            `INSERT INTO orders (pharmacy_id, supplier_id, total_amount, status)
             VALUES ($1, $2, $3, 'pending') RETURNING *`,
            [pharmacy_id, supplier_id, total_amount]
        );
        res.json({ success: true, order: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Order creation failed", error: err.message });
    }
};

// @route   GET /api/pharmacist/requests
// @desc    Get all incoming requests for the logged-in pharmacist
export const getRequests = async (req, res) => {
    const pharmacy_id = req.user?.pharmacyId;
    if (!pharmacy_id) return res.status(401).json({ message: "Pharmacy session not found" });
    try {
        const result = await pool.query(
            `SELECT pr.*, p.first_name || ' ' || p.last_name as patient_name, pres.notes as diagnosis 
             FROM prescription_requests pr
             JOIN patients p ON pr.patient_id = p.id
             JOIN prescriptions pres ON pr.prescription_id = pres.id
             WHERE pr.pharmacy_id = $1 
             ORDER BY pr.created_at DESC`,
            [pharmacy_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Get Requests Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
