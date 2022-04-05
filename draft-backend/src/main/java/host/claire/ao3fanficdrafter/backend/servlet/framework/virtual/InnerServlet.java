package host.claire.ao3fanficdrafter.backend.servlet.framework.virtual;

public interface InnerServlet<T extends IncomingPacket>  {
	
	OutgoingPacket processRequest(T packet);
	
	Class<T> typeOfIncoming();

}
