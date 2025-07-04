package lk.brightbs.purchaseOrder.controller;

import java.util.List;
import lk.brightbs.purchaseOrder.dao.PurchaseOrderStatusDao;
import lk.brightbs.purchaseOrder.entity.PurchaseOrderStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class PurchaseOrderStatusController {
    
    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

    @GetMapping(value = "/purchaseOrderStatues/alldata" , produces = "application/json")
	public List<PurchaseOrderStatus> findAllData(){

        return purchaseOrderStatusDao.findAll();
        
    }
}
