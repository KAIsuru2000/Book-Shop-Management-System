package lk.brightbs.item.controller;

import lk.brightbs.item.dao.AttributeOptionDao;
import lk.brightbs.item.entity.AttributeOption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class AttributeOptionController {

    @Autowired
    private AttributeOptionDao attributeOptionDao;
    
    // get mapping for get AttributeOption all data url - /attributeOption/alldata
    @GetMapping(value = "/attributeOption/alldata" , produces = "application/json")
    public List<AttributeOption> getAllData(){

        return attributeOptionDao.findAll();
    }

    // category attribute id ekata saha brand id ekata options filter karana GET mapping endpoint eka liyanawa
    @GetMapping(value = "/attributeOption/byAttributeAndBrand", produces = "application/json")
    // RequestParam annotation eka use karala option parameters retrieve karagannawa
    public List<AttributeOption> getByAttributeAndBrand(
            @RequestParam("attributeId") Integer attributeId,
            @RequestParam(value = "brandId", required = false) Integer brandId) {
        // attributeOptionDao eka call karala dynamically filtered options list eka return karanawa
        return attributeOptionDao.getByAttributeAndBrand(attributeId, brandId);
    }
}
