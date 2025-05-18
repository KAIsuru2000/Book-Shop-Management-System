package lk.brightbs.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.privilege.entity.Role;
import lk.brightbs.user.entity.User;

@Service // configuration file ekata mema file eka load kirimata heki weema sadaha
// meya user service details nemathi security class ekata implements kirima
public class MyUserServiceDetail implements UserDetailsService {

    //userwa genwa ganima
    @Autowired
    private UserDao userDao;
    

    @Override //UserDetailsService athi abstract method eka(loadUserByUsername) load kara ganima
    //methana username walata security wala username parameter ekehi value eka lebai
    //mehidee username walata adala user kenek innawada bala ehema user kenak innawanam ema userta adala user details object ekak return karanawa ehi athi details walata anuwa configuration file ekehi adla access kirim labe

    //transaction annotation nomathiwa list access kala noheka
    @Transactional
    
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        System.out.println(username);

        //DB wala user object eka ganima
        //getByUsername method eka user dao wala querry liya sedima
        User extUser = userDao.getByUsername(username);
        //extUser gena ehi details siyalla UserDetails object ekata dela new security user object ekak hada return kirima eya security details walin ganima

        //authority sadaha authority list ekak sedima
        Set<GrantedAuthority> authority = new HashSet<>();
        //extUser hi user role set eka aran GrantedAuthority set ekata damima
        //many to many ekan extuser haraha ena role set eka loop eken one by one read karana gaman 
        for(Role userRole : extUser.getRoles()){
            authority.add(new SimpleGrantedAuthority(userRole.getName())); // userRole object eke thibena role name eka dela genarated kara gannawa granted authority object ekak ema object eka set ekata add karanawa
        }

        return new org.springframework.security.core.userdetails.User(extUser.getUsername() , extUser.getPassword() , extUser.getStatus() , true , true , true , authority);
        // log una userge user account eka soaya gena ehi authority list ekath samaga user object ekak memagin return karai.
        //inpasu security container magin ithuru weda tika karai
        //mema security siyalla security file ekehi athi security context holder nam file ekehi store we.(configuration details,user service details)ema file eka apita access kala heka

    }
    
}