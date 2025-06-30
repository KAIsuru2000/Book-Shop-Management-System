package lk.brightbs.item.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.item.dao.ItemDao;
import lk.brightbs.item.dao.ItemStatusDao;
import lk.brightbs.item.entity.Brand;
import lk.brightbs.item.entity.Item;
import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;


@RestController
public class ItemController {

    @Autowired
    private ItemDao itemDao;

    @Autowired
    private ItemStatusDao itemStatusDao;

	@Autowired
	private UserDao userDao;

    @Autowired
    private
     UserPrivilegeController userPrivilegeController;

    ItemController(UserDao userDao) {
        this.userDao = userDao;
    }

    //  load item ui
    @RequestMapping("/item")
    public ModelAndView getitem(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView itemView = new ModelAndView();
        itemView.setViewName("item.html");

        // dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        itemView.addObject("loggedusername", auth.getName());

		//title eka penwimata
		itemView.addObject("title", "Item management | Bright Book Shop");

        return itemView;
    }

	
    //load employee all data
   @GetMapping(value = "/item/alldata" , produces = "application/json")
   public List<Item> findAllData(){// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "ITEM");
		if (userPrivilege.getSel()) {
			//privilege thiyenawanam data return karanawa
			return itemDao.findAll(Sort.by(Sort.Direction.DESC ,"id"));
		} else {
            // privilege neththan
			//empty array list ekak yawanawa
			return new ArrayList<>();
		}
   }
    
 //define delete mapping
 @SuppressWarnings("unused")
	@DeleteMapping(value = "/item/delete")
    //object eka requestbody eken Item type item object ekak pass wei
	public String deleteItem(@RequestBody Item item) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "ITEM");
		if (userPrivilege.getDel()) {
			//check ext
			//exting user object ekak ganima 
			Item extItem = itemDao.getReferenceById(item.getId());
			if(extItem == null ){
				// ehema kenek neththan
				return "Item not exit";
			}

			try {
				extItem.setItemstatus_id(itemStatusDao.getReferenceById(3));
				extItem.setDeletedatetime(LocalDateTime.now());

				//fontend eken ena eka wenas karala awoth eka balapemak wena hinda exit record eka save karai
				itemDao.save(extItem);
				return "OK";
			} catch (Exception e) {

				return "Delete not completed : " + e.getMessage();

			}
		} else {
			return "Delete not completed : you haven't permission...";
		}
	}

//define post mapping
	@PostMapping(value = "/item/insert")
	public String insertItem(@RequestBody Item item) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		//log una user object eka ara ganima
		User logedUser = userDao.getByUsername(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "ITEM");
		if (userPrivilege.getInst()) {
			//check duplicate
			Item extItemName = itemDao.getByItemName(item.getItemname());
			if(extItemName != null){
				return "Save not completed : entered Item name " + item.getItemname() +"Value Allready ext..!";
			}
			

			try {
				//form eken set nowi backend eken set wiya yuthu data thibenam ewa set kirima
			item.setAddeddatetime(LocalDateTime.now());
			item.setAddeduserid(logedUser.getId());
			item.setItemcode(itemDao.getNextItemNo());
		
				// save operator
				itemDao.save(item);
				return "OK";
			} catch (Exception e) {

				return "Insert not completed : " + e.getMessage();

			}
		} else {
			return "Insert not completed : you haven't permission...";
		}
	}


	//fix dead code error
	@SuppressWarnings("unused")
//define put mapping
	@PutMapping(value = "/item/update")
	public String updateItem(@RequestBody Item item) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "ITEM");
		if (userPrivilege.getUpd()) {
			//check ext
			//exting user object ekak ganima 
			Item extItem = itemDao.getReferenceById(item.getId());
			if(extItem == null ){
				// ehema kenek neththan
				return "Item not exit";
			}
			

			try {
				//status eka auto funtend eken enawa

				//password eka encrypt kirima
				

				//user object ekata added data time eka add kirima
				item.setUpdatedatetime(LocalDateTime.now());

				itemDao.save(item);
				return "OK";
			} catch (Exception e) {

				return "Update not completed : " + e.getMessage();

			}
		} else {
			return "Update not completed : you haven't permission...";
		}
	}

	// request mapping for get item without request url - "/items/getListWithoutRequest/"
    @GetMapping(value = "/items/getListWithoutRequest/{pricelistrequestid}" , produces = "application/json")
    public List<Item> getListWithoutRequest(@PathVariable("pricelistrequestid") Integer pricelistrequestid){

        return itemDao.getListWithoutRequest(pricelistrequestid);
    }

}
