package lk.brightbs.purchaseOrder.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.brightbs.employee.entity.EmployeeStatus;
import lk.brightbs.supplier.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
// make as an persistence entity
    @Table(name = "purchaserequest") // for map table name
    @Data // getter , setter tostring

    @NoArgsConstructor
    @AllArgsConstructor
public class PurchaseOrder { 


    @Id //pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id ;

    @Column(name = "purchaserequestno" , unique = true)
    @NotNull // not null
    // @Length(max = 8 , min = 8)
    private String purchaserequestno ;

    @Column(name = "requireddate")
    @NotNull
    private LocalDate requireddate ;

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
    @JoinColumn(name = "purchaserequeststatus_id" , referencedColumnName = "id")
    private EmployeeStatus purchaserequeststatus_id ;
    
    @ManyToOne
    @JoinColumn(name = "supplier_id" , referencedColumnName = "id")
    private Supplier supplier_id ; 

    // addpricelist_id int



    }
