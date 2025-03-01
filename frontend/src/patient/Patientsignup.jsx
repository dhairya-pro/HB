import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosinstance';
import { useLanguage } from '../../LanguageContext';

const Patientsignup = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    en: {
      title: "Patient Registration",
      name: "Full Name",
      age: "Age",
      gender: "Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      contact: "Contact Number",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      signUp: "Sign Up",
      haveAccount: "Already have an account? Login",
      creatingAccount: "Creating Account...",
      success: "Registration successful! Please check your email for verification.",
      errors: {
        name: "Name is required",
        age: "Valid age is required",
        gender: "Gender selection is required",
        contact: "Valid 10-digit contact number is required",
        email: "Valid email is required",
        password: "Password must be at least 6 characters",
        confirmPassword: "Passwords do not match",
        apiError: "Network error. Please try again later."
      }
    },
    hi: {
      title: "रोगी पंजीकरण",
      name: "पूरा नाम",
      age: "आयु",
      gender: "लिंग",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य",
      contact: "संपर्क नंबर",
      email: "ईमेल पता",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      signUp: "साइन अप करें",
      creatingAccount: "खाता बना रहा है...",
      success: "पंजीकरण सफल! कृपया सत्यापन के लिए अपना ईमेल जांचें।",
      errors: {
        name: "नाम आवश्यक है",
        age: "मान्य आयु आवश्यक है",
        gender: "लिंग चयन आवश्यक है",
        contact: "मान्य 10-अंकीय संपर्क नंबर आवश्यक है",
        email: "मान्य ईमेल आवश्यक है",
        password: "पासवर्ड कम से कम 6 वर्णों का होना चाहिए",
        confirmPassword: "पासवर्ड मेल नहीं खाते",
        apiError: "नेटवर्क त्रुटि। कृपया बाद में पुन: प्रयास करें।"
      }
    },
    gu: {
      title: "દર્દી નોંધણી",
      name: "પૂર્ણ નામ",
      age: "ઉંમર",
      gender: "લિંગ",
      male: "પુરુષ",
      female: "સ્ત્રી",
      other: "અન્ય",
      contact: "સંપર્ક નંબર",
      email: "ઇમેઇલ સરનામું",
      password: "પાસવર્ડ",
      confirmPassword: "પાસવર્ડની પુષ્ટિ કરો",
      signUp: "સાઇન અપ કરો",
      creatingAccount: "એકાઉન્ટ બનાવી રહ્યું છે...",
      success: "નોંધણી સફળ! કૃપા કરીને ચકાસણી માટે તમારું ઇમેઇલ તપાસો.",
      errors: {
        name: "નામ જરૂરી છે",
        age: "માન્ય ઉંમર જરૂરી છે",
        gender: "લિંગ પસંદગી જરૂરી છે",
        contact: "માન્ય 10-અંકી સંપર્ક નંબર જરૂરી છે",
        email: "માન્ય ઇમેઇલ જરૂરી છે",
        password: "પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરોનો હોવો જોઈએ",
        confirmPassword: "પાસવર્ડ મેળ ખાતા નથી",
        apiError: "નેટવર્ક ભૂલ. મહેરબાની કરીને થોડીવાર પછી ફરીથી પ્રયાસ કરો."
      }
    }
  };

  const t = translations[language] || translations.en;

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post('/patient/signup', formData);
      if (response.status === 200) {
        setSuccessMessage(t.success);
        navigate('/plogin');
      }
    } catch (error) {
      setErrors({ apiError: t.errors.apiError });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <div className="w-full max-w-3xl px-8">
      <h1 className="text-3xl font-medium text-teal-500 mb-6">{t.title}</h1>

      {successMessage && <p className="text-green-700 bg-green-100 p-3 rounded mt-2">{successMessage}</p>}
      {errors.apiError && <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {["name", "contact", "email", "password", "confirmPassword"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 text-lg font-medium mb-2">{t[field]}</label>
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-3 bg-gray-100 rounded-md"
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2">{t.age}</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2">{t.gender}</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md">
              <option value="">{t.gender}</option>
              <option value="Male">{t.male}</option>
              <option value="Female">{t.female}</option>
              <option value="Other">{t.other}</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
        </div>

        <button type="submit" className="px-8 py-3 mt-8 text-white bg-teal-500 rounded-md hover:bg-teal-600">
          {isSubmitting ? t.creatingAccount : t.signUp}
        </button>
      </form>
      <button onClick={() => navigate('/plogin')} className="mt-4 text-teal-600 underline">{t.haveAccount}</button>
    </div>
  </div>
  );
};

export default Patientsignup;