package lk.brightbs.priceRequest.dao;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.priceRequest.entity.PriceRequest;


public interface PriceRequestDao extends JpaRepository<PriceRequest , Integer>{


    // price request table eke thiyena aluthma request no eka generate karana native query eka
    @Query(value = "SELECT coalesce(concat('R' , lpad(substring(max(i.requestno),2) +1 , 5 , 0)) , 'R00001')  FROM brightbookshop.pricelistrequest as i;" , nativeQuery = true)
    String getNextPriceRequestNo();

    // Active thibeena (Pending ho Partially Added) ha requireddate eka parameters karana dinayata wada adu ho samana price requests database eken laba ganima sadaha
    @Query("SELECT pr FROM PriceRequest pr WHERE pr.pricelistrequeststatus_id.name IN ('Pending', 'Partially Added') AND pr.requireddate <= ?1")
    List<PriceRequest> findActivePriceRequestsBeforeDate(LocalDate date);

}
