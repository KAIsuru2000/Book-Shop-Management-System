package lk.brightbs.seasonalDiscount.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.seasonalDiscount.entity.Seasonaldiscount;

public interface SeasonaldiscountDao extends JpaRepository<Seasonaldiscount , Integer>{

    // discountname magin seasonaldiscount ekak gani
    @Query("select i from Seasonaldiscount i where i.discountname=?1")
    Seasonaldiscount getByDiscountName(String discountname);

}
