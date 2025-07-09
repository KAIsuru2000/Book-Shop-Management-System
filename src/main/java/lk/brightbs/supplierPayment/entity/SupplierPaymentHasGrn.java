package lk.brightbs.supplierPayment.entity;

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
@Table(name = "supplierpayment_has_grn")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierPaymentHasGrn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "previousdueamount")
    @NotNull
    private BigDecimal previousdueamount;

    @Column(name = "paidamount")
    @NotNull
    private BigDecimal paidamount;

    @Column(name = "afterdueamount")
    @NotNull
    private BigDecimal afterdueamount;

    // foreign key
    @Id // primary key nisa
    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    // foreign key lesa another table ekaka record ekak ana nisa type eka
    // PriceRequest
    private Item grn_id;

    // foreign key
    @Id // primary key nisa
    @ManyToOne
    @JoinColumn(name = "supplierpayment_id", referencedColumnName = "id")
    // foreign key lesa another table ekaka record ekak ana nisa type eka PurchaseOrder
    // recursion walek wima sadaha purchaserequest_id read kirima walakwai(JsonIgnore)
    // meya block kala wita save kala noheka
    @JsonIgnore
    private SupplierPayment supplierpayment_id;

}
