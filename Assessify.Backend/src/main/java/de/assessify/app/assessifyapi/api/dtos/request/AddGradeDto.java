package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.Date;

public record AddGradeDto(String gradeName, float value, float gradeWeighting) {}