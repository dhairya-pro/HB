import * as doctorController from '../controllers/doctor.controller.js';
import express from 'express';
import { verifyToken, doctorOnly } from '../middleware/auth.js';
import { getDoctorDashboard } from '../controllers/doctor.controller.js';
import * as appointment from '../controllers/appointment.controller.js'
const router = express.Router();

// ✅ Doctor Signup Route
router.post('/signup', doctorController.doctorSignup);


// ✅ Doctor Login Route
router.post('/login', doctorController.doctorLogin);
router.get("/dashboard", verifyToken, doctorOnly, getDoctorDashboard);
router.get("/getdoctors",verifyToken, doctorController.getDoctors);
router.get("/getappointments",verifyToken, appointment.getAppointmentsbydoctorid);
router.put("/updateStatus",verifyToken, appointment.updateStatus);

export default router;