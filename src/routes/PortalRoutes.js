/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CostSetUp from '../components/pages/CostSetUp';
import Dashboard from '../components/pages/Dashboard';
import Insurance from '../components/pages/Insurance';
import ManageInventory from '../components/pages/ManageInventory';
import NotFound from '../components/pages/NotFound'; // Import your 404 page component
import PatientDetails from '../components/pages/PatientDetails';
import PatientOverview from '../components/pages/PatientOverview';
import PatientsPayments from '../components/pages/PatientsPayments';
import PatientsPaymentsByAppointment from '../components/pages/PatientsPaymentByAppointment';
import InsuranceDetails from '../components/pages/insurance-hmo/InsuranceDetails';
import AuthRoute from './AuthRoute';
import Settings from '../components/pages/insurance-hmo/Settings';
import Patients from '../components/pages/Patients';

export default () => (
    <Routes>
        <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
        <Route path="/patients-payment" element={<AuthRoute><PatientsPayments /></AuthRoute>} />
        <Route path="/patients-invoices" element={<AuthRoute><PatientsPaymentsByAppointment /></AuthRoute>} />
        <Route path="/wallet" element={<AuthRoute><Patients /></AuthRoute>} />
        <Route path="/cost-setup" element={<AuthRoute><CostSetUp /></AuthRoute>} />
        <Route path="/insurance" element={<AuthRoute><Insurance /></AuthRoute>} />
        <Route path="/patients-payment/:patientId" element={<AuthRoute><PatientOverview /></AuthRoute>} />
        <Route path="/patients-details/:patientId" element={<AuthRoute><PatientDetails /></AuthRoute>} />
        <Route path="/insurance/:insuranceId" element={<AuthRoute><InsuranceDetails /></AuthRoute>} />
        <Route path="/manage-inventory" element={<AuthRoute><ManageInventory /></AuthRoute>} />
        <Route path="/settings" element={<AuthRoute><Settings /></AuthRoute>} />
        {/* Render the NotFound component for unmatched routes */}
        <Route path="*" element={<NotFound />} />
    </Routes>
);
