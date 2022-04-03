package host.claire.ao3fanficdrafter.backend.data;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import com.google.gson.GsonBuilder;

import host.claire.ao3fanficdrafter.backend.helper.NameConverter;

public class Fanfiction {
	
	private String text;
	private Map<String, FanfictionTemplate> templates;
	private FanfictionMetadata meta;
	
	public Fanfiction(String text, Map<String, FanfictionTemplate> templates, FanfictionMetadata meta) {
		super();
		this.text = text;
		this.templates = templates;
		this.meta = meta;
	}

	public String getText() {
		return text;
	}

	public Map<String, FanfictionTemplate> getTemplates() {
		return templates;
	}

	public FanfictionMetadata getMeta() {
		return meta;
	}
	
	public Fanfiction withText(String text) {
		return new Fanfiction(text, this.templates, this.meta);
	}
	
	public Fanfiction withTemplates(Map<String, FanfictionTemplate> templates) {
		return new Fanfiction(this.text, templates, this.meta);
	}
	
	public Fanfiction withMetadata(FanfictionMetadata meta) {
		return new Fanfiction(this.text, this.templates, meta);
	}
	
	public void write(File root) throws IOException {
		String fname = NameConverter.toFilename(this.meta.getTitle());
		File dir = new File(root.getCanonicalPath() + "/" + fname);
		if(!dir.exists()) {
			dir.mkdir();
		}
		
		File textFile = new File(dir.getPath() + "/" + fname + ".txt");
		File old = new File(textFile.getPath() + ".old");
		if(textFile.exists()) { textFile.renameTo(old); }
		textFile.createNewFile();
		try(PrintWriter writer = new PrintWriter(new FileWriter(textFile))) {
			writer.append(this.text);
		}
		if(old.exists()) { old.delete(); }
		
		File metaFile = new File(dir.getPath() + "/metadata.json");
		old = new File(metaFile.getPath() + ".old");
		if(metaFile.exists()) { metaFile.renameTo(old); }
		metaFile.createNewFile();
		try(PrintWriter writer = new PrintWriter(new FileWriter(metaFile))) {
			writer.append(new GsonBuilder().create().toJson(this.meta));
		}
		if(old.exists()) { old.delete(); }
		
		File templateDir = new File(dir.getPath() + "/templates");
		if(!templateDir.exists()) templateDir.mkdir();
		for(FanfictionTemplate template : templates.values()) {
			template.write(templateDir);
		}
	}

	@Override
	public int hashCode() {
		return Objects.hash(meta, templates, text);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Fanfiction other = (Fanfiction) obj;
		return Objects.equals(meta, other.meta) && Objects.equals(templates, other.templates)
				&& Objects.equals(text, other.text);
	}	
	
	public static final Fanfiction readFromDirectory(String name, File file) throws FileNotFoundException, IOException {
		String text = null;
		Map<String, FanfictionTemplate> templates = new HashMap<>();
		FanfictionMetadata meta = null;
		
		try(FileReader reader = new FileReader(new File(file.getCanonicalPath() + "/" + name + ".txt"))) {
			StringBuilder builder = new StringBuilder();
			char[] BUFFER = new char[4096];
			int read = 0;
			while((read = reader.read(BUFFER)) != -1) {
				builder.append(BUFFER, 0, read);
			}
			text = builder.toString();
		}
		
		try(FileReader reader = new FileReader(new File(file.getCanonicalPath() + "/metadata.json"))) {
			StringBuilder builder = new StringBuilder();
			char[] BUFFER = new char[4096];
			int read = 0;
			while((read = reader.read(BUFFER)) != -1) {
				builder.append(BUFFER, 0, read);
			}
			meta = new GsonBuilder().create().fromJson(builder.toString(), FanfictionMetadata.class);
		}
		
		File templateDir = new File(file.getCanonicalPath() + "/templates");
		if(!templateDir.exists()) templateDir.mkdir();
		for(File templateFile : templateDir.listFiles()) {
			if(templateFile.getName().endsWith(".template")) {
				FanfictionTemplate template = FanfictionTemplate.readFromFile(templateFile);
				templates.put(template.getKey(), template);
			}
		}
		
		return new Fanfiction(text, templates, meta);
	}

}
