package de.assessify.app.assessifyapi.api.controller.noten;

import de.assessify.app.assessifyapi.api.dtos.request.NotenRequestDto;
import de.assessify.app.assessifyapi.api.dtos.request.UpdateGradeDto;
import de.assessify.app.assessifyapi.api.dtos.response.NotenResponseDto;
import de.assessify.app.assessifyapi.api.dtos.response.TrainingModuleWithGradesDto;
import de.assessify.app.assessifyapi.api.service.EntityFinderService;
import de.assessify.app.assessifyapi.api.service.GradeCalculationService;
import de.assessify.app.assessifyapi.api.repository.NotenRepository;
import de.assessify.app.assessifyapi.api.entity.Grade;
import de.assessify.app.assessifyapi.api.entity.TrainingModule;
import de.assessify.app.assessifyapi.api.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class GradeController {
    private final NotenRepository notenRepository;
    private final EntityFinderService entityFinderService;
    private final GradeCalculationService gradeCalculationService;

    public GradeController(NotenRepository notenRepository,
                           EntityFinderService entityFinderService,
                           GradeCalculationService gradeCalculationService) {
        this.notenRepository = notenRepository;
        this.entityFinderService = entityFinderService;
        this.gradeCalculationService = gradeCalculationService;
    }

    @GetMapping("/user/{userId}/training-modules/{trainingModulesId}/grades")
    public ResponseEntity<List<NotenResponseDto>> getGradesForLearningField(
            @PathVariable UUID userId,
            @PathVariable UUID trainingModulesId) {

        User user = entityFinderService.findUser(userId);
        TrainingModule trainingModule = entityFinderService.findTrainingModule(trainingModulesId);

        if (!user.getTrainingModules().contains(trainingModule)) {
            throw new RuntimeException("User is not enrolled in this Training Module");
        }
        
        List<NotenResponseDto> dtos = trainingModule.getGrades().stream()
                .filter(grade -> grade.getUser().getId().equals(userId))
                .map(g -> new NotenResponseDto(
                        g.getId(),
                        g.getGradeName(),
                        g.getValue(),
                        g.getGradeWeighting(),
                        g.getDate()
                ))
                .toList();

        return ResponseEntity.ok(dtos);
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
                                .map(g -> new NotenResponseDto(
                                        g.getId(),
                                        g.getGradeName(),
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
    public ResponseEntity<NotenResponseDto> addGradeToTrainingModule(
            @PathVariable UUID userId,
            @PathVariable UUID trainingModulesId,
            @RequestBody NotenRequestDto dto){

        User user = entityFinderService.findUser(userId);
        TrainingModule trainingModule = entityFinderService.findTrainingModule(trainingModulesId);

        if (!user.getTrainingModules().contains(trainingModule)) {
            throw new RuntimeException("User is not enrolled in this Training Module");
        }

        Grade grade = new Grade();
        grade.setGradeName(dto.gradeName());
        grade.setValue(dto.value());
        grade.setGradeWeighting(dto.gradeWeighting());
        grade.setDate(new Date());
        grade.setTrainingModules(trainingModule);
        grade.setUser(user);

        Grade savedGrade = notenRepository.save(grade);

        NotenResponseDto response = new NotenResponseDto(
                savedGrade.getId(),
                savedGrade.getGradeName(),
                savedGrade.getValue(),
                savedGrade.getGradeWeighting(),
                savedGrade.getDate()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/user/{userId}/training-modules/{trainingModulesId}/grade/{gradeId}")
    public ResponseEntity<NotenResponseDto> updateGrade(
            @PathVariable UUID userId,
            @PathVariable UUID trainingModulesId,
            @PathVariable UUID gradeId,
            @RequestBody UpdateGradeDto dto) {

        entityFinderService.findUser(userId);
        entityFinderService.findTrainingModule(trainingModulesId);
        Grade grade = entityFinderService.findGrade(gradeId);

        entityFinderService.validateUserTrainingModuleAndGrade(userId, trainingModulesId, gradeId);

        if (dto.value() != null) grade.setValue(dto.value());
        if (dto.gradeName() != null) grade.setGradeName(dto.gradeName());
        if (dto.gradeWeighting() != null) grade.setGradeWeighting(dto.gradeWeighting());
        if (dto.date() != null) grade.setDate(dto.date());

        Grade updated = notenRepository.save(grade);

        NotenResponseDto response = new NotenResponseDto(
                updated.getId(),
                updated.getGradeName(),
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

        notenRepository.delete(grade);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/overall-grade")
    public ResponseEntity<Double> getOverallGrade(@PathVariable UUID userId) {
        User user = entityFinderService.findUser(userId);
        double overallGrade = gradeCalculationService.calculateUserOverallGrade(user);
        return ResponseEntity.ok(overallGrade);
    }
}
