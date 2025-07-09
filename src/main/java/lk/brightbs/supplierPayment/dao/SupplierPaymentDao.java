package lk.brightbs.supplierPayment.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import lk.brightbs.supplierPayment.entity.SupplierPayment;

public interface SupplierPaymentDao extends JpaRepository<SupplierPayment, Integer>{

 @Query(value = "SELECT coalesce(concat('PO' , lpad(substring(max(PO.purchaserequestno),2) +1 , 5 , 0)) , 'PO00001')  FROM brightbookshop.purchaserequest as PO;" , nativeQuery = true) String getNextOrderNo();

}
