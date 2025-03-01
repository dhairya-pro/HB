import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const doctorSchema = new mongoose.Schema({
    doctorId: { type: String, default: uuidv4, unique: true }, // Unique Doctor ID
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    contact: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true,
        minLength: [6, 'Email must be at least 6 characters long'],
        maxLength: [64, 'Email must be at most 64 characters long'],
     },
    password: { type: String, required: true },
    availableTimings: [
        {
            day: String, // e.g., Monday
            startTime: String, // e.g., "10:00 AM"
            endTime: String, // e.g., "5:00 PM"
        }
    ],
   appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
    createdAt: { type: Date, default: Date.now },
    role: { type: String, default: "doctor" },

});


doctorSchema.methods.generateJWT = function(){
    return jwt.sign({email: this.email}, process.env.JWT_SECRET);
}
doctorSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}
doctorSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}


const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
