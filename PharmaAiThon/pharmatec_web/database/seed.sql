-- Seed Data for SILA Ecosystem

-- Users
INSERT INTO users (role, first_name, last_name, email, password_hash, phone_number)
VALUES
  ('doctor', 'Sarah', 'Bennani', 'doctor@pharmatec.com', '$2a$10$ZVPaTbk0c9vo95f/nC.KEukpgmF.M5VsH1nXoX60V4ZB5dwE0DZsG', '+213600000001'),
  ('pharmacist', 'Yacine', 'Amrani', 'pharmacist@pharmatec.com', '$2a$10$ZVPaTbk0c9vo95f/nC.KEukpgmF.M5VsH1nXoX60V4ZB5dwE0DZsG', '+213600000002'),
  ('patient', 'Amine', 'Bensaid', 'patient@pharmatec.com', '$2a$10$ZVPaTbk0c9vo95f/nC.KEukpgmF.M5VsH1nXoX60V4ZB5dwE0DZsG', '+213600000003'),
  ('supplier', 'Karim', 'Ziani', 'supplier@pharmatec.com', '$2a$10$ZVPaTbk0c9vo95f/nC.KEukpgmF.M5VsH1nXoX60V4ZB5dwE0DZsG', '+213600000004'),
  ('admin', 'Admin', 'SILA', 'admin@pharmatec.com', '$2a$10$ZVPaTbk0c9vo95f/nC.KEukpgmF.M5VsH1nXoX60V4ZB5dwE0DZsG', '+213600000000')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Doctor Profile
INSERT INTO doctors (user_id, medical_specialty)
SELECT id, 'Généraliste' FROM users WHERE email = 'doctor@pharmatec.com'
ON CONFLICT (user_id) DO NOTHING;

-- Pharmacy Profile
INSERT INTO pharmacies (user_id, pharmacy_name, pharmacy_address, latitude, longitude)
SELECT id, 'Pharmacie Centrale', '12 Rue Didouche Mourad, Alger', 36.7538, 3.0588 FROM users WHERE email = 'pharmacist@pharmatec.com'
ON CONFLICT (user_id) DO NOTHING;

-- Supplier Profile
INSERT INTO suppliers (user_id, company_name, company_address, wilaya)
SELECT id, 'Biopharm Distribution', 'Zone Industrielle Oued Smar', 'Alger' FROM users WHERE email = 'supplier@pharmatec.com'
ON CONFLICT (user_id) DO NOTHING;

-- Admin Profile
INSERT INTO admins (user_id, permissions)
SELECT id, ARRAY['all'] FROM users WHERE email = 'admin@pharmatec.com'
ON CONFLICT (user_id) DO NOTHING;

-- Patient Profile
INSERT INTO patient_profiles (user_id, age, sex, has_chronic_disease, chronic_disease_name, chifa_number)
SELECT id, 35, 'male', true, 'Diabète', '123456789012' FROM users WHERE email = 'patient@pharmatec.com'
ON CONFLICT (user_id) DO NOTHING;

-- Pharmacy Medicines (50+ items)
DO $$
DECLARE
    pharmacy_id UUID;
