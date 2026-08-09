// package eka map karanawa
package lk.brightbs.item.entity;

// awashya persistence ha jackson serialization libraries import karagannawa
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore; // json recursion nathi karanna json ignore import karagannawa

// database table eka item_has_attribute_option ekka entity eka map karanawa
@Entity
@Table(name = "item_has_attribute_option")
@Data // getters, setters auto generate karagannawa
@NoArgsConstructor // default constructor eka auto genarate karanawa
@AllArgsConstructor // parameters thiyena constructor eka auto genarate karanawa
public class ItemHasAttributeOption {

    @Id // primary key eke kotasarak widihata dynamic select karanawa
    @ManyToOne // item table ekka many to one match association ekak map karanawa
    @JoinColumn(name = "item_id", referencedColumnName = "id") // item_id column eka match karanawa
    @JsonIgnore // item serialise weddi infinite loop recursion wenna nodi ignore karanawa
    private Item item_id; // Item type model variable eka define karanawa

    @Id // composite primary key eke anith kotasa set karanawa
    @ManyToOne // attribute option table ekka match association ekak hadanawa
    @JoinColumn(name = "attribute_option_id", referencedColumnName = "id") // attribute_option_id dynamic match column eka set karanawa
    private AttributeOption attribute_option_id; // AttributeOption object field type property eka build karanawa
}
