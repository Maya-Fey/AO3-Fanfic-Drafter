package host.claire.ao3fanficdrafter.backend.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jdt.annotation.Nullable;

public class TestServlet extends HttpServlet {

	private static final long serialVersionUID = 1616700409996276438L;
	
	@Override
	protected final void doGet(@Nullable HttpServletRequest req, @Nullable HttpServletResponse resp) throws ServletException, IOException
    {
		if(req == null || resp == null) 
			return;
		
		resp.setStatus(HttpServletResponse.SC_OK);
		resp.setContentType("application/json");
		try(PrintWriter writer = resp.getWriter()) {
			writer.append("{ \"gay\": 50 }");
		}
    }
	
	@Override
	protected final void doPost(@Nullable HttpServletRequest req, @Nullable HttpServletResponse resp) throws ServletException, IOException
    {
		if(req == null || resp == null) 
			return;
		
		resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    }

}
