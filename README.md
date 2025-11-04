# 📝 Note Taking App

A simple, lightweight note-taking application built with Node.js and Express. Features a clean web interface for creating, viewing, editing, and deleting notes.

## Features

- ✨ Create new notes with title and content
- 📖 View all notes in a clean, organized list
- ✏️ Edit existing notes
- 🗑️ Delete notes
- 💾 In-memory storage (data resets on server restart)
- 🎨 Beautiful, responsive UI with gradient design
- ⚡ Fast and lightweight

## Prerequisites

- Node.js (version 12 or higher)
- npm (comes with Node.js)

## Installation

1. Navigate to the project directory:
```bash
cd NoteApp
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your web browser and navigate to:
```
http://localhost:3000
```

3. Start creating notes!

## Project Structure

```
NoteApp/
├── server.js           # Express server with REST API
├── package.json        # Project dependencies
├── README.md          # This file
└── public/            # Static files
    ├── index.html     # Main web interface
    ├── styles.css     # Styling
    └── app.js         # Client-side JavaScript
```

## API Endpoints

The application provides the following REST API endpoints:

- `GET /api/notes` - Retrieve all notes
- `GET /api/notes/:id` - Retrieve a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update an existing note
- `DELETE /api/notes/:id` - Delete a note

### Example API Usage

**Create a note:**
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Note content here"}'
```

**Get all notes:**
```bash
curl http://localhost:3000/api/notes
```

## How It Works

1. **Backend**: Express.js server handles API requests and serves static files
2. **Storage**: Notes are stored in-memory (array) and reset when the server restarts
3. **Frontend**: Vanilla JavaScript handles UI interactions and API calls
4. **Styling**: Clean, modern CSS with responsive design

## Notes

- Data is stored in-memory and will be lost when the server restarts
- The server runs on port 3000 by default
- No database setup required - perfect for quick note-taking

## License

ISC