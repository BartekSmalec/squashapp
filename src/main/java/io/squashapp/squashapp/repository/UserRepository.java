package io.squashapp.squashapp.repository;

import io.squashapp.squashapp.models.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByUserName(String user);

}
