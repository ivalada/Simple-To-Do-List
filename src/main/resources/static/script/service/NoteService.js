"use strict"

const DOMAIN_URL = `${window.location.href}`;

async function getAllNotes() {
    let requestParams = { method: "GET" };
    const response = await fetch(`${DOMAIN_URL}all`, requestParams);
    const notes = await response.json();
    return notes;
}

async function addNote(noteText, noteStatus) {
    let requestBody = { content: noteText, status: noteStatus };
    let requestParams = { method: "POST", body: JSON.stringify(requestBody), headers: {'Content-Type': 'application/json'} };
    const response = await fetch(`${DOMAIN_URL}add`, requestParams);
    const note = await response.json();
    return note;
}

async function updateNote(noteId, noteText, noteStatus) {
    let requestBody = { id: noteId, content: noteText, status: noteStatus };
    let requestParams = { method: "PUT", body: JSON.stringify(requestBody), headers: {'Content-Type': 'application/json'} };
    const response = await fetch(`${DOMAIN_URL}update`, requestParams);
    const note = await response.json();
    return note;
}

async function deleteNote(noteId) {
    let requestParams = { method: "DELETE" };
    const response = await fetch(`${DOMAIN_URL}delete/${noteId}`, requestParams);
    const note = await response.json();
    return note;
}

export {getAllNotes, addNote, updateNote, deleteNote};