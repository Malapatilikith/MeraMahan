import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import BottomNav from './components/common/BottomNav';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import ExploreReportsPage from './pages/ExploreReportsPage';
import ReportDetailPage from './pages/ReportDetailPage';
import SubmitReportPage from './pages/SubmitReportPage';
import MyReportsPage from './pages/MyReportsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import HelpPage from './pages/HelpPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-[#FF9933]/20 selection:text-slate-900">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExploreReportsPage />} />
              <Route path="/reports/:id" element={<ReportDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<VerifyOtpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ForgotPasswordPage />} />
              <Route path="/help" element={<HelpPage />} />

              {/* Protected Citizen Routes */}
              <Route
                path="/submit"
                element={
                  <ProtectedRoute>
                    <SubmitReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-report"
                element={
                  <ProtectedRoute>
                    <SubmitReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-reports"
                element={
                  <ProtectedRoute>
                    <MyReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MyReportsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin & Moderator Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute moderatorOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute moderatorOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports/:id"
                element={
                  <ProtectedRoute moderatorOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute moderatorOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute moderatorOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/locations"
                element={
                  <ProtectedRoute moderatorOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute moderatorOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/content-reports"
                element={
                  <ProtectedRoute moderatorOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Not Found Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />
          <BottomNav />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
