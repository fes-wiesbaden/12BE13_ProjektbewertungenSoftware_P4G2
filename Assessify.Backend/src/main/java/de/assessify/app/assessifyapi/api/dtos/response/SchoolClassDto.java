package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;
import java.util.UUID;


public record SchoolClassDto (
        UUID id,
        String courseName,
        String className
) {}
