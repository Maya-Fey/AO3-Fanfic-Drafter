package host.claire.ao3fanficdrafter.backend.servlet;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import host.claire.ao3fanficdrafter.backend.model.virtual.FanficStorage;
import host.claire.ao3fanficdrafter.backend.servlet.framework.ContentOutgoingPacket;
import host.claire.ao3fanficdrafter.backend.servlet.framework.StatusOnlyOutgoingPacket;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.InnerServlet;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.OutgoingPacket;

public class ReadFicInnerServlet implements InnerServlet<ReadPacket> {

	private FanficStorage storage;

	public ReadFicInnerServlet(FanficStorage storage) {
		super();
		this.storage = storage;
	}

	@Override
	public OutgoingPacket processRequest(ReadPacket packet) {
		try {
			return new ContentOutgoingPacket(this.storage.read(packet.getFicName(), packet.getRevision()));
		} catch (IOException e) {
			return new StatusOnlyOutgoingPacket(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public Class<ReadPacket> typeOfIncoming() {
		return ReadPacket.class;
	}

}
