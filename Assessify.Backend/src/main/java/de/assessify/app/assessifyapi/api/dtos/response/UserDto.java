package de.assessify.app.assessifyapi.api.dtos.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record UserDto(
        UUID id,
        String firstName,
        String lastName,
        String username,
        LocalDateTime date,
        String roleName,
        List<UUID> courseId,
        List<String> courseName
) {}