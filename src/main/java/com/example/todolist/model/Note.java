package com.example.todolist.model;

import javax.persistence.*;

@Table(name = "note")
@Entity
public class Note {
    @Id
    @GeneratedValue
    @Column(name = "note_id")
    private long id;

    @Column(name = "note_content")
    private String content;

    @Column(name = "note_status")
    private String status;

    Note() {

    }

    public Note(String content, String status) {
        this.content = content;
        this.status = status;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getId() {
        return this.id;
    }

    public String getContent() {
        return this.content;
    }

    public String getStatus() {
        return this.status;
    }
}
