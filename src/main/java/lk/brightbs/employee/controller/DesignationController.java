package lk.brightbs.employee.controller;

import java.util.List;

import lk.brightbs.employee.dao.DesignationDao;
import lk.brightbs.employee.entity.Designation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class DesignationController {

    @Autowired
    private DesignationDao designationDao;
    
    //get mapping for get designation all data url - /designation/alldata
    @GetMapping(value = "/designation/alldata" , produces = "application/json")
    public List<Designation> getAllData(){

        return designationDao.findAll();
    }
}
