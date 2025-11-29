require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const allowedOrigins = [
  "https://aarasalons6.onrender.com",
  "https://aarasalons5.onrender.com" ,// Render preview URL (update later)
  // "https://www.aarasalons.com",         // your custom domain (later)
  "http://localhost:4000"               // local dev (optional)
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser tools or same-origin
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
// ----------------------
// ✅ Middleware
// ----------------------
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------
// ✅ Routes
// ----------------------
const bookingRoutes = require('./src/routes/bookingRoutes');
app.use('/api', bookingRoutes);

// ----------------------
// ✅ Health Check Endpoint
// ----------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    message: '💇‍♀️ AARA Salon API is running smoothly',
    time: new Date().toISOString(),
  });
});

// ----------------------
// ✅ MongoDB Connection
// ----------------------
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/aarasalon';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

// ----------------------
// ✅ Global Error Handler
// ----------------------
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server!',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal Server Error',
  });
});

module.exports = app;
