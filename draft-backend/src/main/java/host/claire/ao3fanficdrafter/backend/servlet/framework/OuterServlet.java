package host.claire.ao3fanficdrafter.backend.servlet.framework;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jdt.annotation.Nullable;

import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.InnerServlet;

public abstract class OuterServlet extends HttpServlet {

	private static final long serialVersionUID = -7227484002219565353L;
	
	protected abstract InnerServlet getInner();
	
	@Override
	protected final void doGet(@Nullable HttpServletRequest req, @Nullable HttpServletResponse resp) throws ServletException, IOException
    {
		if(req == null || resp == null) 
			return;
		
		this.getInner().doGet(req, resp);
    }
	
	@Override
	protected final void doPost(@Nullable HttpServletRequest req, @Nullable HttpServletResponse resp) throws ServletException, IOException
    {
		if(req == null || resp == null) 
			return;
		
		this.getInner().doPost(req, resp);
    }

}
