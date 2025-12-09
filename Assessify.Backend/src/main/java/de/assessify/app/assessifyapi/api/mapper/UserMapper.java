package de.assessify.app.assessifyapi.api.mapper;

import org.springframework.stereotype.Component;

import de.assessify.app.assessifyapi.api.dtos.response.UserResponseDto;
import de.assessify.app.assessifyapi.api.dtos.request.UserRequestDto;
import de.assessify.app.assessifyapi.api.entity.User;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserMapper {

    public UserResponseDto toResponseDto (User user){
        if (user == null){
            return null;
        }

        return UserResponseDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .roleId(user.getRole() != null ? user.getRole().getId() : null)
                .roleName(user.getRole() != null ? user.getRole().getRoleName() : null)
                .classId(user.getClassEntity() != null ? user.getClassEntity().getId(): null)
                .className(user.getClassEntity() != null ? user.getClassEntity().getName() : null)
                .isActive(user.getIsActive())
                .creationDate(user.getCreationDate())
                .lastLogin(user.getLastLogin())
                .build();
    }


    /**
     * Convert UserRequestDTO to User entity
     * Note: Password should be encoded separately before saving
     */
    public User toEntity(UserRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return User.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword()) // Password should be hashed in service layer
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
    }



}
