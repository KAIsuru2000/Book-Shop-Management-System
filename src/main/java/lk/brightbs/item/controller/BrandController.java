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

    // @Autowired
	// private UserDao userDao;

    // @Autowired
    // private UserPrivilegeController userPrivilegeController;

    
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

    // request mapping for get brand without supply url - "/brand/listwihoutsupply"
    @GetMapping(value = "/brand/getListWithoutSupply/{supplierid}" , produces = "application/json")
    public List<Brand> getListWithoutSupply(@PathVariable("supplierid") Integer supplierid){

        return brandDao.getListWithoutSupply(supplierid);
    }

    

//     // request mapping for get brand without supply url - "/brand/listwihoutsupply"
//     @GetMapping(value = "/brand/listwihoutsupply" , params = {"supplierid"} , produces = "application/json")
//     public List<Brand> getListWithoutSupply(@RequestParam("supplierid") Integer supplierid) {

//         // check user authentication and authorization
// 		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

//         //log una user object eka ara ganima
// 		// User logedUser = userDao.getByUsername(auth.getName());
// 		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "ITEM");
// 		if (userPrivilege.getUpd()) {

// 			return brandDao.getListWithoutSupply(supplierid);

// 			}

    

// }
}
