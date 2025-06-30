package lk.brightbs.priceRequest.entity;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.brightbs.employee.entity.Employee;
import lk.brightbs.item.entity.Item;
import lk.brightbs.supplier.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
// make as an persistence entity
    @Table(name = "pricelistrequest") // for map table name
    @Data // getter , setter tostring

    @NoArgsConstructor
    @AllArgsConstructor

public class PriceRequest {

    @Id //pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id ;

    @Column(name = "requestno" , unique = true)
    @NotNull // not null
    // @Length(max = 8 , min = 8)
    private String requestno ;

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

    @Column(name = "requireddate")
    @NotNull
    private LocalDate requireddate ;

    //user many employee one
    //foreing key eka one side eke sita many side ekata ei ema nisa many to one
    @ManyToOne(optional = true)  //meya optional
    //table name eka(employee_id) foreing key wana table eke id eka(referencedColumnName=primary key)
    @JoinColumn(name = "supplier_id" , referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne
    @JoinColumn(name = "pricelistrequeststatus_id" , referencedColumnName = "id")
    private PriceRequestStatus pricelistrequeststatus_id ;
    
   @ManyToMany(cascade = CascadeType.MERGE)
    //many to many sadaha join table ekak atha
    //join column eka lesa main eka gani
    //anith side eka(inverseJoinColumns)
    @JoinTable(name = "pricelistrequest_has_item" , joinColumns = @JoinColumn(name="pricelistrequest_id") , 
    inverseJoinColumns = @JoinColumn(name="item_id"))
    private Set<Item> items;

}
