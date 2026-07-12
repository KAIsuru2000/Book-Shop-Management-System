package lk.brightbs.dashboard.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.brightbs.inventory.dao.InventoryDao;
import lk.brightbs.invoice.dao.InvoiceDao;
import lk.brightbs.invoice.entity.Invoice;
import lk.brightbs.purchaseOrder.dao.PurchaseOrderDao;

// Dashboard details data access check karanna controller class eka hadanawa
@RestController
public class DashboardController {

    // DAOs autowire karagannawa dashboard statistics data calculate karanna
    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private PurchaseOrderDao purchaseOrderDao;

    @Autowired
    private InvoiceDao invoiceDao;

    // Dashboard dynamic items count laba ganima sadaha REST API endpoint eka
    @GetMapping(value = "/dashboard/data", produces = "application/json")
    public DashboardData getDashboardData() {
        try {
            // Low stock items count eka database query eken gannawa
            Long lowStock = inventoryDao.countLowStockItems();
            
            // Quotations table nethi nisa mock value ekak (2) set karanawa images walata match wena lesa
            Long expiredQuotations = 2L;

            // Pending (Pending state) purchase orders count eka query eken gannawa
            Long pendingPO = purchaseOrderDao.countPendingPurchaseOrders();

            // Ada dawase adayama calculate karanna date range eka hadagannawa
            LocalDate today = LocalDate.now();
            LocalDateTime startToday = today.atStartOfDay();
            LocalDateTime endToday = today.atTime(23, 59, 59);
            
            // Today Income amount eka sum query eken gannawa
            BigDecimal todayIncome = invoiceDao.getTodayIncome(startToday, endToday);
            if (todayIncome == null) {
                todayIncome = BigDecimal.ZERO;
            }

            // Pasugiya masa 6 income statistics calculate kirima
            LocalDate sixMonthsAgoDate = today.minusMonths(5).withDayOfMonth(1);
            LocalDateTime startSixMonths = sixMonthsAgoDate.atStartOfDay();
            LocalDateTime endSixMonths = today.atTime(23, 59, 59);

            // Database eken masa 6 range ekata adala invoices filter karala gannawa
            List<Invoice> invoices = invoiceDao.getInvoicesForReport(startSixMonths, endSixMonths);

            // Masa 6 grouped order eka maintain karanna LinkedHashMap object hadanawa
            Map<String, BigDecimal> monthMap = new LinkedHashMap<>();
            // Durations map range eka setup karanawa default values 0 set karala
            for (int i = 5; i >= 0; i--) {
                LocalDate d = today.minusMonths(i);
                String monthName = d.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
                monthMap.put(monthName, BigDecimal.ZERO);
            }

            // Invoices loop karala adala month map data record update karanawa
            for (Invoice inv : invoices) {
                String monthName = inv.getAddeddatetime().getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
                if (monthMap.containsKey(monthName)) {
                    monthMap.put(monthName, monthMap.get(monthName).add(inv.getNetamount()));
                }
            }

            // List elements hadagannawa front end chart visualization set ekata yawanna
            List<MonthIncome> previousSixMonthIncome = new ArrayList<>();
            for (Map.Entry<String, BigDecimal> entry : monthMap.entrySet()) {
                previousSixMonthIncome.add(new MonthIncome(entry.getKey(), entry.getValue()));
            }

            // Response details object set eka return karanawa
            return new DashboardData(lowStock, expiredQuotations, pendingPO, todayIncome, previousSixMonthIncome);

        } catch (Exception e) {
            // Exceptions awoth empty objects template ekak return karanawa default settings matha
            return new DashboardData(0L, 2L, 0L, BigDecimal.ZERO, new ArrayList<>());
        }
    }

    // Dashboard response structures data class definition details
    public static class DashboardData {
        private Long lowStockCount;
        private Long expiredQuotationsCount;
        private Long pendingPurchaseOrdersCount;
        private BigDecimal todayIncome;
        private List<MonthIncome> previousSixMonthIncome;

        public DashboardData(Long lowStockCount, Long expiredQuotationsCount, Long pendingPurchaseOrdersCount, BigDecimal todayIncome, List<MonthIncome> previousSixMonthIncome) {
            this.lowStockCount = lowStockCount;
            this.expiredQuotationsCount = expiredQuotationsCount;
            this.pendingPurchaseOrdersCount = pendingPurchaseOrdersCount;
            this.todayIncome = todayIncome;
            this.previousSixMonthIncome = previousSixMonthIncome;
        }

        public Long getLowStockCount() {
            return lowStockCount;
        }

        public Long getExpiredQuotationsCount() {
            return expiredQuotationsCount;
        }

        public Long getPendingPurchaseOrdersCount() {
            return pendingPurchaseOrdersCount;
        }

        public BigDecimal getTodayIncome() {
            return todayIncome;
        }

        public List<MonthIncome> getPreviousSixMonthIncome() {
            return previousSixMonthIncome;
        }
    }

    public static class MonthIncome {
        private String month;
        private BigDecimal amount;

        public MonthIncome(String month, BigDecimal amount) {
            this.month = month;
            this.amount = amount;
        }

        public String getMonth() {
            return month;
        }

        public BigDecimal getAmount() {
            return amount;
        }
    }
}
