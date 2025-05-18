package lk.brightbs.employee.dao;

import lk.brightbs.employee.entity.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;



public interface EmployeeStatusDao extends JpaRepository<EmployeeStatus, Integer> {

}
