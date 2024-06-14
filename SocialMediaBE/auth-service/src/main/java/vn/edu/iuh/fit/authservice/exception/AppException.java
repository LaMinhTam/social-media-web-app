package vn.edu.iuh.fit.authservice.exception;

public class AppException extends RuntimeException {
    private int code;
    private String message;

    public AppException(int code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
}