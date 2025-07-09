package lk.brightbs.grn.controller;

import java.util.List;

import lk.brightbs.grn.dao.GRNStatusDao;
import lk.brightbs.grn.entity.GRNStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class GRNStatusController {
    
    @Autowired
    private GRNStatusDao grnStatusDao;

    @GetMapping(value = "/grnStatus/alldata" , produces = "application/json")
	public List<GRNStatus> findAllData(){

        return grnStatusDao.findAll();
        
    }
}
