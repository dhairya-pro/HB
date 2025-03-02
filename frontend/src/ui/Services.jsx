import React from 'react';
import Navbar from './Navbar';

const Services = () => {
  const services = [
    {
      title: "Blood availability",
      description: "Check blood availability in your nearby hospitals and blood banks.",
      icon: "circle"
    },
    {
      title: "24/7 Ambulance",
      description: "Book ambulance service for emergencies and patient transport.",
      icon: "circle"
    },
    {
      title: "24/7 Medical",
      description: "Access medical professionals around the clock for your health needs.",
      icon: "circle"
    },
    {
      title: "Blood availability",
      description: "Check blood availability in your nearby hospitals and blood banks.",
      icon: "circle"
    },
    {
      title: "24/7 Ambulance",
      description: "Book ambulance service for emergencies and patient transport.",
      icon: "circle"
    },
    {
      title: "24/7 Medical",
      description: "Access medical professionals around the clock for your health needs.",
      icon: "circle"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
     <Navbar/>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Easy & Reliable Health Services for You</h1>
          <p className="text-lg text-gray-600">
            Get health advice, check reports, and more—all in one place.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
              <div className="p-6 flex flex-col items-center text-center">
                {/* Circle Icon */}
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <button className="mt-auto bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm">
                  See more
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;