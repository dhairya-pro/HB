import React, { useState, useEffect } from "react";
import { FaUserMd, FaCalendarAlt, FaClipboardList, FaUser, FaUsers } from "react-icons/fa";
import { useAuth } from "../components/AuthContext.jsx";
import { axiosInstance } from "../axiosinstance.js";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);

  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const DoctorID = user.doctor.doctorId;
        const response = await axiosInstance.get("/doctor/getappointments", { params: { doctorID: DoctorID } });
        if (Array.isArray(response.data)) {
          setAppointments(response.data.filter(appt => appt.status === "Scheduled"));
          setCompletedAppointments(response.data.filter(appt => appt.status === "Completed"));
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const markAsCompleted = async (appointmentId) => {
    try {
      await axiosInstance.put("/doctor/updateStatus", { appointmentId });
      setAppointments(prev => prev.filter(appt => appt.appointmentId !== appointmentId));
      setCompletedAppointments(prev => [...prev, appointments.find(appt => appt.appointmentId === appointmentId)]);
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/5 bg-teal-600 text-white p-5 flex flex-col">
        <div className="flex items-center space-x-2 mb-6">
          <FaUserMd size={30} />
          <h1 className="text-2xl font-bold">HealthBridge</h1>
        </div>

        <div className="bg-teal-800 p-4 rounded-lg mb-6 text-center">
          <FaUser size={40} className="mx-auto" />
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm">{user.specialization}</p>
        </div>

        <nav className="space-y-4">
          <button onClick={() => setActiveTab("dashboard")} className="flex items-center space-x-2 hover:bg-teal-700 p-2 rounded">
            <FaClipboardList /> <span>Dashboard</span>
          </button>
          <button onClick={() => setActiveTab("appointments")} className="flex items-center space-x-2 hover:bg-teal-700 p-2 rounded">
            <FaCalendarAlt /> <span>Appointments</span>
          </button>
        
        </nav>
      </div>

      <div className="w-4/5 p-6">
        {activeTab === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold text-gray-700">Dashboard</h1>
            <h2 className="text-2xl font-semibold mt-6">Completed Appointments</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {completedAppointments.length > 0 ? (
                completedAppointments.map(appt => (
                  <div key={appt.appointmentId} className="bg-gray-200 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Patient: {appt.patientname}</h3>
                    <p className="text-sm text-gray-500">Time: {appt.time}</p>
                    <p className="text-sm text-gray-500">Status: Completed</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No completed appointments</p>
              )}
            </div>
          </>
        )}

        {activeTab === "appointments" && (
          <>
            <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {appointments.length > 0 ? (
                appointments.map(appt => (
                  <div key={appt.appointmentId} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Patient: {appt.patientname}</h3>
                    <p className="text-sm text-gray-500">Time: {appt.time}</p>
                    <p className="text-sm text-gray-500">Status: {appt.status}</p>
                    <button onClick={() => markAsCompleted(appt.appointmentId)} className="bg-green-500 text-white px-3 py-1 mt-2 rounded">
                      Mark as Completed
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No upcoming appointments</p>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default DoctorDashboard;
