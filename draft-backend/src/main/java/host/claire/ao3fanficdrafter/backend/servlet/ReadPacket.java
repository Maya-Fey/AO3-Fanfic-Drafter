package host.claire.ao3fanficdrafter.backend.servlet;

import host.claire.ao3fanficdrafter.backend.servlet.framework.ContentlessIncomingPacket;

public class ReadPacket extends ContentlessIncomingPacket {
	
	private String ficName;
	private String revision;
	
	public ReadPacket(String username, String authenticationCode, String ficName, String revision) {
		super(username, authenticationCode);
		this.ficName = ficName;
		this.revision = revision;
	}

	public String getFicName() {
		return ficName;
	}

	public String getRevision() {
		return revision;
	}	
	
}
