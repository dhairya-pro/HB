import Patient from '../models/patient.model.js' // Import Patient Schema
import { sendEmail } from '../services/email.services.js'; // Import Email Service
import axios from 'axios'; // Import Axios
import BloodDonate from '../models/bloodrequest.model.js';
import fs from "fs";
import FormData from "form-data";
import { SpeechClient } from "@google-cloud/speech";
import Groq from "groq-sdk"; // Import Groq SDK
const speechClient = new SpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Google Cloud Key
  });
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY, // Set your Groq API key in .env
  });
  



// ✅ Patient Signup Controller
export const patientSignup = async (req, res) => {
    try {
        const { name, age, gender, contact, email, password } = req.body;

        // Check if patient already exists
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
          }
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ message: "patient already existed" });
        }

        // Hash password before saving
        const hashedPassword = await Patient.hashPassword(password);
        if (!hashedPassword) {
            return res.status(400).json({ error: "Error in hashing password" });
            }
        //0reate a new patient
        const newPatient = new Patient({
            name,
            age,
            gender,
            contact,
            email,
            password: hashedPassword,
            role:"patient"
        });
        if (!newPatient) {
            return res.status(400).json({ error: "Error in creating new patient" });
        }   
        await newPatient.save();
        //email service
        await sendEmail(
            email,
            "Welcome to AI Health Assistant",
            `Hello ${name},\n\nWelcome to AI Health Assistant! Your account has been successfully created.\n\nStay healthy!`
        );
        // Generate JWT Token
        const token =await newPatient.generateJWT();
        if (!token) {
            return res.status(400).json({ error: "Error in generating token" });
        }
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        return res.status(200).json({ message: "Login successful!", patient: newPatient });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error in signup", error: error.message });
    }
};

// ✅ Patient Login Controller
export const patientLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if patient exists
        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        // Validate password
        const isMatch = await patient.isValidPassword(password);
        if (!isMatch) {
            console.log("Invalid password");
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        // Generate JWT Token
        const token = await patient.generateJWT();
        if (!token) {
            return res.status(500).json({ message: "Error in generating JWT!" });
        }
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        return res.status(200).json({ message: "Login successful!",patient:patient}); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error in login", error: error.message });
    }
};


export const getPatientDashboard = async (req, res) => {
     console.log("Patient Dashboard");
    res.status(200).json({ message: "Patient Dashboard", patient: req.patient });
};



export const findPlaces = async (req, res) => {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
   

    const { city, type } = req.query;
    if (!city || !type) {
        return res.status(400).json({ error: "City and type are required." });
    }

    try {
        const url = `https://api.gomaps.pro/maps/api/place/textsearch/json`;

        const response = await axios.get(url, {
            params: {
                query: `${type} in ${city}`,
                key: API_KEY
            }
        });
        
        if (!response.data.results) {
            return res.status(404).json({ error: "No places found." });
        }
        
        const places = response.data.results.map(place => ({
            name: place.name,
            address: place.formatted_address,
            rating: place.rating || "N/A"
        }));
   
        res.json({ places });
    } catch (error) {
        console.error("❌ API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch data", details: error.message });
    }
};

export const findBloodBanks = async (req, res) => {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const { city } = req.query;
    if (!city) {
        return res.status(400).json({ error: "City is required." });
    }

    try {
        const url = `https://api.gomaps.pro/maps/api/place/textsearch/json`;

        const response = await axios.get(url, {
            params: {
                query: `blood bank in ${city}`,
                key: API_KEY
            }
        });
        
        if (!response.data.results) {
            return res.status(404).json({ error: "No blood banks found." });
        }
        
        const bloodBanks = response.data.results.map(bank => ({
            name: bank.name,
            address: bank.formatted_address,
            contact: bank.formatted_phone_number || "N/A",
            bloodTypesAvailable: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        }));
   
        res.json(bloodBanks);
    } catch (error) {
        console.error("❌ API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch data", details: error.message });
    }
}

