import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import Sidebar from './components/Sidebar';
import { DarkModeToggle } from './components/DarkModeToggle';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-royal-dark text-tech-turquoise font-semibold tracking-widest">
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
    <div className="min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
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

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 p-10 text-center ml-64">
                  <h1 className="text-3xl font-black text-royal-dark dark:text-white uppercase tracking-tighter">Pharmacy Locator Grid</h1>
                  <p className="text-slate-500 mt-4 font-bold uppercase text-xs tracking-widest">Accessing regional pharmacy nodes...</p>
                  {/* For demo, we can just show a big map here */}
                  <div className="mt-12 w-full max-w-5xl mx-auto aspect-video bg-slate-100 dark:bg-white/5 rounded-[3rem] border border-slate-200 dark:border-white/10 flex items-center justify-center">
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em]">Interactive Map Rendering...</p>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Redirect */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating Dark Mode Toggle */}
      <DarkModeToggle />
    </div>
  );
}