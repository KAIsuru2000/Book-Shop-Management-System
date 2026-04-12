package lk.brightbs.inventory.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.inventory.dao.InventoryDao;
import lk.brightbs.inventory.entity.Inventory;
import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;

@RestController
public class InventoryController {

    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // load inventory ui
    @RequestMapping("/inventory")
    public ModelAndView getinventory() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView inventoryView = new ModelAndView();
        inventoryView.setViewName("inventory.html");

        inventoryView.addObject("loggedusername", auth.getName());
        inventoryView.addObject("title", "Inventory Management | Bright Book Shop");

        return inventoryView;
    }

    // load inventory all data
    @GetMapping(value = "/inventory/alldata", produces = "application/json")
    public List<Inventory> findAllData() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "INVENTORY");
        if (userPrivilege.getSel()) {
            return inventoryDao.findAll(Sort.by(Sort.Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }
}
