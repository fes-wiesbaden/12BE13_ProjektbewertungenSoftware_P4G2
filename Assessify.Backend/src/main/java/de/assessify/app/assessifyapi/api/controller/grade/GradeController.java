package de.assessify.app.assessifyapi.api.controller.grade;

import de.assessify.app.assessifyapi.api.dtos.request.AddGradeDto;
import de.assessify.app.assessifyapi.api.dtos.request.UpdateGradeDto;
import de.assessify.app.assessifyapi.api.dtos.response.GradeDto;
import de.assessify.app.assessifyapi.api.dtos.response.TrainingModuleWithGradesDto;
import de.assessify.app.assessifyapi.api.service.EntityFinderService;
import de.assessify.app.assessifyapi.api.service.GradeCalculationService;
import de.assessify.app.assessifyapi.api.repository.GradeRepository;
import de.assessify.app.assessifyapi.api.entity.Grade;
import de.assessify.app.assessifyapi.api.entity.TrainingModule;
import de.assessify.app.assessifyapi.api.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class GradeController {
    private final GradeRepository gradeRepository;
    private final EntityFinderService entityFinderService;
    private final GradeCalculationService gradeCalculationService;

    public GradeController(GradeRepository gradeRepository,
                           EntityFinderService entityFinderService,
                           GradeCalculationService gradeCalculationService) {
        this.gradeRepository = gradeRepository;
        this.entityFinderService = entityFinderService;
        this.gradeCalculationService = gradeCalculationService;
    }

    @GetMapping("/user/{userId}/training-modules/{trainingModulesId}/grades")
    public ResponseEntity<TrainingModuleWithGradesDto> getGradesForLearningField(
            @PathVariable UUID userId,
            @PathVariable UUID trainingModulesId) {

        User user = entityFinderService.findUser(userId);

        var module = user.getTrainingModules()
                .stream()
                .filter(field -> field.getId().equals(trainingModulesId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Training module not found or not assigned to user"));

        var dto = new TrainingModuleWithGradesDto(
                module.getId(),
                module.getName(),
                module.getDescription(),
                module.getWeighting(),
                module.getGrades().stream()
                        .map(g -> new GradeDto(
                                g.getId(),
                                g.getValue(),
                                g.getGradeWeighting(),
                                g.getDate()
                        ))
                        .toList()
        );

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/user/{userId}/grades")
    public ResponseEntity<List<TrainingModuleWithGradesDto>> getGradesForUser(
            @PathVariable UUID userId) {

        User user = entityFinderService.findUser(userId);

        var modules = user.getTrainingModules()
                .stream()
                .map(field -> new TrainingModuleWithGradesDto(
                        field.getId(),
                        field.getName(),
                        field.getDescription(),
                        field.getWeighting(),
                        field.getGrades().stream()
                                .map(g -> new GradeDto(
                                        g.getId(),
                                        g.getValue(),
                                        g.getGradeWeighting(),
                                        g.getDate()
                                ))
                                .toList()
                ))
                .toList();

        return ResponseEntity.ok(modules);
    }

    @PostMapping("/user/{userId}/training-modules/{trainingModulesId}/grade")
    public ResponseEntity<GradeDto> addGradeToTrainingModule(
            @PathVariable UUID userId,
            @PathVariable UUID trainingModulesId,
            @RequestBody AddGradeDto dto){

        User user = entityFinderService.findUser(userId);
        TrainingModule trainingModule = entityFinderService.findTrainingModule(trainingModulesId);

        if (!user.getTrainingModules().contains(trainingModule)) {
            throw new RuntimeException("User is not enrolled in this Training Module");
        }

        Grade grade = new Grade();
        grade.setValue(dto.value());
        grade.setGradeWeighting(dto.weighting());
        grade.setDate(dto.date());
        grade.setTrainingModules(trainingModule);

        Grade savedGrade = gradeRepository.save(grade);

        GradeDto response = new GradeDto(
                savedGrade.getId(),
                savedGrade.getValue(),
                savedGrade.getGradeWeighting(),
                savedGrade.getDate()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/user/{userId}/training-modules/{trainingModulesId}/grade/{gradeId}")
    public ResponseEntity<GradeDto> updateGrade(
            @PathVariable UUID userId,
            @PathVariable UUID trainingModulesId,
            @PathVariable UUID gradeId,
            @RequestBody UpdateGradeDto dto) {

        entityFinderService.findUser(userId);
        entityFinderService.findTrainingModule(trainingModulesId);
        Grade grade = entityFinderService.findGrade(gradeId);

        entityFinderService.validateUserTrainingModuleAndGrade(userId, trainingModulesId, gradeId);

        if (dto.value() != null) grade.setValue(dto.value());
        if (dto.weighting() != null) grade.setGradeWeighting(dto.weighting());
        if (dto.date() != null) grade.setDate(dto.date());

        Grade updated = gradeRepository.save(grade);

        GradeDto response = new GradeDto(
                updated.getId(),
                updated.getValue(),
                updated.getGradeWeighting(),
                updated.getDate()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/user/{userId}/training-modules/{trainingModulesId}/grade/{gradeId}")
    public ResponseEntity<Void> deleteGrade(
            @PathVariable UUID userId,
            @PathVariable UUID trainingModulesId,
            @PathVariable UUID gradeId) {

        entityFinderService.findUser(userId);
        entityFinderService.findTrainingModule(trainingModulesId);
        Grade grade = entityFinderService.findGrade(gradeId);

        entityFinderService.validateUserTrainingModuleAndGrade(userId, trainingModulesId, gradeId);

        gradeRepository.delete(grade);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/overall-grade")
    public ResponseEntity<Double> getOverallGrade(@PathVariable UUID userId) {
        User user = entityFinderService.findUser(userId);
        double overallGrade = gradeCalculationService.calculateUserOverallGrade(user);
        return ResponseEntity.ok(overallGrade);
    }
}
