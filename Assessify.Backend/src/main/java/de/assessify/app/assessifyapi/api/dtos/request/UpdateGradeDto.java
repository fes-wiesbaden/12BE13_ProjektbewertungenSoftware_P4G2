package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.Date;

public record UpdateGradeDto (String gradeName, float value, int gradeWeighting, Date date){}