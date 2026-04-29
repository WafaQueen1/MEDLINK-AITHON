# MEDLINK (SILA Healthcare Ecosystem) - Full-Stack Walkthrough

This document summarizes the technical implementation of the MEDLINK platform, focusing on the integration of the React frontend with the Node.js/PostgreSQL backend using the **Royal Tech** design system.

## 🚀 Vision
To build a premium, high-fidelity healthcare ecosystem for Algeria, enabling seamless communication between doctors, pharmacists, and patients.

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, PostgreSQL (`node-postgres`).
- **Security**: JWT-based Authentication, Role-based Access Control (RBAC).
- **AI Integration**: Google Gemini API (for Generic Substitution).

---

## 🏗 Key Components & Integration

### 1. Unified Authentication System
- **Dynamic Signup**: Multi-step registration for Patients, Doctors, and Pharmacists.
- **Secure Login**: Role-aware login with automatic redirection to specialized workspaces.
- **Global Auth State**: Managed via `AuthContext` to ensure session persistence across the grid.

### 2. Smart Prescriber (Doctor Workspace)
- **Live Patient Selection**: Fetches actual patient profiles from the PostgreSQL database.
- **Digital Smart Pad**: AI-ready interface for drafting prescriptions.
- **Network Broadcast**: One-click broadcast of signed prescriptions to the national pharmacy network via the `POST /doctor/prescriptions` endpoint.

### 3. Pharmacy Terminal (Pharmacist Dashboard)
- **Live Network Feed**: Real-time retrieval of incoming prescriptions using `GET /pharmacist/prescriptions`.
- **Chifa Billing Engine**: Integrated logic for calculating insurance coverage (80% vs 100%) and patient co-pay.
- **Dispensing Workflow**: Securely logs dispensing transactions and updates inventory status.

---

## 🎨 Design System: Royal Tech
The platform uses a custom design system characterized by:
- **Palette**: `Royal Dark` (#0A0A0B), `Tech Turquoise` (#2DD4BF), and `Tech Gray` (#F8FAFC).
- **Aesthetics**: Glassmorphism, premium card layouts, and micro-animations for feedback.
- **Typography**: Heavy black tracking for headers and monospaced fonts for medical identifiers.

---

## 🧪 Verification Plan

### Automated Verification
- **Endpoint Tests**: Verified `/auth`, `/doctor`, and `/pharmacist` routes using internal diagnostics.
- **Database Schema**: Aligned PostgreSQL tables (`prescriptions`, `prescription_items`, `patients`) with frontend data models.

### Manual Scenarios
1. **The Doctor's Journey**: Register as a doctor -> Fetch patients -> Create digital ordonnance -> Broadcast to network.
2. **The Pharmacist's Journey**: Log in to terminal -> Select active ordonnance -> Verify Chifa card -> Finalize dispensing.

---

## 📈 Future Roadmap
- **AI Substitution**: Full integration of Gemini to suggest alternatives for Rupture medicines.
- **Supplier Grid**: B2B medicine logistics dashboard for wholesale tracking.
- **Patient Mobile App**: Direct access to medical history and digital Chifa card.

**MEDLINK is now Showcase-Ready.**
