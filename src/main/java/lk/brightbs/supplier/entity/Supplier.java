package lk.brightbs.supplier.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import org.hibernate.validator.constraints.Length;

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
import lk.brightbs.item.entity.Brand;
import lk.brightbs.privilege.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
// make as an persistence entity
    @Table(name = "supplier") // for map table name
    @Data // getter , setter tostring

    @NoArgsConstructor
    @AllArgsConstructor

public class Supplier {
    
@Id //pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id ;

    @Column(name = "suppliername" , unique = true)
    @NotNull // not null
    private String suppliername ;
    
    @Column(name ="regno")
    @NotNull
    private String regno ;

    @Column(name = "brn")
    @NotNull
    private String brn ;

    @Column(name = "contact_person")
    @NotNull
    private String contact_person ;

    @Column(name = "contactno" , unique = true)
    @NotNull
    @Length(max = 10 , min = 10)
    private String contactno ;

    @Column(name = "email" , unique = true)
    @NotNull
    private String email;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name= "bankname")
    @NotNull
    private String bankname;

    @Column(name = "branchname")
    @NotNull
    private String branchname;

    @Column(name = "accuntno")
    @NotNull
    private String accuntno;

    @Column(name = "accuntholdername")
    @NotNull
    private String accuntholdername;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @NotNull
    private Integer addeduserid;

    private LocalDateTime updatedatetime;
    private Integer updateuserid;
    private LocalDateTime deletedatetime;
    private Integer deleteuserid;

    @ManyToOne
    @JoinColumn(name = "supplierstatus_id" , referencedColumnName = "id")
    private SupplierStatus supplierstatus_id ;
    
    @ManyToMany(cascade = CascadeType.MERGE)
    //many to many sadaha join table ekak atha
    //join column eka lesa main eka gani
    //anith side eka(inverseJoinColumns)
    @JoinTable(name = "supplier_has_brand" , joinColumns = @JoinColumn(name="supplier_id") , 
    inverseJoinColumns = @JoinColumn(name="brand_id"))
    private Set<Brand> brands;

}
