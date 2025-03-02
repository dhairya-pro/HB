import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { axiosInstance } from "../axiosinstance";
import Navbar from "../ui/Navbar";

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);

  // Capture Image from Webcam
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
    }
  };

  // Upload Image for Analysis
  const handleUpload = async () => {
    if (!image) {
      alert("Please capture an image first!");
      return;
    }

    const formData = new FormData();
    const blob = await fetch(image).then((res) => res.blob());
    formData.append("image", blob, "webcam-image.jpg");

    try {
      setLoading(true);
      const response = await axiosInstance.post("/patient/vision-analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h2 className="text-center text-2xl font-bold my-4">AI Health Scanner</h2>

      {/* Webcam Component */}
      <div className="flex justify-center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="border-2 rounded-lg"
        />
      </div>

      {/* Capture & Upload Buttons */}
      <div className="flex justify-center mt-4">
        <button 
          onClick={captureImage} 
          className="bg-blue-500 text-white px-4 py-2 rounded mx-2 hover:bg-blue-700 transition"
        >
          Capture Image
        </button>
        <button 
          onClick={handleUpload} 
          className="bg-green-500 text-white px-4 py-2 rounded mx-2 hover:bg-green-700 transition" 
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </div>

      {/* Display Captured Image */}
      {image && (
        <div className="flex justify-center mt-4">
          <img src={image} alt="Captured" className="border rounded-lg w-64" />
        </div>
      )}

      {/* Analysis Results */}
      {result && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100 shadow-lg">
          <h3 className="text-lg font-bold text-center mb-3">Analysis Results:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>😃 Joy:</strong> {result.analysis.joy}</p>
            <p><strong>😡 Anger:</strong> {result.analysis.anger}</p>
            <p><strong>😢 Sorrow:</strong> {result.analysis.sorrow}</p>
            <p><strong>😲 Surprise:</strong> {result.analysis.surprise}</p>
            <p><strong>🔅 Under-Exposed:</strong> {result.analysis.underExposed}</p>
            <p><strong>🔍 Blurred:</strong> {result.analysis.blurred}</p>
            <p><strong>🤕 Head Tilt Angle:</strong> {result.analysis.headTilt}°</p>
          </div>

          {/* Health Recommendations */}
          {result.healthRecommendations.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mt-2 text-center text-red-600">🩺 Health Recommendations:</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {result.healthRecommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadImage;
