package lk.brightbs.purchaseOrder.dao;

import lk.brightbs.purchaseOrder.entity.PurchaseOrderStatus;

import org.springframework.data.jpa.repository.JpaRepository;



public interface PurchaseOrderStatusDao extends JpaRepository<PurchaseOrderStatus, Integer> {

}
