import { createBrowserRouter, Navigate } from "react-router";
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
import AdminLayout from "../features/admin/AdminLayout";
import AdminDashboard from "../features/admin/AdminDashboard";
import AdminUsers from "../features/admin/AdminUsers";
import AdminDocuments from "../features/admin/AdminDocuments";
import AdminComplaints from "../features/admin/AdminComplaints";
import AdminOffices from "../features/admin/AdminOffices";
import AdminAnalytics from "../features/admin/AdminAnalytics";
import AdminSettings from "../features/admin/AdminSettings";
import { AdminSimple } from "../features/admin/AdminSimple";

export const router = createBrowserRouter([
  { path:"/", element:<App/>, children:[
    {index:true,element:<HomePage/>},
    {path:"services",element:<ServicesPage/>},
    {path:"services/property",element:<PropertyPage/>},
    {path:"services/inheritance",element:<InheritancePage/>},
    {path:"services/consumer",element:<ConsumerPage/>},
    {path:"services/agreements",element:<AgreementsPage/>},
    {path:"cyber-fraud",element:<CyberFraudPage/>},
    {path:"schemes",element:<SchemesPage/>},
    {path:"ai-sahayak",element:<AISahayakPage/>},
    {path:"complaints",element:<ComplaintsPage/>},
    {path:"documents",element:<DocumentsPage/>},
    {path:"offices",element:<OfficesPage/>},
    {path:"login",element:<LoginPage/>},
    {path:"profile",element:<ProfilePage/>},
  ]},
  { path:"/admin", element:<AdminLayout/>, children:[
    {index:true,element:<Navigate to="/admin/dashboard" replace/>},
    {path:"dashboard",element:<AdminDashboard/>},
    {path:"complaints",element:<AdminComplaints/>},
    {path:"users",element:<AdminUsers/>},
    {path:"documents",element:<AdminDocuments/>},
    {path:"offices",element:<AdminOffices/>},
    {path:"schemes",element:<AdminSimple type="schemes"/>},
    {path:"ai",element:<AdminSimple type="ai"/>},
    {path:"analytics",element:<AdminAnalytics/>},
    {path:"settings",element:<AdminSettings/>},
  ]},
]);
