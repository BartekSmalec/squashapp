package io.squashapp.squashapp;

import io.squashapp.squashapp.jwt.UserPrinciple;
import io.squashapp.squashapp.models.User;
import io.squashapp.squashapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUserName(username);

        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();

        logger.info("User Detail Service: " + user.get().getUserName() + "\n" + user.get().getRoles());

        UserPrinciple userPrinciple = UserPrinciple.build(user.get());
        // userPrinciple.setAuthorities(new ArrayList<>().add(new SimpleGrantedAuthority("ROLE_ADMIN")));

        logger.info("UserPrinciple.build(): " + UserPrinciple.build(user.get()).getAuthorities());

        return UserPrinciple.build(user.get());
    }
}
