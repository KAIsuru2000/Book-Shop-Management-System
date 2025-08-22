package lk.brightbs.purchaseOrder.entity;

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
    @Table(name = "purchaserequest") // for map table name
    @Data // getter , setter tostring

    @NoArgsConstructor
    @AllArgsConstructor

    // main object ekata (purchaseOrder) adala class eka (PurchaseOrder)
public class PurchaseOrder { 


    @Id //pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id ;

    @Column(name = "purchaserequestno" , unique = true)
    @NotNull // not null
    // @Length(max = 8 , min = 8)
    private String purchaserequestno ;

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
    @JoinColumn(name = "purchaserequeststatus_id" , referencedColumnName = "id")
    private PurchaseOrderStatus purchaserequeststatus_id ;
    
    @ManyToOne
    @JoinColumn(name = "supplier_id" , referencedColumnName = "id")
    private Supplier supplier_id ;

//    //purchaseOrder many addpricelist one
//    //foreing key eka one side eke sita many side ekata ei ema nisa many to one
//    @ManyToOne(optional = true)  //meya optional
//    //table name eka(addpricelist_id) foreing key wana table eke id eka(referencedColumnName=primary key)
//    @JoinColumn(name = "addpricelist_id" , referencedColumnName = "id")
//    private Employee addpricelist_id;

    // list ekak lebiya yuthuya
    // js wala hadapu list eka (purchaseOrderHasItemList)
    // purchaseOrderHasItemList <- meya enna hethuwa -ER eke purchaseOrder eka one wii purchaseOrderHasItem many wiima
    // inner form eke data remove kirimata awashya wei e sadaha orphanRemoval = true yodai
    @OneToMany(mappedBy = "purchaserequest_id" , cascade = CascadeType.ALL , orphanRemoval = true) // mapped by main table id (purchaserequest_id)
    // CascadeType.ALL- read kirimata awasthawa laba dei
    private List<PurchaseOrderHasItem> purchaseOrderHasItemList;



    }
