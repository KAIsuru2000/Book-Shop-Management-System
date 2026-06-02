package lk.brightbs.invoice.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.invoice.entity.Invoice;

public interface InvoiceDao extends JpaRepository<Invoice, Integer> {

  @Query(value = "SELECT coalesce(concat('INV' , lpad(substring(max(i.invoiceno),4) + 1 , 5 , '0')) , 'INV00001')  FROM brightbookshop.invoice as i;", nativeQuery = true)
  String getNextInvoiceNo();

  @Query("SELECT i FROM Invoice i WHERE i.invoicestatus_id.name = 'pending'")
  List<Invoice> getPendingInvoices();

}
