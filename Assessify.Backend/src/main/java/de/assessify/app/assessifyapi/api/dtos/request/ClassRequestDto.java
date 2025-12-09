package de.assessify.app.assessifyapi.api.dtos.request;

import java.time.LocalDate;

public record ClassRequestDto (Integer courseId, Integer cohortYear, String name, String description, LocalDate startDate, LocalDate endDate, Integer currentAcademicYear, String status) {
}
