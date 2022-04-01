package host.claire.ao3fanficdrafter.backend.data;

import java.util.Objects;

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
	
}
