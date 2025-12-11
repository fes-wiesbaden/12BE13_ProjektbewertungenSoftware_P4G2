package de.assessify.app.assessifyapi.api.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private String projectName;

    @Column(name = "project_description", nullable = false)
    private String projectDescription;


    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProjectStatus status = ProjectStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at",  nullable = false, updatable = false)
    private LocalDateTime createdAt;

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

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Group> groups = new ArrayList<>();

    // Constructors
    public Project() {}

    public Project(String projectName) {
        this.projectName = projectName;
    }

    public Project(String projectName, String projectDescription, LocalDate startDate, LocalDate dueDate,  ProjectStatus status) {
        this.projectName = projectName;
        this.projectDescription = projectDescription;
        this.startDate = startDate;
        this.dueDate = dueDate;
        this.status = status;
    }

    public void addGroup(Group group) {
        groups.add(group);
        group.setProject(this);
    }

    public void removeGroup(Group group) {
        groups.remove(group);
        group.setProject(null);
    }
}