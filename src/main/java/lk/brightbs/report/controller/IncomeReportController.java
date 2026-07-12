package lk.brightbs.report.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.time.temporal.TemporalField;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.invoice.dao.InvoiceDao;
import lk.brightbs.invoice.entity.Invoice;

// Report serve kirima sadaha controller class eka hadanawa
@RestController
public class IncomeReportController {

    // InvoiceDao eka autowire karagannawa data gannawa sadaha
    @Autowired
    private InvoiceDao invoiceDao;

    // Request mapping eka income report ui page eka serve kirima sadaha
    @GetMapping("/incomereport")
    public ModelAndView getIncomeReportUI() {
        // Log wunu user ge name eka security context eken gannawa
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        ModelAndView view = new ModelAndView();
        // incomereport.html page eka render kirima sadaha set karanawa
        view.setViewName("incomereport.html");
        // Log wunu user name eka template ekata pass karanawa
        view.addObject("loggedusername", auth.getName());
        // Page eke title eka set karanawa
        view.addObject("title", "Income Report | Bright Book Shop");
        
        return view;
    }

    // Income report data gena ganima sadaha REST API endpoint eka
    @GetMapping(value = "/incomereport/data", produces = "application/json")
    public List<ReportItem> getIncomeReportData(
            @RequestParam("startdate") String startDateStr,
            @RequestParam("enddate") String endDateStr,
            @RequestParam("type") String type) {

        try {
            // Start date eka local date ekak lesa parse karagannawa
            LocalDate startDate = LocalDate.parse(startDateStr);
            // End date eka local date ekak lesa parse karagannawa
            LocalDate endDate = LocalDate.parse(endDateStr);

            // Date range eke patan ganna welawa set karanawa
            LocalDateTime startDateTime = startDate.atStartOfDay();
            // Date range eke awasan welawa set karanawa
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

            // Database eken adala date range eke invoice list eka gannawa
            List<Invoice> invoices = invoiceDao.getInvoicesForReport(startDateTime, endDateTime);

            // Dynamic grouping map ekak hadagannawa (label eka saha amount eka matha)
            Map<String, BigDecimal> groupedData = new LinkedHashMap<>();

            if ("Weekly".equalsIgnoreCase(type)) {
                // Week format eka gannawa sadaha WeekFields objects hadanawa
                TemporalField weekOfYear = WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear();
                
                // Invoice list eka loop karala week number matha group karanawa
                for (Invoice inv : invoices) {
                    int week = inv.getAddeddatetime().get(weekOfYear);
                    String label = String.valueOf(week);
                    BigDecimal netAmount = inv.getNetamount();
                    
                    // Amount eka map ekata ekathu karanawa
                    groupedData.put(label, groupedData.getOrDefault(label, BigDecimal.ZERO).add(netAmount));
                }
            } else if ("Monthly".equalsIgnoreCase(type)) {
                // Invoice list eka loop karala Month description matha group karanawa
                for (Invoice inv : invoices) {
                    LocalDateTime dt = inv.getAddeddatetime();
                    // Month eke number eka saha English nama mix karala label eka hadanawa
                    String label = dt.getMonthValue() + " - " + dt.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
                    BigDecimal netAmount = inv.getNetamount();

                    // Amount eka map ekata ekathu karanawa
                    groupedData.put(label, groupedData.getOrDefault(label, BigDecimal.ZERO).add(netAmount));
                }
            }

            // Client ta yawanna objects array list ekak hadagannawa
            List<ReportItem> result = new ArrayList<>();
            for (Map.Entry<String, BigDecimal> entry : groupedData.entrySet()) {
                result.add(new ReportItem(entry.getKey(), entry.getValue()));
            }

            return result;
        } catch (Exception e) {
            // Error ekak thibe nam empty list return karanawa
            return new ArrayList<>();
        }
    }

    // Response object structure definition eka
    public static class ReportItem {
        private String label;
        private BigDecimal amount;

        public ReportItem(String label, BigDecimal amount) {
            this.label = label;
            this.amount = amount;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }
}
