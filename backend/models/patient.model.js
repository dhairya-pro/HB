import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'



const patientSchema = new mongoose.Schema({
    patientId: { type: String, default: uuidv4, unique: true }, // Unique Patient ID
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    contact: { type: String, unique: true, required: true },
    email: {
        type: String, unique: true, required: true
        , minLength: [6, 'Email must be at least 6 characters long'],
        maxLength: [64, 'Email must be at most 64 characters long'],
    },
    password: { type: String, required: true },
    medicalHistory: [
        {
            condition: { type: String, default: "fever and cough" },
            diagnosisDate: { type: Date, default: Date.now },
            medications: [String],
            doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
            reports: [{ 
                filename: String, 
                filePath: String, 
                uploadedAt: { type: Date, default: Date.now } 
            }]
        }
    ],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }], 
    createdAt: { type: Date, default: Date.now },
    role: { type: String, default: "patient" }
});


patientSchema.methods.generateJWT = function(){
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
    return jwt.sign( { patientId: this._id, email: this.email }, process.env.JWT_SECRET);
}
patientSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}
patientSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;


