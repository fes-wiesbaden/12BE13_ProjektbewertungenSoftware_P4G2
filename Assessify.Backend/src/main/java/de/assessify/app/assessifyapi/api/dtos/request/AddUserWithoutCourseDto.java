package de.assessify.app.assessifyapi.api.dtos.request;

import java.time.LocalDateTime;
import java.util.UUID;

public record AddUserWithoutCourseDto (
        UUID id,
        String firstName,
        String lastName,
        String username,
        String password,
        LocalDateTime date,
        Integer roleId
){}