package lk.brightbs.priceRequest.controller;

import java.util.List;

import lk.brightbs.priceRequest.dao.PriceRequestStatusDao;
import lk.brightbs.priceRequest.entity.PriceRequestStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class PriceRequestStatusController {
    
    @Autowired
    private PriceRequestStatusDao priceRequestStatusDao;

    @GetMapping(value = "/priceRequestStatus/alldata" , produces = "application/json")
	public List<PriceRequestStatus> findAllData(){
        return priceRequestStatusDao.findAll();
    }
}
