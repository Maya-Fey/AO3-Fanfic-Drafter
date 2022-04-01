package host.claire.ao3fanficdrafter.backend.data;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.function.Supplier;

import org.junit.jupiter.api.Test;

public class TestFanfictionMetadata {
	
	private static final String METADATA_FROM_JS_SAMPLE = """
			{
			  "title": "Through Time And Space",
			  "rating": "Mature",
			  "categories": {
			    "ff": true,
			    "fm": true,
			    "mm": false,
			    "multi": true,
			    "gen": false,
			    "other": false
			  },
			  "warnings": {
			    "choseNotToUse": false,
			    "majorDeath": true,
			    "graphicViolence": false,
			    "underage": false,
			    "rape": false
			  },
			  "summary": "When Max Caulfield went through terrigenesis, her life and the lives of those around her were changed forever. Her best friend Chloe Price didn't die a pointless death in a bathroom, and Phil Coulson's fledgling S.H.I.E.L.D. was saved from having to go down a dark path. Arcadia Bay lies in ruin, but its people live on, at least for now.\n\nMax never wanted this power, to decide who lives or dies, which agencies rise or fall. But as she crosses the boundary between the world and the much weirder world, she must ask herself, why do I have this power? And what am I meant to do with it? Weeks and months pass her by, the consequences of her decisions become harder and harder to truly count - the failures add up and the successes are impossible to distinguish from inevitability.\n\nBut amidst the chaos, there's one constant in her life. Only Chloe Price can put all the pieces together, will she help Max find her way? Or will they be torn apart by the tides of time and space.",
			  "fandoms": [
			    "Life Is Strange (Video Game)",
			    "Agents of S.H.I.E.L.D. (TV)"
			  ],
			  "ships": [
			    "Maxine \\"Max\\" Caulfield/Chloe Price",
			    "Phil Coulson/Rosalind Price",
			    "Leo Fitz/Jemma Simmons",
			    "Melinda May/Bobbi Morse"
			  ],
			  "characters": [
			    "Maxine \\"Max\\" Caulfield",
			    "Chloe Price",
			    "Phil Coulson",
			    "Rosalind Price",
			    "Leo Fitz",
			    "Jemma Simmons",
			    "Melinda May",
			    "Bobbi Morse",
			    "Alfonso \\"Mack\\" Mackenzie",
			    "Yo Yo Rodriguez",
			    "AIDA (Agents of S.H.I.E.L.D.)",
			    "Daisy Johnson",
			    "Robin Hinton",
			    "Jeffrey Mace (Secondary)",
			    "Ellen Nadeer (Secondary)",
			    "Grant Ward (Secondary)",
			    "Mark Jefferson (Secondary)"
			  ],
			  "tags": [
			    "Secret Agent Chloe",
			    "Science Taken Seriously",
			    "Time Travel",
			    "Let's talk about inhuman rights",
			    "Bigotry & Prejudice",
			    "watchdogs",
			    "Political Themes",
			    "Sokovia Accords",
			    "Ethics",
			    "AoS was too straight for me",
			    "queer fiction",
			    "Trans Character",
			    "Hurt/Comfort",
			    "Redemption",
			    "Healing",
			    "Friends to Lovers",
			    "Insecurity",
			    "Slow Burn",
			    "Found Family",
			    "Mark Jefferson Is His Own Warning",
			    "Calling her AIDA is deadnaming change my mind"
			  ]
			}
			""";
	
	private static final Random rand = new Random();
	static final Supplier<FanfictionMetadata> metadataSupplier = ()->
		new FanfictionMetadata(DataTestHelper.genString(100), DataTestHelper.genString(),
				DataTestHelper.genStringList(20, 100), DataTestHelper.genStringList(100, 100), DataTestHelper.genStringList(100, 100), DataTestHelper.genStringList(100, 100),
				DataTestHelper.genString(10),
				DataTestHelper.genStringMap(6, 50, ()->rand.nextBoolean()),
				DataTestHelper.genStringMap(6, 50, ()->rand.nextBoolean()));
	
