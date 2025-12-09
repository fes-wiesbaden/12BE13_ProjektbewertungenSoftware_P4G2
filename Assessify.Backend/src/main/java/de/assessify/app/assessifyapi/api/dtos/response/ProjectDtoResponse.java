package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;
import java.util.UUID;

import de.assessify.app.assessifyapi.api.entity.Review;
import de.assessify.app.assessifyapi.api.entity.TrainingModule;
import de.assessify.app.assessifyapi.api.entity.UserProjectGroup;

public record ProjectDtoResponse(
        UUID id,
        String name,
        String description,
        String deadline,
        String status,
        List<TrainingModule> trainingModules,
        List<UserProjectGroup> groups
) {}
