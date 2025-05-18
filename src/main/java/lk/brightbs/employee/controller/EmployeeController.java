package lk.brightbs.employee.controller;

import lk.brightbs.employee.dao.EmployeeDao;
import lk.brightbs.employee.dao.EmployeeStatusDao;
import lk.brightbs.employee.entity.Employee;
import lk.brightbs.privilege.dao.RoleDao;
import lk.brightbs.privilege.entity.Role;
import lk.brightbs.user.dao.UserDao;
import lk.brightbs.user.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
public class EmployeeController {

	@Autowired
	private EmployeeDao employeeDao;

	@Autowired
	private EmployeeStatusDao employeeStatusDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private RoleDao roleDao;

	//encript kirima sadaha encription object eka sedima
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	// private final EmployeeDao employeeDao;
	// private final EmployeeStatusDao employeeStatusDao;

	// public EmployeeController(EmployeeDao employeeDao, EmployeeStatusDao employeeStatusDao) {
	// 	this.employeeDao = employeeDao;
	// 	this.employeeStatusDao = employeeStatusDao;
	// }

	//request mapping for load employee ui url - /employee
	@RequestMapping("/employee") //request eka meka awoth yata function eka run karanawa
	public ModelAndView getemployee(){

		// dashboard ekata username ganima sadaha
        // securitycontextholder magin auth object ekak laba gatha heka
        // auth magin username eka illa gatha heka
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView employeeView = new ModelAndView();
        employeeView.setViewName("employee.html");

		// dashboard ui ekata object add kirima
        // ema data model eke nama loggedusername
        // ehi value eka auth.getname
        //emagin navbar ekehi log una username eka penwai
        employeeView.addObject("loggedusername", auth.getName());

		//title eka penwimata
		employeeView.addObject("title", "Employee management | Bright Book Shop");

		return employeeView;
	}

    
	//load employee all data
	@GetMapping(value = "/employee/alldata" , produces = "application/json")
	public List<Employee> findAllData(){
		return employeeDao.findAll(Sort.by(Sort.Direction.DESC ,"id"));
	}

	// request post mapping for insert employee data url --> /employee/insert
	@PostMapping(value = "/employee/insert")
	//employee insert ekata call eka yai
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
	public String saveEmployeeData(@RequestBody Employee employee) {

		// check loged user authorisation
		//auth object eka magin log wela inna userge object ekak ganima
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		//log una user object eka ara ganima
		User logedUser = userDao.getByUsername(auth.getName());

		//log wela inna kenata post ekata permission thibeda balima

		//insert karanna yana values tika kalin insert kara thibeda balima
		//duplicate nic check
		Employee extEmployeeByNic = employeeDao.getByNic(employee.getNic());
		if (extEmployeeByNic != null){
			return "Save Not Completed : Nic "+ employee.getNic() +" Value Allready ext...!";
		}

		//duplicate email ckeck
		Employee extEmployeeByEmail = employeeDao.getByEmail(employee.getEmail());
		if (extEmployeeByEmail != null){
			return "Save Not Completed : Email "+ employee.getEmail() +" Value Allready ext...!";
		}

		//DB ekath samaga access wana nisa try catch ekak liwima
		try{
			//form eken set nowi backend eken set wiya yuthu data thibenam ewa set kirima
			employee.setAdded_datetime(LocalDateTime.now());
			// auth magin log una username gena userdao magin id eka gena set kirima 
			employee.setAddeduserid(logedUser.getId());
			employee.setEmployeenumber(employeeDao.getNextEmpNo());

			//inpasu methana save karana operation eka liwima
			//Dao gawa thibena save operator ekakata api gawa thibena employee entitiya pass kirima
			employeeDao.save(employee);


			//dependances
			//employee account ekak hedena kota ema employeeta user account ekak onnam eya methanin hediya yuthuya
			//user account ekak create kirimata kalin ema userta account ekak awashyada belima
			if (employee.getDesignation_id().getUseraccount()){

			//user account ekak hedima
        User user = new User(); //empty constructer call kirima
        user.setUsername(employee.getEmployeenumber()); //user name eka set kirima
        user.setEmail(employee.getEmail());
        user.setStatus(true);
        user.setAdded_datetime(LocalDateTime.now());
		//password eka leasa nic eka gani
		//encript kirima sadaha encription object eka sediya yuthuya
        user.setPassword(bCryptPasswordEncoder.encode(employee.getNic()));
		//employee object ekak hedenakota create wena user account ekata adala employee kawda yana bawa add wima
		user.setEmployee_id(employeeDao.getByNic((employee.getNic())));
        //adminta role set kirima esadaha role set ekak thibiya yuthuya
        Set<Role> roles = new HashSet<>();
        //dao gen role object ekak illa ganima
		//employeege designation walata samana role object ekak ganima
        Role role = roleDao.getReferenceById(employee.getDesignation_id().getRoleid());
        //role object eka role set ekata set kirima
        roles.add(role);
        //eya admin userta set kirima
        user.setRoles(roles);
        //eya userdao magin save kirima
        userDao.save(user);
			}

			//return statment eka damima
			return "OK";

			//error ekak thibboth methana exception eka lesa catch we
			//ehi(e) sava kirimata noheki wimata hethuwa atha
		} catch (Exception e) {
			//error ekak thibboth eya catch karanawa
			return "Save Employee Failed" + e.getMessage();

		}

	}

