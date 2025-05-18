package lk.brightbs.item.controller;

import java.util.List;
import lk.brightbs.item.dao.SubcategoryDao;
import lk.brightbs.item.entity.Subcategory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class SubcategoryController {

    @Autowired
    private SubcategoryDao subcategoryDao;
    
    //get mapping for get designation all data url - /Subcategory/alldata
    @GetMapping(value = "/subCategory/alldata" , produces = "application/json")
    public List<Subcategory> getAllData(){

        return subcategoryDao.findAll();
    }

// category magin sub category eka load kirima url --> /subcategory/bycategory?categoryid=1
    @GetMapping(value = "/subcategory/bycategory" ,params = {"categoryid"} ,produces = "application/json")

    // 
    
    // 2. param value eka illa ganima sadaha bycatogory function ekehi parameter ekak lesa illa gatha heka"@RequestParam("categoryid")" >> ema value eka "Integer categoryid" lesa save kara gani
    // inpasu eka category id eka query ekata pass kala yuthuya
    public List<Subcategory> byCategory(@RequestParam("categoryid") Integer categoryid){

        // 

        //1. params ekehi value eka dao walata dama query ekata diya yuthuya >> categoryid wala value eka illa gatha yuthuya
        return subcategoryDao.byCategory(categoryid);
        
        

    }
}
