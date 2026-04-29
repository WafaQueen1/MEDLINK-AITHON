/**
 * Chifa Insurance Logic for Algeria
 */

const getCoveragePercentage = (chifaSerial) => {
  // Mock logic: 100% coverage for chronic diseases (even serial), 80% for others (odd serial)
  if (!chifaSerial) return 0;
  
  const lastDigit = parseInt(chifaSerial.slice(-1));
  if (isNaN(lastDigit)) return 80; // Default
  
  return lastDigit % 2 === 0 ? 100 : 80;
};

const calculateFinalPrice = (totalAmount, coveragePercentage) => {
  const coverage = totalAmount * (coveragePercentage / 100);
  const patientPays = totalAmount - coverage;
  return {
    total: totalAmount,
    coverageAmount: parseFloat(coverage.toFixed(2)),
    patientPays: parseFloat(patientPays.toFixed(2)),
    coveragePercentage
  };
};

export default {
  getCoveragePercentage,
  calculateFinalPrice
};
