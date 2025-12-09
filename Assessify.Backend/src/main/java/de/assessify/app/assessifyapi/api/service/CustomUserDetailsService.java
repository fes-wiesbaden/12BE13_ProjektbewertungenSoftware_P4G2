package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.entity.User;
import de.assessify.app.assessifyapi.api.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        de.assessify.app.assessifyapi.api.entity.User user =
                userRepository.findByUsernameIgnoreCase(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        String roleName = "ROLE_" + user.getRoleId();
        var authorities = List.of(new SimpleGrantedAuthority(roleName));

        return new CustomUserDetails(
                user.getUsername(),
                user.getPassword(),
                authorities,
                user.getRoleId()
        );
    }
}
