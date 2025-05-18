package lk.brightbs.employee.controller;

import java.util.List;

import lk.brightbs.employee.dao.EmployeeStatusDao;
import lk.brightbs.employee.entity.EmployeeStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class EmployeeStatusController {
    
    @Autowired
    private EmployeeStatusDao employeeStatusDao;

    @GetMapping(value = "/employeeStatues/alldata" , produces = "application/json")
	public List<EmployeeStatus> findAllData(){
        return employeeStatusDao.findAll();
    }
}
