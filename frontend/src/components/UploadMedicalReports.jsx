/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { axiosInstance } from "../axiosinstance";

const UploadMedicalReports = ({ patientId, condition }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files)); // Convert FileList to Array
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setMessage("Please select files to upload.");
            return;
        }
        const formData = new FormData();
        formData.append("patientId", patientId);
        formData.append("condition", condition);
        files.forEach((file) => formData.append("reports", file)); // Append all files

        setUploading(true);
        try {
            const response = await axiosInstance.post("/patient/upload-medical-reports", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage(response.data.message);
            setFiles([]); // Clear files after successful upload
        } catch (error) {
            console.error("Upload error:", error);
            setMessage("Failed to upload reports. Please try again.");
        }
        setUploading(false);
    };

    return (
        <div className="p-4 border rounded-md">
            <h3 className="text-lg font-bold">Upload Medical Reports</h3>
            <input type="file" multiple onChange={handleFileChange} className="mt-2" />
            <button 
                onClick={handleUpload} 
                disabled={uploading}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>
            {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </div>
    );
};

export default UploadMedicalReports;
