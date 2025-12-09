package de.assessify.app.assessifyapi.api.dtos.request;

public record AddProjectDto(
        String name,
        String description,
        String startdate,
        String deadline,
        String status
        
) {}
