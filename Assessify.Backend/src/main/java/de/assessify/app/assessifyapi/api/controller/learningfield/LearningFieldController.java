package de.assessify.app.assessifyapi.api.controller.learningfield;

import de.assessify.app.assessifyapi.api.dtos.request.AddTrainingModuleDto;
import de.assessify.app.assessifyapi.api.dtos.request.UpdateTrainingModuleDto;
import de.assessify.app.assessifyapi.api.dtos.response.UserWithModulesDto;
import de.assessify.app.assessifyapi.api.dtos.response.TrainingModuleSummaryDto;
import de.assessify.app.assessifyapi.api.entity.Project;
import de.assessify.app.assessifyapi.api.service.EntityFinderService;
import de.assessify.app.assessifyapi.api.repository.ProjectRepository;
import de.assessify.app.assessifyapi.api.repository.TrainingModuleRepository;
import de.assessify.app.assessifyapi.api.repository.UserRepository;
import de.assessify.app.assessifyapi.api.entity.TrainingModule;
import de.assessify.app.assessifyapi.api.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class LearningFieldController {
    private final TrainingModuleRepository trainingModuleRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final EntityFinderService entityFinderService;

    public LearningFieldController(TrainingModuleRepository learningFieldRepository, UserRepository userRepository, ProjectRepository projectRepository, EntityFinderService entityFinderService) {
        this.trainingModuleRepository = learningFieldRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.entityFinderService = entityFinderService;
    }

    @GetMapping("/training-modules")
    public ResponseEntity<List<TrainingModuleSummaryDto>> getAllTrainingModules() {
        var modules = trainingModuleRepository.findAll()
                .stream()
                .map(field -> new TrainingModuleSummaryDto(
                        field.getId(),
                        field.getName(),
                        field.getDescription(),
                        field.getWeightingHours()
                ))
                .toList();

        return ResponseEntity.ok(modules);
    }

    @GetMapping("/user/{userId}/training-modules")
    public ResponseEntity<List<TrainingModuleSummaryDto>> getAllTrainingModulesByUserId(
            @PathVariable UUID userId) {

        User user = entityFinderService.findUser(userId);

        var modules = user.getTrainingModules()
                .stream()
                .map(module -> new TrainingModuleSummaryDto(
                        module.getId(),
                        module.getName(),
                        module.getDescription(),
                        module.getWeightingHours()
                ))
                .toList();

        return ResponseEntity.ok(modules);
    }

    @PostMapping("/training-modules")
    public ResponseEntity<TrainingModuleSummaryDto> createTrainingModule(
            @RequestBody AddTrainingModuleDto dto) {

        TrainingModule entity = new TrainingModule();
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setWeightingHours(dto.weightingHours());

        TrainingModule saved = trainingModuleRepository.save(entity);

        TrainingModuleSummaryDto response = new TrainingModuleSummaryDto(
                saved.getId(),
                saved.getName(),
                saved.getDescription(),
                saved.getWeightingHours()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/{userId}/connect/training-modules/{trainingModulesId}")
    public ResponseEntity<UserWithModulesDto> addGradeToTrainingModule(
            @PathVariable UUID userId,
            @PathVariable UUID trainingModulesId){

        User user = entityFinderService.findUser(userId);
        TrainingModule trainingModule = entityFinderService.findTrainingModule(trainingModulesId);

        if (!user.getTrainingModules().contains(trainingModule)) {
            user.getTrainingModules().add(trainingModule);
        }

        User updatedUser = userRepository.save(user);

        List<TrainingModuleSummaryDto> modules = user.getTrainingModules().stream()
                .map(field -> new TrainingModuleSummaryDto(
                        field.getId(),
                        field.getName(),
                        field.getDescription(),
                        field.getWeightingHours()
                ))
                .toList();

        UserWithModulesDto response = new UserWithModulesDto(
                updatedUser.getId(),
                updatedUser.getFirstName(),
                updatedUser.getLastName(),
                updatedUser.getUsername(),
                modules
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/training-modules/{trainingModulesId}")
    public ResponseEntity<TrainingModuleSummaryDto> updateTrainingModule(
            @PathVariable UUID trainingModulesId,
            @RequestBody UpdateTrainingModuleDto dto) {

        TrainingModule trainingModule = entityFinderService.findTrainingModule(trainingModulesId);

        if (dto.description() != null) trainingModule.setDescription(dto.description());
        if (dto.name() != null) trainingModule.setName(dto.name());
        trainingModule.setWeightingHours(dto.weightingHours());
        
        TrainingModule updated = trainingModuleRepository.save(trainingModule);

        TrainingModuleSummaryDto response = new TrainingModuleSummaryDto(
                updated.getId(),
                updated.getName(),
                updated.getDescription(),
                updated.getWeightingHours()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/training-modules/{trainingModulesId}")
    public ResponseEntity<Void> deleteTrainingModule(
            @PathVariable UUID trainingModulesId) {

        TrainingModule trainingModule = entityFinderService.findTrainingModule(trainingModulesId);

        List<User> usersWithModule = userRepository.findAll().stream()
                .filter(u -> u.getTrainingModules().contains(trainingModule))
                .toList();

        for (User user : usersWithModule) {
            user.getTrainingModules().remove(trainingModule);
            userRepository.save(user);
        }

        List<Project> projectsWithModule = projectRepository.findAll().stream()
                .filter(p -> p.getTrainingModules().contains(trainingModule))
                .toList();

        for (Project project : projectsWithModule) {
            project.getTrainingModules().remove(trainingModule);
            projectRepository.save(project);
        }

        trainingModuleRepository.delete(trainingModule);
        return ResponseEntity.noContent().build();
    }
}