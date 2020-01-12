package io.squashapp.squashapp;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class HomeResource {

    Logger logger = LoggerFactory.getLogger(HomeResource.class);

    @GetMapping("/")
    public String home() {
        logger.info("Home resource");
        return ("<h1> Welcome </h1>");
    }

    @GetMapping("/user")
    public String user() {
        return ("<h1> Welcome user </h1>");
    }

    @GetMapping("/admin")
    public String admin() {
        return ("<h1> Welcome admin </h1>");
    }
}
