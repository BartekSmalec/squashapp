package io.squashapp.squashapp.repository;

import io.squashapp.squashapp.models.User;

import java.util.Collection;
import java.util.Optional;

public interface IUserService {
    public abstract void createUser(User user);
    public abstract void updateUser(String id, User product);
    public abstract void deleteUser(String id);
    public abstract User getUserById(String id);
    public abstract Optional<User> getUserByName(String name);
    public abstract Collection<User> getUsers();}
