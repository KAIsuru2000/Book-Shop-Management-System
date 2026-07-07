package lk.brightbs.priceRequest.dao;

import lk.brightbs.priceRequest.entity.PriceRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PriceRequestStatusDao extends JpaRepository<PriceRequestStatus, Integer> {

    // status name eka use karala status object eka database eken ganna query eka
    @Query("SELECT s FROM PriceRequestStatus s WHERE s.name = ?1")
    PriceRequestStatus findByName(String name);

}
