import * as doctorController from '../controllers/doctor.controller.js';
import express from 'express';
import { verifyToken, doctorOnly } from '../middleware/auth.js';
import { getDoctorDashboard } from '../controllers/doctor.controller.js';
import * as appointment from '../controllers/appointment.controller.js'
const router = express.Router();

router.post('/signup', doctorController.doctorSignup);
router.post('/login', doctorController.doctorLogin);
router.get("/dashboard", verifyToken, doctorOnly, getDoctorDashboard);
router.get("/getdoctors",verifyToken, doctorController.getDoctors);
router.get("/getappointments",verifyToken, appointment.getAppointmentsbydoctorid);
router.put("/updateStatus",verifyToken, appointment.updateStatus);
router.post("/savePrescription",verifyToken,doctorController.Prescriptionadd)
router.post("/Schedule-meeting",verifyToken,doctorController.meetingScheduler)
export default router;