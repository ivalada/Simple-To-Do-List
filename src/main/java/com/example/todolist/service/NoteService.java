package com.example.todolist.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todolist.model.Note;
import com.example.todolist.repository.NoteRepository;

@Service
public class NoteService {
    @Autowired
    NoteRepository noteRepository;

    public List<Note> getAllNotes() {
        List<Note> notes = new ArrayList<Note>();
        for (Note note : noteRepository.findAll()) {
            notes.add(note);
        }
        return notes;
    }
    
    public Note getNoteById(long id) {
        Note note = noteRepository.findById(id).get();
        return note;
    }

    public void deleteNote(long id) {
        noteRepository.deleteById(id);
    }

    public void saveOrUpdateNote(Note note) {
        noteRepository.save(note);
    }

}
