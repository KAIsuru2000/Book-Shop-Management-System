package lk.brightbs.supplierPayment.dao;
import lk.brightbs.supplierPayment.entity.SupplierPaymentStatus;

import org.springframework.data.jpa.repository.JpaRepository;



public interface SupplierPaymentStatusDao extends JpaRepository<SupplierPaymentStatus, Integer> {

}