	//define delete mapping for employee
	@SuppressWarnings("unused")
	//delete mapping service value eka "/employee/delete"
	@DeleteMapping(value = "/employee/delete")
	//object eka requestbody eken Employee type employee object ekak pass wei
	public String deleteEmployee(@RequestBody Employee employee){
		//check user authorization

		//check ext
		if(employee.getId() == null){

			return "Delete Not Completed : Employee Not Ext..! ";
		}



		//check exsistant
		Employee extEmp = employeeDao.getReferenceById(employee.getId());
		if (extEmp == null) {
			return "Delete Not Completed : Employee doesn't exsite...;";
		}
		//existing check kalata pasuwa eya exist wenawa nam awlak ne deleta karanna ena object eka thiyenawa ema object eka update karanna gatha heka deleta status change we


		try{
			//set auto genarated value
			//ema fontend eken ena object eka check karala balala set karanawa
			//delete date time set
			extEmp.setDeletedatetime(LocalDateTime.now());
			//delete userwa set kirima
			extEmp.setDeleteuserid(1);

			// do operation
			//employeeDao.delete(extEmp); record eka delete wee yai
			//status eka wenas kirima
			//me sadaha employee status type object ekak illai e sadaha employeeStausDao autowired kara gatha yuthuya
			extEmp.setEmployeestatus_id(employeeStatusDao.getReferenceById(3));

			//pass wena employee object eken exist employee record ekak id eken aran save karai eyata hethuwa pass wena object ekehi data wenas wela awoth ewath save wana nisa

			//update operation ekath save magin sidu wei
			//delete,update ekata ewana object eka PK ekak atha ema nisa PK walin save waladi update ekak sidu wei
			//namuth post ekata ewana object eka PK netha fontend ekan ewana empty object eka atha
			//delete ekata fontend eken ena object eka data wenas wimak sidu wee save wima walakwimata ema record eka save nokara ehi id eken DB eke thibena record eka gena save karai
			employeeDao.save(extEmp);

			//dependancies

			return "OK";

		}catch (Exception e){
			return "Delete Not Complete :" + e.getMessage();
		}

	}

	@SuppressWarnings("unused")
	@PutMapping(value = "/employee/update")
	public String updateEmployeeData(@RequestBody Employee employee) {
		// check loged user authorisation

		//wena kenak pitin service eka access karala value pass karanawada belimata
		//check ext - pitin ena data ekata id ekaka add kala nohaka eaya db eka ai magin lebe.
		
		if(employee.getId() == null){

			return "Update Not Completed : Employee Not Ext..! ";
		}

		//update karanna ena data ekehi id eka api laga thibeda balima
		//ema id eka thibena record ekak db eke thibeda belima 
		Employee extByid = employeeDao.getReferenceById(employee.getId());
		if(extByid == null){
			return "Update Not Completed : Employee Not Ext..! ";
		}

		//duplicate check
        //mehidee update kala value eka duplicatda belima saha ema field eka update nokala awasthawaka samana value ekata edite karana employeewa athulath nowimata id asamanada beliya yuthuya

		Employee extEmployeeByNic = employeeDao.getByNic(employee.getNic());
		if (extEmployeeByNic != null && extEmployeeByNic.getId() != employee.getId()){
			return "Save Not Completed : Nic "+ employee.getNic() +" Value Allready ext...!";
		}

		Employee extEmployeeByEmail = employeeDao.getByEmail(employee.getEmail());
		if (extEmployeeByEmail != null && extEmployeeByEmail.getId() != employee.getId()){
			return "Save Not Completed : Email "+ employee.getEmail() +" Value Allready ext...!";
		}
		
		try {
			//set auto added data
			employee.setUpdatedatetime(LocalDateTime.now());
			employee.setUpdateuserid(1);
			
			

			// save operator
             employeeDao.save(employee);
			 
			//dependances

			return "OK";

		} catch (Exception e) {
			return "Update Not Completed" + e.getMessage();
		}
	}

	//load employee all data
	@GetMapping(value = "/employee/employeeListWithoutUserAccount" , produces = "application/json")
	public List<Employee> employeeListWithoutUserAccount(){
		return employeeDao.employeeListWithoutUserAccount();
	}
    
}
