package lk.brightbs.invoice.controller;

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

import lk.brightbs.invoice.dao.InvoiceDao;
import lk.brightbs.invoice.dao.InvoiceStatusDao;
import lk.brightbs.invoice.entity.Invoice;
import lk.brightbs.invoice.entity.InvoiceHasInventory;
import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.math.RoundingMode;
import lk.brightbs.customer.dao.CustomerDao;
import lk.brightbs.customer.entity.Customer;
import lk.brightbs.loyaltycustomer.dao.LoyaltycustomerDao;
import lk.brightbs.loyaltycustomer.entity.Loyaltycustomer;
import lk.brightbs.inventory.dao.InventoryDao;
import lk.brightbs.inventory.entity.Inventory;


@RestController
public class InvoiceController {

    //Autowired - awashya method automatically build karala method body liyala api add karana veriable ekata ewa assing karala denawa (invoiceDao instance ekak hadala denawa)
    @Autowired 
    private InvoiceDao invoiceDao;

    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private
     UserPrivilegeController userPrivilegeController;

    @Autowired
	private UserDao userDao; 

    @Autowired
    private InvoiceStatusDao invoiceStatusDao; 

    // CustomerDao class eka auto inject (autowire) karagannawa database transactions karanna
    @Autowired
    private CustomerDao customerDao;

    // LoyaltycustomerDao class eka autowire karagannawa loyalty tier configurations ganna
    @Autowired
    private LoyaltycustomerDao loyaltycustomerDao;

    //request mapping for load purchase order ui url - /invoice
	@RequestMapping("/invoice") //request eka meka awoth yata function eka run karanawa
	public ModelAndView getInvoiceUI(){

		// dashboard ekata username ganima sadaha
        // securitycontextholder magin auth object ekak laba gatha heka
        // auth magin username eka illa gatha heka
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView invoiceView = new ModelAndView();
        invoiceView.setViewName("invoice.html");

		// dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        invoiceView.addObject("loggedusername", auth.getName());

		//title eka penwimata
		invoiceView.addObject("title", "Invoice Management | Bright Book Shop");

		return invoiceView;
	}

   //load invoice all data
   @GetMapping(value = "/invoice/alldata" , produces = "application/json")
   public List<Invoice> findAllData(){// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "INVOICE");
		if (userPrivilege.getSel()) {
			//privilege thiyenawanam data return karanawa
			return invoiceDao.findAll(Sort.by(Sort.Direction.DESC ,"id"));
		} else {
            // privilege neththan
			//empty array list ekak yawanawa
			return new ArrayList<>();
		}
   }

