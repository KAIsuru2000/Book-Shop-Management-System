package lk.brightbs.supplierPayment.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import lk.brightbs.supplierPayment.entity.SupplierPayment;

public interface SupplierPaymentDao extends JpaRepository<SupplierPayment, Integer>{

 @Query(value = "SELECT coalesce(concat('SP' , lpad(substring(max(SP.billno),3) +1 , 5 , 0)) , 'SP00001')  FROM brightbookshop.supplierpayment as SP;" , nativeQuery = true) String getNextSupplierPaymentNo();

}
