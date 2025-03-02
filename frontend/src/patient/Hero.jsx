import React from 'react';
import { Link } from 'react-router-dom';
//import doc from "./assets/doc.jpg"
import doc from "../assets/doc.jpg"

const Hero = () => {
  // Service cards data
  const services = [
    {
      title: "Blood availability",
      description: "Find Blood When You Need It",
      icon: "droplet"
    },
    {
      title: "24 / 7 Ambulance",
      description: "Emergency Help Anytime",
      icon: "ambulance"
    },
    {
      title: "24/7 Medical store",
      description: "Round-The-Clock Medical help",
      icon: "pill"
    }
  ];

  // Government schemes data (placeholder)
  const governmentSchemes = [
    { id: 1 },
    { id: 2 },
    { id: 3 }
  ];

  // Icon components
  const icons = {
    droplet: (
      <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
    ),
    ambulance: (
      <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    ),
    pill: (
      <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
    )
  };

  // Social media icons
  const socialIcons = [
    {
      name: "Facebook",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      )
    },
    {
      name: "Twitter",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      )
    },
    {
      name: "Instagram",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
          {/* Main heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Begin Your Health Journey with HealthBridge
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-center mb-8">
            Trusted Health Advice, Personalized for You
          </p>
          
          {/* Primary CTA Button */}
          <button className="bg-teal-500 text-white font-medium px-6 py-2 rounded-full mb-12 hover:bg-teal-600 transition-colors"><Link to='/ashaai'>
           Chat-bot
           </Link>
          </button>
          
          {/* Doctor contact card */}
          <div className="w-full bg-teal-50 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">
                Contact with the top most Doctor
              </h2>
              
              <button className="bg-teal-500 text-white px-4 py-2 rounded-md flex items-center mt-4 hover:bg-teal-600 transition-colors">
                Connect
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Doctor image - using placeholder */}
            <div className="w-40 md:w-48">
              <img 
                src={doc} 
                alt="Doctor" 
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>

        {/* Services and Government Schemes Sections */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Services Section */}
          <h2 className="text-2xl font-bold text-center mb-8">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {services.map((service, index) => (
              <div key={index} className="bg-teal-50 rounded-lg p-6">
                <div className="mb-4">
                  {icons[service.icon]}
                </div>
                <h3 className="font-bold mb-1">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <button className="bg-teal-500 text-white px-4 py-1 rounded-md flex items-center text-sm hover:bg-teal-600 transition-colors">
                  Check
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {/* Government Health Schemes Section */}
          <h2 className="text-2xl font-bold text-center mb-8">Government Health Schemes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {governmentSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-teal-50 rounded-lg p-6 h-24">
                {/* Placeholder for scheme content */}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-teal-800 text-white pt-12 pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About column */}
            <div>
              <h3 className="text-xl font-bold mb-4">HealthBridge</h3>
              <p className="text-teal-100 mb-4">
                Providing accessible healthcare solutions and personalized medical services to improve your wellbeing.
              </p>
              {/* Social media icons */}
              <div className="flex space-x-4">
                {socialIcons.map((social, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="text-teal-100 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Health Schemes</a></li>
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Blood Availability</a></li>
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">24/7 Ambulance</a></li>
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Medical Store</a></li>
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Doctor Consultations</a></li>
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Health Checkups</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="text-teal-100 not-italic">
                <p className="mb-2">123 Healthcare Avenue</p>
                <p className="mb-2">Medical District, MD 12345</p>
                <p className="mb-2">Email: info@healthbridge.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 mt-8 border-t border-teal-700 text-center text-teal-200 text-sm">
            <p>&copy; {new Date().getFullYear()} HealthBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;