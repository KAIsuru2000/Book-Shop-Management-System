package lk.brightbs.supplierPayment.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.brightbs.supplier.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
// make as an persistence entity
    @Table(name = "supplierpayment") // for map table name
    @Data // getter , setter tostring

    @NoArgsConstructor
    @AllArgsConstructor

    // main object ekata (purchaseOrder) adala class eka (PurchaseOrder)
public class SupplierPayment { 

    @Id //pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id ;

    @Column(name = "billno" , unique = true)
    @NotNull // not null
    // @Length(max = 8 , min = 8)
    private String billno ;

    @Column(name = "transferid" , unique = true)
    // @Length(max = 8 , min = 8)
    private String transferid ;

    @Column(name = "checkno" , unique = true)
    // @Length(max = 8 , min = 8)
    private String checkno ;

    @Column(name = "checkdate")
    private LocalDate checkdate ;

    @Column(name ="totaldueamount")
    @NotNull
    private BigDecimal totaldueamount ;

    @Column(name ="paidamount")
    @NotNull
    private BigDecimal paidamount ;

    @Column(name ="balanceamount")
    @NotNull
    private BigDecimal balanceamount ;

    @Column(name = "note")
    private String note ;

    @NotNull
    @Column(name = "paymentmethod")
    private String paymentmethod ;

    @Column(name = "transferdatetime")
    private LocalDateTime transferdatetime;

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
    @JoinColumn(name = "suplierpaymentstatus_id" , referencedColumnName = "id")
    private SupplierPaymentStatus suplierpaymentstatus_id ;
    
    @ManyToOne
    @JoinColumn(name = "supplier_id" , referencedColumnName = "id")
    private Supplier supplier_id ; 

    // addpricelist_id int

    // list ekak lebiya yuthuya
    // js wala hadapu list eka (purchaseOrderHasItemList)
    // purchaseOrderHasItemList <- meya enna hethuwa -ER eke purchaseOrder eka one wii purchaseOrderHasItem many wiima
    // inner form eke data remove kirimata awashya wei e sadaha orphanRemoval = true yodai
    @OneToMany(mappedBy = "supplierpayment_id" , cascade = CascadeType.ALL , orphanRemoval = true) // mapped by main table id (purchaserequest_id)
    // CascadeType.ALL- read kirimata awasthawa laba dei
    private List<SupplierPaymentHasGrn> supplierpaymentHasGrnList;



    }
