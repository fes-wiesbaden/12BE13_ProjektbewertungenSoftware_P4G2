package de.assessify.app.assessifyapi.api.dtos.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import de.assessify.app.assessifyapi.api.entity.ProjectStatus;

import java.time.LocalDate;

public record ProjectUpdateRequestDto(
        String projectName,
        String projectDescription,

        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate startDate,


        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate dueDate,
        ProjectStatus status
) {}