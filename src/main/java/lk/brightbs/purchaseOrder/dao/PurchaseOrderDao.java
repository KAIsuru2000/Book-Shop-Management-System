package lk.brightbs.purchaseOrder.dao;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.purchaseOrder.entity.PurchaseOrder;

public interface PurchaseOrderDao extends JpaRepository<PurchaseOrder, Integer>{

    // purchase order table eke thiyena aluthma order no eka generate karana native query eka
    @Query(value = "SELECT coalesce(concat('PO' , lpad(substring(max(PO.purchaserequestno),3) +1 , 5 , 0)) , 'PO00001')  FROM brightbookshop.purchaserequest as PO;" , nativeQuery = true)
    String getNextOrderNo();

@Query("SELECT po FROM PurchaseOrder po WHERE po.purchaserequeststatus_id.name = 'Pending' OR po.purchaserequeststatus_id.name = 'Partially Received' ORDER BY po.id DESC")
List<PurchaseOrder> getPendingList();

    // select karapu add price list id ekata adala, delete nowunu purchase orders set eka ganna query eka
    @Query("SELECT p FROM PurchaseOrder p WHERE p.addpricelist_id.id = ?1 AND p.purchaserequeststatus_id.name <> 'Deleted'")
    List<PurchaseOrder> findByAddPriceList(Integer addPriceListId);

    // Pending purchase orders count eka laba ganimata custom query eka
    @Query("SELECT count(po) FROM PurchaseOrder po WHERE po.purchaserequeststatus_id.name = 'Pending'")
    // Pending orders count eka Long type eken return karai
    Long countPendingPurchaseOrders();

    // Active thibeena (Pending ho Partially Received) ha requireddate eka parameters karana dinayata wada adu ho samana purchase orders database eken laba ganima sadaha
    @Query("SELECT po FROM PurchaseOrder po WHERE po.purchaserequeststatus_id.name IN ('Pending', 'Partially Received') AND po.requireddate <= ?1")
    List<PurchaseOrder> findActivePurchaseOrdersBeforeDate(LocalDate date);

}
