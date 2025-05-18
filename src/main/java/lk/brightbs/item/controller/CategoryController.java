package lk.brightbs.item.controller;

import java.util.List;
import lk.brightbs.item.dao.CategoryDao;
import lk.brightbs.item.entity.Category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;




@RestController
public class CategoryController {

    @Autowired
    private CategoryDao categoryDao;
    
    //get mapping for get designation all data url - /designation/alldata
    @GetMapping(value = "/Category/alldata" , produces = "application/json")
    public List<Category> getAllData(){

        return categoryDao.findAll();
    }
}
