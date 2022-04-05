package host.claire.ao3fanficdrafter.backend.servlet.framework;

import java.io.File;

import host.claire.ao3fanficdrafter.backend.auth.virtual.AuthenticationVerifier;
import host.claire.ao3fanficdrafter.backend.model.FanficStorageImpl;
import host.claire.ao3fanficdrafter.backend.model.virtual.FanficStorage;

public class ServletGlobalState {
	
	public static final ServletGlobalState instance = new ServletGlobalState(new FanficStorageImpl(new File("fanfic")), (String user, String code)->true);
	
	private final FanficStorage storage;
	private final AuthenticationVerifier verify;
	
	public ServletGlobalState(FanficStorage storage, AuthenticationVerifier verify) {
		super();
		this.storage = storage;
		this.verify = verify;
	}

	public FanficStorage getStorage() {
		return storage;
	}

	public AuthenticationVerifier getVerify() {
		return verify;
	}

}
