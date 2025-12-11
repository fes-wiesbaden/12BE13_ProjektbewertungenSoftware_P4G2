package de.assessify.app.assessifyapi.api.dtos.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import de.assessify.app.assessifyapi.api.entity.ProjectStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record ProjectResponseDto(
        UUID id,

        String projectName,

        String projectDescription,

        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate startDate,

        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate dueDate,


        ProjectStatus status,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt,

        int groupCount
) {}
