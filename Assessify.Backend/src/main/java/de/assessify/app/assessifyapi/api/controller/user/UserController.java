package de.assessify.app.assessifyapi.api.controller.user;

import de.assessify.app.assessifyapi.api.dtos.request.AddUserWithCourseDto;
import de.assessify.app.assessifyapi.api.dtos.request.ResetPasswordDto;
import de.assessify.app.assessifyapi.api.dtos.request.UpdateUserDto;
import de.assessify.app.assessifyapi.api.dtos.response.UserDto;
import de.assessify.app.assessifyapi.api.entity.SchoolClass;
import de.assessify.app.assessifyapi.api.repository.RoleRepository;
import de.assessify.app.assessifyapi.api.repository.SchoolClassRepository;
import de.assessify.app.assessifyapi.api.repository.UserRepository;
import de.assessify.app.assessifyapi.api.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import de.assessify.app.assessifyapi.api.dtos.request.ChangePasswordDto;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.UUID;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final SchoolClassRepository schoolClassRepository;

    public UserController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder,
                          RoleRepository roleRepository, SchoolClassRepository schoolClassRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.schoolClassRepository = schoolClassRepository;
    }

    private static final Logger logger = Logger.getLogger(UserController.class.getName());

    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<UserDto>> getAllUsersById(@PathVariable Integer roleId) {
        var modules = userRepository.findByRoleId(roleId)
                .stream()
                .map(field -> {

                    var role = roleRepository.findById(field.getRoleId())
                            .orElse(null);

                    return new UserDto(
                            field.getId(),
                            field.getFirstName(),
                            field.getLastName(),
                            field.getUsername(),
                            field.getCreatedAt(),
                            role != null ? role.getName() : null);
                })
                .toList();

        return ResponseEntity.ok(modules);
    }

    @GetMapping("/role/{roleId}/class/{classId}")
    public ResponseEntity<List<UserDto>> getAllUsersByClass(@PathVariable Integer roleId, @PathVariable UUID classId) {
        var students = userRepository.findByClassIdAndRoleId(classId, roleId)
                .stream()
                .map(user -> {
                    var role = roleRepository.findById(user.getRoleId()).orElse(null);

                    return new UserDto(
                            user.getId(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getUsername(),
                            user.getCreatedAt(),
                            role != null ? role.getName() : null
                    );
                })
                .toList();

        return ResponseEntity.ok(students);
    }

    @PostMapping("/role/{roleId}")
    public ResponseEntity<UserDto> createUserByRole(
            @RequestBody AddUserWithCourseDto dto,
            @PathVariable Integer roleId) {

        User user = new User();
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setUsername(dto.username());
        user.setRoleId(roleId);

        if (dto.courseId() != null && !dto.courseId().isEmpty()) {
            List<SchoolClass> classesToAssign = new ArrayList<>();
            for (UUID classId : dto.courseId()) {
                SchoolClass schoolClass = schoolClassRepository.findById(classId)
                        .orElseThrow(() -> new RuntimeException("Course not found: " + classId));
                classesToAssign.add(schoolClass);
            }
            user.setSchoolClasses(classesToAssign);
        }

        User savedUser = userRepository.save(user);

        var role = roleRepository.findById(savedUser.getRoleId()).orElse(null);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new UserDto(
                        savedUser.getId(),
                        savedUser.getFirstName(),
                        savedUser.getLastName(),
                        savedUser.getUsername(),
                        savedUser.getCreatedAt(),
                        role != null ? role.getName() : null
                ));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUserById(@PathVariable UUID userId) {

        User existingUser = userRepository.findById(userId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id " + userId));
        userRepository.delete(existingUser);

        return ResponseEntity.noContent().build();

    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(@RequestBody UpdateUserDto dto, @PathVariable UUID userId) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        existingUser.setFirstName(dto.firstName());
        existingUser.setLastName(dto.lastName());
        existingUser.setUsername(dto.username());

        User updatedUser = userRepository.save(existingUser);

        var role = roleRepository.findById(updatedUser.getRoleId()).orElse(null);

        return ResponseEntity.ok(new UserDto(
                updatedUser.getId(),
                updatedUser.getFirstName(),
                updatedUser.getLastName(),
                updatedUser.getUsername(),
                updatedUser.getCreatedAt(),
                role != null ? role.getName() : null));
    }

    @PostMapping("/{userId}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable UUID userId, @RequestBody ChangePasswordDto dto) {
        try {
            User existingUser = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

            existingUser.setPassword(passwordEncoder.encode(dto.newPassword()));
            userRepository.save(existingUser);

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error resetting passwords for current user", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/{username}/change-password")
    public ResponseEntity<Void> changePasswordByUsername(
            @PathVariable String username,
            @RequestBody ResetPasswordDto dto
    ) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User nicht gefunden"
                ));

        if (!passwordEncoder.matches(dto.oldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Altes Passwort ist falsch");
        }

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepository.save(user);

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/role/{roleId}/amount")
    public ResponseEntity<Long> getUserRoleAmount(@PathVariable Integer roleId) {
        long count = userRepository.countByRoleId(roleId);
        return ResponseEntity.ok(count);
    }

    private static final String PASSWORD_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private String generateTempPassword(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(PASSWORD_CHARS.length());
            sb.append(PASSWORD_CHARS.charAt(index));
        }
        return sb.toString();
    }
}