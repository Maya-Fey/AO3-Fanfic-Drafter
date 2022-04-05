package host.claire.ao3fanficdrafter.backend.servlet.framework;

import javax.servlet.http.HttpServletResponse;

import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.OutgoingPacket;

public abstract class AbstractOutgoingPacket implements OutgoingPacket {

	@Override
	public void populate(HttpServletResponse resp) {
		
	}

}
