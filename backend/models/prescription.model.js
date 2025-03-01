import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";  // Import UUID generator

const PrescriptionSchema = new mongoose.Schema({
    prescriptionId: { type: String, default: uuidv4, unique: true },  // Auto-generate UUID
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    medicines: { type: String, required: true },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Prescription = mongoose.model("Prescription", PrescriptionSchema);
export default Prescription;
