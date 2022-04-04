package host.claire.ao3fanficdrafter.backend.servlet.framework.virtual;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface InnerServlet {
	
	void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException;
	void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException;

}
