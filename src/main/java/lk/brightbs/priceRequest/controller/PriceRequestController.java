package lk.brightbs.priceRequest.controller;

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

import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.priceRequest.dao.PriceRequestDao;
import lk.brightbs.priceRequest.entity.PriceRequest;
import lk.brightbs.privilege.controller.UserPrivilegeController;

@RestController
public class PriceRequestController {

    @Autowired
    private PriceRequestDao priceRequestDao;

	// userprivilegecontroller walin constructer object ekak sada ganima
	@Autowired
	private UserPrivilegeController userPrivilegeController;

    //load privilege ui
    @RequestMapping("/priceRequest")
    public ModelAndView getpriceRequest() {

		// dashboard ekata username ganima sadaha
        // securitycontextholder magin auth object ekak laba gatha heka
        // auth magin username eka illa gatha heka
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView priceRequestView = new ModelAndView();
        priceRequestView.setViewName("priceRequest.html");

		// dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        priceRequestView.addObject("loggedusername", auth.getName());

		//title eka penwimata
		priceRequestView.addObject("title", "Price Request management | Bright Book Shop");

        return priceRequestView;
    }

     //load price request all data
   @GetMapping(value = "/priceRequest/alldata" , produces = "application/json")
   public List<PriceRequest> findAllData(){// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PRICEREQUEST");
		if (userPrivilege.getSel()) {
			//privilege thiyenawanam data return karanawa
			return priceRequestDao.findAll(Sort.by(Sort.Direction.DESC ,"id"));
		} else {
            // privilege neththan
			//empty array list ekak yawanawa
			return new ArrayList<>();
		}
   }
    
}
