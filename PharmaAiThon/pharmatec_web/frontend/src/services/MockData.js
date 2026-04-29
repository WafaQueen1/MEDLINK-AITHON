/**
 * Mock Data for SILA Ecosystem
 */

export const ALGERIAN_MEDICINES = [
  { id: 1, name: 'Panadol 500mg', genericName: 'Paracetamol', type: 'Painkiller', isRupture: false, price: 250 },
  { id: 2, name: 'Doliprane 1g', genericName: 'Paracetamol', type: 'Painkiller', isRupture: true, price: 320 },
  { id: 3, name: 'Amoxil 500mg', genericName: 'Amoxicillin', type: 'Antibiotic', isRupture: false, price: 450 },
  { id: 4, name: 'Clamoxyl 1g', genericName: 'Amoxicillin', type: 'Antibiotic', isRupture: true, price: 680 },
  { id: 5, name: 'Voltarene 75mg', genericName: 'Diclofenac', type: 'Anti-inflammatory', isRupture: false, price: 550 },
  { id: 6, name: 'Flector 50mg', genericName: 'Diclofenac', type: 'Anti-inflammatory', isRupture: false, price: 480 },
  { id: 7, name: 'Glucophage 850mg', genericName: 'Metformin', type: 'Diabetes', isRupture: false, price: 890 },
  { id: 8, name: 'Stagid 700mg', genericName: 'Metformin', type: 'Diabetes', isRupture: true, price: 750 },
  { id: 9, name: 'Lasilix 40mg', genericName: 'Furosemide', type: 'Diuretic', isRupture: false, price: 350 },
  { id: 10, name: 'Augmentin 1g', genericName: 'Amoxicillin/Clavulanic acid', type: 'Antibiotic', isRupture: false, price: 1200 },
  { id: 11, name: 'Ciblor 1g', genericName: 'Amoxicillin/Clavulanic acid', type: 'Antibiotic', isRupture: true, price: 1100 },
  { id: 12, name: 'Ventoline 100mcg', genericName: 'Salbutamol', type: 'Asthma', isRupture: false, price: 650 },
  { id: 13, name: 'Mopral 20mg', genericName: 'Omeprazole', type: 'Gastric', isRupture: false, price: 950 },
  { id: 14, name: 'Zestril 10mg', genericName: 'Lisinopril', type: 'Hypertension', isRupture: true, price: 780 },
  { id: 15, name: 'Aprovel 150mg', genericName: 'Irbesartan', type: 'Hypertension', isRupture: false, price: 1500 }
];

export const MOCK_PATIENT = {
  name: 'Amine Bensaid',
  age: 31,
  bloodType: 'O+',
  chifaStatus: 'Verified (100%)',
  coverage: 100,
  history: [
    { diagnosis: 'Type 2 Diabetes', date: '12 Jan 2024', doctor: 'Dr. Karima' },
    { diagnosis: 'Allergic Rhinitis', date: '05 Mar 2024', doctor: 'Dr. Mourad' }
  ]
};

export const MOCK_REQUESTS = [
  { id: 'ORD-7721', patient: 'Amine Bensaid', time: '2m ago', status: 'pending', items: ['Doliprane 1g', 'Amoxil 500mg'] },
  { id: 'ORD-8842', patient: 'Lydia Hamdi', time: '15m ago', status: 'pending', items: ['Ventoline', 'Gaviscon'] },
  { id: 'ORD-9910', patient: 'Samir Brahimi', time: '1h ago', status: 'dispensed', items: ['Lasilix'] }
];
