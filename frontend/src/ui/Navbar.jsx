import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-2 bg-white shadow-sm h-20">
      {/* Logo and brand */}
      <div className="flex items-center">
        {/* Logo placeholder */}
        <div className="w-8 h-8 mr-2 overflow-hidden">
          {/* You can replace this with an actual image tag */}
          <div className="flex items-center justify-center w-full h-full bg-teal-500 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
        </div>
        <span className="text-lg font-semibold">HealthBridge</span>
      </div>

      {/* Navigation links */}
      <div className="flex items-center space-x-6">
      <Link to='/homepage' className="text-gray-800 hover:text-teal-500">Home</Link>
        <Link to='/cureskin' className="text-gray-800 hover:text-teal-500">Cureskin</Link>
        <Link to='/visionanalyze' className="text-gray-800 hover:text-teal-500">Health Vision</Link>
        <Link to='/ashaai' className="text-gray-800 hover:text-teal-500">Chatbot</Link>
        <Link to="/services" className="text-gray-800 hover:text-teal-500">Services</Link>
        <Link to='/pdashboard' className="px-4 py-1 text-teal-600 border border-teal-600 rounded-full hover:bg-teal-50">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;