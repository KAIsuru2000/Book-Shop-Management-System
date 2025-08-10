package lk.brightbs.addPriceList.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.brightbs.item.entity.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "addpricelist_has_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddPriceListHasItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "unitprice")
    @NotNull
    private BigDecimal unitprice;

    @Column(name = "mincountity")
    @NotNull
    private Integer mincountity;

    @Column(name = "lastunitprice")
    @NotNull
    private BigDecimal lastunitprice;

    @Column(name = "marketprice")
    @NotNull
    private BigDecimal marketprice;

    // foreign key
    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    // foreign key lesa another table ekaka record ekak ana nisa type eka
    // PriceRequest
    private Item item_id;

    // foreign key
    @ManyToOne
    @JoinColumn(name = "addpricelist_id", referencedColumnName = "id")
    // foreign key lesa another table ekaka record ekak ana nisa type eka addpricelist
    // recursion walek wima sadaha addpricelist_id read kirima walakwai(JsonIgnore)
    // meya block kala wita save kala noheka eyata wisadumak lesa controller file eka thula for loop ekak liyala main object eka thula athi list eka illa gena eyata set karanawa addpricelist_id eka set karai
    @JsonIgnore
    private AddPriceList addpricelist_id;

}
