package host.claire.ao3fanficdrafter.backend.helper;

import java.util.function.Function;

public class ShutUpException {
	
	public static interface ExceptionalFunction<T,R> {
		R apply(T t) throws Exception;
	}
	
	public static <T,R> Function<T,R> Try(ExceptionalFunction<T, R> func) {
		return (T t)->{
			try {
				return func.apply(t);
			} catch(Exception e) {
				throw new RuntimeException(e);
			}
		};
	}

}
