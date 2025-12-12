package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.List;
import java.util.UUID;

import de.assessify.app.assessifyapi.api.entity.TrainingModule;

public record AddSchoolClassDto (String name, List<UUID> learnfields) {}