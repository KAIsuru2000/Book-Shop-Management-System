package lk.brightbs.priceRequest.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.priceRequest.entity.PriceRequest;


public interface PriceRequestDao extends JpaRepository<PriceRequest , Integer>{


    // price request table eke thiyena aluthma request no eka generate karana native query eka
    @Query(value = "SELECT coalesce(concat('R' , lpad(substring(max(i.requestno),2) +1 , 5 , 0)) , 'R00001')  FROM brightbookshop.pricelistrequest as i;" , nativeQuery = true)
    String getNextPriceRequestNo();

}
