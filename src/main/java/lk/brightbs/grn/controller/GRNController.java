package lk.brightbs.grn.controller;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import lk.brightbs.grn.entity.GrnHasItem;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.addPriceList.entity.AddPriceList;
import lk.brightbs.grn.dao.GRNDao;
import lk.brightbs.grn.entity.GRN;
// GRNStatusDao class eka use karanna me import eka dagannawa
import lk.brightbs.grn.dao.GRNStatusDao;
// GRNStatus entity class eka use karanna me import eka dagannawa
import lk.brightbs.grn.entity.GRNStatus;
import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.purchaseOrder.dao.PurchaseOrderDao;
import lk.brightbs.purchaseOrder.dao.PurchaseOrderStatusDao;
import lk.brightbs.purchaseOrder.entity.PurchaseOrder;
import lk.brightbs.purchaseOrder.entity.PurchaseOrderHasItem;
import lk.brightbs.purchaseOrder.entity.PurchaseOrderStatus;
import lk.brightbs.inventory.dao.InventoryDao;
import lk.brightbs.inventory.entity.Inventory;


@RestController
public class GRNController {

    //Autowired - awashya method automatically build karala method body liyala api add karana veriable ekata ewa assing karala denawa (purchaseOrderDao instance ekak hadala denawa)
    @Autowired 
    private GRNDao grnDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private
     UserPrivilegeController userPrivilegeController;

    @Autowired
    private InventoryDao inventoryDao;

    // purchase order dao control eka autowired karagannawa
    @Autowired
    private PurchaseOrderDao purchaseOrderDao;

    // purchase order status dao control eka autowired karagannawa
    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

    // grn status dao dependency inject karanna me Autowired line eka dagannawa
    @Autowired
    private GRNStatusDao grnStatusDao;

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

