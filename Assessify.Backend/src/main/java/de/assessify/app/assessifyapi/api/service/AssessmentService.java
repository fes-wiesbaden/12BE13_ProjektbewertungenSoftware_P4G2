package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.dtos.request.AssessmentSubmissionDto;
import de.assessify.app.assessifyapi.api.dtos.request.MemberRatingDto;
import de.assessify.app.assessifyapi.api.dtos.request.QuestionRatingDto;
import de.assessify.app.assessifyapi.api.dtos.response.GroupAssessmentStatisticsDto;
import de.assessify.app.assessifyapi.api.dtos.response.MemberStatisticsDto;
import de.assessify.app.assessifyapi.api.dtos.response.ReviewAnswerDto;
import de.assessify.app.assessifyapi.api.dtos.response.ReviewResponseDto;
import de.assessify.app.assessifyapi.api.entity.Review;
import de.assessify.app.assessifyapi.api.entity.ReviewAnswer;
import de.assessify.app.assessifyapi.api.entity.ReviewQuestion;
import de.assessify.app.assessifyapi.api.repository.ReviewAnswerRepository;
import de.assessify.app.assessifyapi.api.repository.ReviewQuestionRepository;
import de.assessify.app.assessifyapi.api.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewAnswerRepository reviewAnswerRepository;

    @Autowired
    private ReviewQuestionRepository reviewQuestionRepository;

    @Transactional
    public List<ReviewResponseDto> submitAssessment(AssessmentSubmissionDto dto) {

        // Check if already submitted
        if (reviewRepository.existsByReviewerIdAndGroupIdAndIsSubmitted(
                dto.reviewerId(), dto.groupId(), true)) {
            throw new RuntimeException("Assessment already submitted for this group");
        }

        List<Review> createdReviews = new ArrayList<>();

        // For each question, create reviews for each member being rated
        for (QuestionRatingDto questionRating : dto.questionRatings()) {

            // Get question details
            ReviewQuestion question = reviewQuestionRepository.findById(questionRating.questionId())
                    .orElseThrow(() -> new RuntimeException("Question not found: " + questionRating.questionId()));

            // For each member rating in this question
            for (MemberRatingDto memberRating : questionRating.ratings()) {

                // Find or create review for this reviewer-reviewee pair
                Review review = reviewRepository
                        .findByReviewerIdAndRevieweeIdAndGroupId(
                                dto.reviewerId(),
                                memberRating.revieweeId(),
                                dto.groupId())
                        .orElse(new Review());

                // Set review details if new
                if (review.getId() == null) {
                    review.setReviewerId(dto.reviewerId());
                    review.setRevieweeId(memberRating.revieweeId());
                    review.setGroupId(dto.groupId());
                    review.setIsSubmitted(false);
                    review.setCreationDate(LocalDateTime.now());
                }

                // Create answer for this question
                ReviewAnswer answer = new ReviewAnswer();
                answer.setQuestionId(questionRating.questionId());
                answer.setRate(memberRating.rating());
                answer.setComment(null); // Can be extended to include per-question comments

                review.addAnswer(answer);

                createdReviews.add(review);
            }
        }

        // Mark all reviews as submitted and set submission date
        LocalDateTime submissionDate = LocalDateTime.now();
        createdReviews.forEach(review -> {
            review.setIsSubmitted(true);
            review.setSubmissionDate(submissionDate);
            if (dto.comment() != null && !dto.comment().isBlank()) {
                review.setComment(dto.comment());
            }
        });

        // Save all reviews
        List<Review> savedReviews = reviewRepository.saveAll(createdReviews);

        // Convert to DTOs
        return savedReviews.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDto> getReviewsByReviewer(UUID reviewerId) {
        return reviewRepository.findByReviewerId(reviewerId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDto> getReviewsByReviewee(UUID revieweeId) {
        return reviewRepository.findByRevieweeId(revieweeId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDto> getReviewsByGroup(UUID groupId) {
        return reviewRepository.findByGroupId(groupId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    private ReviewResponseDto toResponseDto(Review review) {
        List<ReviewAnswerDto> answerDtos = review.getAnswers().stream()
                .map(answer -> {
                    ReviewQuestion question = reviewQuestionRepository
                            .findById(answer.getQuestionId())
                            .orElse(null);

                    return new ReviewAnswerDto(
                            answer.getId(),
                            answer.getQuestionId(),
                            question != null ? question.getQuestionText() : null,
                            answer.getRate(),
                            answer.getComment()
                    );
                })
                .collect(Collectors.toList());

        return new ReviewResponseDto(
                review.getId(),
                review.getReviewerId(),
                review.getRevieweeId(),
                review.getGroupId(),
                review.getComment(),
                review.getIsSubmitted(),
                review.getSubmissionDate(),
                review.getCreationDate(),
                answerDtos
        );
    }

    /**
     * Check if reviewer has already submitted assessment for a group
     */
    public boolean hasAlreadySubmitted(UUID reviewerId, UUID groupId) {
        return reviewRepository.existsByReviewerIdAndGroupIdAndIsSubmitted(
                reviewerId, groupId, true);
    }

    /**
     * Get statistics for a group's assessments
     */
    @Transactional(readOnly = true)
    public GroupAssessmentStatisticsDto getGroupStatistics(UUID groupId) {
        List<Review> reviews = reviewRepository.findByGroupId(groupId);

        if (reviews.isEmpty()) {
            return new GroupAssessmentStatisticsDto(
                    groupId, 0, 0, 0, 0.0, List.of()
            );
        }

        // Get unique reviewees (members being reviewed)
        Set<UUID> revieweeIds = reviews.stream()
                .map(Review::getRevieweeId)
                .collect(Collectors.toSet());

        // Calculate member statistics
        List<MemberStatisticsDto> memberStats = revieweeIds.stream()
                .map(revieweeId -> calculateMemberStatistics(revieweeId, reviews))
                .collect(Collectors.toList());

        // Count submitted reviews
        long submittedCount = reviews.stream()
                .filter(Review::getIsSubmitted)
                .count();

        int totalMembers = revieweeIds.size();
        int totalExpected = totalMembers * (totalMembers - 1); // Everyone reviews everyone else
        double completionPercentage = totalExpected > 0
                ? (submittedCount * 100.0) / totalExpected
                : 0.0;

        return new GroupAssessmentStatisticsDto(
                groupId,
                totalMembers,
                (int) submittedCount,
                totalExpected,
                completionPercentage,
                memberStats
        );
    }

    /**
     * Calculate statistics for a specific member
     */
    private MemberStatisticsDto calculateMemberStatistics(
            UUID memberId, List<Review> allReviews) {

        // Filter reviews for this member
        List<Review> memberReviews = allReviews.stream()
                .filter(r -> r.getRevieweeId().equals(memberId) && r.getIsSubmitted())
                .collect(Collectors.toList());

        if (memberReviews.isEmpty()) {
            return new MemberStatisticsDto(
                    memberId,
                    "Unknown", // You might want to fetch actual name
                    0.0,
                    0,
                    Map.of()
            );
        }

        // Calculate average rating across all answers
        List<ReviewAnswer> allAnswers = memberReviews.stream()
                .flatMap(r -> r.getAnswers().stream())
                .collect(Collectors.toList());

        double totalRating = allAnswers.stream()
                .mapToInt(ReviewAnswer::getRate)
                .sum();

        double averageRating = allAnswers.isEmpty()
                ? 0.0
                : totalRating / allAnswers.size();

        // Calculate average per question
        Map<UUID, Double> questionAverages = allAnswers.stream()
                .collect(Collectors.groupingBy(
                        ReviewAnswer::getQuestionId,
                        Collectors.averagingInt(ReviewAnswer::getRate) // ✅ Now Integer
                ))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> Math.round(e.getValue() * 100.0) / 100.0
                ));

        return new MemberStatisticsDto(
                memberId,
                "Member " + memberId, // Fetch actual name from Group_Members
                averageRating,
                memberReviews.size(),
                questionAverages
        );
    }

    /**
     * Get average rating for a specific member
     */
    @Transactional(readOnly = true)
    public Double getAverageRatingForMember(UUID memberId) {
        List<Review> reviews = reviewRepository.findByRevieweeId(memberId);

        List<ReviewAnswer> allAnswers = reviews.stream()
                .filter(Review::getIsSubmitted)
                .flatMap(r -> r.getAnswers().stream())
                .collect(Collectors.toList());

        if (allAnswers.isEmpty()) {
            return 0.0;
        }

        double total = allAnswers.stream()
                .mapToInt(ReviewAnswer::getRate) // ✅ Now Integer
                .sum();


        double average = total / allAnswers.size();
        return Math.round(average * 100.0) / 100.0;
    }
}
