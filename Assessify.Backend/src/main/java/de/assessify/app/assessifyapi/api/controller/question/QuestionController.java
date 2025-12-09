package de.assessify.app.assessifyapi.api.controller.question;

import de.assessify.app.assessifyapi.api.dtos.request.AddQuestionDto;
import de.assessify.app.assessifyapi.api.dtos.request.UpdateQuestionDto;
import de.assessify.app.assessifyapi.api.dtos.response.ReviewQuestionResponseDto;
import de.assessify.app.assessifyapi.api.entity.ReviewQuestion;
import de.assessify.app.assessifyapi.api.service.EntityFinderService;
import de.assessify.app.assessifyapi.api.repository.QuestionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/question")
public class QuestionController {
    private final QuestionRepository questionRepository;
    private final EntityFinderService entityFinderService;

    public QuestionController(QuestionRepository questionRepository, EntityFinderService entityFinderService) {
        this.questionRepository = questionRepository;
        this.entityFinderService = entityFinderService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewQuestionResponseDto>> getAllQuestions() {
        var modules = questionRepository.findAll()
                .stream()
                .map(field -> new ReviewQuestionResponseDto(
                        field.getId(),
                        field.getQuestionText()
                ))
                .toList();

        return ResponseEntity.ok(modules);
    }

    @PostMapping
    public ResponseEntity<ReviewQuestionResponseDto> createQuestion(
            @RequestBody AddQuestionDto dto) {

        ReviewQuestion entity = new ReviewQuestion();
        entity.setQuestionText(dto.questionText());

        ReviewQuestion saved = questionRepository.save(entity);

        ReviewQuestionResponseDto response = new ReviewQuestionResponseDto(
                saved.getId(),
                saved.getQuestionText()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<ReviewQuestionResponseDto> updateQuestion(
            @PathVariable UUID questionId,
            @RequestBody UpdateQuestionDto dto) {

        ReviewQuestion question = entityFinderService.findQuestion(questionId);

        question.setQuestionText(dto.questionText());

        ReviewQuestion updated = questionRepository.save(question);

        ReviewQuestionResponseDto response = new ReviewQuestionResponseDto(
                updated.getId(),
                updated.getQuestionText()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable UUID questionId) {

        ReviewQuestion question = entityFinderService.findQuestion(questionId);

        questionRepository.delete(question);
        return ResponseEntity.noContent().build();
    }
}