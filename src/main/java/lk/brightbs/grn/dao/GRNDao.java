package lk.brightbs.grn.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.brightbs.grn.entity.GRN;

public interface GRNDao extends JpaRepository<GRN, Integer>{

 @Query(value = "SELECT coalesce(concat('GN' , lpad(substring(max(GN.grnno),2) +1 , 5 , 0)) , 'GN00001')  FROM brightbookshop.grn as GN;" , nativeQuery = true) String getNextGrnNo();

}
