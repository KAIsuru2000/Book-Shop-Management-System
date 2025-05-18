package lk.brightbs.item.entity;

import java.math.BigDecimal;
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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
// make as an persistence entity
@Table(name = "item") // for map table name
@Data // getter , setter tostring

@NoArgsConstructor
@AllArgsConstructor
public class Item {

    @Id // pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @Column(name = "itemcode", unique = true)
    @NotNull // not null
    // @Length(max = 8 , min = 8)
    private String itemcode;

    @Column(name = "itemname")
    @NotNull
    private String itemname;

    @Column(name = "profitrate", unique = true)
    @NotNull
    // @Length(max = 12 , min = 10)
    private BigDecimal profitrate;

    @Column(name = "salesprice")
    @NotNull
    private BigDecimal salesprice;

    @Column(name = "purchaseprice", unique = true)
    @NotNull
    private BigDecimal purchaseprice;

    @Column(name = "discountrate")
    @NotNull
    private BigDecimal discountrate;

    @Column(name = "unitsize")
    private BigDecimal unitsize;

    @Column(name = "rop")
    @NotNull
    private BigDecimal rop;

    @Column(name = "roq")
    @NotNull
    private BigDecimal roq;

    @Column(name = "note")
    private String note;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @NotNull
    private Integer addeduserid;

    private LocalDateTime updatedatetime;
    private Integer updateuserid;
    private LocalDateTime deletedatetime;
    private Integer deleteuserid;

    // (optional = true) magin null pass kala heki bawa hegawei
    @ManyToOne(optional = false)
    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    private Brand brand_id;

    @ManyToOne
    @JoinColumn(name = "subcategory_id", referencedColumnName = "id")
    private Subcategory subcategory_id;

    @ManyToOne
    @JoinColumn(name = "itemstatus_id", referencedColumnName = "id")
    private Itemstatus itemstatus_id;

    @ManyToOne
    @JoinColumn(name = "packagetype_id", referencedColumnName = "id")
    private Packagetype packagetype_id;

    @ManyToOne
    @JoinColumn(name = "unittype_id" , referencedColumnName = "id")
    private UniteType unittype_id ;

    // table eka fill kirima sadaha selected data genwa ganimata dao hi query eka
    // sadaha awashya constructer eka sadima >> construnter eka class name ekenma
    // sadai new keyword eka en ne
    // mewaye "i" wenuwata data type eka damiya yuthuya
    // inpasu constructer properties set kala yuthuya
    // public Item(Integer id , String itemcode , String itemname , BigDecimal purchaseprice , BigDecimal profitrate , BigDecimal salesprice , BigDecimal roq , Itemstatus itemstatus_id){

    //     this.id = id;
    //     this.itemcode = itemcode;
    //     this.itemname = itemname;
    //     this.purchaseprice = purchaseprice;
    //     this.profitrate = profitrate;
    //     this.salesprice = salesprice;
    //     this.roq = roq;
    //     this.itemstatus_id = itemstatus_id;

    // }


    }
