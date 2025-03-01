import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../LanguageContext";
import { axiosInstance } from "../axiosinstance";
import { useAuth } from "../components/AuthContext";

const translations = {
  en: {
    welcomeText: "Welcome to HealthBridge!",
    emailPlaceholder: "Enter your Email",
    passwordPlaceholder: "Enter your Password",
    login: "Log In",
    signupPrompt: "Don't have an account?",
    signup: "Sign Up here",
    error: "Invalid credentials, please try again.",
    back: "Back"
  },
  gu: {
    welcomeText: "HealthBridge માં આપનું સ્વાગત છે!",
    emailPlaceholder: "તમારું ઈમેલ દાખલ કરો",
    passwordPlaceholder: "તમારું પાસવર્ડ દાખલ કરો",
    login: "પ્રવેશ કરો",
    signupPrompt: "ખાતું નથી?",
    signup: "અહીં સાઇન અપ કરો",
    error: "અયોગ્ય લૉગિન વિગતો, ફરી પ્રયાસ કરો.",
    back: "પાછા"
  },
  hi: {
    welcomeText: "HealthBridge में आपका स्वागत है!",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    login: "लॉग इन करें",
    signupPrompt: "खाता नहीं है?",
    signup: "यहां साइन अप करें",
    error: "अमान्य क्रेडेंशियल्स, कृपया पुनः प्रयास करें।",
    back: "वापस"
  },
};

const PatientLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/patient/login", formData);
      if (response.status === 200) {
        login(response.data);
        console.log(response.data);
        navigate("/pdashboard");
      } else {
        setError(t.error);
      }
    } catch (err) {
      setError(t.error);
    }
  };

  const handleBack = () => {
    navigate('/healthportal');
  };

  return (
    <div className="flex min-h-screen bg-teal-50">
      {/* Left side with logo */}
      <div className="relative flex flex-col items-center justify-center w-1/2 p-8">
        <button 
          onClick={handleBack} 
          className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-teal-600"
        >
          <span>← {t.back}</span>
        </button>
        
        <div className="mb-4 w-48">
          <img 
            src="/api/placeholder/200/200" 
            alt="HealthBridge Logo" 
            className="w-full"
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">HEALTHBRIDGE</h2>
          <p className="text-sm text-gray-500">HEALTHCARE SOLUTIONS</p>
        </div>
      </div>

      {/* Right side with form */}
      <div className="flex flex-col justify-center w-1/2 p-8">
        <h1 className="mb-8 text-3xl font-bold text-teal-500">
          {t.welcomeText}
        </h1>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              {t.emailPlaceholder}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              {t.passwordPlaceholder}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 text-white transition duration-300 bg-teal-500 rounded-lg w-32 hover:bg-teal-600"
            >
              {t.login}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-600">{t.signupPrompt}</span>{" "}
          <Link to="/psignup" className="ml-1 font-medium text-teal-600">
            {t.signup}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;