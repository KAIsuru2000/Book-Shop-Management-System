package lk.brightbs.priceRequest.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lk.brightbs.item.entity.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="pricelistrequest_has_item")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceListRequestHasItem {
    
    // mehi pawathinna FK 2ki
    //foreign key
    @Id // primary key nisa
    @ManyToOne
    @JoinColumn(name ="pricelistrequest_id" , referencedColumnName = "id")
    //foreign key lesa another table ekaka record ekak ana nisa type eka PriceRequest
    private PriceRequest pricelistrequest_id;

    //foreign key
    @Id // primary key nisa
    @ManyToOne
    @JoinColumn(name ="item_id" , referencedColumnName = "id")
    //foreign key lesa another table ekaka record ekak ana nisa type eka Item
    private Item item_id;
}
