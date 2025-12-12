package de.assessify.app.assessifyapi.api.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Data
@Table(name = "grade")
public class Grade {
    @Id
    @UuidGenerator
    @Column(name = "grade_id", nullable = false, unique = true)
    private UUID id;

    @Column(name = "gradeName")
    private String gradeName;

    @Column(name = "value", nullable = false)
    private float value;

    @Column(name = "grade_weighting", nullable = false)
    private int gradeWeighting;

    @Column(name = "date", nullable = false)
    private Date date;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "training_module_id", nullable = false)
    @JsonBackReference
    private TrainingModule trainingModules;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
