package host.claire.ao3fanficdrafter.backend.servlet.framework.virtual;

public interface InnerServlet {
	
	OutgoingPacket processRequest(IncomingPacket packet);
	
	<T extends IncomingPacket> Class<T> typeOfIncoming();

}
