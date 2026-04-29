# Pharmatec Web API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### `POST /auth/signup`

Doctor payload:

```json
{
  "role": "doctor",
  "firstName": "Aya",
  "lastName": "Khaldi",
  "email": "aya@example.com",
  "password": "secret123",
  "phoneNumber": "+213600111222",
  "medicalSpecialty": "Cardiology"
}
```

Pharmacist payload:

```json
{
  "role": "pharmacist",
  "firstName": "Nadia",
  "lastName": "Mekki",
  "email": "nadia@example.com",
  "password": "secret123",
  "phoneNumber": "+213600111333",
  "pharmacyName": "Central Pharm",
  "pharmacyAddress": "12 Rue Didouche Mourad, Algiers",
  "latitude": 36.7538,
  "longitude": 3.0588
}
```

Patient payload for the mobile app:

```json
{
  "role": "patient",
  "firstName": "Amine",
  "lastName": "Bensaid",
  "email": "amine@example.com",
  "password": "secret123",
  "phoneNumber": "",
  "age": 31,
  "sex": "Male",
  "hasChronicDisease": true,
  "chronicDiseaseName": "Asthma",
  "chifaNumber": "1234567890"
}
```

### `POST /auth/login`

```json
{
  "email": "aya@example.com",
  "password": "secret123"
}
```

### `GET /auth/me`

Returns the authenticated user profile.

## Doctor Endpoints

### `POST /doctor/patients`

```json
{
  "firstName": "Samir",
  "lastName": "Benali",
  "age": 43,
  "sex": "male",
  "chronicDisease": "Diabetes"
}
```

### `POST /doctor/prescriptions`

```json
{
  "patientId": "patient-uuid",
  "notes": "Take after meals",
  "medicines": [
    {
      "medicineName": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "5 days"
    }
  ]
}
```

### `GET /doctor/prescriptions?patientId=<uuid>&date=2026-04-27`

Filters by patient or exact date.

## Pharmacist Endpoints

### `PUT /pharmacist/profile`

```json
{
  "pharmacyName": "Central Pharm Updated",
  "pharmacyAddress": "16 Rue Larbi Ben M'hidi, Algiers"
}
```

### `POST /pharmacist/medicines`

```json
{
  "name": "Amoxicillin",
  "itemType": "medicine",
  "price": 480.0,
  "discountPercentage": 0,
  "quantity": 22
}
```

### `PUT /pharmacist/medicines/:medicineId`

Same payload as create.

### `DELETE /pharmacist/medicines/:medicineId`

Deletes one stock item from the pharmacist's pharmacy.
