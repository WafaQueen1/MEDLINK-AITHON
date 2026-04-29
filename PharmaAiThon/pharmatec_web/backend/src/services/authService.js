import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { findUserByEmail, findUserById } from '../models/userModel.js';
import { ApiError } from '../utils/ApiError.js';

const buildAuthPayload = (user) => ({
  id: user.id,
  role: user.role,
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  phoneNumber: user.phone_number,
  doctorId: user.doctor_id,
  medicalSpecialty: user.medical_specialty,
  pharmacyId: user.pharmacy_id,
  pharmacyName: user.pharmacy_name,
  pharmacyAddress: user.pharmacy_address,
  latitude: user.latitude,
  longitude: user.longitude,
  patientProfileId: user.patient_profile_id,
  age: user.age,
  sex: user.sex,
  hasChronicDisease: user.has_chronic_disease,
  chronicDiseaseName: user.chronic_disease_name,
  chifaNumber: user.chifa_number,
});

const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      role: user.role,
      doctorId: user.doctor_id,
      pharmacyId: user.pharmacy_id,
      firstName: user.first_name,
      lastName: user.last_name,
      medicalSpecialty: user.medical_specialty,
      pharmacyName: user.pharmacy_name,
      pharmacyAddress: user.pharmacy_address,
      latitude: user.latitude,
      longitude: user.longitude,
      patientProfileId: user.patient_profile_id,
      age: user.age,
      sex: user.sex,
      hasChronicDisease: user.has_chronic_disease,
      chronicDiseaseName: user.chronic_disease_name,
      chifaNumber: user.chifa_number,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

export const signupUser = async (payload) => {
  const existingUser = await findUserByEmail(payload.email);

  if (existingUser) {
    throw new ApiError(409, 'Email already exists');
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (role, first_name, last_name, email, password_hash, phone_number)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        payload.role,
        payload.firstName,
        payload.lastName,
        payload.email,
        passwordHash,
        payload.phoneNumber,
      ]
    );

    const user = userResult.rows[0];

    if (payload.role === 'doctor') {
      await client.query(
        `INSERT INTO doctors (user_id, medical_specialty)
         VALUES ($1, $2)`,
        [user.id, payload.medicalSpecialty]
      );
    }

    if (payload.role === 'pharmacist') {
      if (payload.latitude == null || payload.longitude == null) {
        throw new ApiError(400, 'Pharmacy location is required');
      }

      await client.query(
        `INSERT INTO pharmacies (user_id, pharmacy_name, pharmacy_address, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, payload.pharmacyName, payload.pharmacyAddress, payload.latitude, payload.longitude]
      );
    }

    if (payload.role === 'patient') {
      await client.query(
        `INSERT INTO patient_profiles (
           user_id,
           age,
           sex,
           has_chronic_disease,
           chronic_disease_name,
           chifa_number
         )
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          user.id,
          payload.age,
          payload.sex,
          payload.hasChronicDisease ?? false,
          payload.chronicDiseaseName || null,
          payload.chifaNumber,
        ]
      );
    }

    await client.query('COMMIT');

    const createdUser = await findUserById(user.id);
    return {
      token: signToken(createdUser),
      user: buildAuthPayload(createdUser),
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return {
    token: signToken(user),
    user: buildAuthPayload(user),
  };
};

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return buildAuthPayload(user);
};