export const uploadMedicalReports = async (req, res) => {
    try {
        const { patientId, condition } = req.body;
        console.log(patientId, condition);
        if (!patientId || !condition) {
            return res.status(400).json({ message: "Patient ID and condition are required" });
        }
        const patient = await Patient.findOne({ patientId });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const reports = req.files.map(file => ({
            filename: file.originalname,
            filePath: file.path,
            uploadedAt: new Date()
        }));

        // Find existing condition or create a new one
        let medicalEntry = patient.medicalHistory.find(entry => entry.condition === condition);
        if (!medicalEntry) {
            medicalEntry = { condition, reports: [] };
            patient.medicalHistory.push(medicalEntry);
        }

        // Add new reports
        medicalEntry.reports.push(...reports);

        await patient.save();
        res.status(200).json({ message: "Reports uploaded successfully", reports });
    } catch (error) {
        console.error("Error uploading reports:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

};


export const needBlood = async (req, res) => { 
    try {
        const { name, bloodGroup, city, bloodBank, patientId } = req.body;
        if (!name || !bloodGroup || !city || !bloodBank || !patientId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newRequest = new BloodDonate({
            name,
            bloodGroup,
            city,
            bloodBank,
            patientId,
        });
        if (!newRequest) {
            return res.status(400).json({ message: "Error in creating new request" });
        }
        await newRequest.save();
        res.status(201).json({ message: "Blood request submitted successfully!" });
        
        const patient=await Patient
        .findOne({ patientId })
        .select("name email")
        .lean();
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        const { email, name: patientName } = patient;
        
        await sendEmail(
            email,
            "Thnx for joining hands with us", 
            `Hello ${patientName},your request for donating blood is successfully submitted.`
        );
    } catch (error) {
        console.error("Error submitting blood request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
 };


export const getBloodRequests = async (req, res) => {
    try {
        const { patientId } = req.query;
        if (!patientId) {
            return res.status(400).json({ message: "Patient ID is required" });
        }
        const requests = await BloodDonate.find({ patientId });
        if (!requests) {
            return res.status(404).json({ message: "No requests found" });
        }
       res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const analyzeDocument = async (req, res) => {
    try {
        const filePath = req.file.path; // Assuming multer stores file at this path

        // Create a FormData object
        const formData = new FormData();
        formData.append('image', fs.createReadStream(filePath)); // Use createReadStream

        // Make API call
        const response = await axios.post(
            'https://api.va.landing.ai/v1/tools/agentic-document-analysis',
            formData,
            {
                headers: {
                    ...formData.getHeaders(), // Ensure headers are properly set
                    Authorization: `Basic ${process.env.LANDING_AI_API_KEY}`, // Use environment variables for API keys
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.log('Error analyzing document:', error);
        console.error('Error analyzing document:', error);
        res.status(500).json({ error: 'Failed to analyze the document' });
    }
};


export const speechToText = async (req, res) => {
    try {
        const audioFile = fs.readFileSync(req.file.path);
        const audio = { content: audioFile.toString("base64") };
    
        // Speech-to-Text Config
        const config = {
            encoding: "WEBM_OPUS", 
            languageCode: "gu-IN",
            alternativeLanguageCodes: ["hi-IN"],
        };
        const [response] = await speechClient.recognize({ config, audio });
        fs.unlinkSync(req.file.path);
    
        const transcript = response.results
          .map((result) => result.alternatives[0].transcript)
          .join("\n");
    
        const detectedLanguage = response.results[0]?.languageCode || "gu-IN";
    
        // Generate AI response using Groq API
        const groqResponse = await groq.chat.completions.create({
          model: "deepseek-r1-distill-llama-70b", // Use the correct model name
          messages: [
            {
              role: "system",
              content: `You are an AI health assistant.you should not give reply of text which is not related to medical .give response for the text which is related to medical .In response for unappropriate text give response not found Reply in ${
                detectedLanguage === "hi-IN" ? "Hindi" : "Gujarati"
              }.`,
            },
            {
              role: "user",
              content: transcript,
            },
          ],
        });
    
        res.json({
          transcript,
          detectedLanguage,
          response: groqResponse.choices[0].message.content,
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to process request." });
      }

};

const detectLanguage = (text) => {
    const hindiChars = /[\u0900-\u097F]/;
    const gujaratiChars = /[\u0A80-\u0AFF]/;
  
    if (hindiChars.test(text)) return "hindi";
    if (gujaratiChars.test(text)) return "gujarati";
    return "english";
  };
  
  
export const processText = async (req, res) => {
    const userText = req.body.text;
    if (!userText) return res.status(400).json({ reply: "No text provided" });
  
    const detectedLang = detectLanguage(userText);
  
    try {

        const groqResponse = await groq.chat.completions.create({
            model: "deepseek-r1-distill-llama-70b",
            messages: [
              {
                role: "system",
                content: `You are an AI health assistant.you should not give reply of text which is not related to medical .give response for the text which is related to medical .In response for unappropriate text give response not found Reply in ${
                  detectedLang} === "hi-IN" ? "Hindi" : "Gujarati"
                }.`,
              },
              {
                role: "user",
                content:  userText,
              },
            ],
          });
  
      const aiReply = groqResponse.choices[0].message.content || "No response from AI";
  
      res.json({ reply: aiReply });
    } catch (error) {
      console.error("Error fetching AI response:", error);
      res.status(500).json({ reply: "Error fetching AI response" });
    }
};


export const medicalresponse = async (req, res) => {
    const { medicalText, language } = req.body;
    
    if (!medicalText) {
        return res.status(400).json({ reply: "Error: medical text required" });
    }
    
    if (!language) {
        return res.status(400).json({ reply: "Error: language parameter required" });
    }
    
    const prompt = `Provide a medical analysis based on the following data in ${language}:

"${medicalText}"

Respond in a professional medical tone using the requested language.`;
    
    try {
        const groqResponse = await groq.chat.completions.create({
            model: "deepseek-r1-distill-llama-70b",
            messages: [
                {
                    role: "system",
                    content: `You are an AI health assistant. You should only reply to medical-related text. If the text is not related to medical information, respond with "Not Found." Ensure your response is in the requested language: ${language}.`,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        
        const Reply = groqResponse.choices?.[0]?.message?.content || "No response";
        res.json({ reply: Reply });
    } catch (error) {
        console.error("Error fetching AI response:", error.response?.data || error.message);
        res.status(500).json({ reply: "Error fetching AI response" });
    }
};
