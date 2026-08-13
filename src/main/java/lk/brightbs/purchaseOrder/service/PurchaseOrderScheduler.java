package lk.brightbs.purchaseOrder.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import lk.brightbs.purchaseOrder.dao.PurchaseOrderDao;
import lk.brightbs.purchaseOrder.dao.PurchaseOrderStatusDao;
import lk.brightbs.purchaseOrder.entity.PurchaseOrder;
import lk.brightbs.purchaseOrder.entity.PurchaseOrderStatus;

// Mema class eka service layer eke purchase order scheduler class ekak lesa hada gani
@Service
public class PurchaseOrderScheduler {

    // PurchaseOrderDao object eka inject karagani (database access kirima sadaha)
    @Autowired
    private PurchaseOrderDao purchaseOrderDao;

    // PurchaseOrderStatusDao object eka inject karagani (status details laba ganima sadaha)
    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

    // Mema method eka hamadama re 12:00 ta auto run wena lesa schedule karatha (sec min hour day month weekday)
    @Scheduled(cron = "0 0 0 * * *")
    public void autoExpirePurchaseOrders() {
        // System console eke print karanna task eka start una bawa
        System.out.println("Running scheduled task to auto-expire purchase orders...");
        
        // Database eken "Expired" kiyana status object eka soya gani
        PurchaseOrderStatus expiredStatus = purchaseOrderStatusDao.findByName("Expired");
        // Ema status eka database eke nathnam, aluthen hadala save karagani (safe guard ekak lesa)
        if (expiredStatus == null) {
            // PurchaseOrderStatus class eken aluth instance ekak hadai
            expiredStatus = new PurchaseOrderStatus();
            // Ehi name eka "Expired" lesa set karai
            expiredStatus.setName("Expired");
            // Aluth status eka database eke save karagani
            expiredStatus = purchaseOrderStatusDao.save(expiredStatus);
        }

        // Ada dinayen dawas 7k pasupasata gani (required date eka meeta wada parani nam dawas 7k delayed we)
        LocalDate targetDate = LocalDate.now().minusDays(7);
        
        // requireddate eka targetDate ekata wada adu ho samana active (Pending, Partially Received) purchase orders database eken laba gani
        List<PurchaseOrder> delayedOrders = purchaseOrderDao.findActivePurchaseOrdersBeforeDate(targetDate);
        
        // Ema list eka empty nathnam, ehi athi hamama purchase order ekakma loop karai
        if (delayedOrders != null && !delayedOrders.isEmpty()) {
            for (PurchaseOrder purchaseOrder : delayedOrders) {
                // Purchase order status eka "Expired" status ekata wenas karai
                purchaseOrder.setPurchaserequeststatus_id(expiredStatus);
                // Update karapu date time eka laba dei
                purchaseOrder.setUpdatedatetime(LocalDateTime.now());
                // Update karapu user ge id eka 1 (Admin/System user) lesa set karai
                purchaseOrder.setUpdateuserid(1);
                // Wenas karapu details database eke save karai
                purchaseOrderDao.save(purchaseOrder);
                // Console eke print karai purchase order no eka samaga expire kala bawa
                System.out.println("Purchase Order " + purchaseOrder.getPurchaserequestno() + " has been set to Expired.");
            }
        }
    }

    // Application eka start wena wita aniwaryayenma meya eka warak run wiya yuthuya (event listener yoda gani)
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        // Auto expire karana method eka call karai
        autoExpirePurchaseOrders();
    }
}
