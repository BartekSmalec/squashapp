package io.squashapp.squashapp;

import io.squashapp.squashapp.models.User;
import io.squashapp.squashapp.repository.IUserService;
import io.squashapp.squashapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {
    @Autowired
    UserRepository userRepository;

    @Override
    public void createUser(User user) {
        userRepository.save(user);
    }

    @Override
    public void updateUser(String id, User user) {
    }

    @Override
    public void deleteUser(String id) {
        userRepository.deleteById(Long.valueOf(id));
    }

    @Override
    public User getUserById(String id) {

        Optional<User> user = userRepository.findById(Long.valueOf(id));

        return user.orElseThrow(() -> new UsernameNotFoundException("Not found userName with id:  " + id));
    }

    @Override
    public Optional<User> getUserByName(String name) {
        Optional<User> user = userRepository.findByUserName(name);
        return user;
    }

    @Override
    public Collection<User> getUsers() {
        return (List<User>) userRepository.findAll();
    }
}
