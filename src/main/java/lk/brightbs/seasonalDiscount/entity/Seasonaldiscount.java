package lk.brightbs.seasonalDiscount.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.brightbs.item.entity.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
// make as an persistence entity
@Table(name = "seosonaldiscount") // for map table name
@Data // getter , setter tostring

@NoArgsConstructor
@AllArgsConstructor

public class Seasonaldiscount {

    @Id // pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @Column(name = "offername", unique = true)
    @NotNull // not null
    private String discountname;

    @Column(name = "discountrate")
    @NotNull
    private BigDecimal discount;

    @Column(name = "invoiceamount")
    @NotNull
    private BigDecimal invoiceamount;

    @Column(name = "startdate")
    @NotNull
    private LocalDate validfrom;

    @Column(name = "enddate")
    @NotNull
    private LocalDate validto;

    @ManyToOne
    @JoinColumn(name = "offertype_id", referencedColumnName = "id")
    private Offertype offertype_id;

    @ManyToMany(cascade = CascadeType.MERGE)
    // many to many sadaha join table ekak atha
    // join column eka lesa main eka gani
    // anith side eka(inverseJoinColumns)
    @JoinTable(name = "seosonaldiscount_has_item", joinColumns = @JoinColumn(name = "seosonaldiscount_id"), inverseJoinColumns = @JoinColumn(name = "item_id"))
    private Set<Item> items;

}
