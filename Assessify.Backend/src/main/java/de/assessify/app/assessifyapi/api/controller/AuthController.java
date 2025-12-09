package de.assessify.app.assessifyapi.api.controller;
import de.assessify.app.assessifyapi.api.dtos.response.LoginResponseDto;
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
    public ResponseEntity<?> login(@RequestBody AddLoginDto loginDto) {
        String token = authService.loginAndGetJwt(loginDto.username(), loginDto.password());
        if (token == null) {
            return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }
        LoginResponseDto response = new LoginResponseDto(
                token,
                "Bearer"
        );
        return ResponseEntity.ok(response);
    }
}