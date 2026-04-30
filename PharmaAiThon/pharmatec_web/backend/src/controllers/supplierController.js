import { pool } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

// @route   GET /api/supplier/orders
// @desc    Get all orders for the logged-in supplier
export const getSupplierOrders = asyncHandler(async (req, res) => {
    const supplierId = req.user?.supplierId;
    if (!supplierId) throw new ApiError(401, "Supplier session not found");

    const result = await pool.query(
        `SELECT o.*, ph.pharmacy_name, ph.pharmacy_address
         FROM orders o
         JOIN pharmacies ph ON o.pharmacy_id = ph.id
         WHERE o.supplier_id = $1
         ORDER BY o.created_at DESC`,
        [supplierId]
    );

    res.json({ success: true, orders: result.rows });
});

// @route   PATCH /api/supplier/orders/:id
// @desc    Update order status (accepted, shipped, delivered, denied)
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const supplierId = req.user?.supplierId;

    const checkOrder = await pool.query('SELECT * FROM orders WHERE id = $1 AND supplier_id = $2', [id, supplierId]);
    if (checkOrder.rows.length === 0) throw new ApiError(404, "Order not found");

    const result = await pool.query(
        `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [status, id]
    );

    res.json({ success: true, order: result.rows[0] });
});

// @route   GET /api/supplier/stats
// @desc    Get supplier dashboard stats
export const getSupplierStats = asyncHandler(async (req, res) => {
    const supplierId = req.user?.supplierId;

    const ordersCount = await pool.query('SELECT COUNT(*) FROM orders WHERE supplier_id = $1', [supplierId]);
    const pendingCount = await pool.query("SELECT COUNT(*) FROM orders WHERE supplier_id = $1 AND status = 'pending'", [supplierId]);
    
    res.json({
        success: true,
        stats: {
            totalOrders: parseInt(ordersCount.rows[0].count),
            pendingOrders: parseInt(pendingCount.rows[0].count)
        }
    });
});
