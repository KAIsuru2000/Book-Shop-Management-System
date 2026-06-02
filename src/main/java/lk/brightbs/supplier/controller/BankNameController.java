package lk.brightbs.supplier.controller;

import java.util.List;

import lk.brightbs.supplier.dao.BankNameDao;
import lk.brightbs.supplier.entity.BankName;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BankNameController {

    @Autowired
    private BankNameDao bankNameDao;

    @GetMapping(value = "/bankname/alldata", produces = "application/json")
    public List<BankName> findAllData() {
        return bankNameDao.findAll();
    }
}
