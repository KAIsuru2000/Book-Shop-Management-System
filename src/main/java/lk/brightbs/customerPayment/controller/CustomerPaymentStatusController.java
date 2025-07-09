package lk.brightbs.customerPayment.controller;

import java.util.List;

import lk.brightbs.customerPayment.dao.CustomerPaymentStatusDao;
import lk.brightbs.customerPayment.entity.CustomerPaymentStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class CustomerPaymentStatusController {
    
    @Autowired
    private CustomerPaymentStatusDao customerPaymentStatusDao;

    @GetMapping(value = "/customerPaymentStatues/alldata" , produces = "application/json")
	public List<CustomerPaymentStatus> findAllData(){

        return customerPaymentStatusDao.findAll();

    }
}
