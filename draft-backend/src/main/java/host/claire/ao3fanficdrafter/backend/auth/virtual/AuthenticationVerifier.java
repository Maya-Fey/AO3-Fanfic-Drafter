package host.claire.ao3fanficdrafter.backend.auth.virtual;

public interface AuthenticationVerifier {
	
	boolean verifyCode(String mac);

}
