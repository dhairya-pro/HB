import { useState } from "react";
import { axiosInstance } from "../axiosinstance";

export default function Healthcentres() {
    const [city, setCity] = useState("");
    const [placeType, setPlaceType] = useState("medical store");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchPlaces = async () => {
        if (!city) {
            setError("Please enter a city name.");
            return;
        }

        setLoading(true);
        setError("");
        setResults([]);

        try {
            const response = await axiosInstance.get("/patient/find-places", {
                params: { city, type: placeType }
            });

            setResults(response.data.places || []);
        } catch (err) {
            setError("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
            <h1 className="text-xl font-bold text-center mb-4">Find Nearby Medical Stores & Hospitals</h1>

            {/* City Input */}
            <input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
            />

            {/* Dropdown for Type Selection */}
            <select
                className="w-full p-3 border rounded-md mt-3"
                value={placeType}
                onChange={(e) => setPlaceType(e.target.value)}
            >
                <option value="medical store">Medical Stores</option>
                <option value="hospital">Hospitals</option>
            </select>

            {/* Search Button */}
            <button
                onClick={fetchPlaces}
                className="w-full mt-4 bg-teal-500 text-white p-3 rounded-md hover:bg-blue-700 transition"
                disabled={loading}
            >
                {loading ? "Searching..." : "Find Now"}
            </button>

            {/* Error Message */}
            {error && <p className="text-red-600 text-center mt-3">{error}</p>}

            {/* Results Display */}
            <div className="mt-6">
                {results.length > 0 ? (
                    results.map((place, index) => (
                        <div key={index} className="border p-3 rounded-lg shadow-md mb-3">
                            <h3 className="font-semibold text-lg">{place.name}</h3>
                            <p className="text-gray-700">{place.address}</p>
                            <p className="text-yellow-500">⭐ {place.rating || "N/A"}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 text-center">{loading ? "" : "No results found"}</p>
                )}
            </div>
        </div>
    );
}
