const express = require("express");
const authenticate = require("../../Middlewares/AuthMiddleware");
const Authorize = require("../../Middlewares/Authorize");
const { changePassword, getClientProfile } = require("../../Controllers/ClientControllers/clientController");
const { getClientMeetings } = require("../../Controllers/MeetingsController/MeetingsController");
const { getClientProject } = require("../../Controllers/ProjectsControllers/ProjectsControllers");
const router = express.Router();

router.patch('/changePassword/:id',authenticate,Authorize("client"),changePassword);
router.get('/profile',authenticate,Authorize("client"),getClientProfile);
router.get('/allMeetings',authenticate,Authorize("client"),getClientMeetings);

//Project
router.get('/getClientProjects',authenticate,Authorize("client"),getClientProject);




module.exports = router;