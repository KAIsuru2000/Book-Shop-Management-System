package lk.brightbs.item.dao;
import lk.brightbs.item.entity.Brand;

import java.util.List;

// import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Query;


public interface BrandDao extends JpaRepository<Brand, Integer>{
    
    //mehidee category eka magin brand eka ganimata hekiwana paridi sadai
    @Query(value = "SELECT b FROM Brand b where b.id in (select bhc.brand_id.id from BrandHasCategory bhc where bhc.category_id.id=?1)" )
    public List<Brand> byCategory(Integer categoryid);

    @Query("select b from Brand b where b.id not in (select shb.brand_id.id from SupplierHasBrand shb where shb.supplier_id.id=?1)" )
    public List<Brand> getListWithoutSupply(Integer supplierid);

}
