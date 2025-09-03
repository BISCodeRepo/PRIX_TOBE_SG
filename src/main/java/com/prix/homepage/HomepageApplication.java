package com.prix.homepage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

//@SpringBootApplication
//public class HomepageApplication{

@SpringBootApplication
public class HomepageApplication extends SpringBootServletInitializer{

	@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(HomepageApplication.class);
    } 

	public static void main(String[] args) {
		SpringApplication.run(HomepageApplication.class, args);
	}

}
