import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Initialize express app
const app = express();

// Get the directory name and filename for serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the port from the environment or default to 3000
const PORT = process.env.PORT || 3000;

// Enable CORS (allow requests from frontend if served separately)
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files (like HTML, CSS, JS) from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to handle the registration submission (POST request)
app.post('/submit-registration', async (req, res) => {
  const { name, email, companyName, companyId } = req.body;

  try {
    // Validation of input data (you can add more validations)
    if (!name || !email || !companyName || !companyId) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Log the registration data (to be processed later)
    console.log("Received registration data:", { name, email, companyName, companyId });

    // In future: You can process the data (e.g., store in Firebase Firestore using Firebase Admin SDK)
    
    // Respond with success message
    res.json({ success: true, message: 'Registration data submitted successfully' });

  } catch (error) {
    console.error('Error during registration submission:', error);
    res.status(500).json({ success: false, message: 'Error submitting registration data' });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
