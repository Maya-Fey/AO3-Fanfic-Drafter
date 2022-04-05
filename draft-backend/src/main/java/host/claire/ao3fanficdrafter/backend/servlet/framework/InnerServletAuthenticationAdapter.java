package host.claire.ao3fanficdrafter.backend.servlet.framework;

import javax.servlet.http.HttpServletResponse;

import host.claire.ao3fanficdrafter.backend.auth.virtual.AuthenticationVerifier;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.IncomingPacket;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.InnerServlet;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.OutgoingPacket;

public class InnerServletAuthenticationAdapter<T extends IncomingPacket> implements InnerServlet<T> {

	private final AuthenticationVerifier verifier;
	private final InnerServlet<T> adapted;

	public InnerServletAuthenticationAdapter(AuthenticationVerifier verifier, InnerServlet<T> adapted) {
		super();
		this.verifier = verifier;
		this.adapted = adapted;
	}

	@Override
	public OutgoingPacket processRequest(T packet) {
		if(verifier.verifyCode(packet.username(), packet.authenticationCode())) {
			return this.adapted.processRequest(packet);
		} else {
			return new StatusOnlyOutgoingPacket(HttpServletResponse.SC_FORBIDDEN);
		}
	}

	@Override
	public Class<T> typeOfIncoming() {
		return adapted.typeOfIncoming();
	}

}
