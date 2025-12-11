package de.assessify.app.assessifyapi.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.time.LocalDate;
import java.time.Month;

@Entity
@Data
@Table(name = "school_class")
public class SchoolClass {
    @Id
    @UuidGenerator
    @Column(name = "class_id", nullable = false, unique = true)
    private UUID id;

    @Column(name = "course_name", nullable = false)
    private String courseName;

    @Column(name = "class_name", nullable = false)
    private String className;

    // many to many with users (students)
    @ManyToMany(mappedBy = "schoolClasses")
    @JsonIgnore
    private List<User> users = new ArrayList<>();


    // teachers assigned to this class (bidirectional)
    @OneToMany(mappedBy = "schoolClass", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ClassTeacherList> classTeacherAssignments = new ArrayList<>();

    public void setClassName(String className) {
        this.className = className;
    }


    public SchoolClass () {}

    public SchoolClass ( String courseName){
        this.courseName = courseName;
        calculateClass();
    }

    public List<User> getUsers(){
        return users;
    }

    @PrePersist
    @PreUpdate
    private void updateClassName() {
        calculateClass();
    }

    public void calculateClass(){
        if (courseName == null || courseName.length() < 6) {
            return;
        }

        String yearPrefix = courseName.substring(0, 2);
        int startYearShort = Integer.parseInt(yearPrefix);
        int startYear = startYearShort + 2000;


        String suffix = courseName.substring(courseName.length() - 4);

        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();
        Month currentMonth = now.getMonth();
        int currentDay = now.getDayOfMonth();

        boolean newSchoolYearStarted = (currentMonth.getValue() > 8) || (currentMonth.getValue() == 8 && currentDay >= 1);

        int schoolYearBase = currentYear;
        if (!newSchoolYearStarted) {
            schoolYearBase = currentYear - 1;
        }

        int apprenticeShipYear = schoolYearBase - startYear + 1;

        switch (apprenticeShipYear) {
            case 1: className = "10" + suffix; break;
            case 2: className = "11" + suffix; break;
            case 3: className = "12" + suffix; break;
            default: className = "false";
        }

    }

    // Helper methods
    public void addTeacher(User teacher) {
        ClassTeacherList assignment = new ClassTeacherList(teacher, this);
        classTeacherAssignments.add(assignment);
        teacher.getTeacherClassAssignments().add(assignment);
    }
    
    public void removeTeacher(User teacher) {
        classTeacherAssignments.removeIf(assignment -> 
            assignment.getTeacher().equals(teacher));
    }
}