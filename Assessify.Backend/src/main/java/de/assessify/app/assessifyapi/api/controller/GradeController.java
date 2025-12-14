package de.assessify.app.assessifyapi.api.controller;

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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
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
    public ResponseEntity<List<GradeDto>> getGradesForLearningField(
            @PathVariable UUID userId,
            @PathVariable UUID trainingModulesId) {

        User user = entityFinderService.findUser(userId);
        TrainingModule trainingModule =
                entityFinderService.findTrainingModule(trainingModulesId);

        // ✅ Zugriff prüfen: User -> Klassen -> TrainingModules
        boolean hasAccess = user.getSchoolClasses()
                .stream()
                .flatMap(sc -> sc.getTrainingModules().stream())
                .anyMatch(tm -> tm.getId().equals(trainingModulesId));

        if (!hasAccess) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "User has no access to this training module"
            );
        }

        // ✅ Nur Noten dieses Users für dieses Lernfeld
        List<GradeDto> dtos = trainingModule.getGrades()
                .stream()
                .filter(grade -> grade.getUser().getId().equals(userId))
                .map(g -> new GradeDto(
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
                        field.getWeightingHours(),
                        field.getGrades().stream()
                                .map(g -> new GradeDto(
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
    public ResponseEntity<GradeDto> addGradeToTrainingModule(
            @PathVariable UUID userId,
            @PathVariable UUID trainingModulesId,
            @RequestBody AddGradeDto dto){

        User user = entityFinderService.findUser(userId);
        TrainingModule trainingModule =
                entityFinderService.findTrainingModule(trainingModulesId);

        // ✅ Zugriff prüfen über_attach Klassen
        boolean hasAccess = user.getSchoolClasses()
                .stream()
                .flatMap(sc -> sc.getTrainingModules().stream())
                .anyMatch(tm -> tm.getId().equals(trainingModulesId));

        if (!hasAccess) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "User has no access to this training module"
            );
        }

        Grade grade = new Grade();
        grade.setGradeName(dto.gradeName());
        grade.setValue(dto.value());
        grade.setGradeWeighting(dto.gradeWeighting());
        grade.setDate(new Date());
        grade.setTrainingModules(trainingModule);
        grade.setUser(user);

        Grade savedGrade = gradeRepository.save(grade);

        GradeDto response = new GradeDto(
                savedGrade.getId(),
                savedGrade.getGradeName(),
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

        entityFinderService.validateUserTrainingModuleAndGrade(userId, trainingModulesId, gradeId);

        Grade grade = entityFinderService.findGrade(gradeId);

        if (dto.value() != null) grade.setValue(dto.value());
        if (dto.gradeName() != null) grade.setGradeName(dto.gradeName());
        if (dto.gradeWeighting() != null) grade.setGradeWeighting(dto.gradeWeighting());
        if (dto.date() != null) grade.setDate(dto.date());

        Grade updated = gradeRepository.save(grade);

        return ResponseEntity.ok(new GradeDto(
                updated.getId(),
                updated.getGradeName(),
                updated.getValue(),
                updated.getGradeWeighting(),
                updated.getDate()
        ));
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

//    @GetMapping("/user/{userId}/overall-grade")
//    public ResponseEntity<Double> getOverallGrade(@PathVariable UUID userId) {
//        User user = entityFinderService.findUser(userId);
//        double overallGrade = gradeCalculationService.calculateUserOverallGrade(user);
//        return ResponseEntity.ok(overallGrade);
//    }
}
