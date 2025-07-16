package lk.brightbs.customer.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.customer.dao.CustomerDao;
import lk.brightbs.customer.dao.CustomerStatusDao;
import lk.brightbs.customer.entity.Customer;
import lk.brightbs.privilege.controller.UserPrivilegeController;
import lk.brightbs.privilege.entity.Privilege;

@RestController
public class CustomerController {
    
    @Autowired
    private CustomerDao customerDao;

    @Autowired
    private
     UserPrivilegeController userPrivilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
	private CustomerStatusDao customerStatusDao;

    //  load item ui
    @RequestMapping("/customer")
    public ModelAndView getcustomer(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView customerView = new ModelAndView();
        customerView.setViewName("customer.html");

        // dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        customerView.addObject("loggedusername", auth.getName());

		//title eka penwimata
		customerView.addObject("title", "Customer management | Bright Book Shop");

        return customerView;
    }

    //load customer all data
   @GetMapping(value = "/customer/alldata" , produces = "application/json")
   public List<Customer> getAllData(){// check user authentication and authorization
		// log una kena saoya ganimata authentication object eka ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// privilege object ekak genwa ganima
		// auth gen illa gena username eka laba deema
		// module name eka privilege lesa pass kirima
		// dan userPrivilege ta privilege object eka (username ekata ha privilege module
		// ekata adala privileges tika) pamine
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "CUSTOMER");
		if (userPrivilege.getSel()) {
			//privilege thiyenawanam data return karanawa
			return customerDao.findAll(Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
		} else {
            // privilege neththan
			//empty array list ekak yawanawa
			return new ArrayList<>();
		}
   }

    // request post mapping for insert employee data url --> /employee/insert
    @PostMapping(value = "/customer/insert")
    //employee insert ekata call eka yaioffcanvasBottomItemView
    //esa yana wita data object ekak ewiya yuthuya
    //post eke data object eka yewiya yuthuya
    //ema data object eka mema method ekedi puluwan RequestBody yana anotation eken access karanna
    //@RequestBody ->fontend eken request body eke ewana object eka access karanna
    //post wala data yanne request body eka
    //fontend eken ewwa employee object ekak nisa employee kiyala yodai
    //ema object ekehi type eka Employee wei
    //Employee entity type ekehi object ekak pass wei
    //inpasu mema object eka directly sava kala heka
    //saveEmployeeData - method name
    public String saveCustomerData(@RequestBody Customer customer) {

        // check loged user authorisation
        //auth object eka magin log wela inna userge object ekak ganima
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //log una user object eka ara ganima
        User logedUser = userDao.getByUsername(auth.getName());

        //log wela inna kenata post ekata permission thibeda balima


        //duplicate email ckeck
        Customer extCustomerByEmail = customerDao.getByEmail(customer.getEmail());
        if (extCustomerByEmail != null){
            return "Save Not Completed : Email "+ customer.getEmail() +" Value Allready ext...!";
        }

        //DB ekath samaga access wana nisa try catch ekak liwima
        try{
            //form eken set nowi backend eken set wiya yuthu data thibenam ewa set kirima
            customer.setAddeddatetime(LocalDateTime.now());
            // auth magin log una username gena userdao magin id eka gena set kirima
            customer.setAddeduserid(logedUser.getId());
            customer.setRegno(customerDao.getNextCustNo());

            //inpasu methana save karana operation eka liwima
            //Dao gawa thibena save operator ekakata api gawa thibena employee entitiya pass kirima
            customerDao.save(customer);


            //dependances
            

            //return statment eka damima
            return "OK";

            //error ekak thibboth methana exception eka lesa catch we
            //ehi(e) sava kirimata noheki wimata hethuwa atha
        } catch (Exception e) {
            //error ekak thibboth eya catch karanawa
            return "Save Customer Failed" + e.getMessage();

        }

    }

	@SuppressWarnings("unused")
    //delete mapping service value eka "/customer/delete"
	@DeleteMapping(value = "/customer/delete")
	//object eka requestbody eken Customer type customer object ekak pass wei
	public String deleteCustomer(@RequestBody Customer customer){
		//check user authorization

		//check ext
		if(customer.getId() == null){

			return "Delete Not Completed : Customer Not Ext..! ";
		}



		//check exsistant
		Customer extCust = customerDao.getReferenceById(customer.getId());
		if (extCust == null) {
			return "Delete Not Completed : Customer doesn't exsite...;";
		}
		//existing check kalata pasuwa eya exist wenawa nam awlak ne deleta karanna ena object eka thiyenawa ema object eka update karanna gatha heka deleta status change we


		try{
			//set auto genarated value
			//ema fontend eken ena object eka check karala balala set karanawa
			//delete date time set
			extCust.setDeletedatetime(LocalDateTime.now());
			//delete userwa set kirima
			extCust.setDeleteuserid(1);

			// do operation
			//employeeDao.delete(extEmp); record eka delete wee yai
			//status eka wenas kirima
			//me sadaha employee status type object ekak illai e sadaha employeeStausDao autowired kara gatha yuthuya
			extCust.setCustomerstatus_id(customerStatusDao.getReferenceById(2));

			//pass wena employee object eken exist employee record ekak id eken aran save karai eyata hethuwa pass wena object ekehi data wenas wela awoth ewath save wana nisa

			//update operation ekath save magin sidu wei
			//delete,update ekata ewana object eka PK ekak atha ema nisa PK walin save waladi update ekak sidu wei
			//namuth post ekata ewana object eka PK netha fontend ekan ewana empty object eka atha
			//delete ekata fontend eken ena object eka data wenas wimak sidu wee save wima walakwimata ema record eka save nokara ehi id eken DB eke thibena record eka gena save karai
			customerDao.save(extCust);

			//dependancies

			return "OK";

		}catch (Exception e){
			return "Delete Not Complete :" + e.getMessage();
		}

	}

    @SuppressWarnings("unused")
	@PutMapping(value = "/customer/update")
	public String updateCustomerData(@RequestBody Customer customer) {
		// check loged user authorisation

		//wena kenak pitin service eka access karala value pass karanawada belimata
		//check ext - pitin ena data ekata id ekaka add kala nohaka eaya db eka ai magin lebe.

		if(customer.getId() == null){

			return "Update Not Completed : Customer Not Ext..! ";
		}

		//update karanna ena data ekehi id eka api laga thibeda balima
		//ema id eka thibena record ekak db eke thibeda belima
		Customer extByid = customerDao.getReferenceById(customer.getId());
		if(extByid == null){
			return "Update Not Completed : Customer Not Ext..! ";
		}

		//duplicate check
		//mehidee update kala value eka duplicatda belima saha ema field eka update nokala awasthawaka samana value ekata edite karana employeewa athulath nowimata id asamanada beliya yuthuya

		Customer extCustomerByEmail = customerDao.getByEmail(customer.getEmail());
		if (extCustomerByEmail != null && extCustomerByEmail.getId() != customer.getId()){
			return "Save Not Completed : Email "+ customer.getEmail() +" Value Allready ext...!";
		}

		try {
			//set auto added data
			customer.setUpdatedatetime(LocalDateTime.now());
			customer.setUpdateuserid(1);

			// save operator
			customerDao.save(customer);

			//dependances

			return "OK";

		} catch (Exception e) {
			return "Update Not Completed" + e.getMessage();
		}
	}

		
    
}

