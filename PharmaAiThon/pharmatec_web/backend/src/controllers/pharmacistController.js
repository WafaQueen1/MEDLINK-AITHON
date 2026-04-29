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
