import { apiRequest } from './api';

export const fetchDoctorDashboard = () => apiRequest('/doctor/dashboard');

export const fetchPatients = (search = '') =>
  apiRequest(`/doctor/patients${search ? `?search=${encodeURIComponent(search)}` : ''}`);

export const createPatientRequest = (payload) =>
  apiRequest('/doctor/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchPrescriptions = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.patientId) params.set('patientId', filters.patientId);
  if (filters.date) params.set('date', filters.date);

  const query = params.toString();
  return apiRequest(`/doctor/prescriptions${query ? `?${query}` : ''}`);
};

export const createPrescriptionRequest = (payload) =>
  apiRequest('/doctor/prescriptions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
