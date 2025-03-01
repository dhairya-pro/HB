import React, { useState, useEffect } from "react";
import { FaUserMd, FaCalendarAlt, FaClipboardList, FaUser } from "react-icons/fa";
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

      // Move the appointment to completed
      setAppointments(prev => prev.filter(appt => appt.appointmentId !== selectedAppointment.appointmentId));
      setCompletedAppointments(prev => [...prev, { ...selectedAppointment, status: "Completed" }]);

      // Reset state
      setShowPrescriptionForm(false);
      setSelectedAppointment(null);
      setPrescription({ medicines: "", notes: "" });
    } catch (error) {
      console.error("Error saving prescription:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
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

      {/* Main Content */}
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
                    <button
                      onClick={() => openPrescriptionForm(appt)}
                      className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                    >
                      Mark as Completed & Add Prescription
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No upcoming appointments</p>
              )}
            </div>
          </>
        )}

        {/* Prescription Form Modal */}
        {showPrescriptionForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Add Prescription</h2>
              <p className="text-sm mb-2"><strong>Patient:</strong> {selectedAppointment.patientname}</p>
              <textarea
                name="medicines"
                placeholder="Enter prescribed medicines..."
                className="w-full p-2 border rounded mb-2"
                value={prescription.medicines}
                onChange={handlePrescriptionChange}
              ></textarea>
              <textarea
                name="notes"
                placeholder="Additional notes..."
                className="w-full p-2 border rounded mb-2"
                value={prescription.notes}
                onChange={handlePrescriptionChange}
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowPrescriptionForm(false)} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                <button onClick={submitPrescription} className="bg-blue-500 text-white px-3 py-1 rounded">Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;