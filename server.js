const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory storage
let notes = [];
let nextId = 1;

// API Routes

// GET all notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// GET single note by ID
app.get('/api/notes/:id', (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(note);
});

// POST create new note
app.post('/api/notes', (req, res) => {
  const { title, content, assignedTo } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newNote = {
    id: nextId++,
    title,
    content,
    assignedTo: assignedTo || '',
    createdAt: new Date().toISOString()
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// PUT update existing note
app.put('/api/notes/:id', (req, res) => {
  const { title, content, assignedTo } = req.body;
  const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    title,
    content,
    assignedTo: assignedTo || ''
  };

  res.json(notes[noteIndex]);
});

// DELETE note
app.delete('/api/notes/:id', (req, res) => {
  const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  notes.splice(noteIndex, 1);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Note-taking app server running on http://localhost:${PORT}`);
});