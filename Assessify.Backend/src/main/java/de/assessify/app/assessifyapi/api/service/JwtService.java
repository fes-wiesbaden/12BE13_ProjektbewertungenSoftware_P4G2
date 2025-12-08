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
    private static final long EXPIRATION_MS = 1000 * 60 * 60;
    private final RoleRepository roleRepository;

    public JwtService(@Value("${jwt.secret}") String secret, RoleRepository roleRepository) {
        this.algorithm = Algorithm.HMAC256(secret);
        this.roleRepository = roleRepository;
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + EXPIRATION_MS);

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
                .withIssuedAt(now)
                .withExpiresAt(expiresAt)
                .sign(algorithm);
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
}
