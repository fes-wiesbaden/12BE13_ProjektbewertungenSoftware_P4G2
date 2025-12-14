package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.ReviewAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewAnswerRepository extends JpaRepository<ReviewAnswer, UUID> {
    List<ReviewAnswer> findByReviewId(UUID reviewId);

    List<ReviewAnswer> findByQuestionId(UUID questionId);
}