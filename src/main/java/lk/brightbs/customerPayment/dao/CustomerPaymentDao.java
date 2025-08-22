package lk.brightbs.customer.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import lk.brightbs.customer.entity.Customer;

public interface CustomerDao extends JpaRepository<Customer, Integer>{

    //querry for get ext customer by given email
    @Query(value = "select c from Customer c where c.email =:email")
    Customer getByEmail(@Param("email") String email);

    //querry for genarate ext customer number
    @Query(value = "SELECT coalesce(concat('C' , lpad(substring(max(i.regno),2) +1 , 5 , 0)) , 'C00001')  FROM brightbookshop.customer as i;" , nativeQuery = true)  String getNextCustNo();

}
