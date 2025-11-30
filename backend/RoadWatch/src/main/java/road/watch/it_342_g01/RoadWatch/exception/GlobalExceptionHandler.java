package road.watch.it_342_g01.RoadWatch.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import road.watch.it_342_g01.RoadWatch.dto.AuthResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<AuthResponse> handleInvalidCredentials(InvalidCredentialsException ex) {
        AuthResponse body = AuthResponse.builder()
                .success(false)
                .message("Invalid email or password")
                .accessToken(null)
                .refreshToken(null)
                .user(null)
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<AuthResponse> handleMessageNotReadable(HttpMessageNotReadableException ex) {
        AuthResponse body = AuthResponse.builder()
                .success(false)
                .message("Request body is missing or malformed JSON")
                .accessToken(null)
                .refreshToken(null)
                .user(null)
                .build();
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<AuthResponse> handleGeneric(Exception ex) {
        AuthResponse body = AuthResponse.builder()
                .success(false)
                .message("An unexpected error occurred")
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
