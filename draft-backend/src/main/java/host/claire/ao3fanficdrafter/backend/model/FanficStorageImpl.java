package host.claire.ao3fanficdrafter.backend.model;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import host.claire.ao3fanficdrafter.backend.data.FanficRevision;
import host.claire.ao3fanficdrafter.backend.data.Fanfiction;
import host.claire.ao3fanficdrafter.backend.data.FanfictionMetadata;
import host.claire.ao3fanficdrafter.backend.helper.NameConverter;
import host.claire.ao3fanficdrafter.backend.model.except.DuplicateNameException;
import host.claire.ao3fanficdrafter.backend.model.except.InvalidNameException;
import host.claire.ao3fanficdrafter.backend.model.virtual.FanficStorage;

public class FanficStorageImpl implements FanficStorage {
	
	private final Map<String, Fanfiction> fanfics = new HashMap<>();
	private final File rootDir;
	
	public FanficStorageImpl(File rootDir) {
		super();
		this.rootDir = rootDir;
		rootDir.mkdir();
		List.of(rootDir.listFiles()).forEach(file->{
			if(file.isDirectory()) {
				try {
					Fanfiction fanfic = Fanfiction.readFromDirectory(file.getName(), file);
					fanfics.put(fanfic.getMeta().getTitle(), fanfic);
				} catch (FileNotFoundException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		});
	}

	@Override
	public Fanfiction newFanfic() throws IOException {
		String name = "New Fanfic";
		{
			int i = 2;
			while(fanfics.containsKey(name)) name = "New Fanfic " + i++;
		}
		
		Fanfiction fanfic = new Fanfiction("", new HashMap<>(), 
				new FanfictionMetadata(name, "", 
						List.of(), List.of(), List.of(), List.of(), 
						"",
						Map.of("ff", false,
							    "fm", false,
							    "mm", false,
							    "multi", false,
							    "gen", false,
							    "other", false),
						Map.of("choseNotToUse", false,
							    "majorDeath", false,
							    "graphicViolence", false,
							    "underage", false,
							    "rape", false)));
		
		fanfic.write(this.rootDir);
		
		return fanfic;
	}

	@Override
	public void write(String prevName, Fanfiction fanfic) throws DuplicateNameException, IOException, InvalidNameException {
		if(!NameConverter.validTitle(fanfic.getMeta().getTitle())) throw new InvalidNameException();
		
		String oldFname = NameConverter.toFilename(prevName);
		String newFname = NameConverter.toFilename(fanfic.getMeta().getTitle());
		this.fanfics.remove(prevName);
		if(!oldFname.equals(newFname)) {
			if(fanfics.containsKey(fanfic.getMeta().getTitle())) {
				throw new DuplicateNameException();
			}
			new File(this.rootDir.getCanonicalPath() + "/" + oldFname).renameTo(new File(this.rootDir.getCanonicalPath() + "/" + newFname));
		}
		this.fanfics.put(fanfic.getMeta().getTitle(), fanfic);
		fanfic.write(this.rootDir);		
	}

	@Override
	public Fanfiction read(String name, String revision) {
		if(revision.equals("latest")) {
			return fanfics.get(name);
		}
		
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<String> getAvailableFics() {
		return new ArrayList<>(fanfics.keySet());	
	}

	@Override
	public List<FanficRevision> getRevisionsForFic(String fic) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void save(String revisionName) {
		// TODO Auto-generated method stub
		
	}

}
