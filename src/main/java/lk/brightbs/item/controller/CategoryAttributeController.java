package lk.brightbs.item.controller;

import lk.brightbs.item.dao.CategoryAttributeDao;
import lk.brightbs.item.entity.CategoryAttribute;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable; // PathVariable support karanna annotation import karagannawa
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class CategoryAttributeController {

    @Autowired
    private CategoryAttributeDao categoryAttributeDao;
    
    //get mapping for get designation all data url - /Subcategory/alldata
    @GetMapping(value = "/categoryAttribute/alldata" , produces = "application/json")
    public List<CategoryAttribute> getAllData(){

        return categoryAttributeDao.findAll();
    }

    // subcategory id eka path parameter ekak widihata aragena get mapping endpoint ekak hadanawa
    @GetMapping(value = "/categoryAttribute/bysubcategory/{subcategoryid}", produces = "application/json")
    // subcategoryid variable eka path parameter ekak widihata select karagannawa
    public List<CategoryAttribute> getBySubcategory(@PathVariable("subcategoryid") Integer subcategoryid) {
        // categoryAttributeDao eka use karala subcategory id ekata adala CategoryAttributes filter karanawa
        return categoryAttributeDao.getBySubcategory(subcategoryid);
    }
}
