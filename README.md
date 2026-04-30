Here is the **Comprehensive Technical Report** for **MEDLINK**. This document serves as the final project documentation, detailing the vision, architecture, workflow, and implementation status.

---

# 📄 Project Report: MEDLINK - Algerian Healthcare Ecosystem

**Project Name:** MEDLINK  
**Version:** 1.0.0 (Hackathon Release)  
**Date:** April 30, 2026  
**Type:** Full-Stack Web Application (SaaS)  
**Architecture:** MERN Stack (PostgreSQL Variant)

---

## 1. Executive Summary

**MEDLINK** is a digital healthcare ecosystem designed to modernize the Algerian medical sector. It addresses critical inefficiencies in the current system: lack of medicine availability transparency, uncertainty regarding healthcare coverage (Chifa), and the fragmentation of medical records.

The platform connects four key stakeholders—**Doctors, Patients, Pharmacists, and Suppliers**—into a secure, interoperable network. By leveraging AI for clinical support and real-time data for logistics, MEDLINK reduces patient waiting times, prevents drug interactions, and ensures financial transparency.

---

## 2. Problem Statement

The Algerian healthcare landscape faces three primary challenges:

1.  **The "Ghost Stock" Phenomenon:** Patients often travel to multiple pharmacies only to find required medicines are out of stock, leading to wasted time and potential health risks.
2.  **Chifa Financial Opacity:** Patients covered by CNAS (Carte Chifa) are frequently unaware of their coverage status (100%, 80%, or inactive) until they reach the pharmacy counter, leading to awkward financial situations and delays.
3.  **Fragmented Medical Data:** Paper prescriptions are easily lost and lack automated checks for drug-drug interactions, posing risks to patients with chronic illnesses.

---

## 3. The Solution: The MEDLINK Ecosystem

MEDLINK digitizes the entire prescription lifecycle through a secure cloud platform.

### 3.1 Core Features
*   **AI-Assisted Prescriptions:** Doctors use an integrated AI assistant (Gemini) to suggest medications and check for interactions with the patient's medical history.
*   **Smart Pharmacy Locator:** An algorithm filters pharmacies based on **100% Stock Availability** of prescribed medicines, sorting results by **Star Rating** and **Geographical Distance**.
*   **Dynamic Chifa Calculator:** The system calculates the "Standard Price" (worst-case cost) upfront. Pharmacists verify coverage dynamically, updating the patient's bill instantly (0% pay, 20% pay, or 100% pay).
*   **Supply Chain Integration:** A safety net allowing pharmacists to request restock from suppliers directly through the platform.

---

## 4. Technical Architecture

### 4.1 Technology Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js + Vite (Single Page Application) |
| **Styling** | Tailwind CSS (Custom "Royal Tech" Design System) |
| **Backend** | Node.js + Express.js (REST API) |
| **Database** | PostgreSQL (Relational Database) |
| **AI Engine** | Google Gemini API (`@google/generative-ai`) |
| **State Mgmt** | React Context API + `useReducer` |

### 4.2 Database Design Highlights
The database is normalized to separate medical data from transactional data:

*   `users`: Central authentication table (Role-based: Doctor, Patient, Pharmacist, Supplier).
*   `prescriptions`: Stores immutable medical records (Diagnosis, Doctor ID, Patient ID).
*   `prescription_items`: Links medicines to a prescription (Many-to-Many).
*   `pharmacies`: Includes a `rating` column for the sorting algorithm.
*   `prescription_requests`: **(Key Innovation)** A transactional table linking a patient's prescription to a specific pharmacy. Tracks status (`SENT`, `PROCESSING`, `READY`) and financial data (`total_standard_price`, `patient_co_pay`).

---

## 5. Workflow Scenarios

### Scenario A: The Doctor (Clinical Decision Support)
1.  **Login:** Doctor accesses a secure dashboard.
2.  **Selection:** Selects a patient from the registry.
3.  **AI Assistance:** Inputs symptoms (e.g., "Hypertension"). The AI suggests Algerian-market medicines.
4.  **Safety Check:** The system cross-references new drugs with the patient's chronic medication list. If an interaction is detected, an alert is triggered.
5.  **Transmission:** The digital prescription is signed and pushed to the patient’s portal.

### Scenario B: The Patient (Search & Budgeting)
1.  **Receipt:** Patient receives a push notification with the new prescription.
2.  **Search:** Patient clicks "Find Pharmacy."
    *   *Backend Logic:* The system queries `pharmacy_medicines` to find pharmacies where stock exists for ALL items.
3.  **Pricing:** The app displays the **Standard Price** (e.g., 5,000 DZD) — the worst-case cost if Chifa is inactive.
4.  **Selection:** The patient sees a list sorted by top-rated pharmacies. They select "Pharmacy A" (⭐ 4.9) and click **Reserve**.

### Scenario C: The Pharmacist (Verification & Dispensing)
1.  **Ingest:** The request appears on the "Live Dispatch Terminal" (updated via Polling every 5 seconds).
2.  **Verification:** The pharmacist asks for the Carte Chifa.
3.  **Calculation:**
    *   Click **"Chifa 100%"**: System updates Patient Pay to 0 DZD.
    *   Click **"Chifa 80%"**: System calculates 20% co-pay (1,000 DZD).
    *   Click **"No Chifa"**: System confirms Standard Price (5,000 DZD).
4.  **Completion:** The patient's app updates with the final amount to bring.

---

## 6. Design System: "Royal Tech"

To differentiate MEDLINK from standard clinical tools, we implemented a custom design system called **Royal Tech**.

*   **Philosophy:** Glassmorphism meets premium luxury.
*   **Color Palette:**
    *   `--royal-green (#064E3B)`: Used for Dark Mode backgrounds (Sidebars, Navbar).
    *   `--turquoise (#2DD4BF)`: Primary accent (Buttons, Highlights).
    *   `--pale-gold (#FDE047)`: Secondary accent (Warnings, Premium features).
    *   `--medical-gray (#F1F5F9)`: Light mode backgrounds.
*   **UI Elements:** High-contrast buttons, subtle gradients, soft shadows, and smooth transitions.
*   **UX Strategy:** "Progressive Disclosure." Information is revealed as needed (e.g., Price shown before selection, Co-pay calculated after verification).

---

## 7. Implementation Status

### ✅ Completed
*   **Database Schema:** Fully designed and migrated (PostgreSQL).
*   **Backend API:** All REST endpoints functional (Auth, CRUD, Logic).
*   **Smart Algorithms:** Stock filtering and Distance calculation implemented.
*   **Frontend UI:** All dashboards (Doctor, Patient, Pharmacist) built.
*   **Design System:** Dark Mode and "Royal Tech" styling applied.
*   **Chifa Logic:** Dynamic pricing engine fully operational.

### 🔄 In Progress / Future Roadmap
*   **Real-time Sockets:** Currently using Polling; planned upgrade to Socket.io for instant updates.
*   **GPS Integration:** Currently using static coordinates; plans to integrate live user geolocation.

---

## 8. Conclusion

MEDLINK represents a paradigm shift for healthcare in Algeria. By digitizing the prescription loop and adding a layer of intelligence (AI and Logistics), we have created a system that saves time, money, and lives. The platform is technically robust, visually stunning, and ready for pilot deployment.
