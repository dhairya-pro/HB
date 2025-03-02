/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext.jsx"; 
import { axiosInstance } from "../axiosinstance.js";


const BookAppointment = () => {
     const { user } = useAuth();
      if (!user) {
       console.error("User not found in context"); // ✅ Debugging
       }

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Scheduled"); // Default status
  const [loading, setLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Fetch doctors from backend
  useEffect(() => {
    axiosInstance
      .get("/doctor/getdoctors")
      .then((response) => {
        setDoctors(response.data); // Assuming API returns JSON array
      })
      .catch((error) => {
        console.log("Error fetching doctors:", error.response?.data || error.message);
        console.error("Error fetching doctors:", error.response?.data || error.message);
      });
  }, []);
     
       // for timing
       const generateTimeSlots = (startTime, endTime) => {
        const slots = [];
        let start = new Date(`2023-01-01T${convertTo24Hour(startTime)}`);
        const end = new Date(`2023-01-01T${convertTo24Hour(endTime)}`);
    
        while (start < end) {
          const formattedTime = start.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          slots.push(formattedTime);
          start.setMinutes(start.getMinutes() + 30); // 30-minute interval
        }
        return slots;
      };
    
      // Convert 12-hour time format to 24-hour format
      const convertTo24Hour = (time) => {
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":");
        if (modifier === "PM" && hours !== "12") {
          hours = String(parseInt(hours, 10) + 12);
        }
        if (modifier === "AM" && hours === "12") {
          hours = "00";
        }
        return `${hours}:${minutes}`;
      };
    
      // Update available time slots based on selected doctor and date
      useEffect(() => {
        if (!selectedDoctor || !date) {
          setAvailableTimeSlots([]);
          return;
        }
    
        const selectedDoc = doctors.find((doc) => doc.doctorId === selectedDoctor);
        if (!selectedDoc) return;
    
        const selectedDay = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    
        const timing = selectedDoc.availableTimings.find((t) => t.day === selectedDay);
        if (timing) {
          setAvailableTimeSlots(generateTimeSlots(timing.startTime, timing.endTime));
        } else {
          setAvailableTimeSlots([]);
        }
      }, [selectedDoctor, date, doctors]);
    


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const patientId = user.patient.patientId;
    const patientname = user.patient.name;
    console.log("Patient ID:", patientId); // ✅ Debugging
    console.log("Patient Name:", patientname); // ✅ Debugging
    if (!patientId) {
      alert("Please log in first!");
      setLoading(false);
      return;
    }

    const appointmentData = {
      patientId,
      patientname,
      doctorname: doctors.find((doctor) => doctor.doctorId === selectedDoctor)?.name,
      doctorId: selectedDoctor,
      date,
      time,
      status,
    };

    try {
      const response = await axiosInstance.post("/patient/add/appointments", appointmentData);
    
      if (response.status === 201 || response.status === 200) {
        alert("Appointment booked successfully!");
        setSelectedDoctor("");
        setDate("");
        setTime("");
      } else {
        alert(response.data.error || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    
      if (error.response) {
        alert(error.response.data.error || "Something went wrong");
      } else {
        alert("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Doctor */}
        <label className="block">
          <span className="text-gray-700">Select a Doctor:</span>
          <select
            className="block w-full mt-1 p-2 border rounded-md"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">-- Choose a Doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor.doctorId} value={doctor.doctorId}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </label>

        {/* Select Date */}
         {/* Select Date */}
         <label className="block">
          <span className="text-gray-700">Select Date:</span>
          <input
            type="date"
            className="block w-full mt-1 p-2 border rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        {/* Select Time */}
        <label className="block">
          <span className="text-gray-700">Select Time:</span>
          <select
            className="block w-full mt-1 p-2 border rounded-md"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            disabled={availableTimeSlots.length === 0}
          >
            <option value="">-- Choose a Time Slot --</option>
            {availableTimeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
