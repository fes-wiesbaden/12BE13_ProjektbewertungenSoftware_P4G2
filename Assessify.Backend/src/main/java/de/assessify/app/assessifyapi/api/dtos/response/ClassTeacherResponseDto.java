package de.assessify.app.assessifyapi.api.dtos.response;

import java.time.LocalDateTime;

public record ClassTeacherResponseDto(
        Integer id,
        Integer teacherId,
        String teacherName,
        String teacherEmail,
        Integer classId,
        String className,
        LocalDateTime assignedDate
) {
}
