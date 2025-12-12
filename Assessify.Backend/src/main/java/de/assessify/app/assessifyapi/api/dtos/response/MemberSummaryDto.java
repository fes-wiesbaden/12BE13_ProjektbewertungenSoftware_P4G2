package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record MemberSummaryDto(
    UUID id,
    String username,
    String fullName,
    Integer roleId
) {}