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
// Spring Boot wala PutMapping use karanna me import eka dagannawa
import org.springframework.web.bind.annotation.PutMapping;
// Spring Boot wala DeleteMapping use karanna me import eka dagannawa
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.addPriceList.dao.AddPriceListDao;
import lk.brightbs.addPriceList.entity.AddPriceList;
import lk.brightbs.addPriceList.entity.AddPriceListHasItem;
// AddPriceListStatusDao class eka use karanna me import eka dagannawa
import lk.brightbs.addPriceList.dao.AddPriceListStatusDao;
// AddPricelistStatus entity class eka use karanna me import eka dagannawa
import lk.brightbs.addPriceList.entity.AddPricelistStatus;
import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;
import java.util.Set;
import lk.brightbs.priceRequest.dao.PriceRequestDao;
import lk.brightbs.priceRequest.dao.PriceRequestStatusDao;
import lk.brightbs.priceRequest.entity.PriceRequest;
import lk.brightbs.priceRequest.entity.PriceRequestStatus;
import lk.brightbs.item.entity.Item;



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

    // price request dao control eka autowired karagannawa
    @Autowired
    private PriceRequestDao priceRequestDao;

    // price request status dao control eka autowired karagannawa
    @Autowired
    private PriceRequestStatusDao priceRequestStatusDao;

    // add price list status dao instance eka dependency inject karaganna Autowired use karanawa
    @Autowired
    private AddPriceListStatusDao addPriceListStatusDao;

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

   @GetMapping(value = "/addPriceList/getPendingList", produces = "application/json")
   public List<AddPriceList> getPendingList() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilegePO = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PURCHASEORDER");
		Privilege userPrivilegeAPL = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "ADDPRICELIST");
		if (userPrivilegePO.getSel() || userPrivilegeAPL.getSel()) {
			return addPriceListDao.getPendingList();
		} else {
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

				// selected price list request eka database eken gannawa
				PriceRequest priceRequest = priceRequestDao.findById(addPriceList.getPricelistrequest_id().getId()).orElse(null);
				// priceRequest object eka null newe nam pamanak meya sidu karanawa
				if (priceRequest != null) {
					// request eke thiyena okkoma required items tika gannawa
					Set<Item> requiredItems = priceRequest.getItems();
					// required items id collect karaganna list ekak hadagannawa
					List<Integer> requiredItemIds = new ArrayList<>();
					// required items set eka loop karala id gannawa
					for (Item item : requiredItems) {
						// requiredItemIds list ekata id eka push karanawa
						requiredItemIds.add(item.getId());
					}

					// select karapu request no ekata adala, kalin database eke save wunu price lists tika gannawa
					List<AddPriceList> savedPriceLists = addPriceListDao.findByPriceRequest(priceRequest.getId());
					// database eke kalin save wunu items id collect karaganna list ekak hadagannawa
					List<Integer> savedItemIds = new ArrayList<>();
					// save wunu price list array eka loop karanawa
					for (AddPriceList apl : savedPriceLists) {
						// price list eke items register wela thiyeda balanawa
						if (apl.getAddPriceListHasItemList() != null) {
							// items array eka loop karala individual items gannawa
							for (AddPriceListHasItem aplhi : apl.getAddPriceListHasItemList()) {
								// item structure eka null newe nam item id eka collect karanawa
								if (aplhi.getItem_id() != null) {
									// savedItemIds list ekata item id eka add karanawa
									savedItemIds.add(aplhi.getItem_id().getId());
								}
							}
						}
					}

					// okkoma required items database eke thiyeda kiyala check karanna variable ekak
					boolean allCovered = true;
					// required items id list eka loop karanawa
					for (Integer reqItemId : requiredItemIds) {
						// required item id eka saved list eke nathnam check eka false karanawa
						if (!savedItemIds.contains(reqItemId)) {
							// allCovered false karala loop eka break karanawa
							allCovered = false;
							// break loop
							break;
						}
					}

					// okkoma items save wela nam, price list request status eka Completed karanawa
					if (allCovered) {
						// status database eken "Completed" status object eka gannawa
						PriceRequestStatus completedStatus = priceRequestStatusDao.findByName("Completed");
						// status object eka valid nam
						if (completedStatus != null) {
							// price request object eke status eka Completed widihata set karanawa
							priceRequest.setPricelistrequeststatus_id(completedStatus);
							// yawatakalina karapu price request eka database save karanawa
							priceRequestDao.save(priceRequest);
						}
					} else {
						// status database eken "Partially Added" status object eka gannawa
						PriceRequestStatus partiallyAddedStatus = priceRequestStatusDao.findByName("Partially Added");
						// status object eka valid nam
						if (partiallyAddedStatus != null) {
							// price request object eke status eka Partially Added widihata set karanawa
							priceRequest.setPricelistrequeststatus_id(partiallyAddedStatus);
							// yawatakalina karapu price request eka database save karanawa
							priceRequestDao.save(priceRequest);
						}
					}
				}

				return "OK";
			} catch (Exception e) {

				return "Insert not completed : " + e.getMessage();

			}
		} else {
			return "Insert not completed : you haven't permission...";
		}
	}

	// update karanna mapping eka set karagannawa
	@PutMapping(value = "/addPriceList/update")
	// addPriceList object eka parameter ekak widiyata ganna method eka
	public String updateAddPriceList(@RequestBody AddPriceList addPriceList) {
		// logged user details ganna spring security authentication context eka gannawa
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// user ge module privilege check karaganna userPrivilegeController call karanawa
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "ADDPRICELIST");
		// upd permission check karanawa update karanna puluwanda kiyala
		if (userPrivilege.getUpd()) {
			// existing price list eka database eken getReferenceById use karala check karanawa
			AddPriceList extAddPriceList = addPriceListDao.getReferenceById(addPriceList.getId());
			// database eke ehema record ekak nathnam error message ekak yawanawa
			if (extAddPriceList == null) {
				// return text message
				return "Add Price List not exist";
			}
			try {
				// updated date time field ekata wathman welawa assign karanawa
				addPriceList.setUpdatedatetime(LocalDateTime.now());
				// updated userid ekata log una user ge id eka set karanawa
				addPriceList.setUpdateuserid(userDao.getByUsername(auth.getName()).getId());

				// parent child mapping block issues clear karanna items list loop karanawa
				for (AddPriceListHasItem aplhi : addPriceList.getAddPriceListHasItemList()) {
					// child item object ekata parent link reference set karanawa
					aplhi.setAddpricelist_id(addPriceList);
				}

				// updated data details database table ekata save karanawa
				addPriceListDao.save(addPriceList);
				// updates successfully confirm data OK string yawanawa
				return "OK";
			} catch (Exception e) {
				// exception block update fails details return karanawa
				return "Update not completed : " + e.getMessage();
			}
		} else {
			// permission nathi user error message return karanawa
			return "Update not completed : you haven't permission...";
		}
	}

	// delete / cancel karanna mapping eka set karagannawa
	@DeleteMapping(value = "/addPriceList/delete")
	// addPriceList object eka parameter ekak widiyata ganna method eka
	public String deleteAddPriceList(@RequestBody AddPriceList addPriceList) {
		// logged user details ganna spring security authentication context eka gannawa
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// user ge module privilege check karaganna userPrivilegeController call karanawa
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "ADDPRICELIST");
		// del delete/cancel permission check karanawa
		if (userPrivilege.getDel()) {
			// existing price list eka database eken reference by id set checks karanawa
			AddPriceList extAddPriceList = addPriceListDao.getReferenceById(addPriceList.getId());
			// database eke ehema record ekak nathnam error status messages return
			if (extAddPriceList == null) {
				// status message return
				return "Add Price List not exist";
			}
			try {
				// status check change deleted status name get
				AddPricelistStatus deletedStatus = addPriceListStatusDao.findByName("Deleted");
				// delete status details active record set
				extAddPriceList.setAddpriceliststatus_id(deletedStatus);
				// delete date time field values assign
				extAddPriceList.setDeletedatetime(LocalDateTime.now());
				// delete userid settings assign log user id
				extAddPriceList.setDeleteuserid(userDao.getByUsername(auth.getName()).getId());

				// update elements database record save checks
				addPriceListDao.save(extAddPriceList);
				// success status return
				return "OK";
			} catch (Exception e) {
				// exception details messages response back
				return "Delete not completed : " + e.getMessage();
			}
		} else {
			// no permission error warning text output return
			return "Delete not completed : you haven't permission...";
		}
	}

}