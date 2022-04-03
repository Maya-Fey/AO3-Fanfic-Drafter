package host.claire.ao3fanficdrafter.backend.data;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Objects;

import com.google.gson.GsonBuilder;

import host.claire.ao3fanficdrafter.backend.helper.NameConverter;

public class FanfictionTemplate {
	private String key;
	private String source;
	private String style;
	private String example;
	
	public FanfictionTemplate(String key, String source, String css, String example)
	{
		this.key = key;
		this.source = source;
		this.style = css;
		this.example = example;
	}
	
	public String getKey() {
		return key;
	}
	
	public String getSource() {
		return source;
	}

	public String getCss() {
		return style;
	}

	public String getExample() {
		return example;
	}
	
	public void write(File root) throws IOException {
		try(PrintWriter writer = new PrintWriter(new FileWriter(new File(root.getCanonicalPath() + "/" + NameConverter.toFilename(this.key) + ".template")))) {
			writer.write(new GsonBuilder().create().toJson(this));
		}
	}

	@Override
	public int hashCode() {
		return Objects.hash(example, key, source, style);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		FanfictionTemplate other = (FanfictionTemplate) obj;
		return Objects.equals(example, other.example) && Objects.equals(key, other.key)
				&& Objects.equals(source, other.source) && Objects.equals(style, other.style);
	}
	
	public static FanfictionTemplate readFromFile(File file) throws IOException {
		String json = null;
		
		try(FileReader reader = new FileReader(file)) {
			StringBuilder builder = new StringBuilder();
			char[] BUFFER = new char[4096];
			int read = 0;
			while((read = reader.read(BUFFER)) != -1) {
				builder.append(BUFFER, 0, read);
			}
			json = builder.toString();
		}
		
		return new GsonBuilder().create().fromJson(json, FanfictionTemplate.class);
	}
	
}
