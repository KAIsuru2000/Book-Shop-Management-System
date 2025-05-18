package lk.brightbs.employee.dao;

import lk.brightbs.employee.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DesignationDao extends JpaRepository<Designation, Integer>{
    
}
