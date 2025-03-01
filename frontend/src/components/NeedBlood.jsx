
import React, { useState, useEffect } from "react";
import { axiosInstance } from "../axiosinstance";
import { useAuth } from "./AuthContext";
import axios from "axios";

const NeedBlood = () => {
    const { user } = useAuth();
    const [name, setName] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [city, setCity] = useState("");
    const [bloodBanks, setBloodBanks] = useState([]);
    const [selectedBloodBank, setSelectedBloodBank] = useState("");
    const [requests, setRequests] = useState([]);

    // Function to fetch blood banks when city changes
    useEffect(() => {
        if (city) {
            fetchBloodBanks();
        }
    }, [city]);

    const fetchBloodBanks = async () => {
        try {
            const apiKey = "AlzaSy5PDDyOssIJ3KBpdLYntyquyzcnTWTvrVT"; // Replace with your API key
            const response = await axios.get(
                `https://api.gomaps.pro/maps/api/place/textsearch/json`,
                {
                    params: {
                        query: `blood bank in ${city}`,
                        key: apiKey
                    }
                }
            );

            const results = response.data.results || [];
            setBloodBanks(results);
        } catch (error) {
            console.error("Error fetching blood banks:", error);
        }
    };

    // Function to submit the request
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/patient/need-blood", {
                name,
                bloodGroup,
                city,
                bloodBank: selectedBloodBank,
                patientId: user.patient.patientId,
            });

            if (response.status === 201) {
                alert("Blood request submitted successfully!");
                fetchRequests(); // Fetch updated requests
            }
        } catch (error) {
            console.error("Error submitting blood request:", error);
        }
    };

    // Fetch stored blood requests
    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get("/patient/get-blood",{params:{patientId:user.patient.patientId}});
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    useEffect(() => {
        fetchRequests(); // Load stored requests on mount
    }, []);

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Request Blood</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full p-2 border rounded-lg" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
                <select 
                    className="w-full p-2 border rounded-lg" 
                    value={bloodGroup} 
                    onChange={(e) => setBloodGroup(e.target.value)} 
                    required
                >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>
                <input 
                    type="text" 
                    placeholder="Enter City" 
                    className="w-full p-2 border rounded-lg" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    required 
                />
                
                {/* Blood Banks Dropdown */}
                <select 
                    className="w-full p-2 border rounded-lg" 
                    value={selectedBloodBank} 
                    onChange={(e) => setSelectedBloodBank(e.target.value)} 
                    required
                >
                    <option value="">Select Blood Bank</option>
                    {bloodBanks.map((bank, index) => (
                        <option key={index} value={bank.name}>{bank.name}</option>
                    ))}
                </select>

                <button type="submit" className="w-full bg-red-500 text-white py-2 rounded-lg">
                    Submit Request
                </button>
            </form>

            {/* Display Blood Requests */}
            <h3 className="text-xl font-semibold mt-6">Your Requests</h3>
            <div className="mt-4 space-y-3">
                {requests.length > 0 ? (
                    requests.map((req, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-gray-100">
                            <p><strong>Name:</strong> {req.name}</p>
                            <p><strong>Blood Group:</strong> {req.bloodGroup}</p>
                            <p><strong>City:</strong> {req.city}</p>
                            <p><strong>Blood Bank:</strong> {req.bloodBank}</p>
                        </div>
                    ))
                ) : (
                    <p>No blood requests found.</p>
                )}
            </div>
        </div>
    );
};

export default NeedBlood;
