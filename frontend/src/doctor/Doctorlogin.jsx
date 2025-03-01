import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../axiosinstance'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../components/AuthContext.jsx"; 

const Doctorlogin = () => {
  const { login } = useAuth(); // Using AuthContext
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validate()) return;
    setIsRedirecting(true);
    try {
      const response = await axiosInstance.post('/doctor/login', formData);
      const data = response.data;
      if (response.status === 200) {
        login(data); // Store user in context
        console.log("doctor data", data);
        setSuccessMessage('Login successful!');
        setTimeout(() => { console.log('Doctor login', data); }, 2000);
        navigate('/ddashboard');
      } else {
        setErrors({ apiError: data.message || 'Registration failed. Try again.' });
      }
    } catch (error) {
      console.error(error);
      setErrors({ apiError: 'Network error. Please try again later.' });
    }
    setIsRedirecting(false);
  };

  return (
    <div className="min-h-screen bg-teal-50 flex">
      <div className="w-1/2 flex items-center justify-center relative">
        <div className="p-8 max-w-md">
          <Link to="/" className="flex items-center text-teal-600 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back
          </Link>
          
          <div className="text-center mb-8">
            <div className="mx-auto w-40 h-40 mb-4">
              <img 
                src="/path-to-your-logo.png" 
                alt="HealthBridge Logo" 
                className="w-full h-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3ccircle cx='50' cy='50' r='40' fill='%23008080'/%3e%3cpath d='M60,40 H40 V60 H60 V40 Z' fill='white'/%3e%3cpath d='M50,30 V70' stroke='white' stroke-width='6'/%3e%3cpath d='M30,50 H70' stroke='white' stroke-width='6'/%3e%3c/svg%3e";
                }}
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">HEALTHBRIDGE</h1>
            <p className="text-gray-600 mt-1">HEALTHCARE SOLUTIONS</p>
          </div>
        </div>
      </div>
      
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-md px-8">
          <h2 className="text-3xl font-semibold text-teal-500 mb-8">Welcome to HealthBridge!</h2>
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          
          {errors.apiError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {errors.apiError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Enter your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Enter your Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <button
              type="submit"
              className={`w-full font-medium py-3 px-4 rounded-lg transition duration-300 mb-6 ${
                isRedirecting 
                  ? 'bg-teal-400 text-white cursor-not-allowed' 
                  : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
              disabled={isRedirecting}
            >
              {isRedirecting ? 'Logging in...' : 'Log In'}
            </button>
            
            <div className="text-center mt-4">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <span className="mx-2">|</span>
                <Link to="/dsignup" className="text-teal-500 hover:text-teal-700 font-medium">
                  Sign Up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Doctorlogin