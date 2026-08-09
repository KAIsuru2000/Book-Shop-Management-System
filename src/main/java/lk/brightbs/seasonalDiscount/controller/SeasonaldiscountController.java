package lk.brightbs.seasonalDiscount.controller;


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

import org.springframework.web.bind.annotation.PathVariable;
import java.time.LocalDate;
import lk.brightbs.privilege.entity.Privilege;
import lk.brightbs.seasonalDiscount.dao.SeasonaldiscountDao;
import lk.brightbs.seasonalDiscount.entity.Seasonaldiscount;
import lk.brightbs.privilege.controller.UserPrivilegeController;

@RestController
public class SeasonaldiscountController {

    @Autowired
    private SeasonaldiscountDao seasonaldiscountDao;

    // userprivilegecontroller walin constructer object ekak sada ganima
    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // load privilege ui
    @RequestMapping("/seasonalDiscount")
    public ModelAndView getSeasonaldiscount() {

        // dashboard ekata username ganima sadaha
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView seasonaldiscountView = new ModelAndView();
        seasonaldiscountView.setViewName("seasonalDiscount.html");

        // dashboard ui ekata object add kirima
        seasonaldiscountView.addObject("loggedusername", auth.getName());

        // title eka penwimata
        seasonaldiscountView.addObject("title", "Seasonal Discount Management | Bright Book Shop");

        return seasonaldiscountView;
    }

    // load all data
    @GetMapping(value = "/seasonaldiscount/alldata", produces = "application/json")
    public List<Seasonaldiscount> findAllData() {
        // user authentication check
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // privilege checking
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "SESONALDISCOUNT");
        if (userPrivilege.getSel()) {
            // privilege thiyenawanam data return karanawa
            return seasonaldiscountDao.findAll(Sort.by(Sort.Direction.DESC, "id"));
        } else {
            // privilege neththan
            return new ArrayList<>();
        }
    }

    // define post mapping
    @PostMapping(value = "/seasonaldiscount/insert")
    public String insertSeasonaldiscount(@RequestBody Seasonaldiscount seasonaldiscount) {
        // check user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "SESONALDISCOUNT");
        
        if (userPrivilege.getInst()) {
            // check duplicate
            Seasonaldiscount extName = seasonaldiscountDao.getByDiscountName(seasonaldiscount.getDiscountname());
            if (extName != null) {
                return "Save not completed : entered Discount name " + seasonaldiscount.getDiscountname()
                        + " Value Already exist..!";
            }

            try {
                // save operator

                // save operator
                seasonaldiscountDao.save(seasonaldiscount);
                return "OK";
            } catch (Exception e) {
                return "Insert not completed : " + e.getMessage();
            }
        } else {
            return "Insert not completed : you haven't permission...";
        }
    }

    // define delete mapping
    @SuppressWarnings("unused")
    @DeleteMapping(value = "/seasonaldiscount/delete")
    public String deleteSeasonaldiscount(@RequestBody Seasonaldiscount seasonaldiscount) {
        // check user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "SESONALDISCOUNT");
        
        if (userPrivilege.getDel()) {
            // check ext
            Seasonaldiscount extSeasonaldiscount = seasonaldiscountDao.getReferenceById(seasonaldiscount.getId());
            if (extSeasonaldiscount == null) {
                return "Seasonal discount not exist";
            }

            try {
                seasonaldiscountDao.delete(extSeasonaldiscount);
                return "OK";
            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }
        } else {
            return "Delete not completed : you haven't permission...";
        }
    }

    // define put mapping
    @SuppressWarnings("unused")
    @PutMapping(value = "/seasonaldiscount/update")
    public String updateSeasonaldiscount(@RequestBody Seasonaldiscount seasonaldiscount) {
        // check user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "SESONALDISCOUNT");
        
        if (userPrivilege.getUpd()) {
            // check ext
            Seasonaldiscount extSeasonaldiscount = seasonaldiscountDao.getReferenceById(seasonaldiscount.getId());
            if (extSeasonaldiscount == null) {
                return "Seasonal discount not exist";
            }

            try {
                // update kirima
                seasonaldiscountDao.save(seasonaldiscount);
                return "OK";
            } catch (Exception e) {
                return "Update not completed : " + e.getMessage();
            }
        } else {
            return "Update not completed : you haven't permission...";
        }
    }

    // select karapu item id ekata adala active seasonal discount eka ganna GetMapping method eka
    @GetMapping(value = "/seasonaldiscount/activebyitem/{itemId}", produces = "application/json")
    // itemId parameter eka path variable ekakin methanata gannawa
    public Seasonaldiscount getActiveDiscountByItem(@PathVariable("itemId") Integer itemId) {
        // me welawe wathman date eka (current date) gannawa
        LocalDate currentDate = LocalDate.now();
        // dao class eke model method eka run karala active seasonal discounts list eka gannawa
        List<Seasonaldiscount> activeDiscounts = seasonaldiscountDao.getActiveDiscountByItemAndDate(itemId, currentDate);
        // list eka empty neththan palamu discount eka return karanawa
        if (!activeDiscounts.isEmpty()) {
            // palamu index eke thiyena active seasonal discount object eka return karanawa
            return activeDiscounts.get(0);
        }
        // active seasonal discount ekak nathnam null object eka return karanawa
        return null;
    }

}
