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

    @ManyToMany
    @JoinTable(
            name = "project_training-module",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "training-module_id")
    )
    private List<TrainingModule> trainingModules = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "project")
    private List<UserProjectGroup> userProjectGroups = new ArrayList<>();
}