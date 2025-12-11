package de.assessify.app.assessifyapi.api.controller;
import de.assessify.app.assessifyapi.api.dtos.request.RefreshTokenRequestDto;
import de.assessify.app.assessifyapi.api.dtos.response.LoginDto;
import de.assessify.app.assessifyapi.api.dtos.request.AddLoginDto;
import de.assessify.app.assessifyapi.api.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginDto> login(@RequestBody AddLoginDto loginDto) {
        LoginDto response = authService.login(loginDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginDto> refresh(@RequestBody RefreshTokenRequestDto request) {
        LoginDto response = authService.refreshTokens(request.refreshToken());
        return ResponseEntity.ok(response);
    }
}