   @GetMapping(value = "/invoice/pending" , produces = "application/json")
   public List<Invoice> findPendingData(){
       Authentication auth = SecurityContextHolder.getContext().getAuthentication();
       Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "CUSTOMERPAYMENT");
       if (userPrivilege.getSel()) {
           return invoiceDao.getPendingInvoices();
       } else {
           return new ArrayList<>();
       }
   }

    // define post mapping
    @PostMapping(value = "/invoice/insert")
    public String insertInvoice(@RequestBody Invoice invoice) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User logedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "INVOICE");
        if (userPrivilege.getInst()) {
            try {
                invoice.setAddeddatetime(LocalDateTime.now());
                invoice.setAddeduserid(logedUser.getId());
                invoice.setInvoiceno(invoiceDao.getNextInvoiceNo());

                for (InvoiceHasInventory invItem : invoice.getInvoiceHasInventoryList()) {
                    invItem.setInvoice_id(invoice);
                }
                invoiceDao.save(invoice);

                // Invoice eka save wena wita available quantity eka inventory eken adu kirima
                if (invoice.getInvoiceHasInventoryList() != null) { // Invoice eke items list eka null newe nam pamanak
                    for (InvoiceHasInventory invItem : invoice.getInvoiceHasInventoryList()) { // Invoice eke hema item ekakma loop karala gannawa
                        if (invItem.getInventory_id() != null && invItem.getQuentity() != null) { // Inventory reference eka saha quantity eka thibe nam pamanak
                            // Item ekata adala Inventory record eka database eken hoyagannawa
                            Inventory inventory = inventoryDao.findById(invItem.getInventory_id().getId()).orElse(null);
                            if (inventory != null) { // Ema inventory record eka thibe nam
                                int qtyToReduce = invItem.getQuentity(); // Adu kala yuthu quantity eka variable ekakata gannawa
                                // Inventory eke available quantity eken ema quantity eka adu karanawa
                                inventory.setAvalablequantity(inventory.getAvalablequantity() - qtyToReduce);
                                // Update karapu inventory record eka database eke save karanawa
                                inventoryDao.save(inventory);
                            }
                        }
                    }
                }

                // invoice eka save karanna kalin customer kenek innawada kiyala check karanawa
                if (invoice.getCustomer_id() != null) {
                    // select karala inna customer ge details customer database eken gannawa
                    Customer customer = customerDao.getReferenceById(invoice.getCustomer_id().getId());
                    if (customer != null) {
                        // customer ge me welawe thiyena total points pramanaya variable ekakata gannawa
                        int currentPoints = customer.getPoints() != null ? customer.getPoints() : 0;
                        
                        // system eke hadala thiyena loyalty card types (tiers) okkoma database eken gannawa
                        List<Loyaltycustomer> allTiers = loyaltycustomerDao.findAll();
                        // adala card tier eka thaba ganna null reference variable ekak hadagannawa
                        Loyaltycustomer matchingTier = null;
                        
                        // okkoma card tiers list eka loop karala match wena ekak thiyeda kiyala check karanawa
                        for (Loyaltycustomer tier : allTiers) {
                            // customer ge wathman points, tier eke startpoint saha endpoint athareda kiyala check karanawa
                            if (currentPoints >= tier.getStartpoint() && currentPoints <= tier.getEndpoint()) {
                                // adala card tier eka select karagannawa
                                matchingTier = tier;
                                // matching tier eka labunu nisa loop eken eliyata enawa
                                break;
                            }
                        }
                        
                        // points maximum endpoint ekatath wada wadi nam match wena ekak labila natha
                        if (matchingTier == null) {
                            // e nisa points walata galapena uparimama card tier eka select karaganna loop ekak hadanawa
                            for (Loyaltycustomer tier : allTiers) {
                                // points pramanaya card tier eke startpoint ekata wada wadi nam
                                if (currentPoints >= tier.getStartpoint()) {
                                    // matchingTier kiyana eka null nam hari, me tier eke startpoint eka kalin set una matchingTier eke startpoint ekata wada wadi nam hari meya uparima tier eka widiyata set karanawa
                                    if (matchingTier == null || tier.getStartpoint() > matchingTier.getStartpoint()) {
                                        // uparimama card tier eka select karagannawa
                                        matchingTier = tier;
                                    }
                                }
                            }
                        }
                        
                        // select una card tier eka null neththan saha eke pointincreaseamount eka 0 ta wada wadi nam
                        if (matchingTier != null && matchingTier.getPointincreaseamount() != null 
                            && matchingTier.getPointincreaseamount().compareTo(BigDecimal.ZERO) > 0) {
                            
                            // labena new points gana calculate karanawa: new points = net amount / pointincreaseamount
                            BigDecimal pointsGained = invoice.getNetamount().divide(matchingTier.getPointincreaseamount(), 0, RoundingMode.DOWN);
                            
                            // customer ge parana points walata me aluth points pramanaya ekathu karanawa
                            customer.setPoints(currentPoints + pointsGained.intValue());
                            // customer ge aluth points count eka customer database table eke update karanawa
                            customerDao.save(customer);
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

    // define delete mapping
    @DeleteMapping(value = "/invoice/delete")
    public String deleteInvoice(@RequestBody Invoice invoice) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "INVOICE");
        if (userPrivilege.getDel()) {
            Invoice extInvoice = invoiceDao.getReferenceById(invoice.getId());
            if (extInvoice == null) {
                return "Invoice not exist";
            }
            try {
                extInvoice.setInvoicestatus_id(invoiceStatusDao.getReferenceById(3)); // Canceled
                extInvoice.setDeletedatetime(LocalDateTime.now());
                extInvoice.setDeleteuserid(userDao.getByUsername(auth.getName()).getId());

                invoiceDao.save(extInvoice);
                return "OK";
            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }
        } else {
            return "Delete not completed : you haven't permission...";
        }
    }

    // define put mapping
    @PutMapping(value = "/invoice/update")
    public String updateInvoice(@RequestBody Invoice invoice) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "INVOICE");
        if (userPrivilege.getUpd()) {
            Invoice extInvoice = invoiceDao.getReferenceById(invoice.getId());
            if (extInvoice == null) {
                return "Invoice not exist";
            }
            try {
                invoice.setUpdatedatetime(LocalDateTime.now());
                invoice.setUpdateuserid(userDao.getByUsername(auth.getName()).getId());

                for (InvoiceHasInventory invItem : invoice.getInvoiceHasInventoryList()) {
                    invItem.setInvoice_id(invoice);
                }

                invoiceDao.save(invoice);
                return "OK";
            } catch (Exception e) {
                return "Update not completed : " + e.getMessage();
            }
        } else {
            return "Update not completed : you haven't permission...";
        }
    }
}