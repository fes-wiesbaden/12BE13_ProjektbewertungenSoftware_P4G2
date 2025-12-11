package de.assessify.app.assessifyapi.api.controller;

import de.assessify.app.assessifyapi.api.entity.*;
import de.assessify.app.assessifyapi.api.service.EntityFinderService;
import de.assessify.app.assessifyapi.api.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ReviewController {
    private final ReviewRepository reviewRepository;
    private final ReviewAnswerRepository reviewAnswerRepository;
    private final EntityFinderService entityFinderService;

    public ReviewController(ReviewRepository reviewRepository, ReviewAnswerRepository reviewAnswerRepository, EntityFinderService entityFinderService) {
        this.reviewRepository = reviewRepository;
        this.reviewAnswerRepository = reviewAnswerRepository;
        this.entityFinderService = entityFinderService;
    }

//    @GetMapping("/user/{userId}/reviews")
//    public ResponseEntity<List<ReviewDto>> getAllReviews(
//            @PathVariable UUID userId) {
//
//        User user = entityFinderService.findUser(userId);
//
//        List<ReviewDto> reviews = user.getReviews().stream()
//                .map(field -> new ReviewDto(
//                        field.getId(),
//                        field.getProject().getId(),
//                        field.getUser().getId(),
//                        field.getDate(),
//                        field.getAnswers().stream()
//                                .map(a -> new ReviewAnswerDto(
//                                        a.getId(),
//                                        a.getQuestion().getId(),
//                                        a.getQuestion().getQuestionText(),
//                                        a.getReviewedUser().getId(),
//                                        a.getReviewedUser().getFirstName() + " " + a.getReviewedUser().getLastName(),
//                                        a.getRating()
//                                )).toList()
//                )).toList();
//
//        return ResponseEntity.ok(reviews);
//    }
//
//    @PostMapping("/user/{userId}/project/{projectId}/review")
//    public ResponseEntity<ReviewDto> createReview(
//            @PathVariable UUID userId,
//            @PathVariable UUID projectId,
//            @RequestBody List<AddReviewAnswerDto> answerDto) {
//
//        User user = entityFinderService.findUser(userId);
//        Project project = entityFinderService.findProject(projectId);
//
//        Review review = new Review();
//        review.setUser(user);
//        review.setProject(project);
//
//        List<ReviewAnswer> answers = answerDto.stream().map(dto -> {
//            Question q = entityFinderService.findQuestion(dto.id());
//            User reviewed = entityFinderService.findUser(dto.id());
//
//            ReviewAnswer a = new ReviewAnswer();
//            a.setQuestion(q);
//            a.setReviewedUser(reviewed);
//            a.setRating(dto.rating());
//            a.setReview(review);
//            return a;
//        }).toList();
//
//        review.setAnswers(answers);
//        Review saved = reviewRepository.save(review);
//
//        ReviewDto response = new ReviewDto(
//                saved.getId(),
//                saved.getProject().getId(),
//                saved.getUser().getId(),
//                saved.getDate(),
//                saved.getAnswers().stream().map(a ->
//                        new ReviewAnswerDto(
//                                a.getId(),
//                                a.getQuestion().getId(),
//                                a.getQuestion().getQuestionText(),
//                                a.getReviewedUser().getId(),
//                                a.getReviewedUser().getFirstName() + " " + a.getReviewedUser().getLastName() + " " + a.getReviewedUser().getUsername(),
//                                a.getRating()
//                        )).toList()
//        );
//
//        return ResponseEntity.ok(response);
//    }
//
//    @PutMapping("/review/{reviewAnswerId}")
//    public ResponseEntity<ReviewAnswerDto> updateRating(
//            @PathVariable UUID reviewAnswerId,
//            @RequestBody UpdateRatingDto dto) {
//
//        ReviewAnswer reviewAnswer = entityFinderService.findReviewAnswer(reviewAnswerId);
//
//        reviewAnswer.setRating(dto.rating());
//
//        ReviewAnswer updated = reviewAnswerRepository.save(reviewAnswer);
//
//        ReviewAnswerDto response = new ReviewAnswerDto(
//                updated.getId(),
//                updated.getQuestion().getId(),
//                updated.getQuestion().getQuestionText(),
//                updated.getReviewedUser() != null ? updated.getReviewedUser().getId() : null,
//                updated.getReviewedUser() != null ? updated.getReviewedUser().getFirstName() + " " + updated.getReviewedUser().getLastName() : null,
//                updated.getRating()
//        );
//
//        return ResponseEntity.ok(response);
//    }

    @DeleteMapping("/review/answer/{reviewAnswerId}")
    public ResponseEntity<Void> deleteReviewAnswer(
            @PathVariable UUID reviewAnswerId) {

        ReviewAnswer reviewAnswer = entityFinderService.findReviewAnswer(reviewAnswerId);

        reviewAnswerRepository.delete(reviewAnswer);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/review/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable UUID reviewId) {

        Review review = entityFinderService.findReview(reviewId);

        reviewRepository.delete(review);
        return ResponseEntity.noContent().build();
    }
}