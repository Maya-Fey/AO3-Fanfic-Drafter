package host.claire.ao3fanficdrafter.backend.servlet.framework;

import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.IncomingPacket;

public class ContentlessIncomingPacket implements IncomingPacket {
	
	private String username;
	private String authenticationCode;
	
	public ContentlessIncomingPacket(String username, String authenticationCode) {
		super();
		this.username = username;
		this.authenticationCode = authenticationCode;
	}

	public String username() {
		return username;
	}

	public String authenticationCode() {
		return authenticationCode;
	}	

}
