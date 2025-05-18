package lk.brightbs.privilege.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import lk.brightbs.privilege.dao.PrivilegeDao;
import lk.brightbs.privilege.entity.Privilege;

@Controller
public class UserPrivilegeController {

    //data genwa ganima sadaha
    @Autowired
    private PrivilegeDao privilegeDao;

    //privilege object ekak genwa ganima sadaha function ekak sedima
    //define function for get privilege by given username and modulename
    //methana username modulename eka aragena ema userta adla ema module eka privilege record eka genwa ganima
    public Privilege getPrivilegeByUserModule(String username , String modulename){

        //return wima sadaha privilege object ekak sada ganima
        Privilege userPrivilege = new Privilege();
        if(username.equals("Admin")) {
            //admin awoth siyaluma privilege thibiya yuthuya
            //userPriviArray eke 0 index eke value eka 1 ta samana nam true return we
        userPrivilege.setSel(true);
        //userPriviArray eke 1 index eke value eka 1 ta samana nam true return we
        userPrivilege.setInst(true);
        //userPriviArray eke 2 index eke value eka 1 ta samana nam true return we
        userPrivilege.setUpd(true);
        //userPriviArray eke 3 index eke value eka 1 ta samana nam true return we
        userPrivilege.setDel(true);

        }else{
        //admin nowe nam
        //string ekak ganima
        String userPriviString = privilegeDao.getUserPrivilegeByUserModule(username, modulename);
        //string eka substring kirima string array ekak gena
        String[] userPriviArray = userPriviString.split(",");
        //ema array eka userPrivilege ta set kirima
        //userPriviArray magin one by one gena set kirima
        //ena array eka bala ganimata
        System.out.println(userPriviString);
        //userPriviArray eke 0 index eke value eka 1 ta samana nam true return we
        userPrivilege.setSel(userPriviArray[0].equals("1"));
        //userPriviArray eke 1 index eke value eka 1 ta samana nam true return we
        userPrivilege.setInst(userPriviArray[1].equals("1"));
        //userPriviArray eke 2 index eke value eka 1 ta samana nam true return we
        userPrivilege.setUpd(userPriviArray[2].equals("1"));
        //userPriviArray eke 3 index eke value eka 1 ta samana nam true return we
        userPrivilege.setDel(userPriviArray[3].equals("1"));
        }

        //ema object eka return kirima
        return userPrivilege;
    }

}
