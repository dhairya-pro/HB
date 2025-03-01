import Doctor from "../models/doctor.model.js";
import { sendEmail } from '../services/email.services.js'; 

// ✅ Doctor Signup Controller
export const doctorSignup = async (req, res) => {
    try {
        const { name, specialization, experience, contact, email, password, availableTimings } = req.body;

        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: "Email already in use!" });
        }

        // Hash password before saving
        const hashedPassword = await Doctor.hashPassword(password);
         if (!hashedPassword) {
            return res.status(500).json({ message: "Error in hashing password!" });    
         } 
        // Create a new doctor
        const newDoctor = new Doctor({
            name,
            specialization,
            experience,
            contact,
            email,
            password: hashedPassword,
            availableTimings,
            role:"doctor"
        });
        if (!newDoctor) {
            return res.status(500).json({ message: "Error in creating doctor!" });
        }
        await newDoctor.save();
           //email service
        await sendEmail(
            email,
            "Welcome to AI Health Assistant",
            `Hello ${name},\n\nWelcome to AI Health Assistant! Your account has been successfully created.\n\nStay healthy!`
        );
        // Generate JWT Token using the model method
        const token = newDoctor.generateJWT();
        if (!token) {
            return res.status(500).json({ message: "Error in generating JWT!" });
        }
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        return res.status(201).json({ message: "Doctor registered successfully!", doctor: newDoctor });
    } catch (error) {
        return res.status(500).json({ message: "Error in signup", error: error.message });
    }
};

// ✅ Doctor Login Controller
export const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if doctor exists
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        // Validate password using the model method
        const isMatch = await doctor.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        // Generate JWT Token using the model method
        const token = doctor.generateJWT();
        if (!token) {
            return res.status(500).json({ message: "Error in generating JWT!" });
        }
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        return res.status(200).json({ message: "Login successful!", doctor: doctor });
   

    } catch (error) {
        return res.status(500).json({ message: "Error in login", error: error.message });
    }
};


// ✅ Doctor Profile Controller

export const getDoctorDashboard = async (req, res) => {  
  console.log("Doctor Profile Controller");
    
  res.status(200).json({ message: "doctor Dashboard",doctor: req.doctor });
}
;

export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ role: "doctor" });
        if (!doctors) {
            return res.status(404).json({ message: "No doctors found!" });
        }
        return res.status(200).json(doctors);
    } catch (error) {
        return res.status(500).json({ message: "Error in fetching doctors", error: error.message });
    }
}
