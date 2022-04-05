package host.claire.ao3fanficdrafter.backend.servlet.framework;

import javax.servlet.http.HttpServletResponse;

import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.OutgoingPacket;

public class StatusOnlyOutgoingPacket implements OutgoingPacket {
	
	private final int status;

	public StatusOnlyOutgoingPacket(int status) {
		super();
		this.status = status;
	}

	@Override
	public void populate(HttpServletResponse resp) {
		resp.setStatus(this.status);
	}

}
