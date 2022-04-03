package host.claire.ao3fanficdrafter.backend.data;

import java.util.function.Supplier;

import org.junit.jupiter.api.Test;

public class TestFanfictionData {
	
	public static final Supplier<Fanfiction> fanficSupplier = ()->new Fanfiction(DataTestHelper.genString(1000), DataTestHelper.genStringMap(10, 50, TestFanfictionTemplate.templateSupplier), TestFanfictionMetadata.metadataSupplier.get());
	
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
