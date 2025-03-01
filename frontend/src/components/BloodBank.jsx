import React, { useState } from "react";
import { axiosInstance } from "../axiosinstance";
const BloodBank = () => {
    const [city, setCity] = useState("");
    const [bloodBanks, setBloodBanks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBloodBanks = async () => {
        if (!city) return;
        setLoading(true);
        try {
            const response = await axiosInstance.get("/patient/find-blood-banks", {
                params: { city }
            });

            setBloodBanks(response.data);
        } catch (error) {
            console.error("Error fetching blood banks:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-3">Find Blood Banks</h2>
            <input
                type="text"
                placeholder="Enter city..."
                className="border p-2 rounded-md w-full"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button
                onClick={fetchBloodBanks}
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Search
            </button>

            {loading && <p>Loading...</p>}

            {bloodBanks.length > 0 ? (
                <ul className="mt-4">
                    {bloodBanks.map((bank, index) => (
                        <li key={index} className="border-b p-2">
                            <strong>{bank.name}</strong> - {bank.address}  
                            <p>Contact: {bank.contact}</p>
                            <p>Available Blood Types: {bank.bloodTypesAvailable.join(", ")}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p className="mt-3">No blood banks found.</p>
            )}
        </div>
    );
};

export default BloodBank;
