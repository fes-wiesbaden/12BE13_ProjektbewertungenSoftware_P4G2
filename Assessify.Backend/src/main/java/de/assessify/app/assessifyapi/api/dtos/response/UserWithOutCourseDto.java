package de.assessify.app.assessifyapi.api.dtos.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserWithOutCourseDto (
        UUID id,
        String firstName,
        String lastName,
        String username,
        LocalDateTime date,
        String roleName
) {
}
