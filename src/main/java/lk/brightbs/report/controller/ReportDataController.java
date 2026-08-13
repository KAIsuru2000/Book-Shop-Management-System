package lk.brightbs.report.controller;

import lk.brightbs.report.dao.RepoortDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
public class ReportDataController {

    @Autowired
    private RepoortDao repoortDao;

    @GetMapping(value = "/report" ,params = {"loggeduserid","startdate","enddate","paymenttype"}, produces = "application/json")
    public String[][] getListBySupplier(@RequestParam("loggeduserid") Integer loggeduserid,
                                        @RequestParam("startdate") String startdate,
                                        @RequestParam("enddate") String enddate,
                                        @RequestParam("paymenttype") String paymenttype){

        LocalDate startDate = LocalDate.parse(startdate);
        LocalDate nextDayStart = LocalDate.parse(enddate);

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = nextDayStart.plusDays(1).atStartOfDay();

        if ( paymenttype.equals("Cash")) {
            return repoortDao.getCustomerPaymentByCash(loggeduserid, startDateTime, endDateTime);

        } else if (paymenttype.equals("Card")) {
            return repoortDao.getCustomerPaymentByCard(loggeduserid, startDateTime, endDateTime);

        }else  {
            return repoortDao.getCustomerPaymentByAll(loggeduserid, startDateTime, endDateTime);
        }
    }
}
