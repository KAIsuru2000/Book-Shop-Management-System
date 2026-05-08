package lk.brightbs.customerPayment.controller;

import lk.brightbs.customerPayment.dao.CustomerPaymentDao;
import lk.brightbs.customerPayment.dao.CustomerPaymentStatusDao;
import lk.brightbs.customerPayment.entity.CustomerPayment;
import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;
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

        try{
            customerPayment.setAddeddatetime(LocalDateTime.now());
            customerPayment.setAddeduserid(logedUser.getId());
            customerPayment.setBillno(customerPaymentDao.getNextBillNo());



            customerPaymentDao.save(customerPayment);
            return "OK";

        } catch (Exception e) {
            return "Save Customer Payment Failed: " + e.getMessage();
        }
    }
}
