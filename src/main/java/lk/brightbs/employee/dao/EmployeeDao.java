package lk.brightbs.employee.dao;

import lk.brightbs.employee.entity.Employee;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmployeeDao extends JpaRepository<Employee, Integer> {

    //querry for genarate ext employee number
   // @Query(value = "SELECT lpad(max(e.employeenumber) + 1, 8 , 0) FROM brightbookshop.employee as e;" , nativeQuery = true) String getNextEmpNo();

    //querry for genarate ext number
    //value ekakwath nethi witaka wuwath number eka genarate wimata coalesce yodai >> emagin default value ekak mulin laba diya heka
    @Query(value = "SELECT coalesce(concat('E' , lpad(substring(max(e.employeenumber),2) +1 , 5 , 0)) , 'E00001')  FROM brightbookshop.employee as e;" , nativeQuery = true) String getNextEmpNo();

    //querry for get ext employee by given nic
    @Query(value = "select e from Employee e where e.nic=?1")
    Employee getByNic(String nic);

    //querry for get ext employee by given email
    @Query(value = "select e from Employee e where e.email =:email")
    Employee getByEmail(@Param("email") String email);

    //create query for get employee without user account
    @Query(value = "SELECT * FROM brightbookshop.employee as e where e.id not in(select u.employee_id from brightbookshop.user as u where u.employee_id is not null);" , nativeQuery = true)
    public List<Employee>employeeListWithoutUserAccount();
    
}
