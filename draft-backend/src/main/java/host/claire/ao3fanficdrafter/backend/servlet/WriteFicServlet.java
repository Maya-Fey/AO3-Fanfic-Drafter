package host.claire.ao3fanficdrafter.backend.servlet;

import javax.servlet.ServletConfig;

import host.claire.ao3fanficdrafter.backend.servlet.framework.InnerServletAuthenticationAdapter;
import host.claire.ao3fanficdrafter.backend.servlet.framework.OuterServlet;
import host.claire.ao3fanficdrafter.backend.servlet.framework.ServletGlobalState;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.IncomingPacket;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.InnerServlet;

public class WriteFicServlet extends OuterServlet {

	private static final long serialVersionUID = 5928551237085149299L;

	private InnerServlet<IncomingPacket> serv;
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public void init(ServletConfig conf) {
		this.serv = (InnerServlet<IncomingPacket>) new InnerServletAuthenticationAdapter(ServletGlobalState.instance.getVerify(), new WriteFicInnerServlet(ServletGlobalState.instance.getStorage()));
	}
	
	@Override
	protected InnerServlet<IncomingPacket> getInner() {
		return this.serv;
	}

}
