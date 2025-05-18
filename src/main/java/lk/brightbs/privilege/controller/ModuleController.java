package lk.brightbs.privilege.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.brightbs.privilege.dao.ModuleDao;
import lk.brightbs.privilege.entity.Module;




@RestController
public class ModuleController {
    @Autowired
    private ModuleDao moduleDao;

    //get mapping for get designation all data url - /module/alldata
    @GetMapping(value = "/module/alldata" , produces = "application/json")
    public List<Module> getAllData(){

        return moduleDao.findAll();
    }
}
