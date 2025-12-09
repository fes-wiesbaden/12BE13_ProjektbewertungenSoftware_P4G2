package de.assessify.app.assessifyapi.api.dtos.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.*;

@Builder
public record UserResponseDto (
    UUID id,
    String firstName,
    String lastName,
    String username,
    Integer roleId,
    String roleName,
    UUID classId,
    String className,
    Boolean isActive,
    LocalDateTime creationDate,
    LocalDateTime lastLogin
) {
    
}
