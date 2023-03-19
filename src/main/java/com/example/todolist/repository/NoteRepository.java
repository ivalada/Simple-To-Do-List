package com.example.todolist.repository;

import org.springframework.data.repository.CrudRepository;

import com.example.todolist.model.Note;

public interface NoteRepository extends CrudRepository<Note, Long> {
    
}
