package lk.brightbs.login.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.privilege.dao.RoleDao;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.privilege.entity.Role;
import lk.brightbs.user.entity.User;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
public class LoginController {

    //Admin account ekak create kirima sadaha user dao auto wierd kara ganima
    @Autowired
    private UserDao userDao;

    //password eka encript wimata bcrypt instance ekak sada ganima
    //configuration ekehi method ekak sada bean ekak kala nisa meya bawitha kirimata heki wiya
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    //Roles set ekata role add kirima sadaha role dao laba ganima
    @Autowired
    private RoleDao roleDao;

    
    @RequestMapping(value = "/login")
    public ModelAndView loadLoginUi(){
        ModelAndView loginUi = new ModelAndView();
        loginUi.setViewName("login.html");
        return loginUi;
    }

    @RequestMapping(value = "/dashboard")
    public ModelAndView loadDashboadUi(){
        // dashboard ekata username ganima sadaha
        // securitycontextholder magin auth object ekak laba gatha heka
        // auth magin username eka illa gatha heka
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView loadDashboadUi = new ModelAndView();
        loadDashboadUi.setViewName("dashboard.html");
        // dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        loadDashboadUi.addObject("loggedusername", auth.getName());

        //title eka penwimata
		loadDashboadUi.addObject("title", "Dashboard | Bright book Shop");


        return loadDashboadUi;
    }

    @RequestMapping(value = "/errorpage")
    public ModelAndView loadErrorPageUi(){
        ModelAndView errorPageView = new ModelAndView();
        errorPageView.setViewName("errorpage.html");
        return errorPageView;
    }

    @RequestMapping(value = "/createAdmin")
    public ModelAndView generateAdminAccount(){

        // kalin hadapu admin account ekak db wala thibeda balima
        User extAdminUser = userDao.getByUsername("Admin");
        if (extAdminUser == null) {
        //Admin neththan aluthin hadima
        User adminUser = new User(); //empty constructer call kirima
        adminUser.setUsername("Admin"); //user name eka set kirima
        adminUser.setEmail("Admin@gmail.com");
        adminUser.setStatus(true);
        adminUser.setAdded_datetime(LocalDateTime.now());
        adminUser.setPassword(bCryptPasswordEncoder.encode("12345"));
        //adminta role set kirima esadaha role set ekak thibiya yuthuya
        Set<Role> roles = new HashSet<>();
        //dao gen role object ekak illa ganima
        Role adminRole = roleDao.getReferenceById(3);
        //role object eka role set ekata set kirima
        roles.add(adminRole);
        //eya admin userta set kirima
        adminUser.setRoles(roles);
        //eya userdao magin save kirima
        userDao.save(adminUser);
}

        ModelAndView loginUi = new ModelAndView();
        loginUi.setViewName("login.html");
        return loginUi;
    }

    
    
}
