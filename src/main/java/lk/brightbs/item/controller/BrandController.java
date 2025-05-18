package lk.brightbs.item.controller;
import java.util.List;
import lk.brightbs.item.dao.BrandDao;
import lk.brightbs.item.entity.Brand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class BrandController {

    @Autowired
    private BrandDao brandDao;
    
    //get mapping for get designation all data url - /brand/alldata
    @GetMapping(value = "/brand/alldata" , produces = "application/json")
    public List<Brand> getAllData(){

        return brandDao.findAll();
    }

    // request mapping for load brand by category url-"/brand/bycategory"
    @GetMapping(value = "/brand/bycategory/{categoryid}" , produces = "application/json")
    public List<Brand> byCategory(@PathVariable("categoryid") Integer categoryid){

        return brandDao.byCategory(categoryid);
    }
}
