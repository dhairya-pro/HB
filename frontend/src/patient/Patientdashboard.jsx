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
import { FaUser, FaCalendarAlt, FaHospital, FaFileMedical, FaHeartbeat, FaSignOutAlt, FaMicrophone, FaFileAlt } from "react-icons/fa";
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

  useEffect(() => {
    if (user?.patient?.patientId) {
      fetchAppointments();
    }
  }, [user]);

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

  // Handle successful booking and refresh the appointments
  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    fetchAppointments(); // Refresh appointments after booking
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Appointments</h2>
        <button onClick={() => setShowBookingForm(true)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
          + Book Appointment
        </button>
      </div>

      {/* Show BookAppointment Component */}
      {showBookingForm && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <BookAppointment onBookingSuccess={handleBookingSuccess} onCancel={() => setShowBookingForm(false)} />
        </div>
      )}

      {error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      ) : appointments.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-md">You don't have any appointments scheduled.</div>
      ) : (
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Doctor</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
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
                  <button className="text-blue-600 hover:text-blue-800">Details</button>
                  {appointment.status !== "Cancelled" && (
                    <button className="ml-2 text-red-600 hover:text-red-800">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "appointments", label: "Appointments", icon: <FaCalendarAlt /> },
    { id: "medicalHistory", label: "Medical History", icon: <FaFileMedical /> },
    { id: "healthcentres", label: "Health Centres", icon: <FaHospital /> },
    { id: "bloodbank", label: "Blood Banks", icon: <FaHeartbeat /> },
    { id: "NeedBlood", label: "Need Blood", icon: <FaHeartbeat /> },
    { id: "DocumentAnalyser", label: "Document Analyzer", icon: <FaFileAlt /> },
    { id: "VoiceAssistant", label: "Voice Assistant", icon: <FaMicrophone /> },
    { id: "AshaAI", label: "AshaAI", icon: <FaMicrophone /> },
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case "profile": return <Profile />;
      case "appointments": return <Appointments />;
      case "medicalHistory": return <MedicalHistory user={user} />;
      case "healthcentres": return <Healthcentres />;
      case "bloodbank": return <BloodBank />;
      case "NeedBlood": return <NeedBlood />;
      case "DocumentAnalyser": return <DocumentAnalyzer />;
      case "VoiceAssistant": return <Voicebasedassistant />;
      case "AshaAI": return <AshaAI />;
      default: return <Profile />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#D1E5E4] text-black flex flex-col p-6 space-y-4 shadow-lg">
        <h1 className="text-2xl font-bold">Patient Portal</h1>
        <p className="text-sm opacity-80">Welcome, {user.patient.name}</p>
        <nav className="flex-grow space-y-2">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all ${
                activeTab === id ? "bg-[#42aea9]" : ""
              }`}
            >
              <span className="mr-3">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center p-3 rounded-lg border-x-24 ">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {/* Header */}
        <div className="bg-white p-6 shadow-md">
          <h2 className="text-2xl font-bold capitalize">{activeTab.replace(/([A-Z])/g, " $1")}</h2>
        </div>
        {/* Content Area */}
        <div className="p-6 flex-grow bg-white shadow-md m-4 rounded-lg overflow-auto">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;




