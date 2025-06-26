package lk.brightbs.priceRequest.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.brightbs.priceRequest.entity.PriceRequest;


public interface PriceRequestDao extends JpaRepository<PriceRequest , Integer>{

}
