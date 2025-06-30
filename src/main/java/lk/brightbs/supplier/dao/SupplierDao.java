package lk.brightbs.supplier.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.supplier.entity.Supplier;

public interface SupplierDao extends JpaRepository<Supplier , Integer>{

    @Query("select i from Supplier i where i.suppliername=?1")
    Supplier getBySupplierName(String suppliername);

    @Query(value = "SELECT coalesce(concat('S' , lpad(substring(max(i.regno),2) +1 , 5 , 0)) , 'S00001')  FROM brightbookshop.supplier as i;" , nativeQuery = true) String getNextSupplierNo();

}
