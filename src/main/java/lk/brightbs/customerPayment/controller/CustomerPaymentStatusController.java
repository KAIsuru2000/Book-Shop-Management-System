package lk.brightbs.customerPayment.controller;

import lk.brightbs.customer.dao.CustomerStatusDao;
import lk.brightbs.customer.entity.CustomerStatus;
import lk.brightbs.customerPayment.dao.CustomerPaymentStatusDao;
import lk.brightbs.customerPayment.entity.CustomerPaymentStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CustomerPaymentStatusController {
     @Autowired
    private CustomerPaymentStatusDao customerPaymentStatusDao;

    @GetMapping(value = "/customerPaymentStatus/alldata" , produces = "application/json")
	public List<CustomerPaymentStatus> findAllData(){
        return customerPaymentStatusDao.findAll();
    }
}
