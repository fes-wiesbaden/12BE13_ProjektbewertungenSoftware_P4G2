package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByGroupId(UUID groupId);

    List<Review> findByReviewerId(UUID reviewerId);

    List<Review> findByRevieweeId(UUID revieweeId);

    Optional<Review> findByReviewerIdAndRevieweeIdAndGroupId(
            UUID reviewerId, UUID revieweeId, UUID groupId);

    boolean existsByReviewerIdAndGroupIdAndIsSubmitted(
            UUID reviewerId, UUID groupId, Boolean isSubmitted);
}