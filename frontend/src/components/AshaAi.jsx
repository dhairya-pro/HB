import React, { useState } from "react";
import { Box, TextField, Button, Typography, CircularProgress, Card, CardContent } from "@mui/material";
import { axiosInstance } from "../axiosinstance";

function AshaAI() {
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    setAiResponse("");

    try {
      const response = await axiosInstance.post("/patient/process-text", {
        text: userInput,
      });
      const cleanedAiResponse = response.data.reply.replace(/<think>.*?<\/think>/gs, "").trim();
      setAiResponse(cleanedAiResponse);
    } catch (error) {
      console.error("Error fetching response:", error);
      setAiResponse("Error: Could not fetch AI response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5, p: 3, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        🔮 AshaAI - Multi-language Chatbot
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={3}
        variant="outlined"
        placeholder="Enter your message (English, Hindi, Gujarati)"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        sx={{ my: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSend}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Send"}
      </Button>

      {aiResponse && (
        <Card sx={{ mt: 3, p: 2, textAlign: "left" }}>
          <CardContent>
            <Typography variant="h6">🤖 AI Response:</Typography>
            <Typography variant="body1">{aiResponse}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default AshaAI;
