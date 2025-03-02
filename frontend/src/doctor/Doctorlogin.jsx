import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosinstance';
import { useAuth } from '../components/AuthContext.jsx';
import { useLanguage } from '../../LanguageContext.jsx';
import logo from '../assets/healthbridgelogo.png'
const translations = {
  en: {
    back: 'Back',
    welcome: 'Welcome to HealthBridge!',
    email: 'Enter your Email',
    password: 'Enter your Password',
    login: 'Log In',
    signup: 'Sign Up here',
    dontHaveAccount: "Don't have an account?",
    loggingIn: 'Logging in...'
  },
  hi: {
    back: 'वापस',
    welcome: 'हेल्थब्रिज में आपका स्वागत है!',
    email: 'अपना ईमेल दर्ज करें',
    password: 'अपना पासवर्ड दर्ज करें',
    login: 'लॉग इन करें',
    signup: 'यहाँ साइन अप करें',
    dontHaveAccount: 'क्या आपके पास खाता नहीं है?',
    loggingIn: 'लॉग इन हो रहा है...'
  },
  gu: {
    back: 'પાછળ',
    welcome: 'હેલ્થબ્રિજમાં આપનું સ્વાગત છે!',
    email: 'તમારું ઈમેલ દાખલ કરો',
    password: 'તમારું પાસવર્ડ દાખલ કરો',
    login: 'લૉગ ઇન કરો',
    signup: 'અહીં સાઇન અપ કરો',
    dontHaveAccount: 'તમારું ખાતું નથી?',
    loggingIn: 'લૉગ ઇન થઈ રહ્યું છે...'
  }
};

const Doctorlogin = () => {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const t = translations[language];
   const handleBack = () =>{
    navigate('/')
   }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = t.email + ' is required';
    }
    if (!formData.password) {
      newErrors.password = t.password + ' is required';
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
      if (response.status === 200) {
        login(response.data);
        setSuccessMessage(t.login + ' successful!');
        navigate('/ddashboard');
      } else {
        setErrors({ apiError: 'Login failed. Try again.' });
      }
    } catch (error) {
      setErrors({ apiError: 'Network error. Please try again later.' });
    }
    setIsRedirecting(false);
  };

  return (
    <div className="min-h-screen bg-teal-50 flex">
      <button 
          onClick={handleBack} 
          className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-teal-600"
        >
          <span>← {t.back}</span>
        </button>
      <div className="w-1/2 flex items-center justify-center">
        <div className="mb-4 w-84">
                  <img 
                    src={logo}
                    alt="HealthBridge Logo" 
                    className="w-full"
                  />
                </div>
      </div>
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-md px-8">
          <h2 className="text-3xl font-semibold text-teal-500 mb-8">{t.welcome}</h2>
          {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>}
          {errors.apiError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.apiError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">{t.email}</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:outline-none" placeholder="your@email.com" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">{t.password}</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:outline-none" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <button type="submit" className="w-full py-3 px-4 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium mb-6" disabled={isRedirecting}>
              {isRedirecting ? t.loggingIn : t.login}
            </button>
            <div className="text-center mt-4">
              <p className="text-gray-600">{t.dontHaveAccount} <Link to="/dsignup" className="text-teal-500 hover:text-teal-700 font-medium">{t.signup}</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Doctorlogin;