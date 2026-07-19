package lk.brightbs.report.controller;


import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ReportUiController {

    @Autowired
    private UserDao userDao;

    //request mapping for load report ui url - /reportui
    @RequestMapping("/reportui") //request eka meka awoth yata function eka run karanawa
    public ModelAndView getEmployeeDesignationByIdUI(){

        // dashboard ekata username ganima sadaha
        // securitycontextholder magin auth object ekak laba gatha heka
        // auth magin username eka illa gatha heka
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User logedUser = userDao.getByUsername(auth.getName());

        ModelAndView reportUiView = new ModelAndView();
//        if(logedUser.getEmployee_id().getDesignation_id().getName().equals("Manager")){
        reportUiView.setViewName("employeeReport.html");

//        if(logedUser.getEmployee_id().getDesignation_id().getName().equals("Cashier")){
//            reportUiView.setViewName("creportui.html");}


        // dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        reportUiView.addObject("loggedusername", auth.getName());

        //title eka penwimata
        reportUiView.addObject("title", "Purchase Order Management | Bright Book Shop");

        return reportUiView;
    }

}
