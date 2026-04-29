import { apiRequest } from './api';

export const fetchPharmacyDashboard = () => apiRequest('/pharmacist/dashboard');

export const updatePharmacyProfileRequest = (payload) =>
  apiRequest('/pharmacist/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const fetchMedicines = (search = '') =>
  apiRequest(`/pharmacist/medicines${search ? `?search=${encodeURIComponent(search)}` : ''}`);

export const createMedicineRequest = (payload) =>
  apiRequest('/pharmacist/medicines', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateMedicineRequest = (medicineId, payload) =>
  apiRequest(`/pharmacist/medicines/${medicineId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteMedicineRequest = (medicineId) =>
  apiRequest(`/pharmacist/medicines/${medicineId}`, {
    method: 'DELETE',
  });

export const fetchPrescriptions = () => apiRequest('/pharmacist/prescriptions');
