package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;
import java.util.UUID;

public record GroupWithMembersResponseDto(
    UUID id,
    String name,
    UUID projectId,
    String projectName,
    List<MemberSummaryDto> members,
    Integer memberCount
) {
    
}
