package lk.brightbs.invoice.dao;

import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.invoice.entity.Invoice;

public interface InvoiceDao extends JpaRepository<Invoice, Integer> {

  @Query(value = "SELECT coalesce(concat('INV' , lpad(substring(max(i.invoiceno),4) + 1 , 5 , '0')) , 'INV00001')  FROM brightbookshop.invoice as i;", nativeQuery = true)
  String getNextInvoiceNo();

  @Query("SELECT i FROM Invoice i WHERE i.invoicestatus_id.name = 'pending'")
  List<Invoice> getPendingInvoices();

  // Report hadanna awashya dates athara paid ho pending invoices geta ganima sadaha query eka
  @Query("SELECT i FROM Invoice i WHERE i.addeddatetime >= :start AND i.addeddatetime <= :end AND i.invoicestatus_id.id <> 3 ORDER BY i.addeddatetime ASC")
  // Invoices list eka dynamic local datetime parameters matha filter karala return karai
  List<Invoice> getInvoicesForReport(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  // Ada dawase labunu mulu adayama (Today Income) calculate karaganna custom query eka
  @Query("SELECT coalesce(sum(i.netamount), 0) FROM Invoice i WHERE i.addeddatetime >= :start AND i.addeddatetime <= :end AND i.invoicestatus_id.id <> 3")
  // Invoices netamount eka sum karala BigDecimal type eken return karai
  java.math.BigDecimal getTodayIncome(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

}
