package com.inventorypulse.inventorypulse_backend.auth.dtos;

public record LoginResponse (
        String accessToken,
        String tokenType,
        long expiresInMillis
) { }
