package lk.brightbs.supplierPayment.controller; // Me package eka thula thama controller classes thiyenne

import java.time.LocalDateTime; // Welawa saha dinaya thaba ganna Java default library eka
import java.util.ArrayList; // Dynamic elements arrays use karanna array list eka
import java.util.List; // List interface eka database response lists walata
import java.math.BigDecimal; // Precision decimal numbers calculation (like paid amount) walata

import lk.brightbs.user.dao.UserDao; // System user details database eken ganna data access object eka
import lk.brightbs.user.entity.User; // System user class map details entity eka
import org.springframework.beans.factory.annotation.Autowired; // Autowired use karala dependency inject karagන්න
import org.springframework.data.domain.Sort; // Table elements sorting details data page levels
import org.springframework.security.core.Authentication; // System authentication details authentication log checks
import org.springframework.security.core.context.SecurityContextHolder; // Web app context credentials check properties
import org.springframework.web.bind.annotation.*; // Spring web rest methods paths mappings
import org.springframework.web.servlet.ModelAndView; // Model maps views navigation layouts

import lk.brightbs.privilege.controller.UserPrivilegeController; // Privilege checks controller logic mappings
import lk.brightbs.privilege.entity.Privilege; // System module privilege user map checks entity eka
import lk.brightbs.supplierPayment.dao.SupplierPaymentDao; // Supplier payment entity save/updates dao controller link
import lk.brightbs.supplierPayment.entity.SupplierPayment; // Supplier payment class properties variables entity
import lk.brightbs.grn.dao.GRNDao; // GRN data save mappings checks controller dao
import lk.brightbs.grn.entity.GRN; // GRN elements access entities
import lk.brightbs.grn.dao.GRNStatusDao; // GRN status mappings database controller class
import lk.brightbs.grn.entity.GRNStatus; // GRN status properties details variables mappings

@RestController // Spring rest controller annotation, json dynamic responses output sets
public class SupplierPaymentController { // SupplierPaymentController patan gannawa

    @Autowired // Auto wire status use karala supplierPaymentDao instance build backend mapping properties
    private SupplierPaymentDao supplierPaymentDao; // Supplier payment dao link details handle variables

    @Autowired // Auto wire user privilege logic controls
    private UserPrivilegeController userPrivilegeController; // User privilege details mappings access controller

	@Autowired // Auto wire user details dao database properties
	private UserDao userDao; // User controller mappings check database query helper

	@Autowired // Auto wire GRN details dao queries variables link
	private GRNDao grnDao; // GRN controller mappings helper

	@Autowired // Auto wire GRN status database queries variables
	private GRNStatusDao grnStatusDao; // GRN status helper

	@RequestMapping("/supplierPayments") // User browser eken /supplierPayments url request ekak dapu wita run wenawa
	public ModelAndView getSupplierPaymentUI(){ // Model and view return function eka

        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Log wela inna user properties access mapping checks

		ModelAndView supplierPaymentView = new ModelAndView(); // View mapping path parameters define create object
        supplierPaymentView.setViewName("supplierPayment.html"); // View response load templates supplierPayment html parameters

        supplierPaymentView.addObject("loggedusername", auth.getName()); // Dynamic navbar page loggeduser name string values inject sets

		supplierPaymentView.addObject("title", "Supplier Payment Management | Bright Book Shop"); // Browser document title dynamic settings sets

		return supplierPaymentView; // Controller response navigation views template parameters returns
	}

