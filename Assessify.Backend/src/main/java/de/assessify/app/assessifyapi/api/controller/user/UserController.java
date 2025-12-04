package de.assessify.app.assessifyapi.api.controller.user;

import de.assessify.app.assessifyapi.api.dtos.request.AddUserDto;
import de.assessify.app.assessifyapi.api.dtos.request.UpdateUserDto;
import de.assessify.app.assessifyapi.api.dtos.response.UserDto;
import de.assessify.app.assessifyapi.api.repository.RoleRepository;
import de.assessify.app.assessifyapi.api.repository.UserRepository;
import de.assessify.app.assessifyapi.api.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import de.assessify.app.assessifyapi.api.dtos.response.ResetPasswordResponseDto;
import java.security.SecureRandom;
import java.util.UUID;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public UserController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder,
            RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

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
    public ResponseEntity<UserDto> createUserByRoleId(@RequestBody AddUserDto dto, @PathVariable Integer roleId) {
        User user = new User();
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setUsername(dto.username());
        user.setRoleId(roleId);

        User savedUser = userRepository.save(user);

        var role = roleRepository.findById(savedUser.getRoleId())
                .orElse(null);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new UserDto(
                        savedUser.getId(),
                        savedUser.getFirstName(),
                        savedUser.getLastName(),
                        savedUser.getUsername(),
                        savedUser.getCreatedAt(),
                        role != null ? role.getName() : null));
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
    public ResponseEntity<ResetPasswordResponseDto> resetPassword(@PathVariable UUID userId) {
        var optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        String tempPassword = generateTempPassword(10);

        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        return ResponseEntity.ok(new ResetPasswordResponseDto(tempPassword));
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