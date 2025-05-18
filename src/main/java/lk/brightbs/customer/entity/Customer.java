package lk.brightbs.customer.entity;
import java.time.LocalDateTime;
import org.hibernate.validator.constraints.Length;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
// make as an persistence entity
    @Table(name = "customer") // for map table name
    @Data // getter , setter tostring

    @NoArgsConstructor
    @AllArgsConstructor
    public class Customer {
        
    @Id //pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id ;

    @Column(name = "regno" , unique = true)
    @NotNull // not null
    // @Length(max = 8 , min = 8)
    private String regno ;
    
    @Column(name ="fullname")
    @NotNull
    private String fullname ;

    @Column(name = "email" , unique = true)
    @NotNull
    private String email ;

    @Column(name = "mobileno" )
    @NotNull
    @Length(max = 10 , min = 10)
    private String mobileno;
    
    @Column(name= "note")
    private String note;

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
    @JoinColumn(name = "customerstatus_id" , referencedColumnName = "id")
    private CustomerStatus customerstatus_id ;
    
    }

