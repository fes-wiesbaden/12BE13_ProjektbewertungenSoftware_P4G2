package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.Date;

public record UpdateGradeDto (String gradeName, Float value, Float weighting, Date date){}