import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import { DarkModeToggle } from './components/DarkModeToggle';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-royal-dark text-tech-turquoise font-black tracking-[0.5em] animate-pulse">
        <div className="w-16 h-16 border-4 border-tech-turquoise border-t-transparent rounded-full animate-spin mb-8" />
        MEDLINK INITIALIZING...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    const dashboardMap = {
      doctor: '/doctor',
      pharmacist: '/pharmacist',
      patient: '/patient',
      supplier: '/supplier',
      admin: '/admin'
    };
    return <Navigate to={dashboardMap[user.role] || '/login'} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pharmacist"
          element={
            <ProtectedRoute role="pharmacist">
              <PharmacistDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier"
          element={
            <ProtectedRoute role="supplier">
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Shared routes */}
        <Route path="/activity" element={<ProtectedRoute><div className="pl-64 p-10 font-bold text-slate-300">Activity Module - Coming Soon</div></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><div className="pl-64 p-10 font-bold text-slate-300">System Settings - Coming Soon</div></ProtectedRoute>} />
        
        {/* Root redirect */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
      </Routes>
      <DarkModeToggle />
    </>
  );
}
