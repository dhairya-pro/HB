import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../language//i18n";
import { useLanguage } from "../../LanguageContext";
import logo from "../assets/healthbridgelogo.png";

const HealthPortal = () => {
  const { t, i18n } = useTranslation();
  const { setLanguage } = useLanguage();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex flex-col items-center justify-center p-4">
      <div className="bg-white h-{70vh} rounded-lg shadow-lg p-2 md:p-12 w-full max-w-3xl flex flex-col items-center">
        <img src={logo} alt="HealthBridge Logo" className="w-72 h-72" />
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">{t("welcome")}</h1>
        <p className="text-xl mb-6 text-center text-gray-600">{t("selectRole")}</p>
        <div className="flex gap-4 mt-1">
          <Link
            to="/dlogin"
            className="px-8 py-3 rounded-full bg-teal-500 text-white font-medium hover:bg-teal-600 transition duration-300"
          >
            {t("doctor")}
          </Link>
          <Link
            to="/plogin"
            className="px-8 py-3 rounded-full bg-teal-500 text-white font-medium hover:bg-teal-600 transition duration-300"
          >
            {t("patient")}
          </Link>
        </div>
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
