package lk.brightbs.employee.controller;

import java.time.LocalDateTime;
import java.util.List;

import lk.brightbs.employee.dao.DesignationDao;
import lk.brightbs.employee.entity.Designation;
import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.user.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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


    //define post mapping
	@PostMapping(value = "/designation/insert")
	public String insertDesignation(@RequestBody Designation designation) {
		
			try {
				
				designationDao.save(designation);

				return "OK";
			} catch (Exception e) {

				return "Insert not completed : " + e.getMessage();

			}
	}

}
