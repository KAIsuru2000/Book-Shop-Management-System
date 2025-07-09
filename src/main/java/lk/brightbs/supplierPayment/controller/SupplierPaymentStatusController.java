package lk.brightbs.supplierPayment.controller;

import java.util.List;
import lk.brightbs.supplierPayment.dao.SupplierPaymentStatusDao;
import lk.brightbs.supplierPayment.entity.SupplierPaymentStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class SupplierPaymentStatusController {
    
    @Autowired
    private SupplierPaymentStatusDao supplierPaymentStatusDao;

    @GetMapping(value = "/supplierPaymentStatus/alldata" , produces = "application/json")
	public List<SupplierPaymentStatus> findAllData(){

        return supplierPaymentStatusDao.findAll();
        
    }
}
