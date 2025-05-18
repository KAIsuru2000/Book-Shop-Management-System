package lk.brightbs.item.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "itemstatus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Itemstatus {
   
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)    
private Integer id;

private String name;
}





