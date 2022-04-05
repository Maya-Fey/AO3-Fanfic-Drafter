package host.claire.ao3fanficdrafter.backend.servlet;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import host.claire.ao3fanficdrafter.backend.data.Fanfiction;
import host.claire.ao3fanficdrafter.backend.model.virtual.FanficStorage;
import host.claire.ao3fanficdrafter.backend.servlet.framework.ContentOutgoingPacket;
import host.claire.ao3fanficdrafter.backend.servlet.framework.ContentlessIncomingPacket;
import host.claire.ao3fanficdrafter.backend.servlet.framework.StatusOnlyOutgoingPacket;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.InnerServlet;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.OutgoingPacket;

public class NewFicInnerServlet implements InnerServlet<ContentlessIncomingPacket> {

	private final FanficStorage storage;
	
	public NewFicInnerServlet(FanficStorage storage) {
		super();
		this.storage = storage;
	}

	@Override
	public OutgoingPacket processRequest(ContentlessIncomingPacket packet) {
		try {
			Fanfiction fanfic = storage.newFanfic();
			return new ContentOutgoingPacket(fanfic);
		} catch (IOException e) {
			return new StatusOnlyOutgoingPacket(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public Class<ContentlessIncomingPacket> typeOfIncoming() {
		return ContentlessIncomingPacket.class;
	}

}
