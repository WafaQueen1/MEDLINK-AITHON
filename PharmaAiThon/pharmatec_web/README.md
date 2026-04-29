# Pharmatec Web Platform

Pharmatec Web Platform is a full-stack web application that extends the Pharmatec mobile ecosystem with a doctor dashboard, pharmacist dashboard, REST API, and PostgreSQL data layer.

## 1. Project Structure

```text
pharmatec_web/
  backend/
  frontend/
  database/
```

## 2. Database Schema

Main tables:

- `users`: shared authentication and profile data
- `doctors`: doctor-specific information
- `pharmacies`: pharmacist and pharmacy details
- `patient_profiles`: mobile patient accounts linked to auth users
- `patients`: patients managed by each doctor
- `prescriptions`: ordonnance header records
- `prescription_items`: medicines attached to each ordonnance
- `pharmacy_medicines`: pharmacy stock

Pharmacy stock now supports:

- `item_type`: `medicine` or `complement`
- `discount_percentage`: discount applied to the stock item

Run the schema:

```sql
\i database/schema.sql
```

If you already created the database before this update, run:

```sql
\i database/migrate_add_complements.sql
\i database/migrate_add_pharmacy_location.sql
\i database/migrate_add_patient_role.sql
```

## 3. Backend API

### Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Environment

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pharmatec_web
JWT_SECRET=replace_with_a_secure_secret
CLIENT_URL=http://localhost:5173
```

### REST Endpoints

#### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

#### Doctor

- `GET /api/doctor/dashboard`
- `GET /api/doctor/patients`
- `POST /api/doctor/patients`
- `GET /api/doctor/prescriptions`
- `POST /api/doctor/prescriptions`

#### Pharmacist

- `GET /api/pharmacist/dashboard`
- `PUT /api/pharmacist/profile`
- `GET /api/pharmacist/medicines`
- `POST /api/pharmacist/medicines`
- `PUT /api/pharmacist/medicines/:medicineId`
- `DELETE /api/pharmacist/medicines/:medicineId`

## 4. Frontend Dashboard

### Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Features

- role-based signup and login
- pharmacist signup with map-based pharmacy location selection
- doctor dashboard with patient management and prescription creation
- pharmacist dashboard with pharmacy profile and medicine stock management
- responsive dashboard UI with sidebar navigation

## 5. Mobile App Integration Path

The backend is designed so your Flutter app can later consume the same endpoints for:

- doctor-generated prescriptions
- pharmacy stock availability
- role-based authentication

## 6. API Notes

- Authentication uses JWT bearer tokens
- All protected endpoints expect `Authorization: Bearer <token>`
- No real-time features or payment system are included
- APIs are simple REST endpoints for easy mobile reuse
