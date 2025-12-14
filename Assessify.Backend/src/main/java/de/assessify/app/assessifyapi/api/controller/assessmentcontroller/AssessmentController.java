package de.assessify.app.assessifyapi.api.controller.assessmentcontroller;


import de.assessify.app.assessifyapi.api.dtos.request.AssessmentSubmissionDto;
import de.assessify.app.assessifyapi.api.dtos.response.GroupAssessmentStatisticsDto;
import de.assessify.app.assessifyapi.api.dtos.response.ReviewResponseDto;
import de.assessify.app.assessifyapi.api.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    /**
     * Submit assessment/review
     */
    @PostMapping
    public ResponseEntity<List<ReviewResponseDto>> submitAssessment(
            @RequestBody AssessmentSubmissionDto dto) {
        List<ReviewResponseDto> reviews = assessmentService.submitAssessment(dto);
        return new ResponseEntity<>(reviews, HttpStatus.CREATED);
    }

    /**
     * Get all reviews submitted by a specific reviewer
     */
    @GetMapping("/reviewer/{reviewerId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByReviewer(
            @PathVariable UUID reviewerId) {
        List<ReviewResponseDto> reviews = assessmentService.getReviewsByReviewer(reviewerId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get all reviews received by a specific reviewee (person being reviewed)
     */
    @GetMapping("/reviewee/{revieweeId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByReviewee(
            @PathVariable UUID revieweeId) {
        List<ReviewResponseDto> reviews = assessmentService.getReviewsByReviewee(revieweeId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get all reviews for a specific group
     */
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByGroup(
            @PathVariable UUID groupId) {
        List<ReviewResponseDto> reviews = assessmentService.getReviewsByGroup(groupId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get review statistics for a group
     */
    @GetMapping("/group/{groupId}/statistics")
    public ResponseEntity<GroupAssessmentStatisticsDto> getGroupStatistics(
            @PathVariable UUID groupId) {
        GroupAssessmentStatisticsDto stats = assessmentService.getGroupStatistics(groupId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Check if a reviewer has already submitted for a group
     */
    @GetMapping("/check-submission/{reviewerId}/{groupId}")
    public ResponseEntity<Boolean> hasSubmitted(
            @PathVariable UUID reviewerId,
            @PathVariable UUID groupId) {
        boolean hasSubmitted = assessmentService.hasAlreadySubmitted(reviewerId, groupId);
        return ResponseEntity.ok(hasSubmitted);
    }
}