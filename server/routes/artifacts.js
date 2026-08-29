const express  = require('express');
const router   = express.Router();
const Artifact = require('../models/Artifact');

// GET all artifacts (optional ?category=royal filter)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const artifacts = await Artifact.find(filter).sort({ createdAt: -1 });
    res.json(artifacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single artifact
router.get('/:id', async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id);
    if (!artifact) return res.status(404).json({ error: 'Not found' });
    res.json(artifact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create artifact
router.post('/', async (req, res) => {
  try {
    const artifact = await Artifact.create(req.body);
    res.status(201).json(artifact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update artifact
router.put('/:id', async (req, res) => {
  try {
    const artifact = await Artifact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(artifact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE artifact
router.delete('/:id', async (req, res) => {
  try {
    await Artifact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;