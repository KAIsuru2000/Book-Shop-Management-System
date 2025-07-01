package lk.brightbs.purchaseOrder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.purchaseOrder.dao.PurchaseOrderDao;

@RestController
public class PurchaseOrderController {

    //Autowired - awashya method automatically build karala method body liyala api add karana veriable ekata ewa assing karala denawa (purchaseOrderDao instance ekak hadala denawa)
    @Autowired 
    private PurchaseOrderDao purchaseOrderDao;

    //request mapping for load purchase order ui url - /purchaseOrders
	@RequestMapping("/purchaseOrders") //request eka meka awoth yata function eka run karanawa
	public ModelAndView getPurchaseOrdersUI(){

		// dashboard ekata username ganima sadaha
        // securitycontextholder magin auth object ekak laba gatha heka
        // auth magin username eka illa gatha heka
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView purchaseOrderView = new ModelAndView();
        purchaseOrderView.setViewName("purchaseOrders.html");

		// dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        purchaseOrderView.addObject("loggedusername", auth.getName());

		//title eka penwimata
		purchaseOrderView.addObject("title", "Purchase Order Management | Bright Book Shop");

		return purchaseOrderView;
	}


}
    

   