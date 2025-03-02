import React, { useState, useEffect } from "react";
import { FaUserMd, FaCalendarAlt, FaClipboardList, FaUser, FaVideo } from "react-icons/fa";
import { useAuth } from "../components/AuthContext.jsx";
import { axiosInstance } from "../axiosinstance.js";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Prescription form state
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescription, setPrescription] = useState({ medicines: "", notes: "" });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const DoctorID = user?.doctor?.doctorId;
        if (!DoctorID) return;

        const response = await axiosInstance.get("/doctor/getappointments", {
          params: { doctorID: DoctorID },
        });
        
        if (Array.isArray(response.data)) {
          setAppointments(response.data.filter(appt => appt.status === "Scheduled"));
          setCompletedAppointments(response.data.filter(appt => appt.status === "Completed"));
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user]);

  const openPrescriptionForm = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionForm(true);
  };

  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;
    setPrescription(prev => ({ ...prev, [name]: value }));
  };
  
  const submitPrescription = async () => {
    try {
      await axiosInstance.post("/doctor/savePrescription", {
        patientId: selectedAppointment.patientId,
        doctorId: user.doctor.doctorId,
        medicines: prescription.medicines,
        notes: prescription.notes,
      });

      setAppointments(prev => prev.filter(appt => appt.appointmentId !== selectedAppointment.appointmentId));
      setCompletedAppointments(prev => [...prev, { ...selectedAppointment, status: "Completed" }]);

      setShowPrescriptionForm(false);
      setSelectedAppointment(null);
      setPrescription({ medicines: "", notes: "" });
    } catch (error) {
      console.error("Error saving prescription:", error);
    }
  };

  const scheduleMeeting = async (appointmentId) => {
    try {
        const response = await axiosInstance.post("/doctor/Schedule-meeting", { appointmentId });

        alert(`Google Meet Link: ${response.data.meetLink}`);
    } catch (error) {
        console.error("Error scheduling meeting", error);
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
          <h2 className="text-lg font-semibold">{user?.name}</h2>
          <p className="text-sm">{user?.specialization}</p>
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
                    <button
                      onClick={() => openPrescriptionForm(appt)}
                      className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                    >
                      Mark as Completed & Add Prescription
                    </button>
                    <button
                      onClick={() => scheduleMeeting(appt.appointmentId)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mt-2 ml-2 flex items-center"
                    >
                      <FaVideo className="mr-1" /> Schedule Meeting
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
