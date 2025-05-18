package lk.brightbs.privilege.entity;
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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name="privillage")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Privilege {
    @Id //primary key nisa
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment nisa
    private Integer id;

    @NotNull
    private Boolean sel;
    @NotNull
    private Boolean inst;
    @NotNull
    private Boolean upd;
    @NotNull
    private Boolean del;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @NotNull
    private Integer addeduserid;

    private LocalDateTime updatedatetime;
    private Integer updateuserid;
    private LocalDateTime deletedatetime;
    private Integer deleteuserid;

    //frean key
    @ManyToOne
    @JoinColumn(name ="role_id" , referencedColumnName = "id")
    //forean key lesa another table ekaka record ekak ana nisa type eka Role
    private Role role_id;

    //frean key
    @ManyToOne
    @JoinColumn(name ="module_id" , referencedColumnName = "id")
    //forean key lesa another table ekaka record ekak ana nisa type eka Module
    private Module module_id;
}
