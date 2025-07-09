package lk.brightbs.invoice.dao;

import lk.brightbs.invoice.entity.InvoiceStatus;

import org.springframework.data.jpa.repository.JpaRepository;



public interface InvoiceStatusDao extends JpaRepository<InvoiceStatus, Integer> {

}
