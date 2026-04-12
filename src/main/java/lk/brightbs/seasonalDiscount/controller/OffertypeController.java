package lk.brightbs.seasonalDiscount.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.brightbs.seasonalDiscount.dao.OffertypeDao;
import lk.brightbs.seasonalDiscount.entity.Offertype;

@RestController
public class OffertypeController {

    @Autowired
    private OffertypeDao offertypeDao;

    // offer type list eka front end ekata laba deemata
    @GetMapping(value = "/offertype/list", produces = "application/json")
    public List<Offertype> getOffertype() {
        return offertypeDao.findAll();
    }

}
