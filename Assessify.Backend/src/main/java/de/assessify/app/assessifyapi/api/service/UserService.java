package de.assessify.app.assessifyapi.api.service;

import static java.lang.Math.log;
import java.util.List;
import java.util.UUID;

import jakarta.transaction.Transactional;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import de.assessify.app.assessifyapi.api.dtos.response.UserResponseDto;
import de.assessify.app.assessifyapi.api.entity.User;
import de.assessify.app.assessifyapi.api.mapper.UserMapper;
import de.assessify.app.assessifyapi.api.repository.ClassRepository;
import de.assessify.app.assessifyapi.api.repository.RoleRepository;
import de.assessify.app.assessifyapi.api.repository.UserRepository;


@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ClassRepository classRepository;
    private final UserMapper userMapper;


    /**
     * Get All users by role
     */
    public List<UserResponseDto> getUsersByRole(Integer roleId) {
        List<User> users = userRepository.findByRoleId(roleId);
        return users.stream()
                .map(userMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public UserService(UserRepository userRepository, RoleRepository roleRepository, ClassRepository classRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.classRepository = classRepository;
        this.userMapper = userMapper;
    }
}
