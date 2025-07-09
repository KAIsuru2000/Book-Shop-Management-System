package lk.brightbs.grn.entity;

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
@Table(name = "grn_has_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrnHasItem {  
 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "uniteprice")
    @NotNull
    private BigDecimal uniteprice;

    @Column(name = "freequentity")
    @NotNull
    private Integer freequentity;

    @Column(name = "totalquentity")
    @NotNull
    private Integer totalquentity;

    @Column(name = "lineprice")
    @NotNull
    private BigDecimal lineprice;

    // foreign key
    @Id // primary key nisa
    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    // foreign key lesa another table ekaka record ekak ana nisa type eka
    // PriceRequest
    private Item item_id;

    // foreign key
    @Id // primary key nisa
    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    // foreign key lesa another table ekaka record ekak ana nisa type eka PurchaseOrder
    // recursion walek wima sadaha purchaserequest_id read kirima walakwai(JsonIgnore)
    // meya block kala wita save kala noheka
    @JsonIgnore
    private GRN grn_id;

}
