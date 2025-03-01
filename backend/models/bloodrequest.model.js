import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";


const BloodrequestSchema = new mongoose.Schema({
    bloodRequestId: { type: String, default: uuidv4, unique: true },
    patientId: { type: String, required: true },
    name: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    city: { type: String, required: true },
    bloodBank: { type: String, required: true },
    
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    createdAt: { type: Date, default: Date.now },

});

const BloodDonate = mongoose.model("BloodDonate", BloodrequestSchema);
export default BloodDonate;
