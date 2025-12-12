package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.List;
import java.util.UUID;

public record UpdateSchoolClassDto (String name, List<UUID> learningFieldsIds) {}