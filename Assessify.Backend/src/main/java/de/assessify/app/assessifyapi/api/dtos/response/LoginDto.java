package de.assessify.app.assessifyapi.api.dtos.response;

public record LoginDto(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresInSeconds
) {}
