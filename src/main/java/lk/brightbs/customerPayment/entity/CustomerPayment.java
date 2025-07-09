package lk.brightbs.customerPayment.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.brightbs.invoice.entity.Invoice;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
// make as an persistence entity
    @Table(name = "customerpayment") // for map table name
    @Data // getter , setter tostring

    @NoArgsConstructor
    @AllArgsConstructor

    // main object ekata (purchaseOrder) adala class eka (PurchaseOrder)
public class CustomerPayment { 

    @Id //pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id ;

    @NotNull
    @Column(name = "paymentmethod")
    private String paymentmethod ;

    @Column(name = "billno" , unique = true)
    @NotNull // not null
    // @Length(max = 8 , min = 8)
    private String billno ;

    @Column(name = "referenceno" , unique = true)
    @NotNull // not null
    // @Length(max = 8 , min = 8)
    private String referenceno ;

    @Column(name = "paidamount")
    @NotNull
    private BigDecimal paidamount;

    @Column(name = "balanceamount")
    @NotNull
    private BigDecimal balanceamount;

        @Column(name = "invoiceamount")
    @NotNull
    private BigDecimal invoiceamount;

    @NotNull
    @Column(name = "cardtype")
    private String cardtype ;

    @Column(name = "requireddate")
    @NotNull
    private LocalDate requireddate ;

    @Column(name ="totalamount")
    @NotNull
    private BigDecimal totalamount ;

    @Column(name = "note")
    private String note ;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    private LocalDateTime updatedatetime;
   
    private LocalDateTime deletedatetime;

    @NotNull
    private Integer addeduserid;

    private Integer updateuserid;

    private Integer deleteuserid;
   
    @ManyToOne
    @JoinColumn(name = "customerpaymentstatus_id" , referencedColumnName = "id")
    private CustomerPaymentStatus customerpaymentstatus_id ;
    
    @ManyToOne
    @JoinColumn(name = "invoice_id" , referencedColumnName = "id")
    private Invoice invoice_id ; 


    }
