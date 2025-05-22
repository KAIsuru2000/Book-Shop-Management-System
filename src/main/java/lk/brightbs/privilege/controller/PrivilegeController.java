package lk.brightbs.privilege.controller;
import lk.brightbs.privilege.dao.PrivilegeDao;
import lk.brightbs.privilege.entity.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

@RestController
public class PrivilegeController {
    @Autowired
    private PrivilegeDao privilegeDao;

	// userprivilegecontroller walin constructer object ekak sada ganima
	@Autowired
	private UserPrivilegeController userPrivilegeController;

    //load privilege ui
    @RequestMapping("/privilege")
    public ModelAndView getprivilege() {

		// dashboard ekata username ganima sadaha
        // securitycontextholder magin auth object ekak laba gatha heka
        // auth magin username eka illa gatha heka
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView privilegeView = new ModelAndView();
        privilegeView.setViewName("privilege.html");

		// dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        privilegeView.addObject("loggedusername", auth.getName());

		//title eka penwimata
		privilegeView.addObject("title", "Privilege management | Bright Book Shop");

        return privilegeView;
    }
	
    //load employee all data
    @GetMapping(value = "/privilege/alldata" , produces = "application/json")
    public List<Privilege> findAllData(){// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PRIVILEGE");
		if (userPrivilege.getSel()) {
			//privilege thiyenawanam data return karanawa
			return privilegeDao.findAll(Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
		} else {
			//empty array list ekak yawanawa
			return new ArrayList<>();
		}
    }

	

    @DeleteMapping(value = "/privilege/delete")
	public String deletePrivilege(@RequestBody Privilege privilege) {
		// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PRIVILEGE");

		if (userPrivilege.getDel()) {
			// check ext

			try {
				// delete operator
				// privilege okkotama false set kirima
				privilege.setSel(false);
				privilege.setInst(false);
				privilege.setUpd(false);
				privilege.setDel(false);

				privilegeDao.save(privilege);
				return "OK";
			} catch (Exception e) {
				return "Delete not completed" + e.getMessage();
			}
		} else {
			return "Delete not completed : you haven't permission";
		}

	}

    @PostMapping(value = "/privilege/insert")
	public String insertPrivilege(@RequestBody Privilege privilege) {
		// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PRIVILEGE");

		// userPrivilege object eka get inst true nam insert karanna puluwan
		if (userPrivilege.getInst()) {
			// check duplicate
			// mehidee role and module value dekama check kala yuthuya
			// previlege object eka ganima
			Privilege extPrivilege = privilegeDao.getPrivilegeByRoleModule(privilege.getRole_id().getId(),
					privilege.getModule_id().getId());

			if (extPrivilege != null) {
				return "save not completed : Privilege Allready exist...!";
			}

			try {
                //form eken set nowi backend eken set wiya yuthu data thibenam ewa set kirima
			privilege.setAddeddatetime(LocalDateTime.now());
			privilege.setAddeduserid(1);
		
				// save operator
				privilegeDao.save(privilege);
				return "OK";
			} catch (Exception e) {
				return "Save not completed !!!!!" + e.getMessage();
			}
		} else {
			return "Save not completed : you haven't permission";
		}

	}

	@PutMapping(value = "/privilege/update")
	public String updatePrivilege(@RequestBody Privilege privilege) {
		// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PRIVILEGE");

		if (userPrivilege.getUpd()) {
			// check ext

			// check duplicate
			Privilege extPrivilege = privilegeDao.getPrivilegeByRoleModule(privilege.getRole_id().getId(),
					privilege.getModule_id().getId());

			if (extPrivilege != null && extPrivilege.getId() != privilege.getId()) {
				return "Update not completed : Privilege Allready exist...!";
			}

			try {
				// update operator
				privilegeDao.save(privilege);
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		} else {
			return "Update not completed : you haven't permission";
		}

	}
}
