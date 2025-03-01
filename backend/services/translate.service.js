import axios from "axios";

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

export const translateText = async (text, targetLanguage) => {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

  try {
    const response = await axios.post(url, {
      q: text,
      target: targetLanguage,
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation Error:", error);
    return text; // Fallback to original text if error occurs
  }
};