package lk.brightbs.purchaseOrder.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.purchaseOrder.entity.PurchaseOrder;

public interface PurchaseOrderDao extends JpaRepository<PurchaseOrder, Integer>{

 @Query(value = "SELECT coalesce(concat('PO' , lpad(substring(max(PO.purchaserequestno),2) +1 , 5 , 0)) , 'PO00001')  FROM brightbookshop.purchaserequest as PO;" , nativeQuery = true) String getNextOrderNo();

 @Query("SELECT po FROM PurchaseOrder po WHERE po.purchaserequeststatus_id.name = 'Pending'")
 List<PurchaseOrder> getPendingList();

}
