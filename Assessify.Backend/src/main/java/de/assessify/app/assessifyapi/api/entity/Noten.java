package de.assessify.app.assessifyapi.api.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import lombok.Builder;
import lombok.Data;

@Entity
@Table(name = "noten")
@Data
@Builder
public class Noten {
    
    @Id
@UuidGenerator
private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lernfeld_id", nullable = false)
    private Lernfeld lernfeld;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "value", nullable = false, precision = 5, scale = 2)
    private BigDecimal value; // Grade value (e.g., 85.50)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "given_by", nullable = false)
    private User givenBy; // Teacher who gave the grade

    @Column(name = "teacher_comment", columnDefinition = "TEXT")
    private String teacherComment;

    @CreationTimestamp
    @Column(name = "date", nullable = false, updatable = false)
    private LocalDateTime date;
}
