const mongoose = require('mongoose');

const artifactSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  // Keep the existing category system used by the museum.
  category: {
    type: String,
    enum: ['royal', 'funerary', 'religious', 'everyday', 'writing', 'art', 'monuments'],
    required: true
  },

  date: String,

  period: {
    type: String,
    enum: [
      'predynastic',
      'early-dynastic',
      'old-kingdom',
      'middle-kingdom',
      'new-kingdom',
      'late-period',
      'ptolemaic'
    ]
  },

  dynasty: String,

  imageUrl: String,

  // Existing field kept for compatibility with older artifacts.
  location: String,

  weight: String,

  // Text shown on Collection cards.
  shortDescription: String,

  // Full artifact story.
  description: String,

  // Materials entered as a repeatable list in Admin.
  materials: {
    type: [String],
    default: []
  },

  // Meaning / historical importance.
  significance: String,

  // Discovery information.
  discovery: String,

  // Person connected to the artifact.
  person: {
    name: String,
    role: String,
    slug: String
  },

  // Place connected to the artifact.
  place: {
    name: String,
    location: String,
    slug: String
  },

  // References to other artifacts in this collection.
  relatedArtifacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artifact'
  }]

}, { timestamps: true });

module.exports = mongoose.model('Artifact', artifactSchema);
