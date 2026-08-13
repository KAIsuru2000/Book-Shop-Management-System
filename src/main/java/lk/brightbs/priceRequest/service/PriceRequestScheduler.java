package lk.brightbs.priceRequest.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import lk.brightbs.priceRequest.dao.PriceRequestDao;
import lk.brightbs.priceRequest.dao.PriceRequestStatusDao;
import lk.brightbs.priceRequest.entity.PriceRequest;
import lk.brightbs.priceRequest.entity.PriceRequestStatus;

// Mema class eka service layer eke scheduler class ekak lesa hada gani
@Service
public class PriceRequestScheduler {

    // PriceRequestDao object eka inject karagani (database access kirima sadaha)
    @Autowired
    private PriceRequestDao priceRequestDao;

    // PriceRequestStatusDao object eka inject karagani (status details laba ganima sadaha)
    @Autowired
    private PriceRequestStatusDao priceRequestStatusDao;

    // Mema method eka hamadama re 12:00 ta auto run wena lesa schedule karatha (sec min hour day month weekday)
    @Scheduled(cron = "0 0 0 * * *")
    public void autoExpirePriceRequests() {
        // System console eke print karanna task eka start una bawa
        System.out.println("Running scheduled task to auto-expire price requests...");
        
        // Database eken "Expired" kiyana status object eka soya gani
        PriceRequestStatus expiredStatus = priceRequestStatusDao.findByName("Expired");
        // Ema status eka database eke nathnam, aluthen hadala save karagani (safe guard ekak lesa)
        if (expiredStatus == null) {
            // PriceRequestStatus class eken aluth instance ekak hadai
            expiredStatus = new PriceRequestStatus();
            // Ehi name eka "Expired" lesa set karai
            expiredStatus.setName("Expired");
            // Aluth status eka database eke save karagani
            expiredStatus = priceRequestStatusDao.save(expiredStatus);
        }

        // Ada dinayen dawas 7k pasupasata gani (required date eka meeta wada parani nam dawas 7k delayed we)
        LocalDate targetDate = LocalDate.now().minusDays(7);
        
        // requireddate eka targetDate ekata wada adu ho samana active (Pending, Partially Added) price requests database eken laba gani
        List<PriceRequest> delayedRequests = priceRequestDao.findActivePriceRequestsBeforeDate(targetDate);
        
        // Ema list eka empty nathnam, ehi athi hamama request ekakma loop karai
        if (delayedRequests != null && !delayedRequests.isEmpty()) {
            for (PriceRequest priceRequest : delayedRequests) {
                // Request eke status eka "Expired" status ekata wenas karai
                priceRequest.setPricelistrequeststatus_id(expiredStatus);
                // Update karapu date time eka laba dei
                priceRequest.setUpdatedatetime(LocalDateTime.now());
                // Update karapu user ge id eka 1 (Admin/System user) lesa set karai
                priceRequest.setUpdateuserid(1);
                // Wenas karapu details database eke save karai
                priceRequestDao.save(priceRequest);
                // Console eke print karai request no eka samaga expire kala bawa
                System.out.println("Price Request " + priceRequest.getRequestno() + " has been set to Expired.");
            }
        }
    }

    // Application eka start wena wita aniwaryayenma meya eka warak run wiya yuthuya (event listener yoda gani)
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        // Auto expire karana method eka call karai
        autoExpirePriceRequests();
    }
}
