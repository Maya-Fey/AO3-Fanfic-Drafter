package host.claire.ao3fanficdrafter.backend.servlet.framework;

import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jdt.annotation.Nullable;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.InnerServlet;
import host.claire.ao3fanficdrafter.backend.servlet.framework.virtual.OutgoingPacket;

public abstract class OuterServlet extends HttpServlet {

	private static final long serialVersionUID = -7227484002219565353L;
	
	protected Gson gson = new GsonBuilder().create();
	
	protected abstract InnerServlet getInner();
	
	@Override
	protected final void doGet(@Nullable HttpServletRequest req, @Nullable HttpServletResponse resp) throws ServletException, IOException
    {
		if(req == null || resp == null) 
			return;
		
		resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    }
	
	@Override
	protected final void doPost(@Nullable HttpServletRequest req, @Nullable HttpServletResponse resp) throws ServletException, IOException
    {
		if(req == null || resp == null) 
			return;
		
		StringBuffer json = new StringBuffer();
		char[] BUFFER = new char[4096];
		try(BufferedReader reader = req.getReader()) {
			int len = 0;
			while((len = reader.read(BUFFER)) != -1) {
				json.append(BUFFER, 0, len);
			}
		}
		
		OutgoingPacket out = this.getInner().processRequest(gson.fromJson(json.toString(), this.getInner().typeOfIncoming()));
		out.populate(resp);
    }

}
