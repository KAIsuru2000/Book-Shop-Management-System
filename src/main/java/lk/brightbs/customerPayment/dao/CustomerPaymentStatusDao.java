package lk.brightbs.customer.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.brightbs.customer.entity.CustomerStatus;


public interface CustomerStatusDao extends JpaRepository<CustomerStatus, Integer>{
    
}
