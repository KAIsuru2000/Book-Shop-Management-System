package lk.brightbs.user.entity;
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
import lk.brightbs.privilege.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // entity file ekak nisa
@Table(name = "user") //DB wala laba dee athi table name eka laba deema
@Data

@NoArgsConstructor
@AllArgsConstructor
public class User {
    // DB level auto increment nisa notnull nodai
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @NotNull
    private String password;


    @NotNull
    @Column(name="username" , unique = true)
    private String username;


    @NotNull
    @Column(name="email" , unique = true)
    private String email;


    @NotNull
    private Boolean status;


    @NotNull
    private LocalDateTime added_datetime;


    private LocalDateTime updatedatetime;


    private LocalDateTime deletedatetime;


    private String note;


    private String photopath;

   

    //user many employee one
    //foreing key eka one side eke sita many side ekata ei ema nisa many to one
    @ManyToOne(optional = true)  //meya optional
    //table name eka(employee_id) foreing key wana table eke id eka(referencedColumnName=primary key)
    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    private Employee employee_id;

    //eka user kenakta role godai
    //user and role athara association ekak atha
    //ema association eka user eke sita handle karai
    //anith side eke data access karanna ona ewa remove karannath ona wenawa e sadaha cascade type MERGE damai 
    @ManyToMany(cascade = CascadeType.MERGE)
    //many to many sadaha join table ekak atha
    //join column eka lesa main eka gani
    //anith side eka(inverseJoinColumns)
    @JoinTable(name = "user_has_role" , joinColumns = @JoinColumn(name="user_id") , 
    inverseJoinColumns = @JoinColumn(name="role_id"))
    private Set<Role> roles;
}
