package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.entity.Role;
import de.assessify.app.assessifyapi.api.entity.User;
import de.assessify.app.assessifyapi.api.repository.RoleRepository;
import de.assessify.app.assessifyapi.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public void run(String... args) throws Exception {
        createRoleIfNotExists(1, "TEACHER");
        createRoleIfNotExists(2, "STUDENT");
        createRoleIfNotExists(3, "ADMIN");

        createDefaultUser();
    }

    private void createRoleIfNotExists(Integer id, String name) {
        if (!roleRepository.existsById(id)) {
            roleRepository.save(new Role(id, name));
            System.out.println("Role created: " + name);
        }
    }

    private void createDefaultUser() {
        String firstName = "super";
        String lastName = "admin";
        String username = firstName + "."  + lastName;

        if (!userRepository.existsByUsername(username)) {
            // String rawPassword = generateRandomPassword();
            String rawPassword = "123";

            User user = new User();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setUsername(username);
            user.setRoleId(3);

            userRepository.save(user);

            System.out.println("Default user created:");
            System.out.println("Username: " + username);
            System.out.println("Password: " + rawPassword);
        }
    }

    private String generateRandomPassword() {
        int length = 15;
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+=<>?";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(chars.length());
            password.append(chars.charAt(index));
        }

        return password.toString();
    }
}
