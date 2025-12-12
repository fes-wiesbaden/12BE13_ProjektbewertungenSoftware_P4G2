package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.dtos.request.AddLoginDto;
import de.assessify.app.assessifyapi.api.dtos.response.LoginDto;
import de.assessify.app.assessifyapi.api.entity.User;
import de.assessify.app.assessifyapi.api.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginDto login(AddLoginDto loginDto) {
        String username = loginDto.username();
        String rawPassword = loginDto.password();

        if (username == null || rawPassword == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username oder Passwort fehlt");
        }

        Optional<User> optionalUser =
                userRepository.findByUsernameIgnoreCase(username.trim());

        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        User user = optionalUser.get();

        boolean matches = passwordEncoder.matches(rawPassword, user.getPassword());
        if (!matches) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new LoginDto(
                accessToken,
                refreshToken,
                "Bearer",
                jwtService.getAccessTokenExpirationInSeconds()
        );
    }

    public String loginAndGetJwt(String username, String rawPassword) {
        AddLoginDto dto = new AddLoginDto(username, rawPassword);
        return login(dto).accessToken();
    }

    public LoginDto refreshTokens(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh-Token fehlt");
        }

        if (!jwtService.validateRefreshToken(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Ungültiger Refresh-Token");
        }

        String username = jwtService.getUsernameFromToken(refreshToken);

        Optional<User> optionalUser =
                userRepository.findByUsernameIgnoreCase(username.trim());

        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User nicht gefunden");
        }

        User user = optionalUser.get();

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        return new LoginDto(
                newAccessToken,
                newRefreshToken,
                "Bearer",
                jwtService.getAccessTokenExpirationInSeconds()
        );
    }

}
