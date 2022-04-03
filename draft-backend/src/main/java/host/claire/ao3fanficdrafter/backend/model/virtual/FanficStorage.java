package host.claire.ao3fanficdrafter.backend.model.virtual;

import java.io.IOException;
import java.util.List;

import host.claire.ao3fanficdrafter.backend.data.FanficRevision;
import host.claire.ao3fanficdrafter.backend.data.Fanfiction;
import host.claire.ao3fanficdrafter.backend.model.except.DuplicateNameException;
import host.claire.ao3fanficdrafter.backend.model.except.InvalidNameException;

public interface FanficStorage {
	
	Fanfiction newFanfic() throws IOException;
	
	void write(String prevName, Fanfiction fanfic) throws DuplicateNameException, InvalidNameException, IOException;
	Fanfiction read(String name, String revisionHash) throws IOException;
	void save(String revisionName);
	
	List<String> getAvailableFics();
	List<FanficRevision> getRevisionsForFic(String fic);	

}
