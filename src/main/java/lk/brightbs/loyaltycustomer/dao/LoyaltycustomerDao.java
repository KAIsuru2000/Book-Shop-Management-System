package lk.brightbs.loyaltycustomer.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.loyaltycustomer.entity.Loyaltycustomer;

public interface LoyaltycustomerDao extends JpaRepository<Loyaltycustomer, Integer> {

    @Query("select l from Loyaltycustomer l where l.cardname=?1")
    Loyaltycustomer getByCardname(String cardname);
}
