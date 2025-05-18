package lk.brightbs.item.dao;
import lk.brightbs.item.entity.Category;

import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoryDao extends JpaRepository<Category, Integer>{
    
}
