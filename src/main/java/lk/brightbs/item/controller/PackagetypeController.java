package lk.brightbs.item.controller;
import java.util.List;
import lk.brightbs.item.dao.PackagetypeDao;
import lk.brightbs.item.entity.Packagetype;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class PackagetypeController {

    @Autowired
    private PackagetypeDao packagetypeDao;
    
    //get mapping for get designation all data url - /packagetype/alldata
    @GetMapping(value = "/packagetype/alldata" , produces = "application/json")
    public List<Packagetype> getAllData(){

        return packagetypeDao.findAll();
    }
}