   @GetMapping(value = "/supplierPayment/alldata" , produces = "application/json") // Ajax call get alldata JSON mapping outputs
   public List<SupplierPayment> findAllData(){ // All supplier payments lists display mapping checks

		Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // User credentials access helper checks

		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "SUPPLIERPAYMENT"); // Check dynamic user privileges for supplier payment select operation
		if (userPrivilege != null && userPrivilege.getSel()) { // Select permissions privilege thibe nam pamanak
			return supplierPaymentDao.findAll(Sort.by(Sort.Direction.DESC ,"id")); // Payments lists database return sorts checks
		} else { // Permission nathi wita empty array sets
			return new ArrayList<>(); // Blank lists returned back
		}
   }

   @GetMapping(value = "/supplierPayment/totalpaidbygrn/{grnId}", produces = "application/json") // GRN ekakata kalin gewapu mulu mudala ganna mapping eka
   public BigDecimal getTotalPaidAmountByGrn(@PathVariable("grnId") Integer grnId) { // Total paid amount eka return karana function eka

		Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Logged user details check karanna security context eka gannawa
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "SUPPLIERPAYMENT"); // Select privilege check block
		if (userPrivilege != null && userPrivilege.getSel()) { // Select permissions privilege thibe nam pamanak
			return supplierPaymentDao.getTotalPaidAmountByGrnId(grnId); // Database eken dynamic SUM logic values returns
		} else {
			return BigDecimal.ZERO; // Default zero settings check values returns
		}
   }

	@PostMapping(value = "/supplierPayment/insert") // Save operations post requests path settings mapping
	public String insertSupplierPayment(@RequestBody SupplierPayment supplierPayment) { // Supplier payment insert function eka mapping parameters

		Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Current user log identity check variables
		User logedUser = userDao.getByUsername(auth.getName()); // Current loged user details database settings checks

		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "SUPPLIERPAYMENT"); // Insert permissions module checks
		if (userPrivilege != null && userPrivilege.getInst()) { // Add operation permissions true da check verification

			try { // Code execute try block parameters
				supplierPayment.setAddeddatetime(LocalDateTime.now()); // System backend server real datetime values sets
				supplierPayment.setAddeduserid(logedUser.getId()); // Log user unique index id values settings sets
				supplierPayment.setBillno(supplierPaymentDao.getNextSupplierPaymentNo()); // Auto-generated bill reference numbers values database checks sets

				if (supplierPayment.getPrepaidamount() == null) { // Prepaid amount null thibe nam logic check
					supplierPayment.setPrepaidamount(BigDecimal.ZERO); // Default zero settings database null handling sets
				}

				GRN grn = null; // GRN object referance
				if (supplierPayment.getGrn_id() != null) { // Pay karapu grn references link thibe nam pamanak check sets
					grn = grnDao.findById(supplierPayment.getGrn_id().getId()).orElse(null); // Database check find by id GRN record mappings
					if (grn != null) { // Record valid dynamic settings check updates
						if (supplierPayment.getSupplier_id() == null && grn.getPurchaserequest_id() != null) { // Supplier_id eka null nam logic checks
							supplierPayment.setSupplier_id(grn.getPurchaserequest_id().getSupplier_id()); // GRN eke supplier_id eka auto map karanawa
						}
					}
				}

				supplierPaymentDao.save(supplierPayment); // Supplier payment object records database mapping saves

				if (grn != null) { // Record valid dynamic settings check updates
					BigDecimal totalPaid = supplierPaymentDao.getTotalPaidAmountByGrnId(grn.getId()); // Database check find total payments for this GRN
					GRNStatus grnStatus; // Status changes properties references
					if (totalPaid.compareTo(grn.getNetamount()) >= 0) { // Total paid amounts greater than netamount check fully paid setting
						grnStatus = grnStatusDao.findByName("Paid"); // Paid status configuration settings gets
					} else { // Balance paid partially logic setting
						grnStatus = grnStatusDao.findByName("Partially Paid"); // Partially Paid database record names gets
					}
					if (grnStatus != null) { // Status references sets is valid database checks
						grn.setGrnstatus_id(grnStatus); // Modify GRN status reference checks parameters
						grnDao.save(grn); // Database elements saves updates
					}
				}

				return "OK"; // AJAX checks success parameters return confirms OK text

			} catch (Exception e) { // Catch exceptions checks errors database triggers

				return "Insert not completed : " + e.getMessage(); // Output error string messages checks

			}
		} else { // Privilege false warning settings returns
			return "Insert not completed : you haven't permission..."; // String return details warnings
		}
	}
}
