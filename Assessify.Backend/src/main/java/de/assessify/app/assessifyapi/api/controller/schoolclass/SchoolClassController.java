package de.assessify.app.assessifyapi.api.controller.schoolclass;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import de.assessify.app.assessifyapi.api.dtos.request.UpdateClassResponseDto;
import de.assessify.app.assessifyapi.api.dtos.response.ClassResponseDto;
import de.assessify.app.assessifyapi.api.dtos.response.UserWithClassResponseDto;
import de.assessify.app.assessifyapi.api.service.EntityFinderService;
import de.assessify.app.assessifyapi.api.repository.ClassRepository;
import de.assessify.app.assessifyapi.api.repository.UserRepository;
import de.assessify.app.assessifyapi.api.entity.ClassEntity;
import de.assessify.app.assessifyapi.api.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api")
public class SchoolClassController {
    private final ClassRepository ClassRepository;
    private final UserRepository userRepository;
    private final EntityFinderService entityFinderService;

    public SchoolClassController(ClassRepository ClassRepository, UserRepository userRepository, EntityFinderService entityFinderService) {
        this.ClassRepository = ClassRepository;
        this.userRepository = userRepository;
        this.entityFinderService = entityFinderService;
    }

    private static final Logger logger = Logger.getLogger(ClassEntityController.class.getName());

    @GetMapping("/school-class/all")
    public ResponseEntity<List<ClassResponseDto>> getAllClassEntityes() {
        var modules = ClassRepository.findAll()
                .stream()
                .map(field -> new ClassResponseDto(
                        field.getId(),
                        field.getCourseName(),
                        field.getClassName()
                ))
                .toList();

        return ResponseEntity.ok(modules);
    }

    @GetMapping("/school-class")
    public ResponseEntity<List<ClassResponseDto>> getClassEntityesForCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            UUID userId = extractUserId(authHeader);

            var classes = ClassRepository.findByUsers_Id(userId)
                    .stream()
                    .map(c -> new ClassResponseDto(c.getId(), c.getCourseName(), c.getClassName()))
                    .toList();

            return ResponseEntity.ok(classes);

        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error getting classes for current user", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/school-class/available")
    public ResponseEntity<List<ClassResponseDto>> getAvailableClassEntityes(
            @RequestHeader("Authorization") String authHeader) {

        try {
            UUID userId = extractUserId(authHeader);

            List<ClassEntity> allClasses = ClassRepository.findAll();

            List<ClassResponseDto> result = allClasses.stream()
                    .filter(c -> c.getUsers().stream()
                            .noneMatch(u -> u.getId().equals(userId))
                    )
                    .map(c -> new ClassResponseDto(
                            c.getId(),
                            c.getCourseName(),
                            c.getClassName()
                    ))
                    .toList();

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error getting available classes", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/school-class")
    public ResponseEntity<ClassResponseDto> addClassEntity(@RequestBody AddClassResponseDto dto) {
       ClassEntity entity = new ClassEntity();
       entity.setCourseName(dto.name());

       ClassEntity saved = ClassRepository.save(entity);

       ClassResponseDto response = new ClassResponseDto(
               saved.getId(),
               saved.getCourseName(),
               saved.getClassName()
       );

       return ResponseEntity.ok(response);
    }

    @PostMapping("/school-class/{ClassEntityId}/user")
    public ResponseEntity<UserWithClassResponseDto> addClassEntityToUser(
            @PathVariable UUID ClassEntityId,
            @RequestHeader("Authorization") String authHeader
            ){
        try {
            UUID userId = extractUserId(authHeader);

            User user = entityFinderService.findUser(userId);
            ClassEntity ClassEntity = entityFinderService.findClassEntity(ClassEntityId);

            if (!user.getClassEntityes().contains(ClassEntity)) {
                user.getClassEntityes().add(ClassEntity);
            }

            User updatedUser = userRepository.save(user);

            UserWithClassResponseDto response = new UserWithClassResponseDto(
                    updatedUser.getId(),
                    updatedUser.getFirstName(),
                    updatedUser.getFirstName(),
                    updatedUser.getUsername(),
                    updatedUser.getClassEntityes().stream()
                            .map(r -> new ClassResponseDto(r.getId(), r.getCourseName(), r.getClassName()))
                            .toList()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error adding class to user", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/school-class/{ClassEntityId}")
    public ResponseEntity<ClassResponseDto> updateRole(
            @PathVariable UUID ClassEntityId,
            @RequestBody UpdateClassResponseDto dto) {

        ClassEntity ClassEntity = entityFinderService.findClassEntity(ClassEntityId);

        ClassEntity.setCourseName(dto.name());

        ClassEntity updated = ClassRepository.save(ClassEntity);

        ClassResponseDto response = new ClassResponseDto(
                updated.getId(),
                updated.getCourseName(),
                updated.getClassName()
        );

        return ResponseEntity.ok(response);
    }
    @GetMapping("/school-class/amount")
    public ResponseEntity<Long> getClassEntityAmount() {
        long amount = ClassRepository.count();
        return ResponseEntity.ok(amount);
        }

//    @DeleteMapping("/school-class/{ClassEntityId}")
//    public ResponseEntity<Void> deleteClassEntity(
//            @PathVariable UUID ClassEntityId) {
//
//        ClassEntity ClassEntity = entityFinderService.findClassEntity(ClassEntityId);
//
//        List<User> userWithRole = userRepository.findAll().stream()
//                .filter(p -> p.getClassEntityes().contains(ClassEntity))
//                .toList();
//
//        for (User user : userWithRole) {
//            user.getClassEntityes().remove(ClassEntity);
//            userRepository.save(user);
//        }
//
//        ClassRepository.delete(ClassEntity);
//        return ResponseEntity.noContent().build();
//    }
    private UUID extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token missing or invalid");
        }

        String token = authHeader.substring(7);
        DecodedJWT jwt = JWT.decode(token);
        return UUID.fromString(jwt.getSubject());
    }
}