package lk.brightbs.purchaseOrder.controller;

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

import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.purchaseOrder.dao.PurchaseOrderDao;
import lk.brightbs.purchaseOrder.entity.PurchaseOrder;
import lk.brightbs.purchaseOrder.entity.PurchaseOrderHasItem;
// PurchaseOrderStatusDao class eka use karanna me import eka dagannawa
import lk.brightbs.purchaseOrder.dao.PurchaseOrderStatusDao;
// PurchaseOrderStatus entity class eka use karanna me import eka dagannawa
import lk.brightbs.purchaseOrder.entity.PurchaseOrderStatus;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;
import lk.brightbs.addPriceList.dao.AddPriceListDao;
import lk.brightbs.addPriceList.dao.AddPriceListStatusDao;
import lk.brightbs.addPriceList.entity.AddPriceList;
import lk.brightbs.addPriceList.entity.AddPriceListHasItem;
import lk.brightbs.addPriceList.entity.AddPricelistStatus;
import lk.brightbs.item.entity.Item;

@RestController
public class PurchaseOrderController {

    //Autowired - awashya method automatically build karala method body liyala api add karana veriable ekata ewa assing karala denawa (purchaseOrderDao instance ekak hadala denawa)
    @Autowired 
    private PurchaseOrderDao purchaseOrderDao;

    @Autowired
    private
     UserPrivilegeController userPrivilegeController;

    @Autowired
	private UserDao userDao; 

    // add price list dao control eka autowired karagannawa
    @Autowired
    private AddPriceListDao addPriceListDao;

    // add price list status dao control eka autowired karagannawa
    @Autowired
    private AddPriceListStatusDao addPriceListStatusDao;

    // purchase order status dao dependency inject karanna me Autowired line eka dagannawa
    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

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

      //load purchaseOrders all data
   @GetMapping(value = "/purchaseOrders/alldata" , produces = "application/json")
   public List<PurchaseOrder> findAllData(){// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PURCHASEORDER");
		if (userPrivilege.getSel()) {
			//privilege thiyenawanam data return karanawa
			return purchaseOrderDao.findAll(Sort.by(Sort.Direction.DESC ,"id"));
		} else {
            // privilege neththan
			//empty array list ekak yawanawa
			return new ArrayList<>();
		}
   }

