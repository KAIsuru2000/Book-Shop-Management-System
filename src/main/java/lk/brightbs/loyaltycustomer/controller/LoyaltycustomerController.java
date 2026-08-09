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
import org.springframework.web.bind.annotation.PathVariable;
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
        loyaltycustomerView.addObject("title", "Manage Loyalty Cards | Bright Book Shop");

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

    // customer ge points pramanayata adala loyalty tier eka ganna GetMapping method eka
    @GetMapping(value = "/loyaltycustomer/bycustomerpoints/{points}", produces = "application/json")
    // points kiyana integer parameter eka url path eken methanata gannawa
    public Loyaltycustomer getLoyaltycustomerByPoints(@PathVariable("points") Integer points) {
        // me welawe log wela inna user ge authentication details context eken gannawa
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // log una user ta LOYALTYCUSTOMER module ekata adala user privileges thiyeda kiyala check karanawa
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "LOYALTYCUSTOMER");
        
        // user ta database eken details select karanna avasara thiyeda kiyala check karanawa
        if (userPrivilege != null && userPrivilege.getSel()) {
            // database eke thiyena okkoma loyalty card tiers list ekak widiyata gannawa
            List<Loyaltycustomer> allTiers = loyaltycustomerDao.findAll();
            // match wena loyalty tier eka thaba ganna null object ekak hadagannawa
            Loyaltycustomer matchingTier = null;
            // labunu loyalty tiers list eka loop eken eka eka check karanawa
            for (Loyaltycustomer tier : allTiers) {
                // customer ge points, card eke startpoint saha endpoint athareda kiyala check karanawa
                if (points >= tier.getStartpoint() && points <= tier.getEndpoint()) {
                    // match wena tier eka select karagannawa
                    matchingTier = tier;
                    // loop eken eliyata enawa
                    break;
                }
            }
            // points pramanaya maximum endpoint ekatath wada wadi nam matching tier ekak labenne natha
            if (matchingTier == null) {
                // e nisa loop ekakin uparimama startpoint eka thiyena card tier eka hoyagannawa
                for (Loyaltycustomer tier : allTiers) {
                    // points pramanaya card eke startpoint ekata wada wadi nam
                    if (points >= tier.getStartpoint()) {
                        // matchingTier kiyana eka null nam hari, me tier eke startpoint eka kalin set una matchingTier eke startpoint ekata wada wadi nam hari meya uparima tier eka widiyata set karanawa
                        if (matchingTier == null || tier.getStartpoint() > matchingTier.getStartpoint()) {
                            // uparima tier eka select karagannawa
                            matchingTier = tier;
                        }
                    }
                }
            }
            // match una loyalty tier eka return karanawa
            return matchingTier;
        } else {
            // avasara nathnam null return karanawa
            return null;
        }
    }
}
