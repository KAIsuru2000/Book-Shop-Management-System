package lk.brightbs.item.controller;
import java.util.List;

import lk.brightbs.item.dao.ItemStatusDao;
import lk.brightbs.item.entity.Itemstatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class ItemStatusController {

    @Autowired
    private ItemStatusDao itemStatusDao;
    
    //get mapping for get designation all data url - /itemStatus/alldata
    @GetMapping(value = "/itemStatus/alldata" , produces = "application/json")
    public List<Itemstatus> getAllData(){

        return itemStatusDao.findAll();
    }
}
