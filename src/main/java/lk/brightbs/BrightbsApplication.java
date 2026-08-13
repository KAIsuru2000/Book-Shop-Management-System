package lk.brightbs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
// Application eke scheduled tasks (kalasatahan karapu wada) auto run kireema active kireema sadaha meya yodagani
@EnableScheduling
public class BrightbsApplication {

	public static void main(String[] args) {
		SpringApplication.run(BrightbsApplication.class, args);

		System.out.println(
				"**************************************  Application Started  ***************************************");
	}

}
