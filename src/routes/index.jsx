import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Login from '../pages/auth/Login';
import StudentDashboard from '../pages/student/Dashboard';
import AdvisorDashboard from '../pages/advisor/Dashboard';
import HodDashboard from '../pages/hod/Dashboard';
import LeaveRequestForm from '../pages/student/LeaveRequestForm';
import LeaveRequests from '../pages/student/LeaveRequests';
import ODRequestForm from '../pages/student/ODRequestForm';
import HalfDayRequestForm from '../pages/student/HalfDayRequestForm';
import Attendance from '../pages/student/Attendance';
import Status from '../pages/student/Status';
import Timetable from '../pages/student/Timetable';
import ManageLeaveRequests from '../pages/advisor/ManageLeaveRequests';
import ManageStudents from '../pages/advisor/ManageStudents';
import TimetableManagement from '../pages/advisor/TimetableManagement';
import AddStudent from '../pages/advisor/AddStudent';
import ManualAttendanceEntry from '../pages/advisor/ManualAttendanceEntry';
import AttendanceManagement from '../pages/advisor/AttendanceManagement';
import HodManageLeaveRequests from '../pages/hod/ManageLeaveRequests';
import HodManageStaff from '../pages/hod/ManageStaff';
import HodManageStudents from '../pages/hod/ManageStudents';
import AddAdvisor from '../pages/hod/AddAdvisor';
import NotFound from '../pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    if (role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (role === 'advisor') {
      return <Navigate to="/advisor/dashboard" replace />;
    } else if (role === 'hod') {
      return <Navigate to="/hod/dashboard" replace />;
    }
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      
      {/* Student Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['student']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/attendance" element={<Attendance />} />
        <Route path="/student/leave/new" element={<LeaveRequestForm />} />
        <Route path="/student/halfday/new" element={<HalfDayRequestForm />} />
        <Route path="/student/od/new" element={<ODRequestForm />} />
        <Route path="/student/status" element={<Status />} />
        <Route path="/student/leave/requests" element={<LeaveRequests />} />
        <Route path="/student/timetable" element={<Timetable />} />
      </Route>
      
      {/* Advisor Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['advisor']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
        <Route path="/advisor/leave/requests" element={<ManageLeaveRequests />} />
        <Route path="/advisor/students" element={<ManageStudents />} />
        <Route path="/advisor/timetable" element={<TimetableManagement />} />
        <Route path="/advisor/students/add" element={<AddStudent />} />
        <Route path="/advisor/attendance/manual" element={<ManualAttendanceEntry />} />
        <Route path="/advisor/attendance/manage" element={<AttendanceManagement />} />
      </Route>
      
      {/* HOD Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['hod']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/hod/dashboard" element={<HodDashboard />} />
        <Route path="/hod/leave/requests" element={<HodManageLeaveRequests />} />
        <Route path="/hod/staff" element={<HodManageStaff />} />
        <Route path="/hod/students" element={<HodManageStudents />} />
        <Route path="/hod/staff/add" element={<AddAdvisor />} />
      </Route>
      
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;