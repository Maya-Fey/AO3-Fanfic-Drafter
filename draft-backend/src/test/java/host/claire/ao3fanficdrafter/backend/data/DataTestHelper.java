package host.claire.ao3fanficdrafter.backend.data;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class DataTestHelper {
	
	static final Gson gson = new GsonBuilder().create();
	static final Random rand = new Random();
	
	public static <T> void assertJsonSerializableProperty(T obj, Class<T> objClass) {
		assertEquals(obj, gson.fromJson(gson.toJson(obj), objClass));
	}
	
	public static <T> void assertEqualsDefinedProperty(T obj, Function<T, T> definiteMutator, Class<T> objClass) {
		assertNotEquals(obj, definiteMutator.apply(gson.fromJson(gson.toJson(obj), objClass)));
	}
	
	public static <T> void assertProperty(Consumer<T> property, Supplier<T> generator, int iter) {
		while(iter-->0) property.accept(generator.get());
	}
	
	public static String genString(int max) {
		int len = rand.nextInt(max);
		StringBuilder builder = new StringBuilder();
		while(len-->0) builder.append((char) rand.nextInt() & 0x7FFF);
		return builder.toString();
	}
	
	public static String genString() {
		return genString(1000);
	}
	
	public static List<String> genStringList(int maxStrs, int maxLen) {
		List<String> list = new ArrayList<>();
		int len = rand.nextInt(maxStrs);
		while(len-->0) list.add(genString(maxLen));
		return list;
	}
	
	public static <T> Map<String, T> genStringMap(int nStrs, int maxLen, Supplier<T> sup) {
		Map<String, T> map = new HashMap<>();
		while(nStrs-->0) map.put(genString(maxLen), sup.get());
		return map;
	}

}
