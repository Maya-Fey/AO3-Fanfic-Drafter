package host.claire.ao3fanficdrafter.backend.data;

import java.util.function.Supplier;

import org.junit.jupiter.api.Test;

public class TestFanfictionTemplate {
	
	static final Supplier<FanfictionTemplate> templateSupplier = ()->new FanfictionTemplate(DataTestHelper.genString(50), DataTestHelper.genString(), DataTestHelper.genString(), DataTestHelper.genString());
	
	@Test
	public void testSerializable() {
		DataTestHelper.assertProperty(
				template->DataTestHelper.assertEqualsDefinedProperty(template, 
						template2->new FanfictionTemplate(template.getKey(), template.getSource() + "i", template2.getCss(), template2.getExample()), 
						FanfictionTemplate.class), 
				templateSupplier, 100);
		DataTestHelper.assertProperty(template->DataTestHelper.assertJsonSerializableProperty(template, FanfictionTemplate.class), 
				templateSupplier, 100);
	}

}
