package lk.brightbs.item.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "attribute_option")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttributeOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    // CategoryAttribute ekka join karala eka many to one association ekak lesa hadanawa
    @ManyToOne
    // category_attribute_id foreign key eka dynamic attribute option ekata map karanawa
    @JoinColumn(name = "category_attribute_id", referencedColumnName = "id")
    // CategoryAttribute class type property eka hadanawa
    private CategoryAttribute category_attribute_id;

    // Brand entity ekka map karaganna many to one dynamic relation ekak hadanawa
    @ManyToOne
    // brand_id column eka foreign key widihata join karanawa
    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    // Brand class type brand_id property eka define karanawa
    private Brand brand_id;
}
