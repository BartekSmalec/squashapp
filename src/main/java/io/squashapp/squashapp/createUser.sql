CREATE TABLE `user`(
    `id` INT(255) UNSIGNED NOT NULL AUTO_INCREMENT,
    `active` BOOLEAN,
    `user_name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `roles` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`id`)
) ENGINE = INNODB DEFAULT CHARSET = utf8;


#########################
INSERT INTO user (active, user_name, password, roles)
VALUES (true, 'user', 'user', 'ROLE_USER');

INSERT INTO user (id ,active, user_name, password, roles)
VALUES (2, true, 'admin', 'admin', 'ROLE_ADMIN');