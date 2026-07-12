package lk.brightbs.inventory.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import lk.brightbs.inventory.entity.Inventory;
import lk.brightbs.item.entity.Item;
import java.math.BigDecimal;
import java.util.Optional;

public interface InventoryDao extends JpaRepository<Inventory, Integer> {

    // Item eka saha sales price eka matha adala inventory record eka hoya ganna custom query eka
    @Query("SELECT i FROM Inventory i WHERE i.item_id = :item AND i.salesprice = :salesprice")
    // Hoyagaththa inventory record eka Optional object ekak widiyata return karai
    Optional<Inventory> findByItemAndSalesprice(@Param("item") Item item, @Param("salesprice") BigDecimal salesprice);

    // Item eke re-order point (rop) ekata wada adu ho sama available quantity thiyena inventory records count eka ganna query eka
    @Query("SELECT count(i) FROM Inventory i WHERE i.avalablequantity <= i.item_id.rop")
    // Low stock items count eka Long type eken return karai
    Long countLowStockItems();
}
