package vn.edu.iuh.fit.authservice.service;

public interface AuthService {
    void setTokenToBlackList(String token, Long sub);

}
