package host.claire.ao3fanficdrafter.backend.helper;

public class NameConverter {
	
	public static String toFilename(String title) { 
		return title.replace("*", "§st").replace("/", "§sl1").replace("\\", "sl2").replace(">", "§gt").replace("<", "§lt").replace(":", "§co").replace("?", "§q").replace("|", "§p").replace("\"", "§qt");
	}
	
	public static boolean validChar(char c) {
		return c > ((char) 0x1F);
	}
	
	public static boolean validTitle(String s) {
		return s.chars().allMatch(i->validChar((char) i));
	}

}