   @GetMapping(value = "/grn/getPendingAndPartiallyPaidList", produces = "application/json")
   public List<GRN> getPendingAndPartiallyPaidList() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilegeGRN = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");
		if (userPrivilegeGRN.getSel()) {
			return grnDao.getPendingAndPartiallyPaidList();
		} else {
			return new ArrayList<>();
		}
   }

   //define post mapping
	 @PostMapping(value = "/grn/insert")
	 public String insertPurchaseOrder(@RequestBody GRN gRN) {
	 	// check user authentication and authorization
	 	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	 	//log una user object eka ara ganima
	 	User logedUser = userDao.getByUsername(auth.getName());
	 	Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");
	 	if (userPrivilege.getInst()) {
	 		//check duplicate
	 		// PurchaseOrder extPurchaseOrder = purchaseOrderDao.getByOrderNumber(purchaseOrder.getOrderNumber());
	 		// if(extPurchaseOrder != null){
	 		// 	return "Save not completed : entered Order number " + purchaseOrder.getOrderNumber() +"Value Allready ext..!";
	 		// }
			

	 		try {
	 			//form eken set nowi backend eken set wiya yuthu data thibenam ewa set kirima
                gRN.setAddeddatetime(LocalDateTime.now());
                gRN.setAddeduserid(logedUser.getId());
                gRN.setGrnno(grnDao.getNextGrnNo());
		
	 			// save operator
                 // purchaserequest_id block kirima nisa save kirimata athiwana getaluwa magaharawa ganimata for each ekak liya purchaseOrder laga athi list eka illa gena (purchaseOrderHasItemList)
               for (GrnHasItem gnItem : gRN.getGrnHasItemList()) {
                   gnItem.setGrn_id(gRN);
               }
	 			grnDao.save(gRN);

				// Inventory eka update kirima ho aluthin athulath kirima
				if (gRN.getGrnHasItemList() != null) { // GRN eke items list eka null newe nam pamanak
					for (GrnHasItem gnItem : gRN.getGrnHasItemList()) { // GRN eke athi hema item ekakma loop karala gannawa
						if (gnItem.getItem_id() != null && gnItem.getSalesprice() != null) { // Item id eka saha sales price eka null newe nam pamanak
							// Ekathu kala yuthu quantity eka gannawa. Null nam 0 widiyata gannawa
							int qtyToAdd = gnItem.getTotalquentity() != null ? gnItem.getTotalquentity() : 0;
							// Item eka saha sales price eka matha database eke parana inventory record ekak thiyeda kiyala hoyanawa
							Optional<Inventory> existingInv = inventoryDao.findByItemAndSalesprice(gnItem.getItem_id(), gnItem.getSalesprice());
							if (existingInv.isPresent()) { // Kalin thibunu record ekak thiyenawa nam
								Inventory inv = existingInv.get(); // Ema record eka gannawa
								// Available quantity ekata aluth quantity eka ekathu karanawa
								inv.setAvalablequantity(inv.getAvalablequantity() + qtyToAdd);
								// Total quantity ekatath aluth quantity eka ekathu karanawa
								inv.setTotalquantity(inv.getTotalquantity() + qtyToAdd);
								// Update karapu record eka database eke save karanawa
								inventoryDao.save(inv);
							} else { // Kalin thibune nethnam aluth record ekak widiyata hadanawa
								Inventory inv = new Inventory(); // Aluth inventory object ekak hadanawa
								inv.setItem_id(gnItem.getItem_id()); // Item object eka set karanawa
								inv.setSalesprice(gnItem.getSalesprice()); // Sales price eka set karanawa
								inv.setAvalablequantity(qtyToAdd); // Available quantity eka set karanawa
								inv.setTotalquantity(qtyToAdd); // Total quantity eka set karanawa
								// Aluth inventory record eka database eke save karanawa
								inventoryDao.save(inv);
							}
						}
					}
				}

				// select karapu purchase order eka null newe nam check karanna patan gannawa
				if (gRN.getPurchaserequest_id() != null) {
					// select karapu purchase order eka database eken gannawa
					PurchaseOrder purchaseOrder = purchaseOrderDao.findById(gRN.getPurchaserequest_id().getId()).orElse(null);
					// purchaseOrder object eka valid nam pamanak meya sidu karanawa
					if (purchaseOrder != null) {
						// purchase order eke thiyena okkoma required items list eka gannawa
						List<PurchaseOrderHasItem> requiredItemsList = purchaseOrder.getPurchaseOrderHasItemList();
						// required items id collect karaganna list ekak hadagannawa
						List<Integer> requiredItemIds = new ArrayList<>();
						// required items array eka loop karala id gannawa
						for (PurchaseOrderHasItem poItem : requiredItemsList) {
							// item object eka valid nam id eka add karanawa
							if (poItem.getItem_id() != null) {
								// requiredItemIds list ekata id eka push karanawa
								requiredItemIds.add(poItem.getItem_id().getId());
							}
						}

						// select karapu purchase order id ekata adala, kalin database eke save wunu GRN records tika gannawa
						List<GRN> savedGRNs = grnDao.findByPurchaseOrder(purchaseOrder.getId());
						// database eke kalin save wunu items id collect karaganna list ekak hadagannawa
						List<Integer> savedItemIds = new ArrayList<>();
						// save wunu GRN list eka loop karanawa
						for (GRN g : savedGRNs) {
							// GRN eke items array eka check karanawa
							if (g.getGrnHasItemList() != null) {
								// items loop karala individual items gannawa
								for (GrnHasItem grnItem : g.getGrnHasItemList()) {
									// item object eka null newe nam item id eka collect karanawa
									if (grnItem.getItem_id() != null) {
										// savedItemIds list ekata item id eka add karanawa
										savedItemIds.add(grnItem.getItem_id().getId());
									}
								}
							}
						}

						// okkoma required items database eke thiyeda kiyala check karanna count variables hadagannawa
						int coveredCount = 0;
						// required items id list eka loop karanawa
						for (Integer reqItemId : requiredItemIds) {
							// required item id eka saved list eke thiyenawanam covered count eka wadi karanawa
							if (savedItemIds.contains(reqItemId)) {
								// covered count 1kin wadi karanawa
								coveredCount++;
							}
						}

						// purchase order status object eka hadagannawa
						PurchaseOrderStatus newStatus = null;
						// okkoma required items cover wela thiyenawanam
						if (coveredCount == requiredItemIds.size() && requiredItemIds.size() > 0) {
							// "Completed" status object eka database eken gannawa
							newStatus = purchaseOrderStatusDao.findByName("Completed");
						} else if (coveredCount > 0) {
							// "Partially Received" status object eka database eken gannawa
							newStatus = purchaseOrderStatusDao.findByName("Partially Received");
						}

						// newStatus eka null newe nam, purchase order status eka change karala save karanawa
						if (newStatus != null) {
							// status property eka newStatus object ekata set karanawa
							purchaseOrder.setPurchaserequeststatus_id(newStatus);
							// update karapu purchase order eka database eke save karanawa
							purchaseOrderDao.save(purchaseOrder);
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
	@PutMapping(value = "/grn/update")
	// grn object eka parameter ekak widiyata ganna method eka
	public String updateGRN(@RequestBody GRN gRN) {
		// logged user details ganna spring security authentication context eka gannawa
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// user ge module privilege check karaganna userPrivilegeController call karanawa
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");
		// upd permission check karanawa update karanna puluwanda kiyala
		if (userPrivilege.getUpd()) {
			// existing grn eka database eken reference by id set checks karanawa
			GRN extGRN = grnDao.getReferenceById(gRN.getId());
			// database eke ehema record ekak nathnam error message ekak yawanawa
			if (extGRN == null) {
				// return text message
				return "GRN not exist";
			}
			try {
				// updated date time field ekata wathman welawa assign karanawa
				gRN.setUpdatedatetime(LocalDateTime.now());
				// updated userid ekata log una user ge id eka set karanawa
				gRN.setUpdateuserid(userDao.getByUsername(auth.getName()).getId());

				// parent child mapping block issues clear karanna items list loop karanawa
				for (GrnHasItem gnItem : gRN.getGrnHasItemList()) {
					// child item object ekata parent link reference set karanawa
					gnItem.setGrn_id(gRN);
				}

				// updated data details database table ekata save karanawa
				grnDao.save(gRN);
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
	@DeleteMapping(value = "/grn/delete")
	// grn object eka parameter ekak widiyata ganna method eka
	public String deleteGRN(@RequestBody GRN gRN) {
		// logged user details ganna spring security authentication context eka gannawa
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// user ge module privilege check karaganna userPrivilegeController call karanawa
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");
		// del delete/cancel permission check karanawa
		if (userPrivilege.getDel()) {
			// existing grn eka database eken reference by id set checks karanawa
			GRN extGRN = grnDao.getReferenceById(gRN.getId());
			// database eke ehema record ekak nathnam error status messages return
			if (extGRN == null) {
				// status message return
				return "GRN not exist";
			}
			try {
				// status check change deleted status name get
				GRNStatus deletedStatus = grnStatusDao.findByName("Deleted");
				// delete status details active record set
				extGRN.setGrnstatus_id(deletedStatus);
				// delete date time field values assign
				extGRN.setDeletedatetime(LocalDateTime.now());
				// delete userid settings assign log user id
				extGRN.setDeleteuserid(userDao.getByUsername(auth.getName()).getId());

				// update elements database record save checks
				grnDao.save(extGRN);
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