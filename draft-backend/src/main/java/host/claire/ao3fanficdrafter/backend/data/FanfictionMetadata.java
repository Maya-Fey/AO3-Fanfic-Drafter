package host.claire.ao3fanficdrafter.backend.data;

import java.util.List;
import java.util.Map;
import java.util.Objects;

public class FanfictionMetadata {
	
	private String title;
	private String summary;
	private List<String> fandoms;
	private List<String> ships;
	private List<String> characters;
	private List<String> tags;
	private String rating;
	private Map<String, Boolean> categories;
	private Map<String, Boolean> warnings;
	
	public FanfictionMetadata(String title, String summary, List<String> fandoms, List<String> ships,
			List<String> characters, List<String> tags, String rating, Map<String, Boolean> categories,
			Map<String, Boolean> warnings) {
		super();
		this.title = title;
		this.summary = summary;
		this.fandoms = fandoms;
		this.ships = ships;
		this.characters = characters;
		this.tags = tags;
		this.rating = rating;
		this.categories = categories;
		this.warnings = warnings;
	}

	public String getTitle() {
		return title;
	}

	public String getSummary() {
		return summary;
	}

	public List<String> getFandoms() {
		return fandoms;
	}

	public List<String> getShips() {
		return ships;
	}

	public List<String> getCharacters() {
		return characters;
	}

	public List<String> getTags() {
		return tags;
	}

	public String getRating() {
		return rating;
	}

	public Map<String, Boolean> getCategories() {
		return categories;
	}

	public Map<String, Boolean> getWarnings() {
		return warnings;
	}

	@Override
	public int hashCode() {
		return Objects.hash(categories, characters, fandoms, rating, ships, summary, tags, title, warnings);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		FanfictionMetadata other = (FanfictionMetadata) obj;
		return Objects.equals(categories, other.categories) && Objects.equals(characters, other.characters)
				&& Objects.equals(fandoms, other.fandoms) && Objects.equals(rating, other.rating)
				&& Objects.equals(ships, other.ships) && Objects.equals(summary, other.summary)
				&& Objects.equals(tags, other.tags) && Objects.equals(title, other.title)
				&& Objects.equals(warnings, other.warnings);
	}	

	
}
