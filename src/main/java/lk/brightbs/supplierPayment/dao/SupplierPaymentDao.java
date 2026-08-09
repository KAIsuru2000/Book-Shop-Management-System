package lk.brightbs.supplierPayment.dao; // Me package eka thula thama dao classes thiyenne

import org.springframework.data.jpa.repository.JpaRepository; // JpaRepository generic class eka import karagannawa
import org.springframework.data.jpa.repository.Query; // Custom native query liyන්න use karana class eka
import org.springframework.data.repository.query.Param; // Query parameters bindings maps checks
import java.math.BigDecimal; // Decimal amounts calculation class eka import karagannawa
import lk.brightbs.supplierPayment.entity.SupplierPayment; // SupplierPayment entity class eka import karagannawa

public interface SupplierPaymentDao extends JpaRepository<SupplierPayment, Integer>{ // SupplierPaymentDao interface eka patan gannawa

    // 1. Next bill number eka generate karana native query eka
    @Query(value = "SELECT coalesce(concat('SP' , lpad(substring(max(SP.billno),3) +1 , 5 , 0)) , 'SP00001') FROM brightbookshop.supplierpayment as SP;" , nativeQuery = true) 
    String getNextSupplierPaymentNo();

    // 2. Select karapu GRN id ekata adala, cancel nowunu payments wala mulu paid amount eka ganna query eka
    @Query("SELECT COALESCE(SUM(sp.paidamount), 0) FROM SupplierPayment sp WHERE sp.grn_id.id = :grnId AND sp.suplierpaymentstatus_id.name <> 'Deleted'")
    BigDecimal getTotalPaidAmountByGrnId(@Param("grnId") Integer grnId); // Param bind config method eka return BigDecimal type
}
