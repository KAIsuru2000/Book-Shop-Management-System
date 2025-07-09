package lk.brightbs.addPriceList.controller;

import java.util.List;

import lk.brightbs.addPriceList.dao.AddPriceListStatusDao;
import lk.brightbs.addPriceList.entity.AddPricelistStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class AddPriceListStatusController {
    
    @Autowired
    private AddPriceListStatusDao addPriceListStatusDao;

    @GetMapping(value = "/addPriceListStatus/alldata" , produces = "application/json")
	public List<AddPricelistStatus> findAllData(){

        return addPriceListStatusDao.findAll();

    }
}
