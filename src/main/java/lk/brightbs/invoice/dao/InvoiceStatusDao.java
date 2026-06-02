package lk.brightbs.invoice.dao;

import lk.brightbs.invoice.entity.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InvoiceStatusDao extends JpaRepository<InvoiceStatus, Integer> {

    @Query("SELECT s FROM InvoiceStatus s WHERE s.name = :name")
    InvoiceStatus getByName(@Param("name") String name);
}

