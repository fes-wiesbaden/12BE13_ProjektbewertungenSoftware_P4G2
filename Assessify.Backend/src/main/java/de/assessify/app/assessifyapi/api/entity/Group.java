package de.assessify.app.assessifyapi.api.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "project_group")  // renamed to avoid SQL reserved keyword "group"
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "group_id", nullable = false, unique = true)
    private UUID id;

    @Column(name="group_name", nullable = false)
    private String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToMany(mappedBy = "group")
    private List<UserProjectGroup> memberships = new ArrayList<>();

    public Group() {}

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

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public List<UserProjectGroup> getMemberships() {
        return memberships;
    }

    public void setMemberships(List<UserProjectGroup> memberships) {
        this.memberships = memberships;
    }
}
