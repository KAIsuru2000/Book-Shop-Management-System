package lk.brightbs.grn.dao;

import lk.brightbs.grn.entity.GRNStatus;

import org.springframework.data.jpa.repository.JpaRepository;



import org.springframework.data.jpa.repository.Query;

public interface GRNStatusDao extends JpaRepository<GRNStatus, Integer> {

    // status name eka use karala status object eka database eken ganna query eka
    @Query("SELECT s FROM GRNStatus s WHERE s.name = ?1")
    GRNStatus findByName(String name);

}
