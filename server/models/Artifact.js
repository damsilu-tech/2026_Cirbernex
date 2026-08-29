const mongoose = require('mongoose');

const artifactSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  category:    {
    type: String,
    enum: ['royal', 'funerary', 'religious', 'everyday', 'writing', 'art', 'monuments'],
    required: true
  },
  date:        String,        // e.g. "c. 1275 BCE"
  period: {
    type: String,
    enum: ['predynastic', 'early-dynastic', 'old-kingdom', 'middle-kingdom', 'new-kingdom', 'late-period', 'ptolemaic'],
  },
  description: String,
  imageUrl:    String,
  location:    String,        // e.g. "British Museum, London"
  dynasty:     String,        // e.g. "18th Dynasty"
  weight:      String,        // optional extra fact
}, { timestamps: true });

module.exports = mongoose.model('Artifact', artifactSchema);