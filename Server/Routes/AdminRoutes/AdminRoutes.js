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
const { createClient, createProject, suspendClient, changePassword } = require("../../Controllers/ClientControllers/clientController");

const router = express.Router();


router.post('/create/client',authenticate,Authorize("admin"),createClient);
router.post('/create/:id/project',authenticate,Authorize("admin"),createProject);
router.patch('/suspend/client/:id',authenticate,Authorize("admin"),suspendClient);
router.patch('/changePassword/:id',authenticate,Authorize("admin"),changePassword);
router.get('/allConsultations',authenticate,Authorize("admin"),getAllConsultations);
router.patch('/consultations/:id/approve',authenticate,Authorize("admin"),approveConsultation);
router.patch('/consultations/:id/reject',authenticate,Authorize("admin"),rejected);
router.get('/consultations/pending',authenticate,Authorize("admin"),pendingConsultations);
router.get('/consultations/:id',authenticate,Authorize("admin"),getOneConsultation);
router.get('/dashboard',authenticate,Authorize("admin"),adminDashboard);
router.get('/allclients',authenticate,Authorize("admin"),allClients);
router.get('/clients/:id',authenticate,Authorize("admin"),oneClient);



module.exports = router;