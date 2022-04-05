package host.claire.ao3fanficdrafter.backend.servlet.framework.virtual;

import javax.servlet.http.HttpServletResponse;

public interface OutgoingPacket {
	
	void populate(HttpServletResponse resp);

}
