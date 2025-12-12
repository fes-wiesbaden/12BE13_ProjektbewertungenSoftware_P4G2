package de.assessify.app.assessifyapi.api.dtos.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.UUID;

public record ClassTeacherResponseDto(
    UUID id,
    UUID teacherId,
    String teacherName,
    UUID classId,
    String className,
    String courseName,
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    LocalDateTime assignedDate
) {}