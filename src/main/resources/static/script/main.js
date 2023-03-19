"use strict"

import * as NoteService from "./service/NoteService.js";

function loadNotesFromDB() {
    NoteService.getAllNotes()
    .then( notes => {
        for (const note of notes) {
            addNewNote(note['id'], note['content'], note['status']);
        }
    });

    return;
}

function clickNoteButton(event) {
    let note = event.target.parentNode.parentNode.parentNode;
    let target = event.target;
    if (target.parentNode.classList.contains('deleteBtn')) {
        deleteNote(note);
    }
    else if (target.parentNode.classList.contains('changeBtn')) {
        turnEditMode(note);
    }
    else if (target.parentNode.classList.contains('doneBtn')) {
        note = event.target.parentNode.parentNode;
        markNoteDone(note);
    }
    return;
}

function validateSubmit(event) {
    let textArea = document.getElementById('noteTextArea');
    let noteText = textArea.value.trim();
    if ( noteText == '' ) {
        showErrorMessage('Введите допустимое значение!');
        return;
    }
    if (noteText.length > 80) {
        showErrorMessage('Превышена максимальная длина (80 символов)!');
        return;
    }

    if (textArea.classList.contains('add')) {
        NoteService.addNote(noteText, "active")
        .then( note => {
            addNewNote(note['id'], note['content'], note['status']);
        });
    } else if (textArea.classList.contains('edit')) {
        if (noteText == document.querySelector(".modified").getAttribute("oldValue")) {
            disableEditMode();
            textArea.value = '';
            return;
        }
        NoteService.updateNote(textArea.getAttribute('modid'), noteText, textArea.getAttribute('modstatus'))
        .then( note => {
            const modNote = document.querySelector(".modified");
            modNote.querySelector('.noteText').textContent = note['content'];
            disableEditMode();
        });
    }

    textArea.value = '';

    return;
}

function addNewNote(id, text, status) {
    let newNote = document.createElement('div');
    newNote.className = 'note';

    let newNoteTextSpan = document.createElement('span');
    newNoteTextSpan.className = 'noteText';
    newNoteTextSpan.textContent = text;
    
    let noteBtnsDiv = document.createElement('div');
    noteBtnsDiv.className = 'noteBtns';

    let doneBtn = document.createElement('button');
    doneBtn.name = 'doneButton';
    doneBtn.className = 'noteBtn';
    doneBtn.classList.add('doneBtn');
    let doneIconSpan = document.createElement('span');
    doneIconSpan.classList.add('fa', ( (status == 'active') ? 'fa-square-o' : 'fa-check-square'));
    doneBtn.append(doneIconSpan);

    let changeBtn = document.createElement('button');
    changeBtn.name = 'changeButton';
    changeBtn.className = 'noteBtn';
    changeBtn.classList.add('changeBtn');
    let editIconSpan = document.createElement('span');
    editIconSpan.classList.add('fa', 'fa-pencil');
    changeBtn.append(editIconSpan);

    let deleteBtn = document.createElement('button');
    deleteBtn.name = 'deleteButton';
    deleteBtn.className = 'noteBtn';
    deleteBtn.classList.add('deleteBtn');
    let deleteIconSpan = document.createElement('span');
    deleteIconSpan.classList.add('fa', 'fa-trash-o');
    deleteBtn.append(deleteIconSpan);

    noteBtnsDiv.append(changeBtn);
    noteBtnsDiv.append(deleteBtn);

    newNote.append(doneBtn);
    newNote.append(newNoteTextSpan);
    newNote.append(noteBtnsDiv);
    
    newNote.classList.add(status);

    newNote.setAttribute("tabid", id);

    newNote.classList.toggle('adding');
    newNote.addEventListener('animationend', function handler() {
        this.classList.toggle('adding');
        this.removeEventListener('animationend', handler);
    } );

    document.getElementById('notesContainer').append(newNote);

    return;
}

function deleteNote(note) {
    NoteService.deleteNote(note.getAttribute('tabid'))
    .then( () => {
        note.classList.toggle('deleting');
        note.addEventListener('animationend', function handler() {
            this.classList.toggle('deleting');
            this.removeEventListener('animationend', handler);
            this.remove();
        });
    });

    return;
}

function markNoteDone(note) {
    let status_old = note.classList[1];
    let status_new = (status_old == 'active') ? 'done' : 'active';
    let doneBtnClass_old = (status_new == 'done') ? 'fa-square-o' : 'fa-check-square';
    let doneBtnClass_new = (status_new == 'done') ? 'fa-check-square' : 'fa-square-o';
    
    NoteService.updateNote(note.getAttribute('tabid'), note.querySelector('.noteText').textContent, status_new)
    .then( () => {
        note.classList.replace(status_old, status_new);
        note.querySelector('.fa').classList.replace(doneBtnClass_old, doneBtnClass_new);
    });
    
    return;
}

function turnEditMode(note) {
    if ( !(document.querySelector('.modified') === null) ) {
        showErrorMessage('Редактирование не завершено!');
        return;
    }
    note.classList.toggle('modified');
    note.setAttribute("oldValue", note.querySelector('.noteText').textContent);

    const textArea = document.getElementById('noteTextArea');
    textArea.value = note.querySelector('.noteText').textContent;
    textArea.classList.replace('add', 'edit');
    textArea.setAttribute('modid', note.getAttribute('tabid'));
    textArea.setAttribute('modstatus', note.classList[1]);
    textArea.addEventListener('input', updateModifiedNote);

    const editNoteBtn = note.querySelector('.noteBtn.changeBtn');
    editNoteBtn.classList.toggle('fa-pulse');

    const submitNoteBtn = document.getElementById('submitNoteBtn');
    submitNoteBtn.textContent = 'Изменить';
    submitNoteBtn.classList.replace('add', 'edit');
    
    return;
}

function disableEditMode() {
    const textArea =  document.getElementById('noteTextArea');
    textArea.classList.replace('edit', 'add');
    textArea.removeAttribute('modid');
    textArea.removeAttribute('modstatus');
    textArea.removeEventListener('input', updateModifiedNote);

    const modNote = document.querySelector(".modified");
    const modNoteText = modNote.querySelector('.noteText');
    modNote.classList.toggle("modified");
    modNote.removeAttribute("oldValue");
    modNoteText.textContent = modNoteText.textContent.trim();

    const editNoteBtn = modNote.querySelector('.noteBtn.changeBtn');
    editNoteBtn.classList.toggle('fa-pulse');

    const submitNoteBtn = document.getElementById('submitNoteBtn');
    submitNoteBtn.textContent = 'Добавить';
    submitNoteBtn.classList.replace('edit', 'add');

    return;
}

function showErrorMessage(text) {
    let errorMsg = document.createElement('div');
    errorMsg.className = 'errorMessage';
    errorMsg.textContent = text;
    document.body.prepend(errorMsg);
    setTimeout(() => {
        errorMsg.classList.toggle('deleting');
        errorMsg.addEventListener('animationend', function handler() {
            this.classList.toggle('deleting');
            this.removeEventListener('animationend', handler);
            this.remove();
        });
    }, 2000);
    return;
}

function updateModifiedNote(event) {
    const modNoteText = document.querySelector('.note.modified .noteText');
    modNoteText.textContent = event.target.value;
    return;
}

loadNotesFromDB();
document.getElementById('submitNoteBtn').addEventListener('click', validateSubmit);
document.getElementById('notesContainer').addEventListener('click', clickNoteButton);