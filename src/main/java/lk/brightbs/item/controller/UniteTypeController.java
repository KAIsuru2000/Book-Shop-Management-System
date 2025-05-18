package lk.brightbs.item.controller;

import java.util.List;
import lk.brightbs.item.dao.UniteTypeDao;
import lk.brightbs.item.entity.UniteType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;




@RestController
public class UniteTypeController {

    @Autowired
    private UniteTypeDao uniteTypeDao;
    
    //get mapping for get designation all data url - /uniteType/alldata
    @GetMapping(value = "/uniteType/alldata" , produces = "application/json")
    public List<UniteType> getAllData(){

        return uniteTypeDao.findAll();
    }
}
