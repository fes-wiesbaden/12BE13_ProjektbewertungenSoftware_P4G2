package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;
import java.util.UUID;

public record TrainingModuleWithGradesDto(UUID id, String name, String description, float weighting, List<NotenResponseDto> grades) {}