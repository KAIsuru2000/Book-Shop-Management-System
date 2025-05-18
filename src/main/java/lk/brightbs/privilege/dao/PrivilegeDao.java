package lk.brightbs.privilege.dao;

import lk.brightbs.privilege.entity.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PrivilegeDao extends JpaRepository<Privilege, Integer> {

    // ?1 - first parameter , ?2 - second parameter
    @Query(value = "select p from Privilege p where p.role_id.id =?1 and p.module_id.id=?2")
    Privilege getPrivilegeByRoleModule(Integer roleid, Integer moduleid);

    //project recording D-21 part-2 time-2.20
    //user table eken username ekata adala user id eka ganima
        //ema user id ekata adala roles id tika user has role table eken ganima
        //ema role id eka privilege table wala thibeda balima
        //ema thibena role walata adala module id tika module table eken name walata adalawa genwa gatha yuthuya.
        //elesa genwa gena privilege tika ganima
        //eka user kenekta many role thibiya haka
        @Query(value ="SELECT bit_or(p.sel) as sel, bit_or(p.inst) as inst , bit_or(p.upd) as upd , bit_or(p.del) as del FROM brightbookshop.privillage as p where p.module_id in (select m.id from brightbookshop.module as m where m.name=?2) and p.role_id in (select uhr.role_id from brightbookshop.user_has_role as uhr where uhr.user_id in(select u.id from brightbookshop.user as u where u.username=?1));" , nativeQuery = true)
        String getUserPrivilegeByUserModule(String username , String modulename);


}
