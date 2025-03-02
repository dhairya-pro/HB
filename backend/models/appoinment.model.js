import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const appointmentSchema = new mongoose.Schema({
    appointmentId: { type: String, default: uuidv4, unique: true },
    patientname: { type: String, required: true },
    doctorname: { type: String, required: true },
    patientId: { type: String, required: true },
    doctorId: {  type: String, required: true  },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // Example: "10:30 AM"
    status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
    meetLink : {type : String},
    patientEmail : {type :String},
    doctorEmail: {type : String},


});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
