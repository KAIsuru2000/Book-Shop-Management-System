package lk.brightbs.supplier.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.supplier.dao.SupplierDao;
import lk.brightbs.supplier.dao.SupplierStatusDao;
import lk.brightbs.supplier.entity.Supplier;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;
import lk.brightbs.privilege.controller.UserPrivilegeController;

@RestController
public class SupplierController {

	@Autowired
	private SupplierDao supplierDao;

	@Autowired
	private SupplierStatusDao supplierStatusDao;

	// userprivilegecontroller walin constructer object ekak sada ganima
	@Autowired
	private UserPrivilegeController userPrivilegeController;

	@Autowired
	private UserDao userDao;

	// load privilege ui
	@RequestMapping("/supplier")
	public ModelAndView getsupplier() {

		// dashboard ekata username ganima sadaha
		// securitycontextholder magin auth object ekak laba gatha heka
		// auth magin username eka illa gatha heka
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView supplierView = new ModelAndView();
		supplierView.setViewName("supplier.html");

		// dashboard ui ekata object add kirima
		// ema data model eke nama loggedusername
		// ehi value eka auth.getname
		// emagin navbar ekehi log una username eka penwai
		supplierView.addObject("loggedusername", auth.getName());

		// title eka penwimata
		supplierView.addObject("title", "Supplier management | Bright Book Shop");

		return supplierView;
	}

	// load supplier all data
	@GetMapping(value = "/supplier/alldata", produces = "application/json")
	public List<Supplier> findAllData() {// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "SUPPLIER");
		if (userPrivilege.getSel()) {
			// privilege thiyenawanam data return karanawa
			return supplierDao.findAll(Sort.by(Sort.Direction.DESC, "id"));
		} else {
			// privilege neththan
			// empty array list ekak yawanawa
			return new ArrayList<>();
		}
	}

	// define post mapping
	@PostMapping(value = "/supplier/insert")
	public String insertSupplier(@RequestBody Supplier supplier) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// log una user object eka ara ganima
		User logedUser = userDao.getByUsername(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "SUPPLIER");
		if (userPrivilege.getInst()) {
			// check duplicate
			Supplier extSupplierName = supplierDao.getBySupplierName(supplier.getSuppliername());
			if (extSupplierName != null) {
				return "Save not completed : entered Supplier name " + supplier.getSuppliername()
						+ "Value Allready ext..!";
			}

			try {
				// form eken set nowi backend eken set wiya yuthu data thibenam ewa set kirima
				supplier.setAddeddatetime(LocalDateTime.now());
				supplier.setAddeduserid(logedUser.getId());
				supplier.setRegno(supplierDao.getNextSupplierNo());

				// save operator
				supplierDao.save(supplier);
				return "OK";
			} catch (Exception e) {

				return "Insert not completed : " + e.getMessage();

			}
		} else {
			return "Insert not completed : you haven't permission...";
		}
	}

	// define delete mapping
	@SuppressWarnings("unused")
	@DeleteMapping(value = "/supplier/delete")
	// object eka requestbody eken Supplier type supplier object ekak pass wei
	public String deleteSupplier(@RequestBody Supplier supplier) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "SUPPLIER");
		if (userPrivilege.getDel()) {
			// check ext
			// exting user object ekak ganima
			Supplier extSupplier = supplierDao.getReferenceById(supplier.getId());
			if (extSupplier == null) {
				// ehema kenek neththan
				return "Supplier not exit";
			}

			try {
				extSupplier.setSupplierstatus_id(supplierStatusDao.getReferenceById(3));
				extSupplier.setDeletedatetime(LocalDateTime.now());

				// fontend eken ena eka wenas karala awoth eka balapemak wena hinda exit record
				// eka save karai
				supplierDao.save(extSupplier);
				return "OK";
			} catch (Exception e) {

				return "Delete not completed : " + e.getMessage();

			}
		} else {
			return "Delete not completed : you haven't permission...";
		}
	}

	// fix dead code error
	@SuppressWarnings("unused")
	// define put mapping
	@PutMapping(value = "/supplier/update")
	public String updateSupplier(@RequestBody Supplier supplier) {
		// check user authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "SUPPLIER");
		if (userPrivilege.getUpd()) {
			// check ext
			// exting user object ekak ganima
			Supplier extSupplier = supplierDao.getReferenceById(supplier.getId());
			if (extSupplier == null) {
				// ehema kenek neththan
				return "Supplier not exit";
			}

			try {
				// status eka auto funtend eken enawa

				// password eka encrypt kirima

				// user object ekata added data time eka add kirima
				supplier.setUpdatedatetime(LocalDateTime.now());

				supplierDao.save(supplier);
				return "OK";
			} catch (Exception e) {

				return "Update not completed : " + e.getMessage();

			}
		} else {
			return "Update not completed : you haven't permission...";
		}
	}

}
