package de.assessify.app.assessifyapi.api.controller;

import de.assessify.app.assessifyapi.api.dtos.request.ReviewQuestionCreateRequestDto;
import de.assessify.app.assessifyapi.api.dtos.request.ReviewQuestionUpdateRequestDto;
import de.assessify.app.assessifyapi.api.dtos.response.ReviewQuestionResponseDto;
import de.assessify.app.assessifyapi.api.service.ReviewQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class ReviewQuestionController {

    private final ReviewQuestionService questionService;

    /**
     * Create a new question
     */
    @PostMapping
    public ResponseEntity<ReviewQuestionResponseDto> createQuestion(
            @RequestBody ReviewQuestionCreateRequestDto dto) {
        ReviewQuestionResponseDto created = questionService.createQuestion(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Get question by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReviewQuestionResponseDto> getQuestionById(@PathVariable UUID id) {
        ReviewQuestionResponseDto question = questionService.getQuestionById(id);
        return ResponseEntity.ok(question);
    }

    /**
     * Get all questions
     */
    @GetMapping
    public ResponseEntity<List<ReviewQuestionResponseDto>> getAllQuestions() {
        List<ReviewQuestionResponseDto> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    /**
     * Get questions by project
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ReviewQuestionResponseDto>> getQuestionsByProject(
            @PathVariable UUID projectId) {
        List<ReviewQuestionResponseDto> questions = questionService.getQuestionsByProject(projectId);
        return ResponseEntity.ok(questions);
    }

    /**
     * Update question
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReviewQuestionResponseDto> updateQuestion(
            @PathVariable UUID id,
            @RequestBody ReviewQuestionUpdateRequestDto dto) {
        ReviewQuestionResponseDto updated = questionService.updateQuestion(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete question
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable UUID id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}