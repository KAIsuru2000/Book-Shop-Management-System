package lk.brightbs.invoice.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.brightbs.customer.entity.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
// make as an persistence entity
    @Table(name = "invoice") // for map table name
    @Data // getter , setter tostring

    @NoArgsConstructor
    @AllArgsConstructor

    // main object ekata (invoice) adala class eka (Invoice)
public class Invoice { 

    @Id //pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id ;

    @Column(name = "invoiceno" , unique = true)
    @NotNull // not null
    // @Length(max = 8 , min = 8)
    private String invoiceno ;

    @Column(name ="discountamount")
    @NotNull
    private BigDecimal discountamount ;

    @Column(name ="netamount")
    @NotNull
    private BigDecimal netamount ;

    @Column(name ="totalamount")
    @NotNull
    private BigDecimal totalamount ;

    @Column(name = "note")
    private String note ;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    private LocalDateTime updatedatetime;
   
    private LocalDateTime deletedatetime;

    @NotNull
    private Integer addeduserid;

    private Integer updateuserid;

    private Integer deleteuserid;
   
    @ManyToOne
    @JoinColumn(name = "invoicestatus_id" , referencedColumnName = "id")
    private InvoiceStatus invoicestatus_id ;
    
    @ManyToOne
    @JoinColumn(name = "customer_id" , referencedColumnName = "id")
    private Customer customer_id ; 

    // addpricelist_id int

    // list ekak lebiya yuthuya
    // js wala hadapu list eka (invoiceHasInventoryList)
    // invoiceHasInventoryList <- meya enna hethuwa -ER eke invoice eka one wii invoiceHasInventory many wiima
    // inner form eke data remove kirimata awashya wei e sadaha orphanRemoval = true yodai
    @OneToMany(mappedBy = "invoice_id" , cascade = CascadeType.ALL , orphanRemoval = true) // mapped by main table id (purchaserequest_id)
    // CascadeType.ALL- read kirimata awasthawa laba dei
    private List<InvoiceHasInventory> invoiceHasInventoryList;



    }
