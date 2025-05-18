package lk.brightbs.customer.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.brightbs.customer.entity.Customer;

public interface CustomerDao extends JpaRepository<Customer, Integer>{
    
}
