package lk.brightbs.supplier.controller;

import java.util.List;
import lk.brightbs.supplier.dao.SupplierStatusDao;
import lk.brightbs.supplier.entity.SupplierStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class SupplierStatusController {
    
    @Autowired
    private SupplierStatusDao supplierStatusDao;

    @GetMapping(value = "/supplierStatus/alldata" , produces = "application/json")
	public List<SupplierStatus> findAllData(){
        return supplierStatusDao.findAll();
    }
}
