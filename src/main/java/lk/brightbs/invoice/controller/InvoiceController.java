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


@RestController
public class InvoiceController {

    //Autowired - awashya method automatically build karala method body liyala api add karana veriable ekata ewa assing karala denawa (invoiceDao instance ekak hadala denawa)
    @Autowired 
    private InvoiceDao invoiceDao;

    @Autowired
    private
     UserPrivilegeController userPrivilegeController;

    @Autowired
	private UserDao userDao; 

    @Autowired
    private InvoiceStatusDao invoiceStatusDao; 

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