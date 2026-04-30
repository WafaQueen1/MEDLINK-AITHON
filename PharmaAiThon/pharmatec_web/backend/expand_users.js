import bcrypt from 'bcryptjs';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:Rami1412%23@localhost:5432/pharmatec_db',
});

const passwordHash = await bcrypt.hash('password123', 10);

async function createUsers() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Clear existing data
    await client.query('TRUNCATE users, doctors, patient_profiles, patients, pharmacies, prescriptions, prescription_requests, prescription_items, promotions, pharmacy_medicines, orders, suppliers RESTART IDENTITY CASCADE');

    // 1. DOCTORS
    const doctorData = [
      { email: 'ahmed.mansour@medlink.com', first: 'Ahmed', last: 'Mansour', specialty: 'Cardiology', phone: '0555112233' },
      { email: 'sarah.brahimi@medlink.com', first: 'Sarah', last: 'Brahimi', specialty: 'Pediatrics', phone: '0555445566' },
      { email: 'karim.ziani@medlink.com', first: 'Karim', last: 'Ziani', specialty: 'Neurology', phone: '0555778899' },
    ];

    const doctorIds = []; 
    for (const d of doctorData) {
      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, role, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [d.email, passwordHash, 'doctor', d.first, d.last, d.phone]
      );
      const docRes = await client.query(
        `INSERT INTO doctors (user_id, medical_specialty) VALUES ($1, $2) RETURNING id`,
        [userRes.rows[0].id, d.specialty]
      );
      doctorIds.push(docRes.rows[0].id);
    }

    // 2. PATIENTS
    const patientData = [
      { email: 'amine.ghoulam@medlink.com', first: 'Amine', last: 'Ghoulam', age: 45, sex: 'male', disease: 'Hypertension', chifa: '123456789012345678', phone: '0661001122' },
      { email: 'meriem.koudri@medlink.com', first: 'Meriem', last: 'Koudri', age: 32, sex: 'female', disease: 'Asthma', chifa: '223456789012345678', phone: '0661334455' },
    ];

    const patientTableIds = [];
    for (const p of patientData) {
      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, role, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [p.email, passwordHash, 'patient', p.first, p.last, p.phone]
      );
      const userId = userRes.rows[0].id;

      await client.query(
        `INSERT INTO patient_profiles (user_id, age, sex, has_chronic_disease, chronic_disease_name, chifa_number) VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, p.age, p.sex, !!p.disease, p.disease, p.chifa]
      );

      const patRes = await client.query(
        `INSERT INTO patients (doctor_id, user_id, first_name, last_name, age, sex, chronic_disease) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [doctorIds[0], userId, p.first, p.last, p.age, p.sex, p.disease]
      );
      patientTableIds.push(patRes.rows[0].id);
    }

    // 3. PHARMACISTS & PROMOTIONS
    const pharmacistData = [
      { email: 'walid.pharmacist@medlink.com', first: 'Walid', last: 'Pharmacist', name: 'Algiers Central Pharmacy', address: 'Place Audin, Algiers', lat: 36.7753, lon: 3.0602, phone: '021667788' },
    ];

    for (const ph of pharmacistData) {
      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, role, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [ph.email, passwordHash, 'pharmacist', ph.first, ph.last, ph.phone]
      );
      const userId = userRes.rows[0].id;
      const phRes = await client.query(
        `INSERT INTO pharmacies (user_id, pharmacy_name, pharmacy_address, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [userId, ph.name, ph.address, ph.lat, ph.lon]
      );
      const pharmacyId = phRes.rows[0].id;

      // Seed Promotions
      await client.query(
        `INSERT INTO promotions (pharmacist_id, title, description, type, medicine_names, discount_percentage) VALUES 
        ($1, 'Doliprane 1g Stock', 'Fresh stock of Doliprane 1g available now.', 'Stock Arrival', 'Doliprane', 0),
        ($1, 'Vitamin C Boost', '20% discount on all Vitamin C brands.', 'Discount', 'Vitamin C, Redoxon', 20)`,
        [userId]
      );

      // Seed some medicines for price lookup
      await client.query(
        `INSERT INTO pharmacy_medicines (pharmacy_id, name, price, quantity) VALUES 
        ($1, 'Norvasc', 1200.00, 50),
        ($1, 'Doliprane', 250.00, 100),
        ($1, 'Ventoline', 450.00, 30)`,
        [pharmacyId]
      );
    }

    // 4. Create an initial prescription for Amine Ghoulam (assigned to Dr. Ahmed)
    const prescRes = await client.query(
      `INSERT INTO prescriptions (doctor_id, patient_id, notes) VALUES ($1, $2, $3) RETURNING id`,
      [doctorIds[0], patientTableIds[0], 'Please take with food. Stay positive!']
    );
    await client.query(
      `INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration) VALUES 
      ($1, 'Norvasc', '5mg', '1 pill / day', '30 days')`,
      [prescRes.rows[0].id]
    );

    // 5. SUPPLIERS
    const supplierData = [
      { email: 'saidal.supply@medlink.com', first: 'Saidal', last: 'Group', company: 'Saidal Logistics', address: 'El Harrach, Algiers', wilaya: 'Alger', phone: '023112233' },
      { email: 'frater.razes@medlink.com', first: 'Frater', last: 'Razes', company: 'Frater-Razes Pharma', address: 'Oued Smar, Algiers', wilaya: 'Alger', phone: '023445566' }
    ];

    for (const s of supplierData) {
      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, role, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [s.email, passwordHash, 'supplier', s.first, s.last, s.phone]
      );
      await client.query(
        `INSERT INTO suppliers (user_id, company_name, company_address, wilaya) VALUES ($1, $2, $3, $4)`,
        [userRes.rows[0].id, s.company, s.address, s.wilaya]
      );
    }

    await client.query('COMMIT');
    console.log('✅ DATABASE FULLY SYNCHRONIZED & SEEDED:');
    console.log(' - Prescriptions created for Amine Ghoulam');
    console.log(' - Promotions created for Central Pharmacy');
    console.log(' - Medicine prices seeded for Norvasc & others');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error expanding users:', err);
  } finally {
    client.release();
    pool.end();
  }
}

createUsers();
