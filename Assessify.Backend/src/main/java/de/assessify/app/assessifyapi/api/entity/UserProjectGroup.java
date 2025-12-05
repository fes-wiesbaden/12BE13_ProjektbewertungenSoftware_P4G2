package de.assessify.app.assessifyapi.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.util.UUID;

@Entity
@Table(name = "user_project_group")
public class UserProjectGroup {
    
    @Id
    @UuidGenerator
    @Column(name = "id", nullable = false, unique = true)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;
    
    @Column(name = "role")
    private String role; // e.g., "MEMBER", "ADMIN", "OWNER"
    
    // Constructors
    public UserProjectGroup() {}
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    
    public Group getGroup() { return group; }
    public void setGroup(Group group) { this.group = group; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}