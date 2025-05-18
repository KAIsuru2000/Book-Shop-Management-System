package lk.brightbs.privilege.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


import lk.brightbs.privilege.dao.RoleDao;

import lk.brightbs.privilege.entity.Role;

@RestController
public class RoleController {
    @Autowired
    private RoleDao roleDao;

    //get mapping for get designation all data url - /role/alldata
    @GetMapping(value = "/role/alldata" , produces = "application/json")
    public List<Role> getAllData(){

        return roleDao.findAll();
    }

    //get mapping for get designation all data url - /role/listWithoutAdmin
    @GetMapping(value = "/role/listWithoutAdmin" , produces = "application/json")
    public List<Role> listWithoutAdmin(){

        return roleDao.listWithoutAdmin();
    }
}
