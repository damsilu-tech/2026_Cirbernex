require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
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

mongoose.connect('mongodb://physics:physics@ac-gih4rk2-shard-00-00.yjbdsch.mongodb.net:27017,ac-gih4rk2-shard-00-01.yjbdsch.mongodb.net:27017,ac-gih4rk2-shard-00-02.yjbdsch.mongodb.net:27017/egyptmuseum?ssl=true&replicaSet=atlas-1nbyad-shard-0&authSource=admin&appName=Cluster0', {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.error(err));