import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../axiosinstance'
import { useNavigate } from 'react-router-dom'



const Doctorsignup = () => {
  const navigate = useNavigate();
  // Initial form state with empty availableTimings array
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    contact: '',
    email: '',
    password: '',
    confirmPassword: '',
    availableTimings: [
      { day: 'Monday', startTime: '09:00 AM', endTime: '05:00 PM' }
    ]
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

  // Handler for timing fields
  const handleTimingChange = (index, field, value) => {
    const updatedTimings = [...formData.availableTimings];
    updatedTimings[index] = {
      ...updatedTimings[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      availableTimings: updatedTimings
    });
  };

  // Add a new timing slot
  const addTimingSlot = () => {
    setFormData({
      ...formData,
      availableTimings: [
        ...formData.availableTimings,
        { day: 'Monday', startTime: '09:00 AM', endTime: '05:00 PM' }
      ]
    });
  };

  // Remove a timing slot
  const removeTimingSlot = (index) => {
    const updatedTimings = [...formData.availableTimings];
    updatedTimings.splice(index, 1);
    
    setFormData({
      ...formData,
      availableTimings: updatedTimings
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required';
    }
    
    if (!formData.experience) {
      newErrors.experience = 'Experience is required';
    } else if (isNaN(formData.experience) || formData.experience <= 0) {
      newErrors.experience = 'Experience must be a valid number';
    }
    
    if (!formData.contact) {
      newErrors.contact = 'Contact number is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.availableTimings.length === 0) {
      newErrors.availableTimings = 'At least one timing slot is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validate()) return;
    setIsRedirecting(true);
    try{
    const response = await axiosInstance.post('/doctor/signup', formData);
    const data = response.data;
    if (response.status === 201) {
      setSuccessMessage('Registration successful! Please check your email for verification.');
      setTimeout(() => { console.log('User registered:', data); }, 2000);
      navigate('/dlogin');
    } else {
      setErrors({ apiError: data.message || 'Registration failed. Try again.' });
    }
  } catch (error) {
    console.log(error);
    setErrors({ apiError: 'Network error. Please try again later.' });
  }
  setIsRedirecting(false);
  };

  // Days of the week for dropdown
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Time options for dropdown
  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i % 12 === 0 ? 12 : i % 12;
      const ampm = i < 12 ? 'AM' : 'PM';
      times.push(`${hour.toString().padStart(2, '0')}:00 ${ampm}`);
      times.push(`${hour.toString().padStart(2, '0')}:30 ${ampm}`);
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl ">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-500">Doctor Registration</h1>
          <p className="text-gray-600 mt-2">Join our medical platform to connect with patients</p>
        </div>
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="Dr. John Doe"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="specialization" className="block text-gray-700 font-medium mb-2">
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.specialization ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="Cardiologist"
              />
              {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="experience" className="block text-gray-700 font-medium mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.experience ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="10"
                min="0"
              />
              {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.contact ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="+1-234-567-8901"
              />
              {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          <div className="mb-4 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Available Timings</h2>
              <button
                type="button"
                onClick={addTimingSlot}
                className="bg-teal-500 hover:bg-teal-500 text-white text-sm py-1 px-3 rounded-lg transition duration-300"
              >
                + Add Slot
              </button>
            </div>
            
            {errors.availableTimings && (
              <p className="text-red-500 text-sm mb-2">{errors.availableTimings}</p>
            )}
            
            {formData.availableTimings.map((timing, index) => (
              <div key={index} className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Slot {index + 1}</h3>
                  {formData.availableTimings.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimingSlot(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Day
                    </label>
                    <select
                      value={timing.day}
                      onChange={(e) => handleTimingChange(index, 'day', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Start Time
                    </label>
                    <select
                      value={timing.startTime}
                      onChange={(e) => handleTimingChange(index, 'startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {timeOptions.map((time) => (
                        <option key={`start-${time}`} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      End Time
                    </label>
                    <select
                      value={timing.endTime}
                      onChange={(e) => handleTimingChange(index, 'endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {timeOptions.map((time) => (
                        <option key={`end-${time}`} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            type="submit"
            className={`w-full font-medium py-2 px-4 rounded-lg transition duration-300 mt-4 ${
              isRedirecting 
                ? 'bg-green-500 hover:bg-green-600 text-white cursor-not-allowed' 
                : 'bg-teal-500 hover:bg-teal-500 text-white'
            }`}
            disabled={isRedirecting}
          >
            {isRedirecting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="text-center pt-4 mt-4 border-t border-gray-200">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/dlogin" className="text-teal-500 font-medium">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Doctorsignup