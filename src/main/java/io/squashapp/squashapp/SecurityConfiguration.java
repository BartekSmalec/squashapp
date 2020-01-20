package io.squashapp.squashapp;

import io.squashapp.squashapp.jwt.JwtAuthEntryPoint;
import io.squashapp.squashapp.jwt.JwtAuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    UserDetailsServiceImpl userDetailService;
    @Autowired
    private JwtAuthEntryPoint unauthorizedHandler;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailService);
    }

    @Bean
    public JwtAuthTokenFilter authenticationJwtTokenFilter() {
        return new JwtAuthTokenFilter();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/actuator/*").permitAll()
                .antMatchers(HttpMethod.OPTIONS, "/tournament/**").permitAll() // Dodaj to aby działało w angularze
                .antMatchers(HttpMethod.OPTIONS, "/match/**").permitAll() // Dodaj to aby działało w angularze
                .antMatchers(HttpMethod.OPTIONS, "/comment/**").permitAll() // Dodaj to aby działało w angularze
                .antMatchers(HttpMethod.OPTIONS, "/matchSet/**").permitAll() // Dodaj to aby działało w angularze
                .antMatchers("/user/").hasAnyRole("USER", "ADMIN")
                .antMatchers("/admin/").access("hasRole('ADMIN')")
                .antMatchers("/admin").access("hasRole('ADMIN')")
                .antMatchers("/user").hasAnyRole("USER", "ADMIN")
                .antMatchers("/tournament/**").hasAnyRole("USER","ADMIN")
                .antMatchers("/match/**").hasAnyRole("USER","ADMIN")
                .antMatchers("/matchSet/**").hasAnyRole("USER","ADMIN")
                .antMatchers("/**").permitAll()
                .anyRequest().authenticated()
                .and().exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return NoOpPasswordEncoder.getInstance();
//    }

}
