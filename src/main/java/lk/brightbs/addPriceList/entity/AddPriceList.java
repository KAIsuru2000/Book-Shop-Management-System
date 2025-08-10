package lk.brightbs.addPriceList.entity;

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

    // main object ekata (addpricelist) adala class eka (AddPriceList)
public class AddPriceList { 

    @Id //pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id ;

    @Column(name = "itemlist")
    @NotNull // not null
    private String itemlist ;

    @Column(name = "addpricelistno" , unique = true)
    @NotNull // not null
    // @Length(max = 8 , min = 8)
    private String addpricelistno ;

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
    // js wala hadapu list eka (addPriceListHasItemList)
    // addPriceListHasItemList <- meya enna hethuwa -ER eke addPriceList eka one wii addPriceListHasItem many wiima
    // inner form eke data remove kirimata awashya wei e sadaha orphanRemoval = true yodai
    @OneToMany(mappedBy = "addpricelist_id" , cascade = CascadeType.ALL , orphanRemoval = true) // mapped by main table id (addpricelist_id)
    // CascadeType.ALL- read kirimata awasthawa laba dei
    private List<AddPriceListHasItem>addPriceListHasItemList;



    }
