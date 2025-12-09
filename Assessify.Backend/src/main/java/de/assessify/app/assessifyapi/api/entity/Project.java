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
    @Column(name = "id", nullable = false, unique = true)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String projectName;

    @Column(name = "description", nullable = false)
    private String projectDescription;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "deadline", nullable = false)
    private String deadline;

  @Column(name = "start_date", nullable = false)
    private String StartDate;

    public UUID getId() {
        return id;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String name) {
        this.projectName = name;
    }

    public String getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(String description) {
        this.projectDescription = description;
    }

    @ManyToMany
    @JoinTable(
            name = "project_training-module",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "training-module_id")
    )
    private final List<TrainingModule> trainingModules = new ArrayList<>();

    public List<TrainingModule> getTrainingModules() {
        return trainingModules;
    }

    public void setTrainingModules(List<TrainingModule> trainingModules) {
        this.trainingModules.clear();
        this.trainingModules.addAll(trainingModules);
    }


    @OneToMany(mappedBy = "project")
    private List<UserProjectGroup> userProjectGroups = new ArrayList<>();

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String Deadline) {
        this.deadline = Deadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String Status) {
        this.status = Status;
    }

    public void setStartDate(String StartDate) {
        this.StartDate = StartDate;
    }

    public String getStartDate() {
        return StartDate;
    }
}
