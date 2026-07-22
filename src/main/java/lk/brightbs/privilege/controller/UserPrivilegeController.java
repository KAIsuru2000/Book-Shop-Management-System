package lk.brightbs.privilege.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import lk.brightbs.privilege.dao.PrivilegeDao;
import lk.brightbs.privilege.entity.Privilege;
// UserDao use kirima sadaha import karanawa
import lk.brightbs.user.dao.UserDao;
// User class eka use kirima sadaha import karanawa
import lk.brightbs.user.entity.User;
// Role class eka use kirima sadaha import karanawa
import lk.brightbs.privilege.entity.Role;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Controller
public class UserPrivilegeController {

    //data genwa ganima sadaha
    @Autowired
    private PrivilegeDao privilegeDao;

    // user ge details check kirima sadaha UserDao injection eka sidu karanawa
    @Autowired
    private UserDao userDao;

    @GetMapping(value = "/getPrivilegeByUserModule" , params = {"modulename"})
    public Privilege getPrivilegeByUserModule(@RequestParam ("modulename") String modulename) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return getPrivilegeByUserModule(auth.getName(), modulename);
    }

    public Privilege getPrivilegeByUserModule(String username, String modulename) {
        // Aluthin privilege class eken object ekak hadagannawa return karanna.
        Privilege privilege = new Privilege();

        // user ta manager role eka thiyeda kiyala check karanna flag variable ekak hadagannawa
        boolean isManager = false;
        // user ta cashier role eka thiyeda kiyala check karanna flag variable ekak hadagannawa
        boolean isCashier = false;
        // db eken user ge object eka aragannawa
        User user = userDao.getByUsername(username);
        // user object eka saha roles list eka null noweda kiyala check karanawa
        if (user != null && user.getRoles() != null) {
            // user has roles set eka loop karala manager saha cashier roles check karanawa
            for (Role role : user.getRoles()) {
                // role name eka "Manager" da kiyala check karanawa
                if (role.getName().equals("Manager")) {
                    // manager role eka thibe nam isManager flag eka true (1) karanawa
                    isManager = true;
                }
                // role name eka "Cashier" da kiyala check karanawa
                if (role.getName().equals("Cashier")) {
                    // cashier role eka thibe nam isCashier flag eka true (1) karanawa
                    isCashier = true;
                }
            }
        }

        // Log wela inna user "Admin" da ho role eka "Manager" da kiyala check karanawa.
        if (username.equals("Admin") || isManager) {
            // Admin ta ho Manager ta data select karanna privilege eka true (1) karanawa.
            privilege.setSel(true);
            // Admin ta ho Manager ta data insert karanna privilege eka true (1) karanawa.
            privilege.setInst(true);
            // Admin ta ho Manager ta data update karanna privilege eka true (1) karanawa.
            privilege.setUpd(true);
            // Admin ta ho Manager ta data delete karanna privilege eka true (1) karanawa.
            privilege.setDel(true);
        } else if (isCashier) {
            // Cashier role eka athi user kenek log una wita module anuwa dynamic privileges laba dima
            if (modulename.equals("CUSTOMER")) {
                // customer registration module eke siyalu task sidu kala heki lesa privileges set kirima
                privilege.setSel(true);
                privilege.setInst(true);
                privilege.setUpd(true);
                privilege.setDel(true);
            } else if (modulename.equals("INVENTORY") || modulename.equals("INVOICE") || 
                       modulename.equals("CUSTOMERPAYMENT") || modulename.equals("LOYALTYCUSTOMER") || 
                       modulename.equals("SESONALDISCOUNT")) {
                // inventory, invoice, customerpayment, loyaltycustomer saha sesonaldiscount module wala data view kirimata pamanak privilege true kirima
                privilege.setSel(true);
                privilege.setInst(false);
                privilege.setUpd(false);
                privilege.setDel(false);
            } else {
                // Anith module sadaha database eken privilege gannawa.
                String privi = privilegeDao.getUserPrivilegeByUserModule(username, modulename);
                // Labunu privilege string eka null noweda kiyala check karanawa (NullPointerException eka prevent karanna).
                if (privi != null) {
                    // String eka comma valin split karala array ekakata gannawa.
                    String[] userPriviArray = privi.split(",");
                    // userPriviArray eke 0 index eke '1' thibe nam select privilege eka true karanawa.
                    privilege.setSel(userPriviArray[0].equals("1"));
                    // userPriviArray eke 1 index eke '1' thibe nam insert privilege eka true karanawa.
                    privilege.setInst(userPriviArray[1].equals("1"));
                    // userPriviArray eke 2 index eke '1' thibe nam update privilege eka true karanawa.
                    privilege.setUpd(userPriviArray[2].equals("1"));
                    // userPriviArray eke 3 index eke '1' thibe nam delete privilege eka true karanawa.
                    privilege.setDel(userPriviArray[3].equals("1"));
                } else {
                    // Database eken privilege labune nathnam (null nam) okkoma false karanawa.
                    privilege.setSel(false);
                    privilege.setInst(false);
                    privilege.setUpd(false);
                    privilege.setDel(false);
                }
            }
        } else {
            // Admin, Manager ho Cashier nowana anith userla sadaha database eken privilege gannawa.
            String privi = privilegeDao.getUserPrivilegeByUserModule(username, modulename);
            // Labunu privilege string eka null noweda kiyala check karanawa (NullPointerException eka prevent karanna).
            if (privi != null) {
                // String eka comma valin split karala array ekakata gannawa.
                String[] userPriviArray = privi.split(",");
                // userPriviArray eke 0 index eke '1' thibe nam select privilege eka true karanawa.
                privilege.setSel(userPriviArray[0].equals("1"));
                // userPriviArray eke 1 index eke '1' thibe nam insert privilege eka true karanawa.
                privilege.setInst(userPriviArray[1].equals("1"));
                // userPriviArray eke 2 index eke '1' thibe nam update privilege eka true karanawa.
                privilege.setUpd(userPriviArray[2].equals("1"));
                // userPriviArray eke 3 index eke '1' thibe nam delete privilege eka true karanawa.
                privilege.setDel(userPriviArray[3].equals("1"));
            } else {
                // Database eken privilege labune nathnam (null nam) okkoma false karanawa.
                privilege.setSel(false);
                privilege.setInst(false);
                privilege.setUpd(false);
                privilege.setDel(false);
            }
        }

        // Sadasa gath privilege object eka return karanawa.
        return privilege;
    }

    //privilege object ekak genwa ganima sadaha function ekak sedima
    //define function for get privilege by given username and modulename
    //methana username modulename eka aragena ema userta adla ema module eka privilege record eka genwa ganima
