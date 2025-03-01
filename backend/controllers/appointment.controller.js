
import Appointment from '../models/appoinment.model.js'
import Doctor from '../models/doctor.model.js'
import Patient from '../models/patient.model.js'
import { sendEmail } from '../services/email.services.js'


export const addappointment = async (req, res) => {
    try {
        const { patientId, patientname, doctorname, doctorId, date, time, status } = req.body;

        const appointment = new Appointment({
            patientId,
            patientname,
            doctorname,
            doctorId,
            date,
            time,
            status
        });

        if (!appointment) {
            console.log("Error in adding appointment");
            return res.status(400).json({ message: "Failed to add appointment" });
        }

        await appointment.save(); // Wait for the appointment to be saved

        // Fixing the Patient query
        const patient = await Patient.findOne({ patientId });

        if (!patient) {
            console.log("Error in finding email of patient");
            return res.status(404).json({ message: "Patient not found" });
        }

        const email = patient.email;

        await sendEmail(
            email,
            "Thanks for booking your slot",
            `Your slot has been successfully booked on ${date} at ${time}!`
        );

        return res.status(201).json({ message: "Appointment added and email sent successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getAppointmentsByPatientId = async (req, res) => {
    try {
        const { patientId } = req.body; // Extract patientId from request body

        if (!patientId) {
            return res.status(400).json({ message: "Patient ID is required" });
        }

        const appointments = await Appointment.find({ patientId });

        if (!appointments.length) {
            return res.status(404).json({ message: "No appointments found" });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error("❌ Error fetching data:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || "Failed to fetch data" });
    }
};




export const getAppointmentsbydoctorid = async (req, res) => {
    try {
        const{doctorID} = req.query;
        const doctorId = doctorID;
        if (!doctorId) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }
        const appointments = await Appointment.find({ doctorId });
        if (!appointments) {
            return res.status(404).json({ message: "No appointments found!" });
        }
    
        return res.status(200).json(appointments);
    } catch (error) {
        return res.status(500).json({ message: "Error in fetching appointments", error: error.message });
    }
}

export const updateStatus = async (req, res) => {   
    try {
        const { appointmentId } = req.body;
        const appointment = await Appointment.findOne
        ({ appointmentId });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found!" });
        }
        appointment.status = "Completed";
        await appointment.save();
        return res.status(200).json({ message: "Appointment status updated successfully!" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error in updating status", error: error.message });
    }
};


