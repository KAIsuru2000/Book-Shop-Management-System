package lk.brightbs.addPriceList.dao;

import lk.brightbs.addPriceList.entity.AddPricelistStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AddPriceListStatusDao extends JpaRepository<AddPricelistStatus, Integer> {

    // status name eka use karala status object eka database eken ganna query eka
    @Query("SELECT s FROM AddPricelistStatus s WHERE s.name = ?1")
    AddPricelistStatus findByName(String name);

}
