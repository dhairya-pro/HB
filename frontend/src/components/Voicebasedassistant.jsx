import React, { useState, useRef } from "react";
import axios from "axios";
import { axiosInstance } from "../axiosinstance";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { Card, CardContent, Typography, Button, Box, CircularProgress } from "@mui/material";

function Voicebasedassistant() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        await sendAudioToBackend(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    setLoading(true); // Show loading indicator

    try {
      const response = await axiosInstance.post("/patient/speech-to-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const cleanedTranscript = response.data.transcript.replace(/<think>.*?<\/think>/gs, "").trim();
      const cleanedAiResponse = response.data.response.replace(/<think>.*?<\/think>/gs, "").trim();

      setTranscript(cleanedTranscript);
      setAiResponse(cleanedAiResponse);
    } catch (error) {
      console.error("Error sending audio:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ maxWidth: 600, width: "100%", p: 3, textAlign: "center", boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          🎙️ AI Health Assistant
        </Typography>

        <Button
          onClick={recording ? stopRecording : startRecording}
          variant="contained"
          color={recording ? "error" : "success"}
          startIcon={recording ? <FaStop /> : <FaMicrophone />}
          sx={{ my: 2, fontSize: "18px", px: 3 }}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </Button>

        {loading && (
          <Box sx={{ mt: 2 }}>
            <CircularProgress />
            <Typography variant="body2" color="textSecondary">
              Processing audio...
            </Typography>
          </Box>
        )}

        {transcript && (
          <CardContent sx={{ textAlign: "left", mt: 3, bgcolor: "#f9f9f9", borderRadius: 1 }}>
            <Typography variant="h6">📝 Transcription:</Typography>
            <Typography variant="body1">{transcript}</Typography>
          </CardContent>
        )}

        {aiResponse && (
          <CardContent sx={{ textAlign: "left", mt: 3, bgcolor: "#f9f9f9", borderRadius: 1 }}>
            <Typography variant="h6">🤖 AI Response:</Typography>
            <Typography variant="body1">{aiResponse}</Typography>
          </CardContent>
        )}
      </Card>
    </Box>
  );
}

export default Voicebasedassistant;
