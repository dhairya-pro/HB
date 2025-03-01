import React, { useState } from "react";
import { axiosInstance } from "../axiosinstance";
 

const DocumentAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [MedicalResponse, setmedicalResponse] = useState(null); 

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please upload a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.post("/patient/analyze-document", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setResult(response.data);
            const medicalText = extractMedicalText(response.data);
            if (medicalText) {
                fetchGroqAiResponse(medicalText);
            }
        } catch (error) {
            console.error("Error analyzing document:", error);
            alert("Failed to analyze document.");
        }
    };

    // Extract meaningful medical text
    const extractMedicalText = (data) => {
        if (!data || !data.data.chunks) return "";
        return data.data.chunks.map(chunk => cleanText(chunk.text)).join(" ");
    };

    const fetchGroqAiResponse = async (medicalText) => {
        try {
            const response = await axiosInstance.post("/patient/medical-response", { medicalText });
    
          
            const cleanedResponse = response.data.reply.replace(/<think>.*?<\/think>/gs, "").trim();
    
            setmedicalResponse(cleanedResponse);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setmedicalResponse("Failed to fetch medical insights.");
        }
    };
    
    

    const cleanText = (text) => {
        if (!text) return "";
        text = text.replace(/<!--[\s\S]*?-->/g, "");
        text = text.replace(/\[.*?\]/g, "");
        text = text.replace(/[*]+/g, "");
        text = text.replace(/\(.*?\)/g, "");
        text = text.replace(/\{.*?\}/g, "");
        text = text.replace(/<.*?>/g, "");
        text = text.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g, "");
        text = text.replace(/\s+/g, " ").trim();
        return text;
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Upload Document for Analysis</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="w-full p-2 border rounded-lg"
                    onChange={handleFileChange}
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
                    Analyze Document
                </button>
            </form>

            {result && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="font-semibold">Analysis Result:</h3>
                    <ul className="list-disc pl-5">
                        {result.data.chunks.map((chunk, index) => (
                            <li key={index} className="text-sm">
                                {cleanText(chunk.text)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {MedicalResponse && (
                <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                    <h3 className="font-semibold">Medical Insights:</h3>
                    <p className="text-sm">{MedicalResponse}</p>
                </div>
            )}
        </div>
    );
};

export default DocumentAnalyzer;
