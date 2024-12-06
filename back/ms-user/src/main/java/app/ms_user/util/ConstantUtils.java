package app.ms_user.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ConstantUtils {
    private ConstantUtils() {}

    public static ResponseEntity<String> getResponseEntity(String message, HttpStatus httpStatus) {
        return new ResponseEntity<String>("Mensaje: " + message, httpStatus);
    }
}
