package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.entity.*;
import de.assessify.app.assessifyapi.api.repository.*;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class EntityFinderService {
    private final UserRepository userRepository;
    private final TrainingModuleRepository trainingModuleRepository;
    private final NotenRepository notenRepository;
    private final ProjectRepository projectRepository;
    private final QuestionRepository questionRepository;
    private final ReviewAnswerRepository reviewAnswerRepository;
    private final ReviewRepository reviewRepository;
    private final RoleRepository roleRepository;
    private final ClassRepository ClassRepository;

    public EntityFinderService(UserRepository userRepository,
                               TrainingModuleRepository trainingModuleRepository,
                               NotenRepository notenRepository,
                               ProjectRepository projectRepository,
                               QuestionRepository questionRepository,
                               ReviewAnswerRepository reviewAnswerRepository,
                               ReviewRepository reviewRepository,
                               RoleRepository roleRepository,
                               ClassRepository ClassRepository)
    {
        this.userRepository = userRepository;
        this.trainingModuleRepository = trainingModuleRepository;
        this.notenRepository = notenRepository;
        this.projectRepository = projectRepository;
        this.questionRepository = questionRepository;
        this.reviewAnswerRepository = reviewAnswerRepository;
        this.reviewRepository = reviewRepository;
        this.roleRepository = roleRepository;
        this.ClassRepository = ClassRepository;
    }
    public User findUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
    public Lernfeld findTrainingModule(UUID trainingModuleId) {
        return trainingModuleRepository.findById(trainingModuleId)
                .orElseThrow(() -> new EntityNotFoundException("Training Module not found"));
    }
    public Noten findGrade(UUID grade) {
        return notenRepository.findById(grade)
                .orElseThrow(() -> new EntityNotFoundException("Grade not found"));
    }
    public Project findProject(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
    }
    public ReviewQuestion findQuestion(UUID questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found"));
    }
    public ReviewAnswer findReviewAnswer(UUID answerId) {
        return reviewAnswerRepository.findById(answerId)
                .orElseThrow(() -> new EntityNotFoundException("Review Answer not found"));
    }
    public Review findReview(UUID reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));
    }
    public Role findRole(int roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));
    }
    public ClassEntity findClassEntity(UUID id) {
        return ClassRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("School Class not found"));
    }
    public void validateUserTrainingModuleAndGrade(UUID userId, UUID trainingModuleId, UUID gradeId) {
        User user = findUser(userId);
        Lernfeld trainingModule = findTrainingModule(trainingModuleId);
        Noten grade = findGrade(gradeId);

        if (!grade.getTrainingModules().equals(trainingModule)) {
            throw new InvalidRelationException("Grade does not belong to this Training Module");
        }

        if (!user.getTrainingModules().contains(trainingModule)) {
            throw new InvalidRelationException("User is not enrolled in this Training Module");
        }
    }
}
