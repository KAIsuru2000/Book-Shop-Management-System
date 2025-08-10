package lk.brightbs.addPriceList.controller;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.addPriceList.dao.AddPriceListDao;
import lk.brightbs.addPriceList.entity.AddPriceList;
import lk.brightbs.addPriceList.entity.AddPriceListHasItem;
import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;



@RestController
public class AddPriceListController {

    //Autowired - awashya method automatically build karala method body liyala api add karana veriable ekata ewa assing karala denawa (addPriceListDao instance ekak hadala denawa)
    @Autowired 
    private AddPriceListDao addPriceListDao;

    @Autowired
    private
     UserPrivilegeController userPrivilegeController;

    @Autowired
	private UserDao userDao; 

    //request mapping for load AddPriceList ui url - /addPriceList
	@RequestMapping("/addPriceList") //request eka meka awoth yata function eka run karanawa
	public ModelAndView getAddPriceListUI(){

		// dashboard ekata username ganima sadaha
        // securitycontextholder magin auth object ekak laba gatha heka
        // auth magin username eka illa gatha heka
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView addPriceListView = new ModelAndView();
        addPriceListView.setViewName("addPriceList.html");

		// dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        addPriceListView.addObject("loggedusername", auth.getName());

		//title eka penwimata
		addPriceListView.addObject("title", "Add Price List Management | Bright Book Shop");

		return addPriceListView;
	}

      //load addPriceList all data
   @GetMapping(value = "/addPriceList/alldata" , produces = "application/json")
   public List<AddPriceList> findAllData(){// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "ADDPRICELIST");
		if (userPrivilege.getSel()) {
			//privilege thiyenawanam data return karanawa
			return addPriceListDao.findAll(Sort.by(Sort.Direction.DESC ,"id"));
		} else {
            // privilege neththan
			//empty array list ekak yawanawa
			return new ArrayList<>();
		}
   }

   //define post mapping
	@PostMapping(value = "/addPriceList/insert")
	public String insertAddPriceList(@RequestBody AddPriceList addPriceList) {
		// check user authentication and authorization
		System.out.println(addPriceList);
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		//log una user object eka ara ganima
		User logedUser = userDao.getByUsername(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "ADDPRICELIST");
		if (userPrivilege.getInst()) {
			//check duplicate
			
			

			try {
				//form eken set nowi backend eken set wiya yuthu data thibenam ewa set kirima
			addPriceList.setAddeddatetime(LocalDateTime.now());
			addPriceList.setAddeduserid(logedUser.getId());
			addPriceList.setAddpricelistno(addPriceListDao.getNextAddPriceListNo());

				// save operator
                // addpricelist_id block kirima nisa save kirimata athiwana getaluwa magaharawa ganimata for each ekak liya addpricelist laga athi list eka illa gena (addPriceListHasItemList)
              for (AddPriceListHasItem aplhi : addPriceList.getAddPriceListHasItemList()) {
                  aplhi.setAddpricelist_id(addPriceList);
              }

				addPriceListDao.save(addPriceList);
				return "OK";
			} catch (Exception e) {

				return "Insert not completed : " + e.getMessage();

			}
		} else {
			return "Insert not completed : you haven't permission...";
		}
	}

    


}
    

   