package lk.brightbs.grn.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.grn.entity.GRN;

public interface GRNDao extends JpaRepository<GRN, Integer>{

 @Query(value = "SELECT coalesce(concat('GN' , lpad(substring(max(GN.grnno),2) +1 , 5 , 0)) , 'GN00001')  FROM brightbookshop.grn as GN;" , nativeQuery = true) String getNextGrnNo();

    // select karapu purchase order id ekata adala, delete nowunu GRN records set eka ganna query eka
    @Query("SELECT g FROM GRN g WHERE g.purchaserequest_id.id = ?1 AND g.grnstatus_id.name <> 'Deleted'")
    List<GRN> findByPurchaseOrder(Integer purchaseOrderId);

}
