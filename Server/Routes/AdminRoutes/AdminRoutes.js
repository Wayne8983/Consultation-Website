const express = require("express");
const Authorize = require("../../Middlewares/Authorize");
const authenticate = require("../../Middlewares/AuthMiddleware");
const {getAllConsultations, 
    approveConsultation, 
    allClients, 
    oneClient, 
    rejected, 
    pendingConsultations, 
    adminDashboard, 
    getOneConsultation} = require("../../Controllers/AdminControllers/AdminControllers");
const { 
    createClient, 
    suspendClient, 
    changePassword } = require("../../Controllers/ClientControllers/clientController");

const { 
    createMeeting, 
    getAdminMeetings, 
    cancelMeeting,
    completeMeeting,
    getMeeting,
    updateMeeting,
    deleteMeeting} = require("../../Controllers/MeetingsController/MeetingsController");
const { createProject, allAdminProjects } = require("../../Controllers/ProjectsControllers/ProjectsControllers");

const router = express.Router();


// CLIENTS
router.post('/clients', authenticate, Authorize("admin"), createClient);
router.get('/clients', authenticate, Authorize("admin"), allClients);
router.get('/clients/:id', authenticate, Authorize("admin"), oneClient);
router.patch('/clients/:id/suspend', authenticate, Authorize("admin"), suspendClient);
router.patch('/clients/:id/change-password', authenticate, Authorize("admin"), changePassword);

// PROJECTS
router.post('/clients/:id/projects', authenticate, Authorize("admin"), createProject);
router.get('/api/allProjects',authenticate,Authorize("admin"),allAdminProjects);

// CONSULTATIONS
router.get('/consultations', authenticate, Authorize("admin"), getAllConsultations);
router.get('/consultations/pending', authenticate, Authorize("admin"), pendingConsultations);
router.get('/consultations/:id', authenticate, Authorize("admin"), getOneConsultation);
router.patch('/consultations/:id/approve', authenticate, Authorize("admin"), approveConsultation);
router.patch('/consultations/:id/reject', authenticate, Authorize("admin"), rejected);

// DASHBOARD
router.get('/dashboard', authenticate, Authorize("admin"), adminDashboard);

// MEETINGS
router.post('/clients/:id/meetings', authenticate, Authorize("admin"), createMeeting);
router.get('/meetings', authenticate, Authorize("admin"), getAdminMeetings);
router.get('/meetings/:id', authenticate, Authorize("admin"), getMeeting);
router.patch('/meetings/:id/cancel', authenticate, Authorize("admin"), cancelMeeting);
router.patch('/meetings/:id/complete', authenticate, Authorize("admin"), completeMeeting);
router.patch('/meetings/:id', authenticate, Authorize("admin"), updateMeeting);
router.delete('/meetings/:id', authenticate, Authorize("admin"), deleteMeeting);

module.exports = router;