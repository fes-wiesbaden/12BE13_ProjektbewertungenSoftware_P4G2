package de.assessify.app.assessifyapi.api.entity;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name="academic_year")
@Data
@Builder
public class AcademicYear {

    @Id
@UuidGenerator
private UUID id;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="class_id", nullable=false)
    private ClassEntity classEntity;

    @Column(name="year_number", nullable=false)
    private Integer yearNumber; //1, 2, or 3

    @Column(name="year_name", nullable=false, length=50)
    private String yearName;  // 10BE13, 11BE13, 12BE13

    @Column(name="start_date", nullable=false)
    private LocalDate startDate;

    @Column(name="end_date", nullable=false)
    private LocalDate endDate;

    @Column(name="is_currect", nullable=false)
    @Builder.Default
    private Boolean isCurrect = false;


    // Navigation properties
    @OneToMany(mappedBy = "academicYear", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Project> projects = new HashSet<>();

    @OneToMany(mappedBy = "academicYear", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Noten> grades = new HashSet<>();

}
