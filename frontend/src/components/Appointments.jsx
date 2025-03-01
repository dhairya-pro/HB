import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext.jsx";

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/patients/${user.patientId}/appointments`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load your appointments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.patientId) {
      fetchAppointments();
    }
  }, [user]);

  // Function to handle booking new appointment
  const handleBookAppointment = () => {
    // Navigate to appointment booking form or open modal
    // This would connect to your booking workflow
    console.log("Book appointment clicked");
    // Implement your navigation logic here
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-blue-600 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with booking button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Appointments</h2>
        <button
          onClick={handleBookAppointment}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
        >
          <span className="mr-2">+</span> Book Appointment
        </button>
      </div>

      {/* Appointments table */}
      {appointments.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-md">
          <p className="text-gray-600">You don't have any appointments scheduled.</p>
          <button
            onClick={handleBookAppointment}
            className="mt-4 text-blue-600 hover:underline"
          >
            Book your first appointment
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
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
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{appointment.doctorName}</p>
                      <p className="text-sm text-gray-500">{appointment.specialization}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{new Date(appointment.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{appointment.time}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : appointment.status === 'Cancelled' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        Details
                      </button>
                      {appointment.status !== 'Cancelled' && (
                        <button className="text-red-600 hover:text-red-800">
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;