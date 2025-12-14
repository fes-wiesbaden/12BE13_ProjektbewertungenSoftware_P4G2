package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.ReviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewQuestionRepository extends JpaRepository<ReviewQuestion, UUID> {
    List<ReviewQuestion> findByProjectId(UUID projectId);
}