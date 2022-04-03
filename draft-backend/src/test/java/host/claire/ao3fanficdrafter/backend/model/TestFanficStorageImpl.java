package host.claire.ao3fanficdrafter.backend.model;

import static host.claire.ao3fanficdrafter.backend.helper.ShutUpException.Try;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import host.claire.ao3fanficdrafter.backend.data.DataTestHelper;
import host.claire.ao3fanficdrafter.backend.data.Fanfiction;
import host.claire.ao3fanficdrafter.backend.data.TestFanfictionData;
import host.claire.ao3fanficdrafter.backend.helper.NameConverter;
import host.claire.ao3fanficdrafter.backend.model.except.DuplicateNameException;
import host.claire.ao3fanficdrafter.backend.model.virtual.FanficStorage;

public class TestFanficStorageImpl {
	
	@Test
	public void testSaveLoad() throws IOException {
		File tmpDir = new File("tmp");
		tmpDir.mkdir();
		FanficStorage storage = new FanficStorageImpl(tmpDir);
		DataTestHelper.assertProperty((Fanfiction fanfic)->{
			try {
				storage.write(fanfic.getMeta().getTitle(), fanfic);
				Fanfiction read = storage.read(fanfic.getMeta().getTitle(), "latest");
				assertEquals(fanfic, read);
				assertTrue(storage.getAvailableFics().contains(fanfic.getMeta().getTitle()));
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}, TestFanfictionData.fanficSupplier, 20);
		Files.walk(Paths.get(tmpDir.getPath()))
	        .map(Path::toFile)
	        .sorted((o1, o2) -> -o1.compareTo(o2))
	        .forEach(File::delete);
	}
	
	@Test
	public void testIdenticalNameOverwriteImpossible() throws IOException {
		File tmpDir = new File("tmp");
		tmpDir.mkdir();
		FanficStorage storage = new FanficStorageImpl(tmpDir);
		DataTestHelper.assertProperty((Fanfiction fanfic)->{
			try {
				storage.write(fanfic.getMeta().getTitle(), fanfic);
				Fanfiction fanfic2 = storage.newFanfic();
				assertThrows(DuplicateNameException.class, ()->{
					storage.write(fanfic2.getMeta().getTitle(), fanfic);
				});
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}, TestFanfictionData.fanficSupplier, 20);
		Files.walk(Paths.get(tmpDir.getPath()))
	        .map(Path::toFile)
	        .sorted((o1, o2) -> -o1.compareTo(o2))
	        .forEach(File::delete);
	}
	
	@Test 
	public void testTitleChange() throws IOException {
		File tmpDir = new File("tmp");
		tmpDir.mkdir();
		FanficStorage storage = new FanficStorageImpl(tmpDir);
		Set<String> titles = new HashSet<>();
		Set<String> fnames = new HashSet<>();
		DataTestHelper.assertProperty((Fanfiction fanfic)->{
			try {
				storage.write(fanfic.getMeta().getTitle(), fanfic);
				for(int i = 0; i < 20; i++) {
					String newName = DataTestHelper.genString(50);
					String oldName = fanfic.getMeta().getTitle();
					fanfic = fanfic.withMetadata(fanfic.getMeta().withTitle(newName));
					storage.write(oldName, fanfic);
				}
				titles.add(fanfic.getMeta().getTitle());
				fnames.add(NameConverter.toFilename(fanfic.getMeta().getTitle()));
				assertEquals(titles, new HashSet<>(storage.getAvailableFics()));
				assertEquals(fnames, Set.of(tmpDir.listFiles()).stream().map(f->f.getName()).collect(Collectors.toSet()));
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}, TestFanfictionData.fanficSupplier, 4);
		Files.walk(Paths.get(tmpDir.getPath()))
	        .map(Path::toFile)
	        .sorted((o1, o2) -> -o1.compareTo(o2))
	        .forEach(File::delete);
	}
	
	@Disabled	
	@Test 
	public void testRevisionAvailability() throws IOException {
		File tmpDir = new File("tmp");
		tmpDir.mkdir();
		FanficStorage storage = new FanficStorageImpl(tmpDir);
		DataTestHelper.assertProperty((Fanfiction fanfic)->{
			List<String> revisions = new ArrayList<>();
			try {
				storage.write(fanfic.getMeta().getTitle(), fanfic);
				for(int i = 0; i < 20; i++) {
					storage.write(fanfic.getMeta().getTitle(), fanfic = fanfic.withText(fanfic.getText() + " moretext"));
					storage.save("Rev" + i);
					revisions.add(fanfic.getText());
				}
				assertEquals(IntStream.range(0, 20)
									  .mapToObj(i->"Rev"+i)
									  .collect(Collectors.toList()),  
						     storage.getRevisionsForFic(fanfic.getMeta().getTitle()).stream()
						     														.map(rev->rev.getName())
						     														.collect(Collectors.toList()));
				final Fanfiction shutUpFinals = fanfic;
				assertEquals(revisions, 
						storage.getRevisionsForFic(fanfic.getMeta().getTitle()).stream()
																			   .map(rev->rev.getHash())
																			   .map(Try(hash->storage.read(shutUpFinals.getMeta().getTitle(), hash)))
																			   .map(fic->fic.getText())
																			   .collect(Collectors.toList()));
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}, TestFanfictionData.fanficSupplier, 4);
		Files.walk(Paths.get(tmpDir.getPath()))
	        .map(Path::toFile)
	        .sorted((o1, o2) -> -o1.compareTo(o2))
	        .forEach(File::delete);
	}
	
	@AfterAll
	public static void cleanup() throws IOException {
		if(new File("tmp").exists())
			Files.walk(Paths.get(new File("tmp").getPath()))
		        .map(Path::toFile)
		        .sorted((o1, o2) -> -o1.compareTo(o2))
		        .forEach(File::delete);
	}

}
