package de.assessify.app.assessifyapi.api.dtos.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import de.assessify.app.assessifyapi.api.entity.ProjectStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ProjectUpdateRequestDto(
        String projectName,
        String projectDescription,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime startDate,


        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime dueDate,
        ProjectStatus status
) {}