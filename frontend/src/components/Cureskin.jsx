import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { useLanguage } from "../../LanguageContext";// Import your language context
import Navbar from "../ui/Navbar";

const translations = {
  en: {
    title: "Skin Disease Detector",
    upload: "Upload an Image",
    capture: "Capture Image",
    detect: "Detect",
    analyzing: "Analyzing...",
    resultTitle: "Detection Result",
    bodyPart: "Body Part",
    imageQuality: "Image Quality",
    imageType: "Image Type",
    conditions: "Possible Conditions",
    error: "Error detecting skin disease",
  },
  hi: {
    title: "त्वचा रोग पहचानकर्ता",
    upload: "चित्र अपलोड करें",
    capture: "कैमरे से तस्वीर लें",
    detect: "जांच करें",
    analyzing: "विश्लेषण हो रहा है...",
    resultTitle: "परिणाम",
    bodyPart: "शरीर का हिस्सा",
    imageQuality: "छवि गुणवत्ता",
    imageType: "छवि प्रकार",
    conditions: "संभावित स्थितियाँ",
    error: "त्वचा रोग पहचानने में त्रुटि",
  },
  gu: {
    title: "ત્વચા રોગ ડિટેક્ટર",
    upload: "છબી અપલોડ કરો",
    capture: "કૅમેરાથી છબી લેવી",
    detect: "શોધો",
    analyzing: "વિશ્લેષણ ચાલી રહ્યું છે...",
    resultTitle: "ફળাফল",
    bodyPart: "શરીરના ભાગ",
    imageQuality: "છબી ગુણવત્તા",
    imageType: "છબી પ્રકાર",
    conditions: "શક્ય ત્વચા પરિસ્થિતિઓ",
    error: "ત્વચા રોગ શોધવામાં ક્ષતિ",
  },
};

const Cureskin = () => {
  const { language } = useLanguage() 
  const t = translations[language] || translations["en"]; 

  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setImageSrc(null);
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!file && !imageSrc) {
      alert(t.upload);
      return;
    }

    setLoading(true);
    const formData = new FormData();

    if (file) {
      formData.append("image", file);
    } else {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      formData.append("image", blob, "webcam.jpg");
    }

    try {
      const response = await axios.post(
        "https://detect-skin-disease1.p.rapidapi.com/skin-disease",
        formData,
        {
          headers: {
            "x-rapidapi-key": "13dd8d6f56msh69cdd6eb386766ep1eb6b5jsn3fe1fcbbebaf", // Replace with actual key
            "x-rapidapi-host": "detect-skin-disease1.p.rapidapi.com",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-700 text-center mb-3">
          {t.title}
        </h2>

        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />

          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-64 h-48 border rounded" />
          <button
            onClick={capture}
            className="px-4 py-2 bg-teal-500 text-white rounded"
          >
            {t.capture}
          </button>

          {imageSrc && <img src={imageSrc} alt="Captured" className="w-40 rounded border mt-2" />}
          {file && <p className="text-sm text-gray-500">{file.name}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 px-4 py-2 bg-teal-500 text-white rounded"
        >
          {loading ? t.analyzing : t.detect}
        </button>

        {/* Display Results */}
        {result && (
          <div className="mt-6 p-4 bg-gray-200 rounded shadow">
            <h3 className="font-semibold text-lg text-gray-700">{t.resultTitle}</h3>
            <div className="mt-2">
              <p><strong>🦵 {t.bodyPart}:</strong> {result.bodyPart}</p>
              <p><strong>📸 {t.imageQuality}:</strong> {result.imageQuality.toFixed(2)}</p>
              <p><strong>🖼️ {t.imageType}:</strong> {result.imageType.replace("_", " ")}</p>
            </div>

            <h4 className="mt-4 font-semibold text-gray-700">🔍 {t.conditions}</h4>
            <div className="mt-2">
              {Object.entries(result.results).map(([condition, probability]) => (
                <div key={condition} className="mb-2">
                  <p className="capitalize text-gray-800 font-medium">
                    {condition.replace("_", " ")} ({(probability * 100).toFixed(2)}%)
                  </p>
                  <div className="w-full bg-gray-300 rounded h-3">
                    <div
                      className="h-3 bg-blue-500 rounded"
                      style={{ width: `${probability * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Cureskin;
