package lk.brightbs.item.dao;
import lk.brightbs.item.entity.Subcategory;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Query;


public interface SubcategoryDao extends JpaRepository<Subcategory, Integer>{

    // category magin sub category eka load kirima D-23 1.50
    @Query(value = "SELECT sc FROM Subcategory sc where sc.category_id.id=?1" )
    public List<Subcategory> byCategory(Integer categoryid );

    
    
}
