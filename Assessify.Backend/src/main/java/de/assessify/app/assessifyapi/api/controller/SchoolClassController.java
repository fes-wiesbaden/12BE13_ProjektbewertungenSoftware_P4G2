package de.assessify.app.assessifyapi.api.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import de.assessify.app.assessifyapi.api.dtos.request.AddSchoolClassDto;
import de.assessify.app.assessifyapi.api.dtos.request.UpdateSchoolClassDto;
import de.assessify.app.assessifyapi.api.dtos.response.SchoolClassDto;
import de.assessify.app.assessifyapi.api.dtos.response.UserWithSchoolClassDto;
import de.assessify.app.assessifyapi.api.service.EntityFinderService;
import de.assessify.app.assessifyapi.api.repository.SchoolClassRepository;
import de.assessify.app.assessifyapi.api.repository.UserRepository;
import de.assessify.app.assessifyapi.api.entity.SchoolClass;
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
    private final SchoolClassRepository schoolClassRepository;
    private final UserRepository userRepository;
    private final EntityFinderService entityFinderService;

    public SchoolClassController(SchoolClassRepository schoolClassRepository, UserRepository userRepository, EntityFinderService entityFinderService) {
        this.schoolClassRepository = schoolClassRepository;
        this.userRepository = userRepository;
        this.entityFinderService = entityFinderService;
    }

    private static final Logger logger = Logger.getLogger(SchoolClassController.class.getName());

    @GetMapping("/school-class/all")
    public ResponseEntity<List<SchoolClassDto>> getAllSchoolClasses() {
        var modules = schoolClassRepository.findAll()
                .stream()
                .map(field -> new SchoolClassDto(
                        field.getId(),
                        field.getCourseName(),
                        field.getClassName()
                ))
                .toList();

        return ResponseEntity.ok(modules);
    }

    @GetMapping("/school-class")
    public ResponseEntity<List<SchoolClassDto>> getSchoolClassesForCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            UUID userId = extractUserId(authHeader);

            var classes = schoolClassRepository.findByUsers_Id(userId)
                    .stream()
                    .map(c -> new SchoolClassDto(c.getId(), c.getCourseName(), c.getClassName()))
                    .toList();

            return ResponseEntity.ok(classes);

        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error getting classes for current user", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/school-class/available")
    public ResponseEntity<List<SchoolClassDto>> getAvailableSchoolClasses(
            @RequestHeader("Authorization") String authHeader) {

        try {
            UUID userId = extractUserId(authHeader);

            List<SchoolClass> allClasses = schoolClassRepository.findAll();

            List<SchoolClassDto> result = allClasses.stream()
                    .filter(c -> c.getUsers().stream()
                            .noneMatch(u -> u.getId().equals(userId))
                    )
                    .map(c -> new SchoolClassDto(
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
    public ResponseEntity<SchoolClassDto> addSchoolClass(@RequestBody AddSchoolClassDto dto) {
       SchoolClass entity = new SchoolClass();
       entity.setCourseName(dto.name());

       SchoolClass saved = schoolClassRepository.save(entity);

       SchoolClassDto response = new SchoolClassDto(
               saved.getId(),
               saved.getCourseName(),
               saved.getClassName()
       );

       return ResponseEntity.ok(response);
    }

    @PostMapping("/school-class/{schoolClassId}/user")
    public ResponseEntity<UserWithSchoolClassDto> addSchoolClassToUser(
            @PathVariable UUID schoolClassId,
            @RequestHeader("Authorization") String authHeader
            ){
        try {
            UUID userId = extractUserId(authHeader);

            User user = entityFinderService.findUser(userId);
            SchoolClass schoolClass = entityFinderService.findSchoolClass(schoolClassId);

            if (!user.getSchoolClasses().contains(schoolClass)) {
                user.getSchoolClasses().add(schoolClass);
            }

            User updatedUser = userRepository.save(user);

            UserWithSchoolClassDto response = new UserWithSchoolClassDto(
                    updatedUser.getId(),
                    updatedUser.getFirstName(),
                    updatedUser.getFirstName(),
                    updatedUser.getUsername(),
                    updatedUser.getSchoolClasses().stream()
                            .map(r -> new SchoolClassDto(r.getId(), r.getCourseName(), r.getClassName()))
                            .toList()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error adding class to user", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/school-class/{schoolClassId}")
    public ResponseEntity<SchoolClassDto> updateRole(
            @PathVariable UUID schoolClassId,
            @RequestBody UpdateSchoolClassDto dto) {

        SchoolClass schoolClass = entityFinderService.findSchoolClass(schoolClassId);

        schoolClass.setCourseName(dto.name());

        SchoolClass updated = schoolClassRepository.save(schoolClass);

        SchoolClassDto response = new SchoolClassDto(
                updated.getId(),
                updated.getCourseName(),
                updated.getClassName()
        );

        return ResponseEntity.ok(response);
    }
    @GetMapping("/school-class/amount")
    public ResponseEntity<Long> getSchoolClassAmount() {
        long amount = schoolClassRepository.count();
        return ResponseEntity.ok(amount);
    }

    @DeleteMapping("/school-class/{schoolClassId}")
    public ResponseEntity<Void> deleteSchoolClass(
            @PathVariable UUID schoolClassId) {

        SchoolClass schoolClass = entityFinderService.findSchoolClass(schoolClassId);

        List<User> userWithRole = userRepository.findAll().stream()
                .filter(p -> p.getSchoolClasses().contains(schoolClass))
                .toList();

        for (User user : userWithRole) {
            user.getSchoolClasses().remove(schoolClass);
            userRepository.save(user);
        }

        schoolClassRepository.delete(schoolClass);
        return ResponseEntity.noContent().build();
    }

    private UUID extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token missing or invalid");
        }

        String token = authHeader.substring(7);
        DecodedJWT jwt = JWT.decode(token);
        return UUID.fromString(jwt.getSubject());
    }
}