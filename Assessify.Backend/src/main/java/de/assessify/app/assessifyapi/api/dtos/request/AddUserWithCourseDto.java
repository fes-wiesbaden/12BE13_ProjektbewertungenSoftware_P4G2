package de.assessify.app.assessifyapi.api.dtos.request;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record AddUserWithCourseDto (
        UUID id,
        String firstName,
        String lastName,
        String username,
        String password,
        LocalDateTime date,
        Integer roleId,
        List<UUID> courseId
){}
