package lk.brightbs.item.dao;

// import lk.brightbs.item.entity.Brand;
import lk.brightbs.item.entity.Item;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ItemDao extends JpaRepository<Item, Integer> {

    // list Item type eka gena findall method eka overide kirima >> @query dama
    // query eka liwima
    // id desc magin order kara selected data laba ganimata sidu wei >> e sadaha
    // normal query eka select all wenuwata column tika liyai
    // mehidi class widihata yana nisa class waladi "i" thiyenna all kena >>
    // selected tikak ganimata nam new kiyala item wala constructer call kala
    // yuthuya >> ehi "i" yanu item object eka emagin access karai
    // in pasu meyata galapena constructer ekak item entity eka thula define kala
    // yuthuya

    // @SuppressWarnings("null")
    // @Query("select new Item(i.id , i.itemcode , i.itemname , i.purchaseprice ,
    // i.profitrate , i.salesprice , i.roq , i.itemstatus_id) from Item i order by
    // i.id desc")
    // List<Item> findAll();

    // querry for genarate ext item number
    // value ekakwath nethi witaka wuwath number eka genarate wimata coalesce yodai
    // >> emagin default value ekak mulin laba diya heka
    @Query(value = "SELECT coalesce(concat('I' , lpad(substring(max(i.itemcode),2) +1 , 5 , 0)) , 'I00001')  FROM brightbookshop.item as i;", nativeQuery = true)
    String getNextItemNo();

    @Query("select i from Item i where i.itemname=?1")
    Item getByItemName(String itemname);

    @Query("select i from Item i where i.id not in (select PRI.item_id.id from PriceListRequestHasItem PRI where PRI.pricelistrequest_id.id=?1)")
    public List<Item> getListWithoutRequest(Integer pricelistrequestid);

    @Query("select i from Item i where i.brand_id.id in (select shb.brand_id.id from SupplierHasBrand shb where shb.supplier_id.id=?1)")
    List<Item> getListBySupplier(Integer supplierid);

    // brand id eka magin items filter kirimata meya yoda gani
    // brand_id object eke athi id eka yoda gata yuthu nisa i.brand_id.id yoda query
    // eka liyai
    @Query("select i from Item i where i.brand_id.id=?1")
    public List<Item> getLisByBrand(Integer brandid);

}
