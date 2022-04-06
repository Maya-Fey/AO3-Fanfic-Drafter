package host.claire.ao3fanficdrafter.backend.servlet;

import host.claire.ao3fanficdrafter.backend.model.virtual.FanficStorage;
import host.claire.ao3fanficdrafter.backend.servlet.framework.ContentOutgoingPacket;
import host.claire.ao3fanficdrafter.backend.servlet.framework.ContentlessIncomingPacket;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.InnerServlet;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.OutgoingPacket;

public class ListFicsInnerServlet implements InnerServlet<ContentlessIncomingPacket> {

	private FanficStorage storage;

	public ListFicsInnerServlet(FanficStorage storage) {
		super();
		this.storage = storage;
	}

	@Override
	public OutgoingPacket processRequest(ContentlessIncomingPacket packet) {
		return new ContentOutgoingPacket(this.storage.getAvailableFics());
	}

	@Override
	public Class<ContentlessIncomingPacket> typeOfIncoming() {
		return ContentlessIncomingPacket.class;
	}

}
