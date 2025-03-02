# HealthBridge!!

HealthBridgeAI

## Overview

HealthBridgeAI is a web-based healthcare platform designed to provide remote access to doctors for people in rural areas. The platform enables patients to describe their symptoms through text or speech, which is then analyzed by an AI model to recommend suitable doctors based on specialization, availability, and location. It also includes additional functionalities such as health report scanning using Agentic AI, live skin disease analysis, and nearby hospital searches.

## Features

Patient Side:

Symptom Reporting:
Text Input: Patients can type their symptoms.
Audio Input: Patients can speak their symptoms in their native language, which is transcribed using Google Cloud Console's Speech-to-Text API and translated if necessary.
AI-Based Symptom Analysis:
Extracts symptoms from transcribed text and predicts potential diseases.
Recommends doctors based on specialization, availability, and location.

Appointment Booking:
Patients can request an appointment with a recommended doctor.
Doctors receive notifications and respond based on their availability.
Patients are notified of the doctor's response via SMS.

Additional Functionalities:
Medical report scanning using Agentic AI.
Live skin disease analysis via webcam.
Emotion analysis for health monitoring.
Blood bank search.
Nearby hospitals and medical centers fetched from Google Maps API.

Doctor Side:

Registration and Verification:
Doctors register with their details (name, specialization, hospital, location, availability, etc.).
Verification is conducted using the National Medical Commission (NMC) database.

Dashboard:
View and manage appointment requests.
Update availability status.
Respond to patient requests.

Technology Stack

Frontend: HTML, CSS, JavaScript, React.js
Backend: Node.js, Express.js
Database: MongoDB
AI & ML: Python, TensorFlow, OpenCV

APIs & Services:
Google Cloud Speech-to-Text API
Google Translate API
Twilio (for SMS notifications)
Google Maps API (for hospital search)
