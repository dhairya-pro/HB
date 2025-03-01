
/* eslint-disable react/prop-types */

import React, { useState,useEffect } from "react";
import { useAuth } from "../components/AuthContext.jsx";
import { useNavigate } from 'react-router-dom';
import BookAppointment from "./BookAppointment";
import { axiosInstance } from "../axiosinstance.js";
import Healthcentres from "../components/Healthcentres.jsx";
import UploadMedicalReports from "../components/UploadMedicalReports.jsx";
import BloodBank from "../components/BloodBank.jsx";
import NeedBlood from "../components/NeedBlood.jsx";
import DocumentAnalyzer from "../components/DocumentAnalyzer.jsx";
import Voicebasedassistant from "../components/Voicebasedassistant.jsx";
import AshaAI from "../components/AshaAi.jsx";
import {useLanguage } from "../../LanguageContext.jsx";

const Profile = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Profile</h2><p>Your profile information will appear here.</p></div>;

const translations = {
  en: {
      title: "Medical History",
      loading: "Loading...",
      unknownCondition: "Unknown Condition",
      diagnosisDate: "Diagnosis Date",
      medications: "Medications",
      none: "None",
      reports: "Reports",
      noReports: "No reports uploaded.",
      noHistory: "No medical history found.",
      uploadNew: "Upload New Medical Records"
  },
  hi: {
      title: "चिकित्सा इतिहास",
      loading: "लोड हो रहा है...",
      unknownCondition: "अज्ञात स्थिति",
      diagnosisDate: "निदान तिथि",
      medications: "दवाइयाँ",
      none: "कोई नहीं",
      reports: "रिपोर्ट्स",
      noReports: "कोई रिपोर्ट अपलोड नहीं की गई।",
      noHistory: "कोई चिकित्सा इतिहास नहीं मिला।",
      uploadNew: "नए चिकित्सा रिकॉर्ड अपलोड करें"
  },
  gu: {
      title: "ચિકિત્સા ઇતિહાસ",
      loading: "લોડ થઈ રહ્યું છે...",
      unknownCondition: "અજ્ઞાત સ્થિતિ",
      diagnosisDate: "નિદાન તારીખ",
      medications: "દવાઓ",
      none: "કોઈ નહિ",
      reports: "અહેવાલો",
      noReports: "કોઈ અહેવાલ અપલોડ થયો નથી.",
      noHistory: "કોઈ ચિકિત્સા ઇતિહાસ મળ્યો નથી.",
      uploadNew: "નવા ચિકિત્સા રેકોર્ડ અપલોડ કરો"
  }
};
const MedicalHistory = () => {
  const { user } = useAuth();
  const { language } = useLanguage(); // Get current language
  const t = translations[language] || translations.en; // Fallback to English

  if (!user || !user.patient) {
      return (
          <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{t.title}</h2>
              <p>{t.loading}</p>
          </div>
      );
  }

  const patientId = user.patient.patientId;

  return (
      <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{t.title}</h2>
          {Array.isArray(user.patient.medicalHistory) && user.patient.medicalHistory.length > 0 ? (
              user.patient.medicalHistory.map((entry, index) => (
                  <div key={index} className="p-4 border rounded-md mb-4">
                      <h3 className="text-lg font-bold">{entry.condition || t.unknownCondition}</h3>
                      <p>{t.diagnosisDate}: {entry.diagnosisDate ? new Date(entry.diagnosisDate).toLocaleDateString() : "N/A"}</p>
                      <p>{t.medications}: {entry.medications?.length > 0 ? entry.medications.join(", ") : t.none}</p>

                      <h4 className="text-md font-semibold mt-2">{t.reports}:</h4>
                      {entry.reports?.length > 0 ? (
                          entry.reports.map((report, i) => (
                              <p key={i}>
                                  <a href={`/${encodeURI(report.filePath)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                                      {report.filename || t.reports}
                                  </a>
                              </p>
                          ))
                      ) : (
                          <p>{t.noReports}</p>
                      )}

                      {typeof UploadMedicalReports === "function" && (
                          <UploadMedicalReports patientId={patientId} condition={entry.condition} />
                      )}
                  </div>
              ))
          ) : (
              <div>
                  <p>{t.noHistory}</p>

                  {typeof UploadMedicalReports === "function" && (
                      <div className="mt-4">
                          <h3 className="text-lg font-bold">{t.uploadNew}</h3>
                          <UploadMedicalReports patientId={patientId} condition="New Condition" />
                      </div>
                  )}
              </div>
          )}
      </div>
  );
};
const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { language } = useLanguage();

  // Translation function
  const translate = (text) => {
    const translations = {
      en: {
        title: "Your Appointments",
        book: "Book Appointment",
        noAppointments: "You don't have any appointments scheduled.",
        doctor: "Doctor",
        date: "Date",
        time: "Time",
        status: "Status",
        actions: "Actions",
        details: "Details",
        cancel: "Cancel",
        bookNew: "Book New Appointment",
      },
      hi: {
        title: "आपकी नियुक्तियां",
        book: "नियुक्ति बुक करें",
        noAppointments: "आपकी कोई नियुक्ति निर्धारित नहीं है।",
        doctor: "डॉक्टर",
        date: "तारीख",
        time: "समय",
        status: "स्थिति",
        actions: "कार्य",
        details: "विवरण",
        cancel: "रद्द करें",
        bookNew: "नई नियुक्ति बुक करें",
      },
      gu: {
        title: "તમારી મુલાકાતો",
        book: "મુલાકાત બુક કરો",
        noAppointments: "તમારી કોઈ મુલાકાત નિર્ધારિત નથી.",
        doctor: "ડૉક્ટર",
        date: "તારીખ",
        time: "સમય",
        status: "સ્થિતિ",
        actions: "ક્રિયાઓ",
        details: "વિગતો",
        cancel: "રદ કરો",
        bookNew: "નવી મુલાકાત બુક કરો",
      },
    };
    return translations[language]?.[text] || text;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/patient/get/appointments", {
          patientId: user?.patient?.patientId,
        });

        if (!response || response.status !== 200) {
          throw new Error("Error fetching appointments");
        }

        setAppointments(response.data || []);
      } catch (err) {
        setError("Failed to load your appointments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.patient?.patientId) {
      fetchAppointments();
    }
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{translate("title")}</h2>
        <button onClick={() => setShowBookingForm(true)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
          + {translate("book")}
        </button>
      </div>

      {error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      ) : appointments.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-md">{translate("noAppointments")}</div>
      ) : (
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">{translate("doctor")}</th>
              <th className="py-3 px-4 text-left">{translate("date")}</th>
              <th className="py-3 px-4 text-left">{translate("time")}</th>
              <th className="py-3 px-4 text-left">{translate("status")}</th>
              <th className="py-3 px-4 text-left">{translate("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{appointment.doctorname}</td>
                <td className="py-3 px-4">{new Date(appointment.date).toLocaleDateString()}</td>
                <td className="py-3 px-4">{appointment.time}</td>
                <td className="py-3 px-4">{appointment.status}</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800">{translate("details")}</button>
                  {appointment.status !== "Cancelled" && (
                    <button className="ml-2 text-red-600 hover:text-red-800">{translate("cancel")}</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 max-w-xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{translate("bookNew")}</h3>
              <button onClick={() => setShowBookingForm(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <BookAppointment />
          </div>
        </div>
      )}
    </div>
  );
};






const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("appointments");

  if (!user) {
    console.error("User not found in context");
    navigate("/plogin");
    return null;
  }

  const renderComponent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "appointments":
        return <Appointments />;
      case "medicalHistory":
        return <MedicalHistory user={user} />;
      case "healthcentres":
        return <Healthcentres />;
      case "bloodbank":
        return <BloodBank />;
      case "NeedBlood":
        return <NeedBlood />;
      case "Document analyser":
        return <DocumentAnalyzer />;
      case "Voicebasedassistant":
        return <Voicebasedassistant />;
      case "AshaAI":
        return <AshaAI />;
      default:
        return <Profile />;
    }
  };

  const NavItem = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-md transition-colors ${
        activeTab === id
          ? "bg-blue-600 text-white font-semibold"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between border-b">
        <div>
          <h1 className="text-xl font-bold">Patient Portal</h1>
          <p className="text-sm text-gray-600">Welcome, {user.patient.name}</p>
        </div>
        <nav className="flex space-x-4">
          <NavItem id="profile" label="Profile" icon="👤" />
          <NavItem id="appointments" label="Appointments" icon="📅" />
          <NavItem id="medicalHistory" label="Medical History" icon="📋" />
          <NavItem id="healthcentres" label="Health Centres" icon="🏥" />
          <NavItem id="bloodbank" label="Blood Banks" icon="💉" />
          <NavItem id="NeedBlood" label="Need Blood" icon="💉" />
          <NavItem id="Document analyser" label="Document Analyser" />
          <NavItem id="Voicebasedassistant" label="Voice Assistant" />
          <NavItem id="AshaAI" label="AshaAI" />
        </nav>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-auto">
        <div className="p-6 bg-white shadow-sm border-b">
          <h2 className="text-2xl font-bold capitalize">{activeTab.replace(/([A-Z])/g, " $1")}</h2>
        </div>
        <main className="p-6">{renderComponent()}</main>
      </div>
    </div>
  );
};

export default PatientDashboard;


