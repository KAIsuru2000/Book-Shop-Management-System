package lk.brightbs.report.dao;

import lk.brightbs.customerPayment.entity.CustomerPayment;
import lk.brightbs.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface RepoortDao extends JpaRepository<Employee, Integer> {

    @Query(value="SELECT e.* FROM brightbookshop.employee as e where designation_id = ?1;" , nativeQuery = true)
    public List<Employee> getEmployeeByDesignation(Integer designationid );


    @Query(value = "SELECT cp.billno , cp.paymentmethod ,cp.cardamount FROM brightbookshop.customerpayment as cp where cp.addeduserid=?1 and cp.addeddatetime >= ?2 and cp.addeddatetime <?3 and cp.cardamount <> 0",nativeQuery = true)
    public String[][] getCustomerPaymentByCard(Integer loggeduserid, LocalDateTime startdate, LocalDateTime enddate);

    @Query(value = "SELECT cp.billno , cp.paymentmethod ,cp.cashamount FROM brightbookshop.customerpayment as cp where cp.addeduserid=?1 and cp.addeddatetime >=?2 and cp.addeddatetime <?3 and cp.cashamount <> 0",nativeQuery = true)
    public String[][] getCustomerPaymentByCash(Integer loggeduserid, LocalDateTime startdate, LocalDateTime enddate);

    @Query(value = "SELECT cp.billno , cp.paymentmethod ,cp.paidamount FROM brightbookshop.customerpayment as cp where cp.addeduserid=?1 and cp.addeddatetime >= ?2 and cp.addeddatetime <?3",nativeQuery = true)
    public String[][] getCustomerPaymentByAll(Integer loggeduserid, LocalDateTime startdate, LocalDateTime enddate);

}
