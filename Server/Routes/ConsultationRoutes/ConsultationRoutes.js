const express = require("express");
const bookConsultation = require("../../Controllers/Consultations/Consultations.Controller");
const router = express.Router();


router.post('/',bookConsultation);




module.exports = router;