import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // Detects browser language
  .use(initReactI18next) // Initializes i18next with React
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Your Health Care Journey starts here",
          selectRole: "Select your role",
          doctor: "Doctor",
          patient: "Patient",
          doctorPortal: "Doctor Portal",
          patientPortal: "Patient Portal",
          signUpPrompt: "Please sign up or login to continue",
          login: "Login",
          signUp: "Sign Up",
          back: "← Back to role selection",
          
        },
      },
      hi: {
        translation: {
          welcome: "आपकी स्वास्थ्य देखभाल यात्रा यहां से शुरू होती है",
          selectRole: "अपनी भूमिका चुनें",
          doctor: "डॉक्टर",
          patient: "रोगी",
          doctorPortal: "डॉक्टर पोर्टल",
          patientPortal: "रोगी पोर्टल",
          signUpPrompt: "कृपया जारी रखने के लिए साइन अप या लॉगिन करें",
          login: "लॉग इन करें",
          signUp: "साइन अप करें",
          back: "← भूमिका चयन पर वापस जाएं",
        },
      },
      gu: {
        translation: {
          welcome: "તમારી આરોગ્ય કાળજીની સફર અહીંથી શરૂ થાય છે",
          selectRole: "તમારી ભૂમિકા પસંદ કરો",
          doctor: "ડોકટર",
          patient: "દર્દી",
          doctorPortal: "ડોકટર પોર્ટલ",
          patientPortal: "દર્દી પોર્ટલ",
          signUpPrompt: "કૃપા કરીને ચાલુ રાખવા માટે સાઇન અપ અથવા લોગિન કરો",
          login: "લોગિન કરો",
          signUp: "સાઇન અપ કરો",
          back: "← ભૂમિકા પસંદગીને પાછા જાઓ",
        },
      },
    },
    fallbackLng: "en", // Default language
    detection: {
      order: ["navigator", "localStorage", "sessionStorage", "htmlTag"],
      caches: ["localStorage", "sessionStorage"],
    },
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
  });

export default i18n;
