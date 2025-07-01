package lk.brightbs.purchaseOrder.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.brightbs.purchaseOrder.entity.PurchaseOrder;

public interface PurchaseOrderDao extends JpaRepository<PurchaseOrder, Integer>{

}
