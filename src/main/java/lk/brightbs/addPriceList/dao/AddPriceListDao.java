package lk.brightbs.addPriceList.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.addPriceList.entity.AddPriceList;

public interface AddPriceListDao extends JpaRepository<AddPriceList, Integer>{

 @Query(value = "SELECT coalesce(concat('A' , lpad(substring(max(a.addpricelistno),2) +1 , 5 , 0)) , 'A00001')  FROM brightbookshop.addpricelist as a;" , nativeQuery = true) String getNextAddPriceListNo();

 @Query("SELECT a FROM AddPriceList a WHERE a.addpriceliststatus_id.name = 'Pending'")
 List<AddPriceList> getPendingList();

}

