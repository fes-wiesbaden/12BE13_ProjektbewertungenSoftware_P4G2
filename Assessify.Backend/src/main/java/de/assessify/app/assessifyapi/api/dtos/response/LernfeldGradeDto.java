package de.assessify.app.assessifyapi.api.dtos.response;

import java.math.BigDecimal;
import java.util.List;

public record LernfeldGradeDto(
        Integer lernfeldId,
        String lernfeldName,
        BigDecimal lernfeldWeighting,
        List<NotenResponseDto> grades,
        BigDecimal averageGrade,
        BigDecimal weightedGrade
) {
}
