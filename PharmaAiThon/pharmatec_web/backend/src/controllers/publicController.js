import { asyncHandler } from '../utils/asyncHandler.js';
import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Get all pharmacies with their medicines
 * Used by patients to find medicines in nearby pharmacies
 */
export const getPharmaciesWithMedicines = asyncHandler(async (req, res) => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.pharmacy_name,
      p.pharmacy_address,
      p.latitude,
      p.longitude,
      u.phone_number,
      json_agg(
        json_build_object(
          'id', pm.id,
          'name', pm.name,
          'price', pm.price,
          'quantity', pm.quantity,
          'discount_percentage', pm.discount_percentage
        )
      ) FILTER (WHERE pm.id IS NOT NULL) as medicines
    FROM pharmacies p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN pharmacy_medicines pm ON pm.pharmacy_id = p.id
    GROUP BY p.id, p.pharmacy_name, p.pharmacy_address, p.latitude, p.longitude, u.phone_number
    ORDER BY p.pharmacy_name
  `);

  const pharmacies = result.rows.map(row => ({
    id: row.id,
    name: row.pharmacy_name,
    address: row.pharmacy_address,
    phone: row.phone_number || '',
    latitude: parseFloat(row.latitude) || null,
    longitude: parseFloat(row.longitude) || null,
    availableMedicines: row.medicines || [],
  }));

  res.json({
    success: true,
    data: pharmacies,
  });
});

/**
 * Search medicines in nearby pharmacies
 * Filters by medicine names and optional location
 */
export const searchMedicinesInPharmacies = asyncHandler(async (req, res) => {
  const { medicines, latitude, longitude, radiusKm = 10 } = req.body;

  if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
    throw new ApiError(400, 'Medicines array is required');
  }

  // Build the search query
  const medicineFilters = medicines
    .map((med, idx) => `pm.name ILIKE '%' || $${idx + 1} || '%'`)
    .join(' OR ');

  let query = `
    SELECT DISTINCT
      p.id,
      p.pharmacy_name,
      p.pharmacy_address,
      p.latitude,
      p.longitude,
      u.phone_number,
      json_agg(
        json_build_object(
          'id', pm.id,
          'name', pm.name,
          'price', pm.price,
          'quantity', pm.quantity,
          'discount_percentage', pm.discount_percentage
        )
      ) FILTER (WHERE pm.id IS NOT NULL) as medicines
    FROM pharmacies p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN pharmacy_medicines pm ON pm.pharmacy_id = p.id AND (${medicineFilters})
    WHERE TRUE
  `;

  const params = [...medicines];
  let paramIdx = medicines.length + 1;

  // Add distance filter if coordinates provided
  if (latitude && longitude) {
    query += ` AND (
      6371 * acos(
        cos(radians($${paramIdx})) * cos(radians(p.latitude)) *
        cos(radians(p.longitude) - radians($${paramIdx + 1})) +
        sin(radians($${paramIdx})) * sin(radians(p.latitude))
      ) <= $${paramIdx + 2}
    )`;
    params.push(latitude, longitude, radiusKm);
    paramIdx += 3;
  }

  query += `
    GROUP BY p.id, p.pharmacy_name, p.pharmacy_address, p.latitude, p.longitude, u.phone_number
    HAVING COUNT(DISTINCT pm.id) > 0
    ORDER BY 
      COUNT(DISTINCT pm.id) DESC,
      p.pharmacy_name
    LIMIT 100
  `;

  const result = await pool.query(query, params);

  // Calculate distances and sort by distance if coordinates provided
  let results = result.rows.map(row => ({
    id: row.id,
    name: row.pharmacy_name,
    address: row.pharmacy_address,
    phone: row.phone_number || '',
    latitude: parseFloat(row.latitude) || null,
    longitude: parseFloat(row.longitude) || null,
    availableMedicines: row.medicines || [],
    distanceKm: latitude && longitude && row.latitude && row.longitude
      ? calculateDistance(latitude, longitude, parseFloat(row.latitude), parseFloat(row.longitude))
      : 0,
  }));

  // Sort by distance if coordinates provided, otherwise by medicine match
  if (latitude && longitude) {
    results.sort((a, b) => a.distanceKm - b.distanceKm);
    // Keep only the 10 nearest pharmacies
    results = results.slice(0, 10);
  }

  res.json({
    success: true,
    medicinesSearched: medicines,
    userLocation: latitude && longitude ? { latitude, longitude } : null,
    results,
  });
});

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get all available suppliers
 */
export const getSuppliers = asyncHandler(async (req, res) => {
  const result = await pool.query(`
    SELECT 
      s.id,
      s.company_name,
      s.company_address,
      s.wilaya,
      u.phone_number
    FROM suppliers s
    JOIN users u ON u.id = s.user_id
    ORDER BY s.company_name
  `);

  res.json({
    success: true,
    suppliers: result.rows,
  });
});
