package de.assessify.app.assessifyapi.api.dtos.request;

public record CourseRequestDto(
    String code,
    String name,
    String description,
    Integer durationYears
) {
    
}
