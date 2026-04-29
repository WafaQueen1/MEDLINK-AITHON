import { pool } from '../config/db.js';
import {
  createPatientForDoctor,
  createPrescriptionWithItems,
  getPatientByIdForDoctor,
  getPatientsByDoctor,
  getPrescriptionsByDoctor,
} from '../models/doctorModel.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDoctorDashboard = asyncHandler(async (req, res) => {
  const patients = await getPatientsByDoctor(req.user.doctorId);
  const prescriptions = await getPrescriptionsByDoctor(req.user.doctorId);

  res.json({
    stats: {
      totalPatients: patients.length,
      totalPrescriptions: prescriptions.length,
    },
    patients,
    prescriptions,
  });
});

export const createPatient = asyncHandler(async (req, res) => {
  const patient = await createPatientForDoctor(req.user.doctorId, req.body);
  res.status(201).json({ patient });
});

export const listPatients = asyncHandler(async (req, res) => {
  const patients = await getPatientsByDoctor(req.user.doctorId, req.query.search || '');
  res.json({ patients });
});

export const createPrescription = asyncHandler(async (req, res) => {
  const patient = await getPatientByIdForDoctor(req.user.doctorId, req.body.patientId);

  if (!patient) {
    throw new ApiError(404, 'Patient not found for this doctor');
  }

  if (!Array.isArray(req.body.medicines) || req.body.medicines.length === 0) {
    throw new ApiError(400, 'At least one medicine is required');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const prescription = await createPrescriptionWithItems(client, req.user.doctorId, req.body);
    await client.query('COMMIT');
    res.status(201).json({ prescription });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

export const listPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await getPrescriptionsByDoctor(req.user.doctorId, {
    patientId: req.query.patientId,
    date: req.query.date,
  });

  res.json({ prescriptions });
});