BEGIN
    SELECT id INTO pharmacy_id FROM pharmacies WHERE pharmacy_name = 'Pharmacie Centrale';

    INSERT INTO pharmacy_medicines (pharmacy_id, name, generic_name, price, quantity, status)
    VALUES
      (pharmacy_id, 'Panadol 500mg', 'Paracetamol', 250.00, 100, 'Available'),
      (pharmacy_id, 'Doliprane 1g', 'Paracetamol', 320.00, 0, 'Rupture'),
      (pharmacy_id, 'Amoxil 500mg', 'Amoxicillin', 450.00, 50, 'Available'),
      (pharmacy_id, 'Clamoxyl 1g', 'Amoxicillin', 680.00, 0, 'Rupture'),
      (pharmacy_id, 'Voltarene 75mg', 'Diclofenac', 550.00, 30, 'Available'),
      (pharmacy_id, 'Flector 50mg', 'Diclofenac', 480.00, 20, 'Available'),
      (pharmacy_id, 'Glucophage 850mg', 'Metformin', 890.00, 40, 'Available'),
      (pharmacy_id, 'Stagid 700mg', 'Metformin', 750.00, 0, 'Rupture'),
      (pharmacy_id, 'Lasilix 40mg', 'Furosemide', 350.00, 60, 'Available'),
      (pharmacy_id, 'Augmentin 1g', 'Amoxicillin/Clavulanic acid', 1200.00, 15, 'Low Stock'),
      (pharmacy_id, 'Ciblor 1g', 'Amoxicillin/Clavulanic acid', 1100.00, 0, 'Rupture'),
      (pharmacy_id, 'Ventoline 100mcg', 'Salbutamol', 650.00, 25, 'Available'),
      (pharmacy_id, 'Mopral 20mg', 'Omeprazole', 950.00, 35, 'Available'),
      (pharmacy_id, 'Zestril 10mg', 'Lisinopril', 780.00, 0, 'Rupture'),
      (pharmacy_id, 'Aprovel 150mg', 'Irbesartan', 1500.00, 20, 'Available'),
      (pharmacy_id, 'Plavix 75mg', 'Clopidogrel', 2800.00, 10, 'Low Stock'),
      (pharmacy_id, 'Inexium 40mg', 'Esomeprazole', 1800.00, 0, 'Rupture'),
      (pharmacy_id, 'Lovenox 4000UI', 'Enoxaparin', 4500.00, 5, 'Low Stock'),
      (pharmacy_id, 'Spasfon', 'Phloroglucinol', 400.00, 80, 'Available'),
      (pharmacy_id, 'Maxilase', 'Alpha-amylase', 380.00, 90, 'Available'),
      (pharmacy_id, 'Gaviscon', 'Sodium alginate', 600.00, 50, 'Available'),
      (pharmacy_id, 'Aerius 5mg', 'Desloratadine', 720.00, 0, 'Rupture'),
      (pharmacy_id, 'Zyrtec 10mg', 'Cetirizine', 650.00, 40, 'Available'),
      (pharmacy_id, 'Celebrex 200mg', 'Celecoxib', 2200.00, 15, 'Available'),
      (pharmacy_id, 'Keforal 500mg', 'Cephalexin', 980.00, 0, 'Rupture'),
      (pharmacy_id, 'Flagyl 500mg', 'Metronidazole', 520.00, 45, 'Available'),
      (pharmacy_id, 'Pyostacine 500mg', 'Pristinamycin', 1600.00, 10, 'Low Stock'),
      (pharmacy_id, 'Roaccutane 20mg', 'Isotretinoin', 3500.00, 5, 'Low Stock'),
      (pharmacy_id, 'Efferalgan 500mg', 'Paracetamol', 240.00, 150, 'Available'),
      (pharmacy_id, 'Aspegic 100mg', 'Aspirin', 180.00, 200, 'Available'),
      (pharmacy_id, 'Kardegic 75mg', 'Aspirin', 220.00, 0, 'Rupture'),
      (pharmacy_id, 'Tadenan 50mg', 'Pygeum africanum', 1400.00, 20, 'Available'),
      (pharmacy_id, 'Chibro-Proscar', 'Finasteride', 2600.00, 0, 'Rupture'),
      (pharmacy_id, 'Avodart 0.5mg', 'Dutasteride', 3200.00, 10, 'Available'),
      (pharmacy_id, 'Viagra 100mg', 'Sildenafil', 1200.00, 30, 'Available'),
      (pharmacy_id, 'Cialis 20mg', 'Tadalafil', 2500.00, 15, 'Available'),
      (pharmacy_id, 'Levitra 20mg', 'Vardenafil', 2300.00, 0, 'Rupture'),
      (pharmacy_id, 'Xanax 0.5mg', 'Alprazolam', 450.00, 20, 'Low Stock'),
      (pharmacy_id, 'Lexomil', 'Bromazepam', 550.00, 0, 'Rupture'),
      (pharmacy_id, 'Valium 10mg', 'Diazepam', 400.00, 15, 'Available'),
      (pharmacy_id, 'Laroxyl 25mg', 'Amitriptyline', 350.00, 40, 'Available'),
      (pharmacy_id, 'Prozac 20mg', 'Fluoxetine', 1800.00, 0, 'Rupture'),
      (pharmacy_id, 'Deroxat 20mg', 'Paroxetine', 2100.00, 10, 'Available'),
      (pharmacy_id, 'Seropram 20mg', 'Citalopram', 1950.00, 0, 'Rupture'),
      (pharmacy_id, 'Zoloft 50mg', 'Sertraline', 2400.00, 15, 'Available'),
      (pharmacy_id, 'Tercian 25mg', 'Cyamemazine', 850.00, 25, 'Available'),
      (pharmacy_id, 'Haldol 5mg', 'Haloperidol', 600.00, 0, 'Rupture'),
      (pharmacy_id, 'Risperdal 2mg', 'Risperidone', 2800.00, 10, 'Available'),
      (pharmacy_id, 'Zyprexa 5mg', 'Olanzapine', 3500.00, 5, 'Low Stock'),
      (pharmacy_id, 'Abilify 10mg', 'Aripiprazole', 4200.00, 0, 'Rupture');
END $$;
