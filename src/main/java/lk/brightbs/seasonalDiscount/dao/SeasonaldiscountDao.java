package lk.brightbs.seasonalDiscount.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

import lk.brightbs.seasonalDiscount.entity.Seasonaldiscount;

public interface SeasonaldiscountDao extends JpaRepository<Seasonaldiscount , Integer>{

    // discountname magin seasonaldiscount ekak gani
    @Query("select i from Seasonaldiscount i where i.discountname=?1")
    Seasonaldiscount getByDiscountName(String discountname);

    // item id saha wathman date ekata adala active seasonal discount ganna query eka
    @Query("select s from Seasonaldiscount s join s.items i where i.id = :itemId and :currentDate between s.validfrom and s.validto")
    // active list eka return karaganna method eka define karanawa
    List<Seasonaldiscount> getActiveDiscountByItemAndDate(@Param("itemId") Integer itemId, @Param("currentDate") LocalDate currentDate);

}
