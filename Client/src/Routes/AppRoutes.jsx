import { Routes, Route } from "react-router-dom";

import Home from "../Pages/Home";
import About from "../Pages/About";
import Services from "../Pages/Services";
import Contact from "../Pages/Contact";
import Blog from "../Pages/blog";
import CaseStudies from "../Pages/CaseStudies";
import MainLayout from "../Components/Layout/MainLayout";
import Login from "../Pages/LoginSignupForm/Login";
import Consultation from "../Pages/Consultation/Consultation";
import ClientLayout from "../Pages/ClientDashboard/ClientLayout";
import ClientDashboard from "../Pages/ClientDashboard/ClientDashboard";
import Projects from "../Pages/ClientDashboard/Projects";
import Payments from "../Pages/ClientDashboard/Payments";
import Documents from "../Pages/ClientDashboard/Documents";
import Meetings from "../Pages/ClientDashboard/Meetings";
import Profile from "../Pages/ClientDashboard/Profile";
import NotFound from "../Pages/Notfound404/NotFound";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard";
import AdminDocuments from "../Pages/AdminDashboard/AdminDocuments";
import AdminLayout from "../Pages/AdminDashboard/AdminLayout";
import AdminSettings from "../Pages/AdminDashboard/AdminSettings";
import AdminProjects from "../Pages/AdminDashboard/AdminProjects";
import AdminPayments from "../Pages/AdminDashboard/AdminPayments";
import AdminMeetings from "../Pages/AdminDashboard/AdminMeetings";
import AdminConsultations from "../Pages/AdminDashboard/AdminConsultations";
import AdminClients from "../Pages/AdminDashboard/AdminClients";

const AppRoutes = () => {
  return (
    <Routes>
        <Route 
                path="/" 
                element={ 
                            <MainLayout>
                                <Home />
                            </MainLayout> 
                        } />

        <Route 
                path="/about" 
                element={ 
                            <MainLayout>
                                <About/>
                            </MainLayout> 
                        } /> 

        <Route 
                path="/services" 
                element={ 
                            <MainLayout>
                                <Services />
                            </MainLayout> 
                        } />

        <Route 
                path="/insights" 
                element={ 
                            <MainLayout>
                                <Blog />
                            </MainLayout> 
                        } />

        <Route 
                path="/case-studies" 
                element={ 
                            <MainLayout>
                                <CaseStudies />
                            </MainLayout> 
                        } />

        <Route 
        path="/contact" 
                element={ 
                            <MainLayout>
                                <Contact />
                            </MainLayout> 
                        } />
        
        <Route
            path="/login"
                element={<Login />}
        />
        <Route 
            path="/consultation" 
                element={
                            <MainLayout>
                                <Consultation />
                            </MainLayout>
                            }     />

        <Route element={<ClientLayout />}>
        <Route
            path="/client/dashboard"
                element={<ClientDashboard />}
        />
        <Route
          path="/client/project"
                element={<Projects />}
        />

        <Route
          path="/client/payments"
                element={<Payments />}
        />

        <Route
          path="/client/documents"
                element={<Documents />}
        />

        <Route
          path="/client/meetings"
                element={<Meetings />}
        />

        <Route
          path="/client/profile"
                element={<Profile />}
        />
        </Route>

        {/*---------------------The admin------------------------------}*/}
        <Route element={<AdminLayout />}>

        <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
        />

        <Route
            path="/admin/payments"
            element={<AdminPayments />}
        />

        <Route
            path="/admin/projects"
            element={<AdminProjects />}
        />

        <Route
            path="/admin/documents"
            element={<AdminDocuments />}
        />

        <Route
            path="/admin/meetings"
            element={<AdminMeetings />}
        />

        <Route
            path="/admin/consultations"
            element={<AdminConsultations />}
        />
        <Route
            path="/admin/clients"
            element={<AdminClients />}
        />
        <Route
            path="/admin/settings"
            element={<AdminSettings />}
        />

        </Route>

        <Route path="*" element={<NotFound />} />
        

    </Routes>

    

  );
};

export default AppRoutes;