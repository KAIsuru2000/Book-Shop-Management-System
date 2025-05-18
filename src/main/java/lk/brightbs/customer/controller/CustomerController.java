package lk.brightbs.customer.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.customer.dao.CustomerDao;
import lk.brightbs.customer.entity.Customer;
import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;

@RestController
public class CustomerController {
    
    @Autowired
    private CustomerDao customerDao;

    @Autowired
    private
     UserPrivilegeController userPrivilegeController;

    //  load item ui
    @RequestMapping("/customer")
    public ModelAndView getcustomer(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView customerView = new ModelAndView();
        customerView.setViewName("customer.html");

        // dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        customerView.addObject("loggedusername", auth.getName());

		//title eka penwimata
		customerView.addObject("title", "Customer management | Bright Book Shop");

        return customerView;
    }

    //load employee all data
   @GetMapping(value = "/customer/alldata" , produces = "application/json")
   public List<Customer> getAllData(){// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "CUSTOMER");
		if (userPrivilege.getSel()) {
			//privilege thiyenawanam data return karanawa
			return customerDao.findAll(Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
		} else {
            // privilege neththan
			//empty array list ekak yawanawa
			return new ArrayList<>();
		}
   }
    
}

