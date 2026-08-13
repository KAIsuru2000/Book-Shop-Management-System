package lk.brightbs.grn.dao;

import java.util.List;
import java.time.LocalDateTime; // Java wala local date time class eka import karagannawa
import org.springframework.data.repository.query.Param; // Query eke parameters bind karanna Param class eka import karagannawa
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.grn.entity.GRN;

public interface GRNDao extends JpaRepository<GRN, Integer>{

 @Query(value = "SELECT coalesce(concat('GN' , lpad(substring(max(GN.grnno),3) +1 , 5 , 0)) , 'GN00001')  FROM brightbookshop.grn as GN;" , nativeQuery = true) String getNextGrnNo();

    // select karapu purchase order id ekata adala, delete nowunu GRN records set eka ganna query eka
    @Query("SELECT g FROM GRN g WHERE g.purchaserequest_id.id = ?1 AND g.grnstatus_id.name <> 'Deleted'")
    List<GRN> findByPurchaseOrder(Integer purchaseOrderId);

    @Query("SELECT a FROM GRN a WHERE a.grnstatus_id.name = 'Pending' OR a.grnstatus_id.name = 'Partially Paid'ORDER BY a.id DESC")
 List<GRN> getPendingAndPartiallyPaidList();

    // Report hadanna awashya dates athara delete nowunu grn records laba ganima sadaha query eka
    @Query("SELECT g FROM GRN g WHERE g.addeddatetime >= :start AND g.addeddatetime <= :end AND g.grnstatus_id.name <> 'Deleted' ORDER BY g.addeddatetime ASC") // Dynamic parameter pass karala dynamic grn select karana query eka
    List<GRN> getGrnsForReport(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end); // local datetime parameters deken getGrnsForReport function eka call karagannawa

}

