package podrzime.utilities;

import net.coobird.thumbnailator.Thumbnails;

import java.io.File;
import java.io.IOException;

public class Compression {

    public static File compressImage(File inputImage, String outputPath) throws IOException {
        File outputFile = new File(outputPath);

        Thumbnails.of(inputImage)
                .scale(1.0) 
                .outputQuality(0.7f)
                .toFile(outputFile);

        return outputFile;
    }
}
