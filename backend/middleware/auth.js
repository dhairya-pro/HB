import jwt from "jsonwebtoken";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = req.cookies.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

        if (!token) {
            return res.status(401).json({ message: "Authorization denied, no token provided" });
        }// Extract token from header

        if (!token) return res.status(401).json({ message: "Access Denied! No token provided." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded; // Attach user data to request
        
        next(); // Proceed to the next middleware
    } catch (error) {
        res.status(403).json({ message: "Invalid Token!" });
    }
};

// Restrict to only patients
export const patientOnly = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ email: req.user.email });
        if (!patient) return res.status(403).json({ message: "Access Denied! Only Patients allowed." });

        req.patient = patient; // Attach patient data
        next();
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Restrict to only doctors
export const doctorOnly = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ email: req.user.email });
        if (!doctor) return res.status(403).json({ message: "Access Denied! Only Doctors allowed." });

        req.doctor = doctor; // Attach doctor data
        next();
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
