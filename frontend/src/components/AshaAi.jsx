import React, { useState, useRef } from "react";
import { Box, TextField, Button, Typography, CircularProgress, Card, CardContent, InputAdornment, IconButton } from "@mui/material";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { axiosInstance } from "../axiosinstance";
import Navbar from "../ui/Navbar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function AshaAI() {
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    setAiResponse("");
    try {
      const response = await axiosInstance.post("/patient/process-text", { text: userInput });
      const cleanedAiResponse = response.data.reply.replace(/<think>.*?<\/think>/gs, "").trim();
      const formattedResponse = cleanedAiResponse
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .map((line, index) => {
        const match = line.match(/^(\d+)\.\s*\*\*(.*?)\*\*(.*)$/);
        return match ? (
          <li key={index}>
            <strong>{match[2]}</strong> {match[3]}
          </li>
        ) : (
          <li key={index}>{line}</li>
        );
      });
      setAiResponse(<ul>{formattedResponse}</ul>);
    } catch (error) {
      console.error("Error fetching response:", error);
      setAiResponse("Error: Could not fetch AI response.");
    } finally {
      setLoading(false);
    }
  };

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

    setLoading(true);

    try {
      const response = await axiosInstance.post("/patient/speech-to-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const cleanedTranscript = response.data.transcript.replace(/<think>.*?<\/think>/gs, "").trim();
      let cleanedAiResponse = response.data.response.replace(/<think>.*?<\/think>/gs, "").trim();

      const formattedResponse = cleanedAiResponse
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "")
        .map((line, index) => {
          const match = line.match(/^(\d+)\.\s*\*\*(.*?)\*\*(.*)$/);
          return match ? (
            <li key={index}>
              <strong>{match[2]}</strong> {match[3]}
            </li>
          ) : (
            <li key={index}>{line}</li>
          );
        });

      setTranscript(cleanedTranscript);
      setAiResponse(<ul>{formattedResponse}</ul>);
    } catch (error) {
      console.error("Error processing audio:", error);
      setAiResponse(<p style={{ color: "red" }}>❌ Unable to process request. Please try again.</p>);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5, p: 3, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Multi-language Chatbot</Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 1 }}>
      <TextField
  fullWidth
  multiline
  minRows={2}
  variant="outlined"
  placeholder="Enter your message (English, Hindi, Gujarati)"
  value={userInput}
  onChange={(e) => setUserInput(e.target.value)}
  sx={{ flex: 1 }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <IconButton
          onClick={recording ? stopRecording : startRecording}
          sx={{ color: "#00897b" }}
        >
          {recording ? <FaStop /> : <FaMicrophone />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
      </Box>

      <Button
  variant="contained"
  sx={{
    mt: 1,
    backgroundColor: "#00897b",
    transition: "all 0.3s",
    "&:hover": { transform: "scale(1.08)", backgroundColor: "#00695c" },
  }}
  onClick={handleSend}
  disabled={loading}
>
  {loading ? <CircularProgress size={24} color="inherit" /> : <ArrowForwardIcon />}
</Button>
    </Box>
    </>
  );
}

export default AshaAI;