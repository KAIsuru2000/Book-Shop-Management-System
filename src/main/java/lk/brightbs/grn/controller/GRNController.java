package lk.brightbs.grn.controller;
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

import lk.brightbs.grn.dao.GRNDao;
import lk.brightbs.grn.entity.GRN;
import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;


@RestController
public class GRNController {

    //Autowired - awashya method automatically build karala method body liyala api add karana veriable ekata ewa assing karala denawa (purchaseOrderDao instance ekak hadala denawa)
    @Autowired 
    private GRNDao grnDao;

    @Autowired
    private
     UserPrivilegeController userPrivilegeController;

    // @Autowired
	// private UserDao userDao; 

    //request mapping for load grn ui url - /grn
	@RequestMapping("/grn") //request eka meka awoth yata function eka run karanawa
	public ModelAndView getGRNUI(){

		// dashboard ekata username ganima sadaha
        // securitycontextholder magin auth object ekak laba gatha heka
        // auth magin username eka illa gatha heka
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView grnView = new ModelAndView();
        grnView.setViewName("grn.html");

		// dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        grnView.addObject("loggedusername", auth.getName());

		//title eka penwimata
		grnView.addObject("title", "GRN Management | Bright Book Shop");

		return grnView;
	}

      //load grn all data
   @GetMapping(value = "/grn/alldata" , produces = "application/json")
   public List<GRN> findAllData(){// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");
		if (userPrivilege.getSel()) {
			//privilege thiyenawanam data return karanawa
			return grnDao.findAll(Sort.by(Sort.Direction.DESC ,"id"));
		} else {
            // privilege neththan
			//empty array list ekak yawanawa
			return new ArrayList<>();
		}
   }

   //define post mapping
	// @PostMapping(value = "/purchaseOrders/insert")
	// public String insertPurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {
	// 	// check user authentication and authorization
	// 	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	// 	//log una user object eka ara ganima
	// 	User logedUser = userDao.getByUsername(auth.getName());
	// 	Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PURCHASEORDER");
	// 	if (userPrivilege.getInst()) {
	// 		//check duplicate
	// 		// PurchaseOrder extPurchaseOrder = purchaseOrderDao.getByOrderNumber(purchaseOrder.getOrderNumber());
	// 		// if(extPurchaseOrder != null){
	// 		// 	return "Save not completed : entered Order number " + purchaseOrder.getOrderNumber() +"Value Allready ext..!";
	// 		// }
			

	// 		try {
	// 			//form eken set nowi backend eken set wiya yuthu data thibenam ewa set kirima
	// 		purchaseOrder.setAddeddatetime(LocalDateTime.now());
	// 		purchaseOrder.setAddeduserid(logedUser.getId());
	// 		purchaseOrder.setPurchaserequestno(purchaseOrderDao.getNextOrderNo());
		
	// 			// save operator
    //             // purchaserequest_id block kirima nisa save kirimata athiwana getaluwa magaharawa ganimata for each ekak liya purchaseOrder laga athi list eka illa gena (purchaseOrderHasItemList)
    //           for (PurchaseOrderHasItem poItem : purchaseOrder.getPurchaseOrderHasItemList()) {
    //               poItem.setPurchaserequest_id(purchaseOrder);
    //           }

	// 			purchaseOrderDao.save(purchaseOrder);
	// 			return "OK";
	// 		} catch (Exception e) {

	// 			return "Insert not completed : " + e.getMessage();

	// 		}
	// 	} else {
	// 		return "Insert not completed : you haven't permission...";
	// 	}
	// }

    


}
    

   