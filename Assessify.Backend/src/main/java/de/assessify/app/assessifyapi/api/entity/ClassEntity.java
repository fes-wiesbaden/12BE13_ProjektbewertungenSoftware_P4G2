package de.assessify.app.assessifyapi.api.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import lombok.Builder;
import lombok.Data;

@Entity
@Table(name="class")
@Data
@Builder
public class ClassEntity {
    
    @Id
@UuidGenerator
private UUID id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="course_id", nullable=false)
    private Course course;
            
    @Column(name= "cohort_year", nullable=false)
    private Integer cohortYear; // 2023, 2024, ...

    @Column(name = "name", nullable = false, length = 50)
    private String name; // "23BE13"

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable=false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable=false)
    private LocalDate endDate;

    @Column(name = "currect_academic_year", nullable = false)
    @Builder.Default
    private Integer currectAcademicYear = 1; // 1, 2, or 3

    @Column(name = "status", length=20)
    @Builder.Default
    private String status = "active";  // active, completed, archived

    @CreationTimestamp
    @Column(name = "creation_date", nullable=false, updatable=false)
    private LocalDateTime creationDate;


    // Navigation properties
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private Set<User> students = new HashSet<>();

    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private Set<ClassTeacherList> teachers = new HashSet<>();

    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private Set<AcademicYear> academicYears = new HashSet<>();

    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private Set<Project> projects = new HashSet<>();

    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private Set<Noten> grades = new HashSet<>();
    
}
