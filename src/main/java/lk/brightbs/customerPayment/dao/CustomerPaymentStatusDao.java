package lk.brightbs.customerPayment.dao;

import lk.brightbs.customer.entity.CustomerStatus;
import lk.brightbs.customerPayment.entity.CustomerPaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CustomerPaymentStatusDao extends JpaRepository<CustomerPaymentStatus, Integer>{
    
}
