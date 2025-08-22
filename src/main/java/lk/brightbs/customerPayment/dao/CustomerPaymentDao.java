package lk.brightbs.customerPayment.dao;

import lk.brightbs.customer.entity.Customer;
import lk.brightbs.customerPayment.entity.CustomerPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerPaymentDao extends JpaRepository<CustomerPayment, Integer>{

    //querry for get ext customer by given email
    @Query(value = "select c from Customer c where c.email =:email")
    Customer getByEmail(@Param("email") String email);

    //querry for genarate ext customer number
    @Query(value = "SELECT coalesce(concat('CP' , lpad(substring(max(i.billno),3) +1 , 5 , 0)) , 'CP00001')  FROM brightbookshop.customerpayment as CP;" , nativeQuery = true)  String getNextBillNo();

}
