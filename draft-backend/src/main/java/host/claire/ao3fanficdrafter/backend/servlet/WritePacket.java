package host.claire.ao3fanficdrafter.backend.servlet;

import host.claire.ao3fanficdrafter.backend.data.Fanfiction;
import host.claire.ao3fanficdrafter.backend.servlet.framework.ContentlessIncomingPacket;

public class WritePacket extends ContentlessIncomingPacket {
	
	private String prevName;
	private Fanfiction fanfic;
	
	public WritePacket(String username, String authenticationCode, String prevName, Fanfiction fanfic) {
		super(username, authenticationCode);
		this.prevName = prevName;
		this.fanfic = fanfic;
	}

	public String getPrevName() {
		return prevName;
	}

	public Fanfiction getFanfic() {
		return fanfic;
	}
	
}