	@Test
	public void testSerializable() {
		DataTestHelper.assertProperty(
				template->DataTestHelper.assertEqualsDefinedProperty(template, 
						template2->new FanfictionMetadata(template2.getTitle() + "i", template2.getSummary(), 
								template2.getFandoms(), template2.getShips(), template2.getCharacters(), template2.getTags(),
								template2.getRating(), template2.getCategories(), template2.getWarnings()), 
						FanfictionMetadata.class), 
				metadataSupplier, 100);
		DataTestHelper.assertProperty(template->DataTestHelper.assertJsonSerializableProperty(template, FanfictionMetadata.class), 
				metadataSupplier, 100);
	}
	
	@Test
	public void tesCompatibleWithJS() {
		assertEquals(
				DataTestHelper.gson.fromJson(METADATA_FROM_JS_SAMPLE, FanfictionMetadata.class),
				new FanfictionMetadata(
						"Through Time And Space", 
						"When Max Caulfield went through terrigenesis, her life and the lives of those around her were changed forever. Her best friend Chloe Price didn't die a pointless death in a bathroom, and Phil Coulson's fledgling S.H.I.E.L.D. was saved from having to go down a dark path. Arcadia Bay lies in ruin, but its people live on, at least for now.\n\nMax never wanted this power, to decide who lives or dies, which agencies rise or fall. But as she crosses the boundary between the world and the much weirder world, she must ask herself, why do I have this power? And what am I meant to do with it? Weeks and months pass her by, the consequences of her decisions become harder and harder to truly count - the failures add up and the successes are impossible to distinguish from inevitability.\n\nBut amidst the chaos, there's one constant in her life. Only Chloe Price can put all the pieces together, will she help Max find her way? Or will they be torn apart by the tides of time and space.",
						List.of(new String[] { "Life Is Strange (Video Game)",
							    "Agents of S.H.I.E.L.D. (TV)" }),
						List.of(new String[] { "Maxine \"Max\" Caulfield/Chloe Price",
							    "Phil Coulson/Rosalind Price",
							    "Leo Fitz/Jemma Simmons",
							    "Melinda May/Bobbi Morse" }),
						List.of(new String[] { "Maxine \"Max\" Caulfield",
							    "Chloe Price",
							    "Phil Coulson",
							    "Rosalind Price",
							    "Leo Fitz",
							    "Jemma Simmons",
							    "Melinda May",
							    "Bobbi Morse",
							    "Alfonso \"Mack\" Mackenzie",
							    "Yo Yo Rodriguez",
							    "AIDA (Agents of S.H.I.E.L.D.)",
							    "Daisy Johnson",
							    "Robin Hinton",
							    "Jeffrey Mace (Secondary)",
							    "Ellen Nadeer (Secondary)",
							    "Grant Ward (Secondary)",
							    "Mark Jefferson (Secondary)" }),
						List.of(new String[] { "Secret Agent Chloe",
							    "Science Taken Seriously",
							    "Time Travel",
							    "Let's talk about inhuman rights",
							    "Bigotry & Prejudice",
							    "watchdogs",
							    "Political Themes",
							    "Sokovia Accords",
							    "Ethics",
							    "AoS was too straight for me",
							    "queer fiction",
							    "Trans Character",
							    "Hurt/Comfort",
							    "Redemption",
							    "Healing",
							    "Friends to Lovers",
							    "Insecurity",
							    "Slow Burn",
							    "Found Family",
							    "Mark Jefferson Is His Own Warning",
							    "Calling her AIDA is deadnaming change my mind" }),
						"Mature",
						Map.of("ff", true,
							    "fm", true,
							    "mm", false,
							    "multi", true,
							    "gen", false,
							    "other", false),
						Map.of("choseNotToUse", false,
							    "majorDeath", true,
							    "graphicViolence", false,
							    "underage", false,
							    "rape", false)
			  ));
		
	}

}
