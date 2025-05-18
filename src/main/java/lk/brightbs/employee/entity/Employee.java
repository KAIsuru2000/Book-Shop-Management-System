package lk.brightbs.employee.entity;

import java.time.LocalDate;
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
    @Table(name = "employee") // for map table name
    @Data // getter , setter tostring

    @NoArgsConstructor
    @AllArgsConstructor
    public class Employee {

    @Id //pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id ;

    @Column(name = "employeenumber" , unique = true)
    @NotNull // not null
    // @Length(max = 8 , min = 8)
    private String employeenumber ;
    
    @Column(name ="fullname")
    @NotNull
    private String fullname ;

    @Column(name = "nic" , unique = true)
    @NotNull
    // @Length(max = 12 , min = 10)
    private String nic ;

    @Column(name = "callingname")
    @NotNull
    private String callingname ;

    @Column(name = "email" , unique = true)
    @NotNull
    private String email ;

    @Column(name = "mobile" )
    @NotNull
    @Length(max = 10 , min = 10)
    private String mobile;

    @Column(name = "landno")
    @Length(max = 10 , min = 10)
    private String landno;

    @Column(name= "note")
    private String note;

    @Column(name = "dob")
    @NotNull
    private LocalDate dob;

    @Column(name = "civilstatus")
    @NotNull
    private String civilstatus;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name = "added_datetime")
    @NotNull
    private LocalDateTime added_datetime;

    @Column(name = "gender")
    @NotNull
    private String gender;

    @NotNull
    private Integer addeduserid;

    private LocalDateTime updatedatetime;
    private Integer updateuserid;
    private LocalDateTime deletedatetime;
    private Integer deleteuserid;

    @ManyToOne
    @JoinColumn(name = "employeestatus_id" , referencedColumnName = "id")
    private EmployeeStatus employeestatus_id ;
    
    @ManyToOne
    @JoinColumn(name = "designation_id" , referencedColumnName = "id")
    private Designation designation_id ; 

    }
