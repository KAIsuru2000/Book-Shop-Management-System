package lk.brightbs.item.dao;

import lk.brightbs.item.entity.CategoryAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface CategoryAttributeDao extends JpaRepository<CategoryAttribute, Integer>{

    // subcategory id eka magin category attributes filter karala ganna dynamic query eka liyanawa
    @Query("select ca from CategoryAttribute ca where ca.subcategory_id.id = ?1")
    // subcategory id eka pass karala dynamic category attributes list ekak retrieve karana method signature eka set karanawa
    List<CategoryAttribute> getBySubcategory(Integer subcategoryid);
    
}
