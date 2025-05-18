package lk.brightbs.item.dao;
import lk.brightbs.item.entity.Itemstatus;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ItemStatusDao extends JpaRepository<Itemstatus, Integer>{
    
}
