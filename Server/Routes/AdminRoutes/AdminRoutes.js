const express = require("express");
const Authorize = require("../../Middlewares/Authorize");
const authenticate = require("../../Middlewares/AuthMiddleware");
const uploadDocument = require("../../Middlewares/uploadDocument");

const {
  getAdminDocuments,
  uploadAdminDocument,
  deleteAdminDocument,
} = require("../../Controllers/DocumentsController/DocumentsController");

const {getAllConsultations, 
    approveConsultation, 
    allClients, 
    oneClient, 
    rejected, 
    pendingConsultations, 
    adminDashboard, 
    getOneConsultation,
    changeAdminPassword} = require("../../Controllers/AdminControllers/AdminControllers");
const { 
    createClient, 
    suspendClient
     } = require("../../Controllers/ClientControllers/clientController");

const { 
    createMeeting, 
    getAdminMeetings, 
    cancelMeeting,
    completeMeeting,
    getMeeting,
    updateMeeting,
    deleteMeeting} = require("../../Controllers/MeetingsController/MeetingsController");
const { createProject, 
    allAdminProjects, 
    singleProject, 
    updateProject, 
    completeProject, 
    deleteProject, 
    oneClientProject, 
    cancelProject,
    updateMilestone,
    confirmMilestonePayment} = require("../../Controllers/ProjectsControllers/ProjectsControllers");

const router = express.Router();


// CLIENTS Routes
router.post('/clients', authenticate, Authorize("admin"), createClient);
router.get('/clients', authenticate, Authorize("admin"), allClients);
router.get('/clients/:id', authenticate, Authorize("admin"), oneClient);
router.patch('/clients/:id/suspend', authenticate, Authorize("admin"), suspendClient);
router.patch("/change-password",authenticate,Authorize("admin"),changeAdminPassword);

// PROJECTS Routes
router.post('/clients/:id/projects', authenticate, Authorize("admin"), createProject);
router.get('/Projects',authenticate,Authorize("admin"),allAdminProjects);
router.get('/Projects/:id',authenticate,Authorize("admin"),singleProject);
router.patch('/Projects/update/:id',authenticate,Authorize("admin"),updateProject);
router.patch('/Projects/:id/complete',authenticate,Authorize("admin"),completeProject);
router.delete('/Projects/delete/:id',authenticate,Authorize("admin"),deleteProject);
router.patch('/cancelProject/:id',authenticate,Authorize("admin"),cancelProject);

router.patch(
  "/Projects/:projectId/milestones/:milestoneId",
  authenticate,
  Authorize("admin"),
  updateMilestone
);

router.patch(
  "/Projects/:projectId/milestones/:milestoneId/confirm-payment",
  authenticate,
  Authorize("admin"),
  confirmMilestonePayment
);

router.get('/Clients/:id/projects',authenticate,Authorize("admin"),oneClientProject);


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


// DOCUMENTS
router.get("/documents", authenticate, Authorize("admin"), getAdminDocuments);
router.post(
  "/clients/:id/documents",
  authenticate,
  Authorize("admin"),
  uploadDocument.single("document"),
  uploadAdminDocument
);
router.delete(
  "/documents/:id",
  authenticate,
  Authorize("admin"),
  deleteAdminDocument
);

module.exports = router;