package de.assessify.app.assessifyapi.api.controller;

import de.assessify.app.assessifyapi.api.dtos.request.AddQuestionDto;
import de.assessify.app.assessifyapi.api.dtos.request.UpdateQuestionDto;
import de.assessify.app.assessifyapi.api.dtos.response.QuestionDto;
import de.assessify.app.assessifyapi.api.entity.Question;
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
    public ResponseEntity<List<QuestionDto>> getAllQuestions() {
        var modules = questionRepository.findAll()
                .stream()
                .map(field -> new QuestionDto(
                        field.getId(),
                        field.getQuestionText()
                ))
                .toList();

        return ResponseEntity.ok(modules);
    }

    @PostMapping
    public ResponseEntity<QuestionDto> createQuestion(
            @RequestBody AddQuestionDto dto) {

        Question entity = new Question();
        entity.setQuestionText(dto.questionText());

        Question saved = questionRepository.save(entity);

        QuestionDto response = new QuestionDto(
                saved.getId(),
                saved.getQuestionText()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<QuestionDto> updateQuestion(
            @PathVariable UUID questionId,
            @RequestBody UpdateQuestionDto dto) {

        Question question = entityFinderService.findQuestion(questionId);

        question.setQuestionText(dto.questionText());

        Question updated = questionRepository.save(question);

        QuestionDto response = new QuestionDto(
                updated.getId(),
                updated.getQuestionText()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable UUID questionId) {

        Question question = entityFinderService.findQuestion(questionId);

        questionRepository.delete(question);
        return ResponseEntity.noContent().build();
    }
}