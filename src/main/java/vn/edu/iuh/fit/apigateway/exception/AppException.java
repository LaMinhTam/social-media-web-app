package vn.edu.iuh.fit.apigateway.exception;


public class AppException extends RuntimeException {
    private int code;
    private String message;

    public AppException(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}