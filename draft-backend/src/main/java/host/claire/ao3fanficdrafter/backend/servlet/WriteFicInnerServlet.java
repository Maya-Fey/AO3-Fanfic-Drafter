package host.claire.ao3fanficdrafter.backend.servlet;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import host.claire.ao3fanficdrafter.backend.model.except.DuplicateNameException;
import host.claire.ao3fanficdrafter.backend.model.except.InvalidNameException;
import host.claire.ao3fanficdrafter.backend.model.virtual.FanficStorage;
import host.claire.ao3fanficdrafter.backend.servlet.framework.StatusOnlyOutgoingPacket;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.InnerServlet;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.OutgoingPacket;

public class WriteFicInnerServlet implements InnerServlet<WritePacket> {

	private FanficStorage storage;

	public WriteFicInnerServlet(FanficStorage storage) {
		super();
		this.storage = storage;
	}

	@Override
	public OutgoingPacket processRequest(WritePacket packet) {
		try {
			this.storage.write(packet.getPrevName(), packet.getFanfic());
			return new StatusOnlyOutgoingPacket(HttpServletResponse.SC_OK);
		} catch (IOException e) {
			return new StatusOnlyOutgoingPacket(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		} catch (DuplicateNameException e) {
			return new StatusOnlyOutgoingPacket(HttpServletResponse.SC_BAD_REQUEST);
		} catch (InvalidNameException e) {
			return new StatusOnlyOutgoingPacket(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

	@Override
	public Class<WritePacket> typeOfIncoming() {
		return WritePacket.class;
	}

}
