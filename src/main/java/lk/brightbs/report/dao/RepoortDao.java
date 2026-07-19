package lk.brightbs.report.dao;

import lk.brightbs.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RepoortDao extends JpaRepository<Employee, Integer> {

    @Query(value="SELECT e.* FROM brightbookshop.employee as e where designation_id = ?1;" , nativeQuery = true)
    public List<Employee> getEmployeeByDesignation(Integer designationid );

}
