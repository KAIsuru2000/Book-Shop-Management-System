package lk.brightbs.invoice.controller;

import java.util.List;
import lk.brightbs.invoice.dao.InvoiceStatusDao;
import lk.brightbs.invoice.entity.InvoiceStatus;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class InvoiceStatusController {
    
    @Autowired
    private InvoiceStatusDao invoiceStatusDao;

    @GetMapping(value = "/invoiceStatues/alldata" , produces = "application/json")
	public List<InvoiceStatus> findAllData(){

        return invoiceStatusDao.findAll();
        
    }
}
