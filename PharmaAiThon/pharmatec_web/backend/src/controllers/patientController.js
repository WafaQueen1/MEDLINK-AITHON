import { pool } from '../config/db.js';

// Helper: Calculate Distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 0.5 - Math.cos(dLat)/2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos(dLon))/2;
    return R * 2 * Math.asin(Math.sqrt(a));
};

// @route POST /api/patient/find-pharmacy/:prescription_id
export const findBestPharmacies = async (req, res) => {
    const { prescription_id } = req.params;
    const { 
        patientLat = req.body.latitude || 36.7538, 
        patientLng = req.body.longitude || 3.0588 
    } = req.body; // default to Algiers if not provided

    try {
        // 1. Get list of medicines needed
        const medsRes = await pool.query(
            'SELECT medicine_name FROM prescription_items WHERE prescription_id = $1', 
            [prescription_id]
        );
        const medNames = medsRes.rows.map(r => r.medicine_name);
        const totalMedsNeeded = medNames.length;

        if (totalMedsNeeded === 0) {
            return res.status(404).json({ message: "No medicines found in this prescription" });
        }

        // 2. Find Pharmacies with ALL medicines in stock
        // LOGIC: Group by pharmacy, count medicines. If count == totalMedsNeeded, they have everything.
        const query = `
            SELECT p.id, p.pharmacy_name as name, p.pharmacy_address as address, p.rating, p.latitude as lat, p.longitude as lng, 
                   SUM(pm.price) as total_standard_price
            FROM pharmacies p
            JOIN pharmacy_medicines pm ON p.id = pm.pharmacy_id
            WHERE pm.name = ANY($1) AND pm.quantity > 0
            GROUP BY p.id
            HAVING COUNT(pm.name) = $2;
        `;
        
        const result = await pool.query(query, [medNames, totalMedsNeeded]);

        // 3. Calculate Distance and Sort (Highest Stars -> Nearest)
        const pharmacies = result.rows.map(p => {
            const dist = p.lat && p.lng ? calculateDistance(patientLat, patientLng, p.lat, p.lng) : 0;
            return { ...p, distance: dist.toFixed(2), standard_price: p.total_standard_price };
        });

        // Sort: Rating Desc, Distance Asc
        pharmacies.sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return a.distance - b.distance;
        });

        res.json({ 
            standard_price: pharmacies[0]?.standard_price || 0, 
            pharmacies 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error finding pharmacies", error: err.message });
    }
};

// @route   POST /api/patient/send-request
// @desc    Patient sends a prescription request to a specific pharmacy
export const sendRequest = async (req, res) => {
    const { prescription_id, pharmacy_id, standard_price } = req.body;
    const patient_id = req.user?.id; 
    if (!patient_id) return res.status(401).json({ message: "User session not found" });
    try {
        // Verify we don't send duplicate requests
        const existing = await pool.query(
            "SELECT * FROM prescription_requests WHERE prescription_id = $1 AND pharmacy_id = $2",
            [prescription_id, pharmacy_id]
        );
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: "Request already sent to this pharmacy" });
        }

        const result = await pool.query(
            `INSERT INTO prescription_requests 
             (prescription_id, patient_id, pharmacy_id, standard_price, status) 
             VALUES ($1, $2, $3, $4, 'SENT') 
             RETURNING *`,
            [prescription_id, patient_id, pharmacy_id, standard_price]
        );

        res.status(201).json({ 
            message: "Request sent successfully! Waiting for pharmacist verification.", 
            request: result.rows[0] 
        });

    } catch (err) {
        console.error("Send Request Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @route   GET /api/patient/request-status/:request_id
// @desc    Get current status of a specific request
export const getRequestStatus = async (req, res) => {
    const { request_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT pr.*, ph.pharmacy_name 
             FROM prescription_requests pr
             JOIN pharmacies ph ON pr.pharmacy_id = ph.id
             WHERE pr.id = $1`,
            [request_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Request not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Get Status Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
// @route   GET /api/patient/my-prescriptions
// @desc    Get all prescriptions for the logged-in patient
export const getMyPrescriptions = async (req, res) => {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "User session not found" });

    try {
        // 1. Find the patient record linked to this user
        const patientRes = await pool.query(
            "SELECT id FROM patients WHERE user_id = $1",
            [user_id]
        );

        if (patientRes.rows.length === 0) {
            return res.json({ prescriptions: [] }); // No patient profile linked yet
        }

        const patient_id = patientRes.rows[0].id;

        // 2. Get prescriptions with items
        const query = `
            SELECT p.*, u.last_name as doctor_name, d.medical_specialty as specialty,
                   json_agg(json_build_object(
                       'name', pi.medicine_name,
                       'dosage', pi.dosage,
                       'price', COALESCE(pm.price, 0),
                       'covered', true
                   )) as medicines
            FROM prescriptions p
            JOIN doctors d ON p.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            LEFT JOIN prescription_items pi ON p.id = pi.prescription_id
            LEFT JOIN LATERAL (
                SELECT price FROM pharmacy_medicines 
                WHERE name = pi.medicine_name 
                LIMIT 1
            ) pm ON true
            WHERE p.patient_id = $1
            GROUP BY p.id, d.id, u.id
            ORDER BY p.created_at DESC;
        `;

        const result = await pool.query(query, [patient_id]);
        res.json({ prescriptions: result.rows });

    } catch (err) {
        console.error("Get My Prescriptions Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
