package lk.brightbs.privilege.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //persistant entity file ekk bawata convert kirima
@Table(name = "role") //table eka map wimata
@Data //getters setters sedimata
@NoArgsConstructor // default constructer
@AllArgsConstructor //all argument constructer

public class Role {
    @Id //primary key ekak bawa dekwimata
    @GeneratedValue(strategy = GenerationType.IDENTITY) //id eka auoto increment wimata
    private Integer id;

    private String name;
}
