package de.assessify.app.assessifyapi.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "review_question")
public class ReviewQuestion {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Column(name = "project_id", nullable = false)
    private UUID projectId; // Foreign key to Project

}