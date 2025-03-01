import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../language//i18n"
import { useLanguage } from "../../LanguageContext";
import logo from "../assets/healthbridgelogo.png";
const HealthPortal = () => {
  const { t, i18n } = useTranslation(); // Hook to access translations
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const { setLanguage } = useLanguage();
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowAuthOptions(true);
  };

  const handleBack = () => {
    setSelectedRole(null);
    setShowAuthOptions(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  // Role Selection Component
  const RoleSelection = () => (
    <div className="max-w-2xl flex flex-col items-center justify-center">
      <img src={logo} alt="HealthBridge Logo" className="mb-6 w-48 h-48" />
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">{t("welcome")}</h1>
      <p className="text-xl mb-8 text-center text-gray-600">{t("selectRole")}</p>
      <div className="flex gap-4 mt-2">
        <button
          onClick={() => handleRoleSelect("doctor")}
          className="px-8 py-3 rounded-full bg-teal-500 text-white font-medium hover:bg-teal-600 transition duration-300"
        >
          {t("doctor")}
        </button>
        <button
          onClick={() => handleRoleSelect("patient")}
          className="px-8 py-3 rounded-full bg-teal-500 text-white font-medium hover:bg-teal-600 transition duration-300"
        >
          {t("patient")}
        </button>
      </div>
    </div>
  );

  // Authentication Options Component
  const AuthOptions = () => (
    <div className="flex flex-col items-center justify-center">
      <img src={logo} alt="HealthBridge Logo" className="mb-6 w-48 h-48" />
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        {selectedRole === "doctor" ? t("doctorPortal") : t("patientPortal")}
      </h1>
      <p className="text-xl mb-8 text-center text-gray-600">{t("signUpPrompt")}</p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          to={selectedRole === "doctor" ? "/dlogin" : "/plogin"}
          className="px-8 py-3 rounded-full bg-teal-500 text-white font-medium hover:bg-teal-600 transition duration-300 w-full text-center"
        >
          {t("login")}
        </Link>
        <Link
          to={selectedRole === "doctor" ? "/dsignup" : "/psignup"}
          className="px-8 py-3 rounded-full border-2 border-teal-500 text-teal-500 font-medium hover:bg-teal-50 transition duration-300 w-full text-center"
        >
          {t("signUp")}
        </Link>
        <button onClick={handleBack} className="mt-4 text-teal-600 hover:text-teal-800 font-medium">
          {t("back")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex flex-col items-center justify-center p-4">
      <div className="bg-white h-{70vh} rounded-lg shadow-lg p-8 md:p-12 w-full max-w-xl">
        {showAuthOptions ? <AuthOptions /> : <RoleSelection />}
      </div>
      {/* Language Selection Dropdown */}
      <div className="absolute top-4 right-4">
        <select
          onChange={(e) => changeLanguage(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="gu">ગુજરાતી</option>
        </select>
      </div>
    </div>
  );
};

export default HealthPortal;
