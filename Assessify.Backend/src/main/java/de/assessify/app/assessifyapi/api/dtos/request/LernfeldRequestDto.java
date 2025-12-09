package de.assessify.app.assessifyapi.api.dtos.request;

import java.math.BigDecimal;

public record LernfeldRequestDto(Integer courseId, String name, String description, BigDecimal lernfeldWeighting, Integer academicYearLevel) {

}
