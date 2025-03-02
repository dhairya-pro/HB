import * as patientController from '../controllers/patient.controller.js';
import express from 'express';
import {verifyToken, patientOnly} from '../middleware/auth.js';
import {getPatientDashboard} from '../controllers/patient.controller.js';
import * as appointment from '../controllers/appointment.controller.js'
import upload from '../middleware/multer.middleware.js'
const router = express.Router();

// ✅ Patient Signup Route
router.post('/signup', patientController.patientSignup);

// ✅ Patient Login Route
router.post('/login', patientController.patientLogin);
router.get("/dashboard", verifyToken, patientOnly, getPatientDashboard);
router.post("/add/appointments",verifyToken,appointment.addappointment)
router.post("/get/appointments",verifyToken,appointment.getAppointmentsByPatientId)
router.get("/find-places",verifyToken,patientController.findPlaces)
router.post("/upload-medical-reports",verifyToken,upload.array("reports", 5),patientController.uploadMedicalReports)
router.post("/analyze-document",verifyToken,upload.single("file"),patientController.analyzeDocument)
router.get("/find-blood-banks",verifyToken,patientController.findBloodBanks)
router.post("/need-blood",verifyToken,patientController.needBlood)
router.get("/get-blood",verifyToken,patientController.getBloodRequests)
router.post("/speech-to-text",verifyToken,upload.single("audio"),patientController.speechToText)
router.post("/process-text",verifyToken,patientController.processText)
router.post("/medical-response",verifyToken,patientController.medicalresponse)
router.post('/vision-analyze',verifyToken,upload.single("image"),patientController.visionanalyze)
export default router;