   @GetMapping(value = "/purchaseOrders/getPendingList", produces = "application/json")
   public List<PurchaseOrder> getPendingList() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilegePO = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PURCHASEORDER");
		Privilege userPrivilegeGRN = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");
		if (userPrivilegePO.getSel() || userPrivilegeGRN.getSel()) {
			return purchaseOrderDao.getPendingList();
		} else {
			return new ArrayList<>();
		}
   }

   //define post mapping
	@PostMapping(value = "/purchaseOrders/insert")
	public String insertPurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		//log una user object eka ara ganima
		User logedUser = userDao.getByUsername(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PURCHASEORDER");
		if (userPrivilege.getInst()) {
			//check duplicate
			// PurchaseOrder extPurchaseOrder = purchaseOrderDao.getByOrderNumber(purchaseOrder.getOrderNumber());
			// if(extPurchaseOrder != null){
			// 	return "Save not completed : entered Order number " + purchaseOrder.getOrderNumber() +"Value Allready ext..!";
			// }
			

			try {
				//form eken set nowi backend eken set wiya yuthu data thibenam ewa set kirima
			purchaseOrder.setAddeddatetime(LocalDateTime.now());
			purchaseOrder.setAddeduserid(logedUser.getId());
			purchaseOrder.setPurchaserequestno(purchaseOrderDao.getNextOrderNo());
		
				// save operator
                // purchaserequest_id block kirima nisa save kirimata athiwana getaluwa magaharawa ganimata for each ekak liya purchaseOrder laga athi list eka illa gena (purchaseOrderHasItemList)
              for (PurchaseOrderHasItem poItem : purchaseOrder.getPurchaseOrderHasItemList()) {
                  poItem.setPurchaserequest_id(purchaseOrder);
              }

				purchaseOrderDao.save(purchaseOrder);

				// selected add price list eka null newe nam check karanna patan gannawa
				if (purchaseOrder.getAddpricelist_id() != null) {
					// selected add price list eka database eken gannawa
					AddPriceList addPriceList = addPriceListDao.findById(purchaseOrder.getAddpricelist_id().getId()).orElse(null);
					// addPriceList object eka valid nam pamanak meya sidu karanawa
					if (addPriceList != null) {
						// add price list eke thiyena okkoma items list eka gannawa
						List<AddPriceListHasItem> requiredItemsList = addPriceList.getAddPriceListHasItemList();
						// required items id collect karaganna list ekak hadagannawa
						List<Integer> requiredItemIds = new ArrayList<>();
						// required items array eka loop karala id gannawa
						for (AddPriceListHasItem aplhi : requiredItemsList) {
							// item object eka valid nam id eka add karanawa
							if (aplhi.getItem_id() != null) {
								// requiredItemIds list ekata id eka push karanawa
								requiredItemIds.add(aplhi.getItem_id().getId());
							}
						}

						// select karapu add price list id ekata adala, kalin database eke save wunu purchase orders tika gannawa
						List<PurchaseOrder> savedPOs = purchaseOrderDao.findByAddPriceList(addPriceList.getId());
						// database eke kalin save wunu items id collect karaganna list ekak hadagannawa
						List<Integer> savedItemIds = new ArrayList<>();
						// save wunu purchase orders list eka loop karanawa
						for (PurchaseOrder po : savedPOs) {
							// purchase order eke items array eka check karanawa
							if (po.getPurchaseOrderHasItemList() != null) {
								// items loop karala individual items gannawa
								for (PurchaseOrderHasItem poItem : po.getPurchaseOrderHasItemList()) {
									// item object eka null newe nam item id eka collect karanawa
									if (poItem.getItem_id() != null) {
										// savedItemIds list ekata item id eka add karanawa
										savedItemIds.add(poItem.getItem_id().getId());
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

						// okkoma items save wela nam, add price list status eka Completed karanawa
						if (allCovered) {
							// status database eken "Completed" status object eka gannawa
							AddPricelistStatus completedStatus = addPriceListStatusDao.findByName("Completed");
							// status object eka valid nam
							if (completedStatus != null) {
								// add price list status eka Completed widihata set karanawa
								addPriceList.setAddpriceliststatus_id(completedStatus);
								// yawatakalina karapu add price list eka database save karanawa
								addPriceListDao.save(addPriceList);
							}
						} else {
							// status database eken "Partially Ordered" status object eka gannawa
							AddPricelistStatus partiallyOrderedStatus = addPriceListStatusDao.findByName("Partially Ordered");
							// status object eka valid nam
							if (partiallyOrderedStatus != null) {
								// add price list status eka Partially Ordered widihata set karanawa
								addPriceList.setAddpriceliststatus_id(partiallyOrderedStatus);
								// yawatakalina karapu add price list eka database save karanawa
								addPriceListDao.save(addPriceList);
							}
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
	@PutMapping(value = "/purchaseOrders/update")
	// purchaseOrder object eka parameter ekak widiyata ganna method eka
	public String updatePurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {
		// logged user details ganna spring security authentication context eka gannawa
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// user ge module privilege check karaganna userPrivilegeController call karanawa
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PURCHASEORDER");
		// upd permission check karanawa update karanna puluwanda kiyala
		if (userPrivilege.getUpd()) {
			// existing purchase order eka database eken getReferenceById use karala check karanawa
			PurchaseOrder extPurchaseOrder = purchaseOrderDao.getReferenceById(purchaseOrder.getId());
			// database eke ehema record ekak nathnam error message ekak yawanawa
			if (extPurchaseOrder == null) {
				// return text message
				return "Purchase Order not exist";
			}
			try {
				// updated date time field ekata wathman welawa assign karanawa
				purchaseOrder.setUpdatedatetime(LocalDateTime.now());
				// updated userid ekata log una user ge id eka set karanawa
				purchaseOrder.setUpdateuserid(userDao.getByUsername(auth.getName()).getId());

				// parent child mapping block issues clear karanna items list loop karanawa
				for (PurchaseOrderHasItem poItem : purchaseOrder.getPurchaseOrderHasItemList()) {
					// child item object ekata parent link reference set karanawa
					poItem.setPurchaserequest_id(purchaseOrder);
				}

				// updated data details database table ekata save karanawa
				purchaseOrderDao.save(purchaseOrder);
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
	@DeleteMapping(value = "/purchaseOrders/delete")
	// purchaseOrder object eka parameter ekak widiyata ganna method eka
	public String deletePurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {
		// logged user details ganna spring security authentication context eka gannawa
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// user ge module privilege check karaganna userPrivilegeController call karanawa
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "PURCHASEORDER");
		// del delete/cancel permission check karanawa
		if (userPrivilege.getDel()) {
			// existing purchase order eka database eken reference by id set checks karanawa
			PurchaseOrder extPurchaseOrder = purchaseOrderDao.getReferenceById(purchaseOrder.getId());
			// database eke ehema record ekak nathnam error status messages return
			if (extPurchaseOrder == null) {
				// status message return
				return "Purchase Order not exist";
			}
			try {
				// status check change deleted status name get
				PurchaseOrderStatus deletedStatus = purchaseOrderStatusDao.findByName("Deleted");
				// delete status details active record set
				extPurchaseOrder.setPurchaserequeststatus_id(deletedStatus);
				// delete date time field values assign
				extPurchaseOrder.setDeletedatetime(LocalDateTime.now());
				// delete userid settings assign log user id
				extPurchaseOrder.setDeleteuserid(userDao.getByUsername(auth.getName()).getId());

				// update elements database record save checks
				purchaseOrderDao.save(extPurchaseOrder);
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