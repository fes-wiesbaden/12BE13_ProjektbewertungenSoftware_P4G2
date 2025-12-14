package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.dtos.request.ReviewQuestionCreateRequestDto;
import de.assessify.app.assessifyapi.api.dtos.request.ReviewQuestionUpdateRequestDto;
import de.assessify.app.assessifyapi.api.dtos.response.ProjectResponseDto;
import de.assessify.app.assessifyapi.api.dtos.response.ReviewQuestionResponseDto;
import de.assessify.app.assessifyapi.api.entity.Project;
import de.assessify.app.assessifyapi.api.entity.ReviewQuestion;
import de.assessify.app.assessifyapi.api.repository.ProjectRepository;
import de.assessify.app.assessifyapi.api.repository.ReviewQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewQuestionService {

    @Autowired
    private ReviewQuestionRepository reviewQuestionRepository;

    @Autowired
    private ProjectService projectService;

    @Transactional
    public ReviewQuestionResponseDto createQuestion(ReviewQuestionCreateRequestDto dto) {

        ReviewQuestion question = new ReviewQuestion();
        question.setQuestionText(dto.questionText());
        question.setProjectId(dto.projectId());

        ReviewQuestion saved = reviewQuestionRepository.save(question);
        return toResponseDto(saved);
    }

    public ReviewQuestionResponseDto getQuestionById(UUID id) {
        ReviewQuestion question = reviewQuestionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
        return toResponseDto(question);
    }

    public List<ReviewQuestionResponseDto> getAllQuestions() {
        return reviewQuestionRepository.findAll().stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<ReviewQuestionResponseDto> getQuestionsByProject(UUID projectId) {
        return reviewQuestionRepository.findByProjectId(projectId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewQuestionResponseDto updateQuestion(UUID id, ReviewQuestionUpdateRequestDto dto) {
        ReviewQuestion question = reviewQuestionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));

        question.setQuestionText(dto.questionText());

        ReviewQuestion updated = reviewQuestionRepository.save(question);
        return toResponseDto(updated);
    }

    @Transactional
    public void deleteQuestion(UUID id) {
        if (!reviewQuestionRepository.existsById(id)) {
            throw new RuntimeException("Question not found with id: " + id);
        }
        reviewQuestionRepository.deleteById(id);
    }

    private ReviewQuestionResponseDto toResponseDto(ReviewQuestion question) {
        return new ReviewQuestionResponseDto(
                question.getId(),
                question.getQuestionText(),
                question.getProjectId()
        );
    }
}