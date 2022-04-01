package host.claire.ao3fanficdrafter.backend.data;

import java.util.Map;
import java.util.Objects;

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

}