//    public Privilege getPrivilegeByUserModule(String username , String modulename){

        //return wima sadaha privilege object ekak sada ganima
//        Privilege userPrivilege = new Privilege();
//        if(username.equals("Admin")) {
            //admin awoth siyaluma privilege thibiya yuthuya
            //userPriviArray eke 0 index eke value eka 1 ta samana nam true return we
//        userPrivilege.setSel(true);
        //userPriviArray eke 1 index eke value eka 1 ta samana nam true return we
//        userPrivilege.setInst(true);
        //userPriviArray eke 2 index eke value eka 1 ta samana nam true return we
//        userPrivilege.setUpd(true);
        //userPriviArray eke 3 index eke value eka 1 ta samana nam true return we
//        userPrivilege.setDel(true);

//        }else{
        //admin nowe nam
        //string ekak ganima
//        String userPriviString = privilegeDao.getUserPrivilegeByUserModule(username, modulename);
//        if (userPriviString != null) {
            //string eka substring kirima string array ekak gena
//            String[] userPriviArray = userPriviString.split(",");
            //ema array eka userPrivilege ta set kirima
            //userPriviArray magin one by one gena set kirima
            //ena array eka bala ganimata
//            System.out.println(userPriviString);
            //userPriviArray eke 0 index eke value eka 1 ta samana nam true return we
//            userPrivilege.setSel(userPriviArray[0].equals("1"));
            //userPriviArray eke 1 index eke value eka 1 ta samana nam true return we
//            userPrivilege.setInst(userPriviArray[1].equals("1"));
            //userPriviArray eke 2 index eke value eka 1 ta samana nam true return we
//            userPrivilege.setUpd(userPriviArray[2].equals("1"));
            //userPriviArray eke 3 index eke value eka 1 ta samana nam true return we
//            userPrivilege.setDel(userPriviArray[3].equals("1"));
//        } else {
//            userPrivilege.setSel(false);
//            userPrivilege.setInst(false);
//            userPrivilege.setUpd(false);
//            userPrivilege.setDel(false);
//        }
//        }

        //ema object eka return kirima
//        return userPrivilege;
//    }

}
