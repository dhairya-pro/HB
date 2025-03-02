import React, { useState } from "react";
import { axiosInstance } from "../axiosinstance";

const DocumentAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [MedicalResponse, setmedicalResponse] = useState(null);
    const [language, setLanguage] = useState("en"); // Default to English

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
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
                fetchGroqAiResponse(medicalText, language);
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

    const fetchGroqAiResponse = async (medicalText, language) => {
        try {
            console.log("Sending to API:", { medicalText, language });

            const response = await axiosInstance.post("/patient/medical-response", { medicalText, language });

            console.log("Raw API Response:", response);
            console.log("API Response Data:", response.data);

            if (!response.data || !response.data.reply) {
                console.error("Invalid API response format:", response.data);
                setmedicalResponse("No valid medical insights received.");
                return;
            }

            const cleanedResponse = response.data.reply.replace(/<think>.*?<\/think>/gs, "").trim();
            const formattedResponse = cleanedResponse
        .split("\n") // Split by line breaks
        .filter(line => line.trim() !== "") // Remove empty lines
        .map((line, index) => `${index + 1}. ${line.trim()}`) // Add numbering
        .join("\n");
            setmedicalResponse(formattedResponse);
            console.log("Updated Medical Response:", cleanedResponse);

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

                {/* Language Selection Dropdown */}
                <select 
                    className="w-full p-2 border rounded-lg" 
                    value={language} 
                    onChange={handleLanguageChange}
                >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="gu">Gujarati</option>
                </select>

                <button type="submit" className="w-full bg-teal-500 text-white py-2 rounded-lg">
                    Analyze Document
                </button>
            </form>

            {/* {result && (
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
            )} */}

{MedicalResponse && (
    <div className="mt-6 p-4 bg-blue-100 rounded-lg">
        <h3 className="font-semibold mb-2">Medical Insights ({language.toUpperCase()}):</h3>
        <div className="text-sm">
            {MedicalResponse.split("\n").map((line, index) => {
                // Remove unintended numbering
                const cleanedLine = line.replace(/^\d+\.\s*/, "");

                // If the line contains bold markdown-style text, wrap it in <strong>
                if (cleanedLine.includes("**")) {
                    return (
                        <p key={index} className="mt-1">
                            <span dangerouslySetInnerHTML={{ __html: cleanedLine.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                        </p>
                    );
                }

                // If it's a numbered point (not bold), render it as a list item
                return cleanedLine.match(/^\d+\./) ? (
                    <li key={index} className="ml-5 list-decimal">{cleanedLine}</li>
                ) : (
                    <p key={index} className="mt-1">{cleanedLine}</p>
                );
            })}
        </div>
    </div>
)}


        </div>
    );
};

export default DocumentAnalyzer;
