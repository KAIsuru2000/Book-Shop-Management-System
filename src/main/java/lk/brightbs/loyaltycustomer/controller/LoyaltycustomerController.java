package lk.brightbs.loyaltycustomer.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.loyaltycustomer.dao.LoyaltycustomerDao;
import lk.brightbs.loyaltycustomer.entity.Loyaltycustomer;
import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;

@RestController
public class LoyaltycustomerController {

    @Autowired
    private LoyaltycustomerDao loyaltycustomerDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @RequestMapping("/loyaltycustomer")
    public ModelAndView getLoyaltycustomer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView loyaltycustomerView = new ModelAndView();
        loyaltycustomerView.setViewName("loyaltycustomer.html");
        loyaltycustomerView.addObject("loggedusername", auth.getName());
        loyaltycustomerView.addObject("title", "Loyalty Customer management | Bright Book Shop");

        return loyaltycustomerView;
    }

    @GetMapping(value = "/loyaltycustomer/alldata", produces = "application/json")
    public List<Loyaltycustomer> findAllData() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "LOYALTYCUSTOMER");
        if (userPrivilege != null && userPrivilege.getSel()) {
            return loyaltycustomerDao.findAll(Sort.by(Sort.Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }

    @PostMapping(value = "/loyaltycustomer/insert")
    public String insertLoyaltycustomer(@RequestBody Loyaltycustomer loyaltycustomer) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "LOYALTYCUSTOMER");
        
        if (userPrivilege != null && userPrivilege.getInst()) {
            Loyaltycustomer extName = loyaltycustomerDao.getByCardname(loyaltycustomer.getCardname());
            if (extName != null) {
                return "Save not completed : entered Card Name " + loyaltycustomer.getCardname() + " Value Already exist..!";
            }

            try {
                loyaltycustomerDao.save(loyaltycustomer);
                return "OK";
            } catch (Exception e) {
                return "Insert not completed : " + e.getMessage();
            }
        } else {
            return "Insert not completed : you haven't permission...";
        }
    }

    @DeleteMapping(value = "/loyaltycustomer/delete")
    public String deleteLoyaltycustomer(@RequestBody Loyaltycustomer loyaltycustomer) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "LOYALTYCUSTOMER");
        
        if (userPrivilege != null && userPrivilege.getDel()) {
            if (loyaltycustomer.getId() == null) {
                return "Delete not completed : ID is missing";
            }

            Loyaltycustomer extLoyaltycustomer = loyaltycustomerDao.getReferenceById(loyaltycustomer.getId());
            if (extLoyaltycustomer == null) {
                return "Loyalty Customer not exist";
            }

            try {
                loyaltycustomerDao.delete(extLoyaltycustomer);
                return "OK";
            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }
        } else {
            return "Delete not completed : you haven't permission...";
        }
    }

    @PutMapping(value = "/loyaltycustomer/update")
    public String updateLoyaltycustomer(@RequestBody Loyaltycustomer loyaltycustomer) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "LOYALTYCUSTOMER");
        
        if (userPrivilege != null && userPrivilege.getUpd()) {
            if (loyaltycustomer.getId() == null) {
                return "Update not completed : ID is missing";
            }

            Loyaltycustomer extLoyaltycustomer = loyaltycustomerDao.getReferenceById(loyaltycustomer.getId());
            if (extLoyaltycustomer == null) {
                return "Loyalty Customer not exist";
            }

            Loyaltycustomer extName = loyaltycustomerDao.getByCardname(loyaltycustomer.getCardname());
            if (extName != null && extName.getId() != loyaltycustomer.getId().intValue()) {
                return "Update not completed : entered Card Name " + loyaltycustomer.getCardname() + " Value Already exist..!";
            }

            try {
                loyaltycustomerDao.save(loyaltycustomer);
                return "OK";
            } catch (Exception e) {
                return "Update not completed : " + e.getMessage();
            }
        } else {
            return "Update not completed : you haven't permission...";
        }
    }
}
