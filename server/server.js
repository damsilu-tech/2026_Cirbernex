require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const PORT     = process.env.PORT || 3000;
const artifacts = require('./routes/artifacts');

const app = express();

// Allow requests from file:// and localhost origins
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (file://, Postman, curl)
    // and any localhost origin
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === 'null') {
      callback(null, true);
    } else {
      callback(null, true); // allow all for development
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use('/api/artifacts', artifacts);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  })
  .catch(err => console.error(err));