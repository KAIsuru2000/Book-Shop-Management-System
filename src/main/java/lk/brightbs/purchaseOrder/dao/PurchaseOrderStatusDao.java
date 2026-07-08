package lk.brightbs.purchaseOrder.dao;

import lk.brightbs.purchaseOrder.entity.PurchaseOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PurchaseOrderStatusDao extends JpaRepository<PurchaseOrderStatus, Integer> {

    // status name eka use karala status object eka database eken ganna query eka
    @Query("SELECT s FROM PurchaseOrderStatus s WHERE s.name = ?1")
    PurchaseOrderStatus findByName(String name);

}
