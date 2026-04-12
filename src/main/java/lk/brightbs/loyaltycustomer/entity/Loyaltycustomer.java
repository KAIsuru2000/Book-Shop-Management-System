package lk.brightbs.loyaltycustomer.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "loyaltycustomer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loyaltycustomer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "cardname", unique = true)
    @NotNull
    private String cardname;

    @Column(name = "startpoint")
    @NotNull
    private Integer startpoint;

    @Column(name = "endpoint")
    @NotNull
    private Integer endpoint;

    @Column(name = "pointincreaseamount")
    @NotNull
    private BigDecimal pointincreaseamount;

    @Column(name = "discount")
    @NotNull
    private BigDecimal discount;
}
