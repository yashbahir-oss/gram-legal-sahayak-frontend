import { createBrowserRouter } from "react-router";

import App from "./App";

import HomePage from "../features/home/HomePage";
import ServicesPage from "../features/services/ServicesPage";
import PropertyPage from "../features/services/PropertyPage";
import InheritancePage from "../features/services/InheritancePage";
import ConsumerPage from "../features/services/ConsumerPage";
import AgreementsPage from "../features/services/AgreementsPage";

import CyberFraudPage from "../features/cyber-fraud/CyberFraudPage";
import SchemesPage from "../features/schemes/SchemesPage";
import AISahayakPage from "../features/ai-sahayak/AISahayakPage";
import ComplaintsPage from "../features/complaints/ComplaintsPage";
import DocumentsPage from "../features/documents/DocumentsPage";

import OfficesPage from "../features/offices/OfficesPage";
import LoginPage from "../features/auth/LoginPage";
import ProfilePage from "../features/auth/ProfilePage";
import AdminPage from "../features/auth/AdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      // Home
      {
        index: true,
        element: <HomePage />,
      },

      // Services
      {
        path: "services",
        element: <ServicesPage />,
      },
      {
        path: "services/property",
        element: <PropertyPage />,
      },
      {
        path: "services/inheritance",
        element: <InheritancePage />,
      },
      {
        path: "services/consumer",
        element: <ConsumerPage />,
      },
      {
        path: "services/agreements",
        element: <AgreementsPage />,
      },

      // Other modules
      {
        path: "cyber-fraud",
        element: <CyberFraudPage />,
      },
      {
        path: "schemes",
        element: <SchemesPage />,
      },
      {
        path: "ai-sahayak",
        element: <AISahayakPage />,
      },
      {
        path: "complaints",
        element: <ComplaintsPage />,
      },
      {
        path: "documents",
        element: <DocumentsPage />,
      },

      { path: "login", element: <LoginPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "admin", element: <AdminPage /> },

      // Offices
      {
        path: "offices",
        element: <OfficesPage />,
      },
    ],
  },
]);