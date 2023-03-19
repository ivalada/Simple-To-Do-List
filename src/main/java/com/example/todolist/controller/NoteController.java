package com.example.todolist.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.example.todolist.model.Note;
import com.example.todolist.service.NoteService;

@Controller
public class NoteController {
    
    @Autowired
    NoteService noteService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    private String showAllNotes() {
        return "index";
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    @ResponseBody
    private List<Note> getAllNotes() {
        return noteService.getAllNotes();
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    private Note addNote(@RequestBody Note note) {
        noteService.saveOrUpdateNote(note);
        return note;
    }

    @RequestMapping(value = "/update", method = RequestMethod.PUT)
    @ResponseBody
    private Note updateNote(@RequestBody Note note) {
        noteService.saveOrUpdateNote(note);
        return note;
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    private Note deleteNote(@PathVariable long id) {
        Note note = noteService.getNoteById(id);
        noteService.deleteNote(id);
        return note;
    }

}
