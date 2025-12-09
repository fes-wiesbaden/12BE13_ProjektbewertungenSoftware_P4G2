package de.assessify.app.assessifyapi.api.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

//import javax.validation.constraints.Min;
//import javax.validation.constraints.Max;

import java.math.BigDecimal;

import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "review_answer",
uniqueConstraints = {
        @UniqueConstraint(columnNames = {"review_id", "question_id"})
})
@Data
@Builder
public class ReviewAnswer {

    @Id
@UuidGenerator
private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private ReviewQuestion question;

    @Column(name = "rate", nullable = false)
    private BigDecimal rate; // Rating (e.g., 1 - 6)

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment; // Optional comment for this specific question
}
