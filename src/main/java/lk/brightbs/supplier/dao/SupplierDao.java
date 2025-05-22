package lk.brightbs.supplier.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.brightbs.supplier.entity.Supplier;

public interface SupplierDao extends JpaRepository<Supplier , Integer>{
    
}
