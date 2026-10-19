package com.meramahan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MeraMahanApplication {

    public static void main(String[] args) {
        SpringApplication.run(MeraMahanApplication.class, args);
    }
}
