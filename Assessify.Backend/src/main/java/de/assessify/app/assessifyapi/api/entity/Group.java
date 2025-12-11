package de.assessify.app.assessifyapi.api.entity;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Entity
@Table(name = "groups")
public class Group {
    @Id
    @UuidGenerator
    @Column(name = "group_id", nullable = false, unique = true)
    private UUID id;

    @Column(name="group_name", nullable = false)
    private String groupName;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;



    @OneToMany(mappedBy="group", cascade=CascadeType.ALL, orphanRemoval=true)
    @JsonIgnore
    private List<GroupMember> groupMembers = new ArrayList<>();

    

    public Group() {

    }

    public Group(String groupName, Project project ) {
        this.groupName = groupName;
        this.project = project;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public void addMember(User user){
        GroupMember groupMember = new GroupMember(user, this);
        groupMembers.add(groupMember);
    }

    public void removeMember(User user){
        groupMembers.removeIf(gm -> gm.getMember().equals(user));
    }

    public List<GroupMember> getGroupMembers(){
        return groupMembers;
    }

    public void setGroupMembers(List<GroupMember> groupMembers){
        this.groupMembers = groupMembers;
    }

}
