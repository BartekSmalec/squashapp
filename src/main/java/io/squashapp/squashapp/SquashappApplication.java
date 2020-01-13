package io.squashapp.squashapp;

import io.squashapp.squashapp.repository.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackageClasses = UserRepository.class)
public class SquashappApplication {

	public static void main(String[] args) {
		SpringApplication.run(SquashappApplication.class, args);
	}

}
