package lk.brightbs.customer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.brightbs.customer.dao.CustomerStatusDao;
import lk.brightbs.customer.entity.CustomerStatus;

@RestController
public class CustomerStatusController {
     @Autowired
    private CustomerStatusDao customerStatusDao;

    @GetMapping(value = "/customerStatus/alldata" , produces = "application/json")
	public List<CustomerStatus> findAllData(){
        return customerStatusDao.findAll();
    }
}
