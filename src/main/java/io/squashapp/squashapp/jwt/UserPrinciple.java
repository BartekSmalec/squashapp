package io.squashapp.squashapp.jwt;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.squashapp.squashapp.UserDetailsServiceImpl;
import io.squashapp.squashapp.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


public class UserPrinciple implements UserDetails {

    private static final long serialVersionUID = 1L;
    Logger logger = LoggerFactory.getLogger(UserPrinciple.class);
    private long id;
    private String name;
    private String surname;
    private String userName;
    @JsonIgnore
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    //private Collection<SimpleGrantedAuthority> authorities;

    public UserPrinciple(long id, String name, String surname, String userName, String password,
                         Collection<SimpleGrantedAuthority> authorities) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.userName = userName;
        this.password = password;
        this.authorities = authorities;
        //this.authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));


        logger.info("AUTH CONSTRUCTOR " + this.getAuthorities());

    }

    public static UserPrinciple build(User user) {
        List<SimpleGrantedAuthority> authorities = Arrays.stream(user.getRoles().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());


        Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
        logger.info("AUTH: " + authorities);

        UserPrinciple userPrinciple = new UserPrinciple(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getUserName(),
                user.getPassword(),
                authorities
        );

        logger.info("userPrinciple in buid AUTH: " + userPrinciple.getAuthorities());


        return new UserPrinciple(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getUserName(),
                user.getPassword(),
                authorities
        );
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Collection<SimpleGrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserPrinciple user = (UserPrinciple) o;
        return Objects.equals(id, user.id);
    }


}
