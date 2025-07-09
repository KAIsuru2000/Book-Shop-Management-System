package lk.brightbs.addPriceList.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "addpriceliststatus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddPricelistStatus {
   
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)    
private Integer id;

private String name;


}
