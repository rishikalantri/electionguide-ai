const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
const chatRoutes = require('./routes/chatRoutes');
const toolsRoutes = require('./routes/toolsRoutes');
const quizRoutes = require('./routes/quizRoutes');

app.use('/api/chat', chatRoutes);
app.use('/api/tools', toolsRoutes); // For translate and tts
app.use('/api/quiz', quizRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ElectionGuide AI Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
