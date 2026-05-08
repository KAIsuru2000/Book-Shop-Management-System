package lk.brightbs.invoice.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.invoice.entity.Invoice;

public interface InvoiceDao extends JpaRepository<Invoice, Integer>{

 @Query(value = "SELECT coalesce(concat('PO' , lpad(substring(max(PO.purchaserequestno),2) +1 , 5 , 0)) , 'PO00001')  FROM brightbookshop.purchaserequest as PO;" , nativeQuery = true) String getNextOrderNo();

 @Query("SELECT i FROM Invoice i WHERE i.invoicestatus_id.name = 'Pending'")
 List<Invoice> getPendingInvoices();

}
