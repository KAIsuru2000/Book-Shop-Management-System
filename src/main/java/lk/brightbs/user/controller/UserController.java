package lk.brightbs.user.controller;

import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("unused")
@RestController
public class UserController {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserDao userDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    UserController(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    //loadd user ui
    @RequestMapping("/user")
    public ModelAndView getuser(){

        // dashboard ekata username ganima sadaha
        // securitycontextholder magin auth object ekak laba gatha heka
        // auth magin username eka illa gatha heka
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView userView = new ModelAndView();
        userView.setViewName("user.html");

        // dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        userView.addObject("loggedusername", auth.getName());

        //title eka penwimata
		userView.addObject("title", "User management | Bright Book Shop");


        return userView;
    }

    //data ganna mapping eka liwima
//get all data URL --["/user/alldata"]
	@GetMapping(value = "/user/alldata", produces = "application/json")
	public List<User> getUserAllData(){

		// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "USER");

		if (userPrivilege.getSel()) {
			//privilege thiyenawanam data return karanawa
			//log una user wa ha admin wa nopenwimata  
            return userDao.findAll(auth.getName());

		} else {
			//empty array list ekak yawanawa
			return new ArrayList<>();
		} 

		
	}

    //define delete mapping
	@DeleteMapping(value = "/user/delete")
	public String deleteUser(@RequestBody User user) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "USER");
		if (userPrivilege.getDel()) {
			//check ext
			//exting user object ekak ganima 
			User extUser = userDao.getReferenceById(user.getId());
			if(extUser == null ){
				// ehema kenek neththan
				return "User not exit";
			}

			try {
				extUser.setStatus(false);
				extUser.setDeletedatetime(LocalDateTime.now());

				userDao.save(extUser);
				return "OK";
			} catch (Exception e) {

				return "Delete not completed : " + e.getMessage();

			}
		} else {
			return "Delete not completed : you haven't permission...";
		}
	}

	//define post mapping
	@PostMapping(value = "/user/insert")
	public String insertUser(@RequestBody User user) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "USER");
		if (userPrivilege.getInst()) {
			//check duplicate
			//email , employeegen duplicate check kala heka
			

			try {
				//status eka auto funtend eken enawa

				//password eka encrypt kirima
				user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

				//user object ekata added data time eka add kirima
				user.setAdded_datetime(LocalDateTime.now());

				userDao.save(user);
				return "OK";
			} catch (Exception e) {

				return "Insert not completed : " + e.getMessage();

			}
		} else {
			return "Insert not completed : you haven't permission...";
		}
	}

	//define put mapping
	@PutMapping(value = "/user/update")
	public String updateUser(@RequestBody User user) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "USER");
		if (userPrivilege.getUpd()) {
			//check ext
			//exting user object ekak ganima 
			User extUser = userDao.getReferenceById(user.getId());
			if(extUser == null ){
				// ehema kenek neththan
				return "User not exit";
			}
			

			try {
				//status eka auto funtend eken enawa

				//password eka encrypt kirima
				

				//user object ekata added data time eka add kirima
				user.setUpdatedatetime(LocalDateTime.now());

				userDao.save(user);
				return "OK";
			} catch (Exception e) {

				return "Update not completed : " + e.getMessage();

			}
		} else {
			return "Update not completed : you haven't permission...";
		}
	}


}
