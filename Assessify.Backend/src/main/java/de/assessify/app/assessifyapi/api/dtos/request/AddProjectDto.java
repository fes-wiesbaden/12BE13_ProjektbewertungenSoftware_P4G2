package de.assessify.app.assessifyapi.api.dtos.request;

public record AddProjectDto(
        String name,
        String description,
        String deadline,
        String status
        
) {}
