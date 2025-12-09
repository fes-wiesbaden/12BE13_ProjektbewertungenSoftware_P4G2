package de.assessify.app.assessifyapi.api.entity;

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
@Table(name = "course")
@Data
@Builder
public class Course {

    @Id
@UuidGenerator
private UUID id;

    @Column(name = "code", nullable = false, length = 10)
    private String code; // "BE", "IT", "AI"

    @Column(name = "name", nullable = false, length = 10)
    private String name;

    @Column(name = "description", nullable = false, length = 10)
    private String description;

    @Column(name = "duration_years", nullable = false, length = 10)
    @Builder.Default
    private Integer durationYears = 3;

    @CreationTimestamp
    @Column(name = "creation_date", nullable=false, updatable=false)
    private LocalDateTime creationDate;

    // Navigation properties
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private Set<ClassEntity> classes = new HashSet<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private Set<Lernfeld> lernfelds = new HashSet<>();
}
