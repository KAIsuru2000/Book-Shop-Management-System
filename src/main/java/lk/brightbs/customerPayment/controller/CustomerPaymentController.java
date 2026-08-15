package lk.brightbs.customerPayment.controller;

import lk.brightbs.customerPayment.dao.CustomerPaymentDao;
import lk.brightbs.customerPayment.dao.CustomerPaymentStatusDao;
import lk.brightbs.customerPayment.entity.CustomerPayment;
import lk.brightbs.invoice.dao.InvoiceDao;
import lk.brightbs.invoice.dao.InvoiceStatusDao;
import lk.brightbs.invoice.entity.Invoice;
import lk.brightbs.invoice.entity.InvoiceStatus;
import lk.brightbs.invoice.entity.InvoiceHasInventory;
import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;
import lk.brightbs.inventory.dao.InventoryDao;
import lk.brightbs.inventory.entity.Inventory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class CustomerPaymentController {

	@Autowired
	private CustomerPaymentDao customerPaymentDao;

	@Autowired
	private UserPrivilegeController userPrivilegeController;

	@Autowired
	private UserDao userDao;

	@Autowired
	private InvoiceDao invoiceDao;

	@Autowired
	private InvoiceStatusDao invoiceStatusDao;

	@Autowired
	private InventoryDao inventoryDao;

	// @Autowired
	// private InvoiceDao invoiceDao;

	@Autowired
	private CustomerPaymentStatusDao customerPaymentStatusDao;

	@RequestMapping("/customerPayment")
	public ModelAndView getcustomer() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView customerPaymentView = new ModelAndView();
		customerPaymentView.setViewName("customerPayment.html");

		customerPaymentView.addObject("loggedusername", auth.getName());
		customerPaymentView.addObject("title", "Customer Payment Management | Bright Book Shop");

		return customerPaymentView;
	}

	@GetMapping(value = "/customerPayment/alldata", produces = "application/json")
	public List<CustomerPayment> getAllData() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "CUSTOMERPAYMENT");
		if (userPrivilege != null && userPrivilege.getSel()) {
			return customerPaymentDao.findAll(Sort.by(Sort.Direction.DESC, "id"));
		} else {
			return new ArrayList<>();
		}
	}

	@PostMapping(value = "/customerPayment/insert")
	public String saveCustomerPaymentData(@RequestBody CustomerPayment customerPayment) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User logedUser = userDao.getByUsername(auth.getName());

		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "CUSTOMERPAYMENT");
		if (userPrivilege == null || !userPrivilege.getInst()) {
			return "Insert not completed : you haven't permission...";
		}

		try {
			customerPayment.setAddeddatetime(LocalDateTime.now());
			customerPayment.setAddeduserid(logedUser.getId());
			customerPayment.setBillno(customerPaymentDao.getNextBillNo());

			customerPaymentDao.save(customerPayment);

			// Update associated invoice status to "Paid"
			if (customerPayment.getInvoice_id() != null) { // Customer payment ekata adala invoice ekak thiyenawa nam
				// Invoice record eka database eken hoyagannawa
				Invoice invoice = invoiceDao.findById(customerPayment.getInvoice_id().getId()).orElse(null);
				if (invoice != null) { // Invoice record eka hambuna nam
					InvoiceStatus paidStatus = invoiceStatusDao.getByName("paid"); // "paid" kiyana status object eka
																					// gannawa
					if (paidStatus != null) { // Paid status eka valid nam
						invoice.setInvoicestatus_id(paidStatus); // Invoice eke status eka update karanawa
						invoiceDao.save(invoice); // Update karapu invoice eka save karanawa
					}

					// Payment eka sidu wathma total quantity eka inventory eken adu kirima
					if (invoice.getInvoiceHasInventoryList() != null) { // Invoice eke items list eka null newe nam
																		// pamanak
						for (InvoiceHasInventory invItem : invoice.getInvoiceHasInventoryList()) { // Invoice eke hema
																									// item ekakma loop
																									// karala gannawa
							if (invItem.getInventory_id() != null && invItem.getQuentity() != null) { // Inventory
																										// reference eka
																										// saha quantity
																										// eka thibe nam
																										// pamanak
								// Item ekata adala Inventory record eka database eken hoyagannawa
								Inventory inventory = inventoryDao.findById(invItem.getInventory_id().getId())
										.orElse(null);
								if (inventory != null) { // Ema inventory record eka thibe nam
									int qtyToReduce = invItem.getQuentity(); // Adu kala yuthu quantity eka variable
																				// ekakata gannawa
									// Inventory eke total quantity eken ema quantity eka adu karanawa
									inventory.setTotalquantity(inventory.getTotalquantity() - qtyToReduce);
									// Update karapu inventory record eka database eke save karanawa
									inventoryDao.save(inventory);
								}
							}
						}
					}
				}
			}

			return "OK";

		} catch (Exception e) {
			return "Save Customer Payment Failed: " + e.getMessage();
		}
	}
}
