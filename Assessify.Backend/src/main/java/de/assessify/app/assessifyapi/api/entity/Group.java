package de.assessify.app.assessifyapi.api.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "groups")
public class Group {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="group_id", nullable=false, unique=true)
    private UUID id;
    
    private String name;
    
    // Constructors
    public Group() {}
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
}