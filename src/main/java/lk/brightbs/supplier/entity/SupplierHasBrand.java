package lk.brightbs.supplier.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lk.brightbs.item.entity.Brand;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name="supplier_has_brand")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierHasBrand {
    
    // mehi pawathinna FK 2ki
    //foreign key
    @Id // primary key nisa
    @ManyToOne
    @JoinColumn(name ="brand_id" , referencedColumnName = "id")
    //foreign key lesa another table ekaka record ekak ana nisa type eka Role
    private Brand brand_id;

    //foreign key
    @Id // primary key nisa
    @ManyToOne
    @JoinColumn(name ="supplier_id" , referencedColumnName = "id")
    //foreign key lesa another table ekaka record ekak ana nisa type eka Module
    private Supplier supplier_id;
}
