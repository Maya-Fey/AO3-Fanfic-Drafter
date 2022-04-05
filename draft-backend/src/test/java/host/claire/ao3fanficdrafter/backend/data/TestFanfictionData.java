package host.claire.ao3fanficdrafter.backend.data;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.function.Supplier;

import org.junit.jupiter.api.Test;

public class TestFanfictionData {
	
	public static final Supplier<Fanfiction> fanficSupplier = ()->new Fanfiction(DataTestHelper.genString(1000), genTemplateMap(), TestFanfictionMetadata.metadataSupplier.get());
	
	private static final Map<String, FanfictionTemplate> genTemplateMap() {
		int templates = new Random().nextInt(20);
		Map<String, FanfictionTemplate> map = new HashMap<>();
		while(templates-->0) {
			FanfictionTemplate temp = TestFanfictionTemplate.templateSupplier.get();
			map.put(temp.getKey(), temp);
		}
		return map;
	}
	
	@Test
	public void testSerializable() {
		DataTestHelper.assertProperty(
				template->DataTestHelper.assertEqualsDefinedProperty(template, 
						template2->new Fanfiction(template2.getText() + "i", template2.getTemplates(), template2.getMeta()), 
						Fanfiction.class), 
				fanficSupplier, 100);
		DataTestHelper.assertProperty(template->DataTestHelper.assertJsonSerializableProperty(template, Fanfiction.class), 
				fanficSupplier, 100);
	}

}
