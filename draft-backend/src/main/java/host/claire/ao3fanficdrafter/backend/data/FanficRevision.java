package host.claire.ao3fanficdrafter.backend.data;

import java.util.Objects;

public class FanficRevision {
	
	private String hash;
	private String name;
	private String time;
	
	public FanficRevision(String hash, String name, String time) {
		super();
		this.hash = hash;
		this.name = name;
		this.time = time;
	}
	
	public String getHash() {
		return hash;
	}
	
	public String getName() {
		return name;
	}
	
	public String getTime() {
		return time;
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(hash, name, time);
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		FanficRevision other = (FanficRevision) obj;
		return Objects.equals(hash, other.hash) && Objects.equals(name, other.name) && Objects.equals(time, other.time);
	}
	
	

}
