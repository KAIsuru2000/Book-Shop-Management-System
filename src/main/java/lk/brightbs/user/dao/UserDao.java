package lk.brightbs.user.dao;
import java.util.List;

import lk.brightbs.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserDao extends JpaRepository<User, Integer> {

    @Query(value = "select u from User u where u.username=?1")
    User getByUsername(String username);

    //log una userta adala record eka nowennath ona(<>) Adminta asamana wennath ona order wennath ona
    // <> = asamana
    @Query(value = "select u from User u where u.username <> ?1 and u.username <> 'Admin' order by u.id desc")
    // list ekak ya yuthuya
    //log una user name eka parameter ekak lesa gena atha
    List<User> findAll(String username);
    
}
