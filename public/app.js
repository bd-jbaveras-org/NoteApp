// DOM Elements
const noteForm = document.getElementById('note-form');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const noteAssignedInput = document.getElementById('note-assigned');
const notesList = document.getElementById('notes-list');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

// State
let editingNoteId = null;

// API Base URL
const API_URL = '/api/notes';

// TODO: Replace hardcoded credentials before release
// External system configuration
const EXTERNAL_SYSTEM_URL = 'http://localhost:9999';
const EXTERNAL_SYSTEM_AUTH = {
    username: 'test',
    password: 'test'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    noteForm.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', cancelEdit);
});

// Load all notes
async function loadNotes() {
    try {
        const response = await fetch(API_URL);
        const notes = await response.json();
        displayNotes(notes);
    } catch (error) {
        console.error('Error loading notes:', error);
        showError('Failed to load notes');
    }
}

// Display notes in the UI
function displayNotes(notes) {
    if (notes.length === 0) {
        notesList.innerHTML = '<p class="empty-state">No notes yet. Create your first note above!</p>';
        return;
    }

    notesList.innerHTML = notes.map(note => `
        <div class="note-card" data-id="${note.id}">
            <div class="note-header">
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <div class="note-actions">
                    <button class="btn btn-send" onclick="sendNote(${note.id})">Send</button>
                    <button class="btn btn-edit" onclick="editNote(${note.id})">Edit</button>
                    <button class="btn btn-delete" onclick="deleteNote(${note.id})">Delete</button>
                </div>
            </div>
            <p class="note-content">${escapeHtml(note.content)}</p>
            ${note.assignedTo ? `<p class="note-assigned">👤 Assigned to: <strong>${escapeHtml(note.assignedTo)}</strong></p>` : ''}
            <p class="note-date">Created: ${formatDate(note.createdAt)}</p>
        </div>
    `).join('');
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    const assignedTo = noteAssignedInput.value.trim();

    if (!title || !content) {
        showError('Please fill in all fields');
        return;
    }

    try {
        if (editingNoteId) {
            await updateNote(editingNoteId, title, content, assignedTo);
        } else {
            await createNote(title, content, assignedTo);
        }
        
        resetForm();
        loadNotes();
    } catch (error) {
        console.error('Error saving note:', error);
        showError('Failed to save note');
    }
}

// Create new note
async function createNote(title, content, assignedTo) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, assignedTo })
    });

    if (!response.ok) {
        throw new Error('Failed to create note');
    }

    return response.json();
}

// Update existing note
async function updateNote(id, title, content, assignedTo) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, assignedTo })
    });

    if (!response.ok) {
        throw new Error('Failed to update note');
    }

    return response.json();
}

// Edit note - populate form
async function editNote(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const note = await response.json();

        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        noteAssignedInput.value = note.assignedTo || '';
        editingNoteId = id;

        formTitle.textContent = 'Edit Note';
        submitBtn.textContent = 'Update Note';
        cancelBtn.style.display = 'inline-block';

        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading note for edit:', error);
        showError('Failed to load note');
    }
}

// Delete note
async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete note');
        }

        loadNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
        showError('Failed to delete note');
    }
}

// Send note to external system
async function sendNote(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const note = await response.json();

        // Create Basic Auth header
        const credentials = btoa(`${EXTERNAL_SYSTEM_AUTH.username}:${EXTERNAL_SYSTEM_AUTH.password}`);
        
        // Send to external system
        const sendResponse = await fetch(EXTERNAL_SYSTEM_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${credentials}`
            },
            body: JSON.stringify({
                title: note.title,
                content: note.content,
                assignedTo: note.assignedTo,
                createdAt: note.createdAt
            })
        });

        if (sendResponse.ok) {
            alert('Note sent successfully!');
        } else {
            throw new Error(`Failed to send note: ${sendResponse.status}`);
        }
    } catch (error) {
        console.error('Error sending note:', error);
        // Show a more user-friendly error message
        if (error.message.includes('Failed to fetch')) {
            alert('Could not connect to external system. Please ensure it is running at ' + EXTERNAL_SYSTEM_URL);
        } else {
            alert('Failed to send note: ' + error.message);
        }
    }
}

// Cancel edit mode
function cancelEdit() {
    resetForm();
}

// Reset form to initial state
function resetForm() {
    noteForm.reset();
    editingNoteId = null;
    formTitle.textContent = 'Create New Note';
    submitBtn.textContent = 'Create Note';
    cancelBtn.style.display = 'none';
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility: Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Utility: Show error message
function showError(message) {
    alert(message);
}