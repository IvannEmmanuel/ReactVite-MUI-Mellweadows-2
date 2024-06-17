import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import PatientForm from '../Pages/PatientForm';
import Dashboard from '../Pages/Dashboard';
import StaffRegistration from '../Pages/StaffRegistration';
import MainContent from '../MainContent';
import WardRequisition from '../Pages/WardRequisition';
import Appointment from '../Pages/Appointment';
import Ward from '../Pages/Ward';
import Supplies from '../Pages/Supplies';
import Pharmaceutical from '../Pages/Pharmaceutical';
import Surgical from '../Pages/Surgical';
import PatientMedication from '../Pages/PatientMedication';
import StaffManagement from '../Pages/StaffManagement';

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <Dashboard/>,
    children: [
        {
            index: true,
            element: <MainContent />
        },
        {
            path: 'patientform',
            element: <PatientForm/>
        },
        {
            path: 'staffregistration',
            element: <StaffRegistration/>
        },
        {
            path: 'wardrequisition',
            element: <WardRequisition/>
        },
        {
            path: 'appointment',
            element: <Appointment/>
        },
        {
            path: 'ward',
            element: <Ward/>
        },
        {
            path: 'supplies',
            element: <Supplies/>
        },
        {
            path: 'pharmaceutical',
            element: <Pharmaceutical/>
        },
        {
            path: 'surgical',
            element: <Surgical/>
        },
        {
            path: 'patientmedication',
            element: <PatientMedication/>
        },
        {
            path: 'staffmanagement',
            element: <StaffManagement/>
        },
    ]
  }
]);

export default router;
