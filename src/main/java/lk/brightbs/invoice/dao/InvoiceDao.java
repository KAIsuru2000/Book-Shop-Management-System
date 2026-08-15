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

  @Query("SELECT i FROM Invoice i WHERE i.invoicestatus_id.name = 'pending'ORDER BY i.id DESC")
  List<Invoice> getPendingInvoices();

  // Report hadanna awashya dates athara paid ho pending invoices geta ganima sadaha query eka
  @Query("SELECT i FROM Invoice i WHERE i.addeddatetime >= :start AND i.addeddatetime <= :end AND i.invoicestatus_id.id <> 3 ORDER BY i.addeddatetime ASC")
  // Invoices list eka dynamic local datetime parameters matha filter karala return karai
  List<Invoice> getInvoicesForReport(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  // Ada dawase labunu mulu adayama (Today Income) calculate karaganna custom query eka
  @Query("SELECT coalesce(sum(i.netamount), 0) FROM Invoice i WHERE i.addeddatetime >= :start AND i.addeddatetime <= :end AND i.invoicestatus_id.id <> 3")
  // Invoices netamount eka sum karala BigDecimal type eken return karai
  java.math.BigDecimal getTodayIncome(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  // labunu start saha end datetime athara wadima pramanayak wikinunu items (trending items) laba ganima sadaha query eka
  @Query("SELECT ih.inventory_id.item_id.itemcode, ih.inventory_id.item_id.itemname, SUM(ih.quentity) " + // item details saha sold quantity eka sum karaganna select statement eka
         "FROM Invoice i JOIN i.invoiceHasInventoryList ih " + // invoice list eken invoice inventory details join karagannawa
         "WHERE i.addeddatetime >= :start AND i.addeddatetime <= :end AND i.invoicestatus_id.id <> 3 " + // start end date filter karala delete nowunu invoices pamanak gannawa
         "GROUP BY ih.inventory_id.item_id.id, ih.inventory_id.item_id.itemcode, ih.inventory_id.item_id.itemname " + // item id , code saha name eka anuwa data group karagannawa
         "ORDER BY SUM(ih.quentity) DESC") // wikinunu pramanaya (quantity) matha wadima thana sita aduma thanata sort karagannawa
  // trending items details list ekak lesa return karana function eka declare kirima
  List<Object[]> getTrendingItems(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end); // local date time parameters dekak labagena object type list ekak return karanawa

  // labunu start saha end datetime athara item eken item ekata profit eka calculate karaganna native SQL query eka
  @Query(value = "SELECT it.itemcode, it.itemname, SUM(ih.quentity) AS total_qty, " + // item code, name saha quentity sum select statement eka
                 "SUM(ih.quentity * ih.uniteprice) AS total_sales, " + // wikinunu revenue total sales calculate karanna select eka
                 "SUM(ih.quentity * (SELECT COALESCE(MAX(ghi.purchaseprice), 0) FROM brightbookshop.grn_has_item ghi WHERE ghi.item_id = it.id AND ghi.salesprice = ih.uniteprice)) AS total_cost " + // grn eken adala item eke purchaseprice matha cost eka calculate karanna select eka
                 "FROM brightbookshop.invoice_has_inventory ih " + // invoice line item details table eken select eka
                 "JOIN brightbookshop.invoice inv ON ih.invoice_id = inv.id " + // invoice details table join karanawa date range check karanna
                 "JOIN brightbookshop.inventory invt ON ih.inventory_id = invt.id " + // inventory table map join karanawa item id ganna
                 "JOIN brightbookshop.item it ON invt.item_id = it.id " + // item master table join data display name select ganna
                 "WHERE inv.addeddatetime >= :start AND inv.addeddatetime <= :end AND inv.invoicestatus_id <> 3 " + // filters dates and status mapping
                 "GROUP BY it.id, it.itemcode, it.itemname " + // details grouping fields criteria
                 "ORDER BY total_sales DESC", nativeQuery = true) // total sales revenue matha descending sorting path
  // item wise profit details return karana list array function eka declare kirima
  List<Object[]> getItemWiseProfit(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end); // date parameters mapping list arrays returns
}
