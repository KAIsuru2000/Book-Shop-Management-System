package lk.brightbs.inventory.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import lk.brightbs.inventory.entity.Inventory;

public interface InventoryDao extends JpaRepository<Inventory, Integer> {
    
}
