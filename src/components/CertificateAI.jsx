import { useState } from "react";
import { Button, TextField, Typography, Box, Grid, Paper } from "@mui/material";

export default function CertificateAI() {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [aiInstruction, setAiInstruction] = useState("");

  const handleValidateInputs = () => {
    if (!backgroundImage) {
      alert("Please upload a background image.");
      return false;
    }
    if (!referenceImage) {
      alert("Please upload a reference certificate image.");
      return false;
    }
    if (!name.trim()) {
      alert("Please enter a name.");
      return false;
    }
    if (!course.trim()) {
      alert("Please enter a course.");
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!handleValidateInputs()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("course", course);
    formData.append("backgroundImage", backgroundImage);
    formData.append("referenceImage", referenceImage);

    const response = await fetch("http://localhost:3001/api/generate", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setHtmlCode(data.html);
  };

  const handleModify = async () => {
    const response = await fetch("http://localhost:3001/api/modify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html: htmlCode, instruction: aiInstruction }),
    });
    const data = await response.json();
    setHtmlCode(data.html);
    setAiInstruction("");
  };

  return (
    <Box sx={{ p: 4, maxWidth: "900px", mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        CertCraft AI
      </Typography>

      <Box mb={3}>
        <Typography>Upload Background Image</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBackgroundImage(e.target.files[0])}
        />

        <Typography mt={2}>Upload Reference Certificate Image</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setReferenceImage(e.target.files[0])}
        />
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </Grid>
      </Grid>

      <Button variant="contained" onClick={handleGenerate} sx={{ mb: 3 }}>
        Generate HTML
      </Button>

      <Box mb={3}>
        <Typography fontWeight="medium" gutterBottom>
          Generated HTML
        </Typography>
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: 2,
            borderRadius: 1,
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: "0.9rem",
            whiteSpace: "pre-wrap",
            border: "1px solid #ccc",
          }}
          component="pre"
        >
          <code>{htmlCode.replace(/```html|```/g, "").trim()}</code>
        </Box>
      </Box>

      <Box>
        <Typography fontWeight="medium" gutterBottom>
          Ask AI to Modify Layout
        </Typography>
        <TextField
          fullWidth
          multiline
          placeholder="e.g. move name slightly up, add padding, center text"
          value={aiInstruction}
          onChange={(e) => setAiInstruction(e.target.value)}
        />
        <Button variant="outlined" onClick={handleModify} sx={{ mt: 2 }}>
          Apply AI Modification
        </Button>
      </Box>
    </Box>
  );
}
