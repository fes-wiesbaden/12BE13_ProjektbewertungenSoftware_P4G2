package de.assessify.app.assessifyapi.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "training_module")
public class TrainingModule {
    @Id
    @UuidGenerator
    @Column(name = "training_module_id", nullable = false, unique = true)
    private UUID id;

    @Column(name = "training_module_name", nullable = false)
    private String name;

    @Column(name = "training_module_description", nullable = false)
    private String description;

    @Column(name = "training_module_weighting_hours", nullable = false)
    private int weightingHours;

    @ManyToMany(mappedBy = "trainingModules")
    @JsonIgnore
    private List<User> users = new ArrayList<>();

    @ManyToMany(mappedBy = "trainingModules")
    @JsonIgnore
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = "trainingModules", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Grade> grades = new ArrayList<>();

    @ManyToMany(mappedBy = "trainingModules")
    @JsonIgnore
    private List<SchoolClass> schoolClasses = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getWeightingHours() {
        return weightingHours;
    }

    public void setWeightingHours(int weightingHours) {
        this.weightingHours = weightingHours;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public List<Grade> getGrades() {
        return grades;
    }

    public void setGrades(List<Grade> grades) {
        this.grades = grades;
    }

    public UUID getId() {
        return id;
    }

}
