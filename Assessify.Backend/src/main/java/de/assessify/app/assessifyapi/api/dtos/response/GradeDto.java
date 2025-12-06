package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.Date;
import java.util.UUID;

public record GradeDto(UUID id, String gradeName, Float value, Float gradeWeighting, Date date) {}
