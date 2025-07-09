package lk.brightbs.addPriceList.entity;

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
import lk.brightbs.priceRequest.entity.PriceRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
// make as an persistence entity
    @Table(name = "addpricelist") // for map table name
    @Data // getter , setter tostring

    @NoArgsConstructor
    @AllArgsConstructor

    // main object ekata (purchaseOrder) adala class eka (PurchaseOrder)
public class AddPriceList { 

    @Id //pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id ;

    @Column(name = "itemlist")
    private String itemlist ;

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
    @JoinColumn(name = "addpriceliststatus_id" , referencedColumnName = "id")
    private AddPricelistStatus addpriceliststatus_id ;
    
    @ManyToOne
    @JoinColumn(name = "pricelistrequest_id" , referencedColumnName = "id")
    private PriceRequest pricelistrequest_id ; 

    // addpricelist_id int

    // list ekak lebiya yuthuya
    // js wala hadapu list eka (purchaseOrderHasItemList)
    // purchaseOrderHasItemList <- meya enna hethuwa -ER eke purchaseOrder eka one wii purchaseOrderHasItem many wiima
    // inner form eke data remove kirimata awashya wei e sadaha orphanRemoval = true yodai
    @OneToMany(mappedBy = "addpricelist_id" , cascade = CascadeType.ALL , orphanRemoval = true) // mapped by main table id (purchaserequest_id)
    // CascadeType.ALL- read kirimata awasthawa laba dei
    private List<AddPricelistHasItem> purchaseOrderHasItemList;



    }
