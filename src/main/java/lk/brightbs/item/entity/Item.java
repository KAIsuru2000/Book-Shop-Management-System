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
import jakarta.persistence.OneToMany; // OneToMany relationship use karanna import karagannawa
import jakarta.persistence.CascadeType; // database operations automatic cascade karaganna import karanawa
import java.util.List; // java list interface use karanna import karagannawa
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
// make as an persistence entity
@Table(name = "item") // for map table name
@Data // getter , setter tostring
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

@NoArgsConstructor
@AllArgsConstructor
public class Item {

    @Id // pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(name = "itemcode", unique = true)
    @NotNull // not null
    // @Length(max = 8 , min = 8)
    private String itemcode;

    @Column(name = "itemname")
    @NotNull
    private String itemname;

    @Column(name = "rop")
    @NotNull
    private BigDecimal rop;

    @Column(name = "roq")
    @NotNull
    private BigDecimal roq;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @NotNull
    private Integer addeduserid;

    private LocalDateTime updatedatetime;
    private Integer updateuserid;
    private LocalDateTime deletedatetime;
    private Integer deleteuserid;
    private byte[] item_photo;

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

    // Item ekata adala attributes option list eka cascade edit/delete wena dynamic relationship ekak map karanawa
    @OneToMany(mappedBy = "item_id", cascade = CascadeType.ALL, orphanRemoval = true)
    // List class type eka use karala itemHasAttributeOptionList variable eka build karanawa
    private List<ItemHasAttributeOption> itemHasAttributeOptionList;

    // table eka fill kirima sadaha selected data genwa ganimata dao hi query eka
    // sadaha awashya constructer eka sadima >> construnter eka class name ekenma
    // sadai new keyword eka en ne
    // mewaye "i" wenuwata data type eka damiya yuthuya
    // inpasu constructer properties set kala yuthuya
    // public Item(Integer id , String itemcode , String itemname , BigDecimal
    // purchaseprice , BigDecimal profitrate , BigDecimal salesprice , BigDecimal
    // roq , Itemstatus itemstatus_id){

    // this.id = id;
    // this.itemcode = itemcode;
    // this.itemname = itemname;
    // this.purchaseprice = purchaseprice;
    // this.profitrate = profitrate;
    // this.salesprice = salesprice;
    // this.roq = roq;
    // this.itemstatus_id = itemstatus_id;

    // }

}
