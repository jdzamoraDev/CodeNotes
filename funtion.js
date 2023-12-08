document.addEventListener('DOMContentLoaded', loadNotes);

function saveNote() {
    const content = document.getElementById('note-content').value.trim();
    const color = document.getElementById('note-color').value;

    if (content === '') {
        alert('Please enter note content');
        return;
    }

    const note = {
        content,
        color,
        timestamp: new Date().getTime(),
    };

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));

    loadNotes();
}

function loadNotes() {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';

    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.sort((a, b) => b.timestamp - a.timestamp); // Sort by creation time

    notes.forEach((note) => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.style.borderLeftColor = note.color;
        noteElement.innerHTML = `
            <p>${note.content}</p>
            <button onclick="editNote(${note.timestamp})">Edit</button>
            <button onclick="deleteNote(${note.timestamp})">Delete</button>
        `;
        notesContainer.appendChild(noteElement);
    });
}

function editNote(timestamp) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToEdit = notes.find((note) => note.timestamp === timestamp);

    const modalContent = `
        <label for="edit-content">Edit Note:</label>
        <textarea id="edit-content">${noteToEdit.content}</textarea>
        <button onclick="saveEditedNote(${timestamp})">Save</button>
    `;

    showModal('Edit Note', modalContent);
}

function showModal(title, content) {
    const modalElement = document.createElement('div');
    modalElement.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.innerHTML = `
        <span class="close" onclick="closeModal()">&times;</span>
        <h2>${title}</h2>
        ${content}
    `;

    modalElement.appendChild(modalContent);
    document.body.appendChild(modalElement);
}

function closeModal() {
    const modalElement = document.querySelector('.modal');
    if (modalElement) {
        modalElement.remove();
    }
}

function saveEditedNote(timestamp) {
    const editedContent = document.getElementById('edit-content').value;

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToEdit = notes.find((note) => note.timestamp === timestamp);

    if (editedContent.trim() !== '') {
        noteToEdit.content = editedContent;
        localStorage.setItem('notes', JSON.stringify(notes));
        closeModal();
        loadNotes();
    } else {
        alert('Note content cannot be empty');
    }
}

function deleteNote(timestamp) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter((note) => note.timestamp !== timestamp);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}
