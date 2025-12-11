package de.assessify.app.assessifyapi.api.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import de.assessify.app.assessifyapi.api.entity.Role;
import de.assessify.app.assessifyapi.api.entity.User;
import de.assessify.app.assessifyapi.api.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private final Algorithm algorithm;
    private static final long ACCESS_EXPIRATION_MS = 1000 * 60 * 60; // 1 Stunde
    private static final long REFRESH_EXPIRATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 Tage
    private final RoleRepository roleRepository;

    public JwtService(@Value("${jwt.secret}") String secret, RoleRepository roleRepository) {
        this.algorithm = Algorithm.HMAC256(secret);
        this.roleRepository = roleRepository;
    }

    public String generateAccessToken(User user) {
        return generateToken(user, ACCESS_EXPIRATION_MS, "access");
    }

    public String generateRefreshToken(User user) {
        return generateToken(user, REFRESH_EXPIRATION_MS, "refresh");
    }


    public String generateToken(User user) {
        return generateAccessToken(user);
    }

    public DecodedJWT verifyToken(String token) {
        return JWT.require(algorithm)
                .build()
                .verify(token);
    }

    public String getUsernameFromToken(String token) {
        DecodedJWT decoded = verifyToken(token);
        return decoded.getClaim("username").asString();
    }

    public boolean validateRefreshToken(String token) {
        try {
            DecodedJWT decoded = verifyToken(token);
            String type = decoded.getClaim("type").asString();
            return "refresh".equals(type);
        } catch (Exception ex) {
            return false;
        }
    }

    public String getUsernameFromRefreshToken(String token) {
        DecodedJWT decoded = verifyToken(token);
        String type = decoded.getClaim("type").asString();
        if (!"refresh".equals(type)) {
            throw new IllegalArgumentException("Token ist kein Refresh-Token");
        }
        return decoded.getClaim("username").asString();
    }

    public long getAccessTokenExpirationInSeconds() {
        return ACCESS_EXPIRATION_MS / 1000;
    }

    private String generateToken(User user, long expirationMs, String type) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + expirationMs);

        String roleName = roleRepository.findById(user.getRoleId())
                .map(Role::getName)
                .orElse("UNKNOWN");

        return JWT.create()
                .withSubject(user.getId().toString())
                .withClaim("firstName", user.getFirstName())
                .withClaim("lastName", user.getLastName())
                .withClaim("username", user.getUsername())
                .withClaim("roleId", user.getRoleId())
                .withClaim("roleName", roleName)
                .withClaim("type", type)
                .withIssuedAt(now)
                .withExpiresAt(expiresAt)
                .sign(algorithm);
    }

}
