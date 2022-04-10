package host.claire.ao3fanficdrafter.backend.servlet.framework;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.OutgoingPacket;

public class ContentOutgoingPacket implements OutgoingPacket {
	
	protected final Gson gson = new GsonBuilder().create();
	
	protected final Object o;
	
	public ContentOutgoingPacket(Object o) {
		this.o = o;
	}

	@Override
	public void populate(HttpServletResponse resp) {
		resp.setContentType("application/json");
		try {
			resp.getWriter().write(gson.toJson(this.o));
		} catch (IOException e) {
			e.printStackTrace();
			resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			return;
		}
		resp.setStatus(HttpServletResponse.SC_OK);
	}

}
