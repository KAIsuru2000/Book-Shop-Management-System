package lk.brightbs.priceRequest.dao;

import lk.brightbs.priceRequest.entity.PriceRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;



public interface PriceRequestStatusDao extends JpaRepository<PriceRequestStatus, Integer> {

}
