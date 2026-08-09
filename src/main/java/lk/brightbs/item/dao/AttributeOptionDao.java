package lk.brightbs.item.dao;

import lk.brightbs.item.entity.AttributeOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface AttributeOptionDao extends JpaRepository<AttributeOption, Integer>{

    // attribute id ekata saha brand id ekata matching options select karaganna dynamic query eka liyanawa
    @Query("select ao from AttributeOption ao where ao.category_attribute_id.id = ?1 and (?2 is null and ao.brand_id is null or ?2 is not null and (ao.brand_id.id = ?2 or ao.brand_id is null))")
    // parameters pass karala adala options list eka retrieve karana method signature eka set karanawa
    List<AttributeOption> getByAttributeAndBrand(Integer attributeId, Integer brandId);
    
}
