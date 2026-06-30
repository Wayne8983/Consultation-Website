const express = require("express");
const authenticate = require("../../Middlewares/AuthMiddleware");
const Authorize = require("../../Middlewares/Authorize");
const { 
    changePassword, 
    getClientProfile } = require("../../Controllers/ClientControllers/clientController");
const { getClientMeetings } = require("../../Controllers/MeetingsController/MeetingsController");
const { getClientProject } = require("../../Controllers/ProjectsControllers/ProjectsControllers");
const uploadDocument = require("../../Middlewares/uploadDocument");

const {
  getClientDocuments,
  uploadClientDocument,
  deleteClientDocument,
} = require("../../Controllers/DocumentsController/DocumentsController");

const router = express.Router();

router.patch('/changePassword/:id',authenticate,Authorize("client"),changePassword);
router.get('/profile',authenticate,Authorize("client"),getClientProfile);
router.get('/allMeetings',authenticate,Authorize("client"),getClientMeetings);

//Project
router.get('/getClientProjects',authenticate,Authorize("client"),getClientProject);


// DOCUMENTS
router.get("/documents", authenticate, Authorize("client"), getClientDocuments);
router.post(
  "/documents",
  authenticate,
  Authorize("client"),
  uploadDocument.single("document"),
  uploadClientDocument
);
router.delete(
  "/documents/:id",
  authenticate,
  Authorize("client"),
  deleteClientDocument
);



module.exports = router;