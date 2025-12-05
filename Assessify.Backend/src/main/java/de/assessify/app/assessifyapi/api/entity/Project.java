package de.assessify.app.assessifyapi.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "project")
public class Project {
    @Id
    @UuidGenerator
    @Column(name = "project_id", nullable = false, unique = true)
    private UUID id;

    @Column(name = "project_name", nullable = false)
    private String ProjectName;

    @Column(name = "project_description", nullable = false)
    private String ProjectDescription;

    public UUID getId() {
        return id;
    }

    public String getProjectName (){
        return ProjectName;
    }

    public void setProjectName(String name){
        this.ProjectName = name;
    }

    public String getProjectDescription(){
        return ProjectDescription;
    }

    public void setProjectDescription(String description){
        this.ProjectDescription = description;
    }

    @ManyToMany
    @JoinTable(
            name = "project_training-module",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "training-module_id")
    )
    private final List<TrainingModule> trainingModules = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public List<TrainingModule> getTrainingModules() {
        return trainingModules;
    }

    public void setTrainingModules(List<TrainingModule> trainingModules) {
        this.trainingModules.clear();
        this.trainingModules.addAll(trainingModules);
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews.clear();
        this.reviews.addAll(reviews);
    }
    @OneToMany(mappedBy = "project")
    private List<UserProjectGroup> userProjectGroups = new ArrayList<>();
}