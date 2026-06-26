import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../Auth/ProtectedRoute";

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
                element={
                    <ProtectedRoute role="client" >
                        <ClientDashboard />
                    </ProtectedRoute>
                
            }
        />
        <Route
          path="/client/project"
                element={
                    <ProtectedRoute role="client" >
                        <Projects />
                    </ProtectedRoute>
                }
        />

        <Route
          path="/client/payments"
                element={
                    <ProtectedRoute role="client" >
                        <Payments />
                    </ProtectedRoute>
                }
        />

        <Route
          path="/client/documents"
                element={
                    <ProtectedRoute role="client" >
                        <Documents />
                    </ProtectedRoute>
                }
        />

        <Route
          path="/client/meetings"
                element={
                    <ProtectedRoute role="client" >
                        <Meetings />
                    </ProtectedRoute>
                }
        />

        <Route
          path="/client/profile"
                element={
                    <ProtectedRoute role="client" >
                        <Profile />
                    </ProtectedRoute>
                }
        />
        </Route>

        {/*---------------------The admin------------------------------}*/}
        <Route element={<AdminLayout />}>

        <Route
            path="/admin/dashboard"
            element={
                <ProtectedRoute role="admin" >
                    <AdminDashboard />
                </ProtectedRoute>
            
        }
        />

        <Route
            path="/admin/payments"
            element={
                <ProtectedRoute role="admin" >
                    <AdminPayments />
                </ProtectedRoute>
            }
        />

        <Route
            path="/admin/projects"
            element={
                <ProtectedRoute role="admin" >
                    <AdminProjects />
                </ProtectedRoute>
            }
        />

        <Route
            path="/admin/documents"
            element={
                <ProtectedRoute role="admin" >
                    <AdminDocuments />
                </ProtectedRoute>
            }
        />

        <Route
            path="/admin/meetings"
            element={
                <ProtectedRoute role="admin" >
                    <AdminMeetings />
                </ProtectedRoute>
            }
        />

        <Route
            path="/admin/consultations"
            element={
                <ProtectedRoute role="admin" >
                    <AdminConsultations />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/clients"
            element={
                <ProtectedRoute role="admin" >
                    <AdminClients />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/settings"
            element={
                <ProtectedRoute role="admin" >
                    <AdminSettings />
                </ProtectedRoute>
            }
        />

        </Route>

        <Route path="*" element={<NotFound />} />
        

    </Routes>

    

  );
};

export default AppRoutes;