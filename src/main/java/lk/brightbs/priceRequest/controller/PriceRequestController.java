package lk.brightbs.priceRequest.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;
import lk.brightbs.priceRequest.dao.PriceRequestDao;
import lk.brightbs.priceRequest.dao.PriceRequestStatusDao;
import lk.brightbs.priceRequest.entity.PriceRequest;
import lk.brightbs.privilege.controller.UserPrivilegeController;

@RestController
public class PriceRequestController {

    @Autowired
    private PriceRequestDao priceRequestDao;

	 @Autowired
    private PriceRequestStatusDao priceRequestStatusDao;

	// userprivilegecontroller walin constructer object ekak sada ganima
	@Autowired
	private UserPrivilegeController userPrivilegeController;

	@Autowired
	private UserDao userDao;

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

   //define post mapping
	@PostMapping(value = "/priceRequest/insert")
	public String insertPriceRequest(@RequestBody PriceRequest priceRequest) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		//log una user object eka ara ganima
		User logedUser = userDao.getByUsername(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PRICEREQUEST");
		if (userPrivilege.getInst()) {
			//check duplicate
			
			

			try {
				//form eken set nowi backend eken set wiya yuthu data thibenam ewa set kirima
			priceRequest.setAddeddatetime(LocalDateTime.now());
			priceRequest.setAddeduserid(logedUser.getId());
			priceRequest.setRequestno(priceRequestDao.getNextPriceRequestNo());

				// save operator
				priceRequestDao.save(priceRequest);
				return "OK";
			} catch (Exception e) {

				return "Insert not completed : " + e.getMessage();

			}
		} else {
			return "Insert not completed : you haven't permission...";
		}
	}
   
	// define delete mapping
	@SuppressWarnings("unused")
	@DeleteMapping(value = "/priceRequest/delete")
	// object eka requestbody eken PriceRequest type priceRequest object ekak pass wei
	public String deletePriceRequest(@RequestBody PriceRequest priceRequest) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PRICEREQUEST");
		if (userPrivilege.getDel()) {
			// check ext
			// exting user object ekak ganima
			PriceRequest extPriceRequest = priceRequestDao.getReferenceById(priceRequest.getId());
			if (extPriceRequest == null) {
				// ehema kenek neththan
				return "priceRequest not exit";
			}

			try {
				extPriceRequest.setPricelistrequeststatus_id(priceRequestStatusDao.getReferenceById(2));
				extPriceRequest.setDeletedatetime(LocalDateTime.now());

				// fontend eken ena eka wenas karala awoth eka balapemak wena hinda exit record
				// eka save karai
				priceRequestDao.save(extPriceRequest);
				return "OK";
			} catch (Exception e) {

				return "Delete not completed : " + e.getMessage();

			}
		} else {
			return "Delete not completed : you haven't permission...";
		}
	}

	// fix dead code error
	@SuppressWarnings("unused")
	// define put mapping
	@PutMapping(value = "/priceRequest/update")
	public String updatePriceRequest(@RequestBody PriceRequest priceRequest) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PRICEREQUEST");
		if (userPrivilege.getUpd()) {
			// check ext
			// exting user object ekak ganima
			PriceRequest extPriceRequest = priceRequestDao.getReferenceById(priceRequest.getId());
			if (extPriceRequest == null) {
				// ehema kenek neththan
				return "Price Request not exit";
			}

			try {
				// status eka auto funtend eken enawa

				// password eka encrypt kirima

				// user object ekata added data time eka add kirima
				priceRequest.setUpdatedatetime(LocalDateTime.now());

				priceRequestDao.save(priceRequest);
				return "OK";
			} catch (Exception e) {

				return "Update not completed : " + e.getMessage();

			}
		} else {
			return "Update not completed : you haven't permission...";
		}
	}

}
