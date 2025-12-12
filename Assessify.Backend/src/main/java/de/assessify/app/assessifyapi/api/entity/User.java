package de.assessify.app.assessifyapi.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @UuidGenerator
    @Column(name = "user_id", nullable = false, unique = true)
    private UUID id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "role_id")
    private Integer roleId;

    @ManyToMany
    @JoinTable(
            name = "user_training_module",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "training_module_id")
    )
    private List<TrainingModule> trainingModules = new ArrayList<>();


    // many to many with schoolclass (for students)
    @ManyToMany
    @JoinTable(
            name = "user_schoolclass",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "class_id")
    )
    @JsonIgnore
    private List<SchoolClass> schoolClasses = new ArrayList<>();


    // teachers assigned to classes (bidirectional)
    @OneToMany(mappedBy = "teacher" , cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ClassTeacherList> teacherClassAssignments = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Grade> grades = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();


    // members
    @OneToMany(mappedBy="member", cascade= CascadeType.ALL, orphanRemoval=true)
    @JsonIgnore
    private List<GroupMember> groupMemberships = new ArrayList<>();

    public List<GroupMember> getGroupMemberships(){
        return groupMemberships;
    
    }

    public void setGroupMemberships(List<GroupMember> groupMembership){
        this.groupMemberships = groupMemberships;
    }


    // @ManyToOne
    // @JoinColumn(name = "school_class_id")
    // private SchoolClass schoolClasses;

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }


    // Helper methods
    public void addSchoolClass(SchoolClass schoolClass) {
        schoolClasses.add(schoolClass);
        schoolClass.getUsers().add(this);
    }
    
    public void removeSchoolClass(SchoolClass schoolClass) {
        schoolClasses.remove(schoolClass);
        schoolClass.getUsers().remove(this);
    }




    public UUID getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public List<TrainingModule> getTrainingModules() {
        return trainingModules;
    }

    public void setTrainingModules(List<TrainingModule> trainingModules) {
        this.trainingModules = trainingModules;
    }

    public List<SchoolClass> getSchoolClasses() {
        return schoolClasses;
    }

    public void setSchoolClasses(List<SchoolClass> schoolClasses) {
        this.schoolClasses = schoolClasses;
    }

    public List<Grade> getGrades() {
        return grades;
    }

    public void setGrades(List<Grade> grades) {
        this.grades = grades;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public List<SchoolClass> getSchoolClass (){
        return schoolClasses;
    }

    public void setSchoolClass (List<SchoolClass> schoolClasses){
        this.schoolClasses = schoolClasses;
    }

    public List<ClassTeacherList> getTeacherClassAssignments (){
        return teacherClassAssignments;
    }
}
