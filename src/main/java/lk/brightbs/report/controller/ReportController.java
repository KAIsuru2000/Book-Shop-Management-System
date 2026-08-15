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

import lk.brightbs.employee.entity.Employee;
import lk.brightbs.report.dao.RepoortDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.brightbs.invoice.dao.InvoiceDao;
import lk.brightbs.invoice.entity.Invoice;
import lk.brightbs.grn.dao.GRNDao; // grn dao class eka import karagannawa
import lk.brightbs.grn.entity.GRN; // grn entity class eka import karagannawa

// Report serve kirima sadaha controller class eka hadanawa
@RestController
public class ReportController {

    @Autowired
//    report dao wala instent ekak sada genima
    private RepoortDao repoortDao;

    // InvoiceDao eka autowire karagannawa data gannawa sadaha
    @Autowired
    private InvoiceDao invoiceDao;

    // GRNDao eka autowire karagannawa expense data laba ganimata
    @Autowired // Auto dependency injection sidu kirima
    private GRNDao grnDao; // grnDao instance eka declare kirima

    @GetMapping(value = "/report/getemployeebydesignation" , params = {"designationid"})
    public List<Employee> getEmployeeDataByDesignation(@RequestParam("designationid") Integer designationid){
        return repoortDao.getEmployeeByDesignation(designationid);
    }

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

    // PNL report UI page eka load karana mapping eka
    @GetMapping("/pnlreport") // browser eken /pnlreport request eka awoth meya run wenawa
    public ModelAndView getPnlReportUI() { // ModelAndView object ekak return karana getPnlReportUI function eka
        // Log wuna user ge nama security context eken gannawa
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Authentication object eka SecurityContextHolder eken laba gannawa
        
        ModelAndView view = new ModelAndView(); // Aluth ModelAndView instance ekak hadagannawa
        // pnlreport.html file eka render kirimata target name ekak lesa set karanawa
        view.setViewName("pnlreport.html"); // view name eka pnlreport.html widiyata set karanawa
        // loggedusername kiyana name ekata logged user ge username value eka set karanawa html template ekata pass karanna
        view.addObject("loggedusername", auth.getName()); // login una user ge nama page ekata add karanawa
        // Page eke load wena wita browser title eka set karanawa
        view.addObject("title", "Profit & Loss (PNL) Report | Bright Book Shop"); // page title eka add karanawa
        
        return view; // set karapu model and view eka return karanawa
    }

    // Loss and Profit (PNL) report data gena ganima sadaha REST API endpoint eka
    @GetMapping(value = "/pnlreport/data", produces = "application/json") // GET request mapping eka json output labena se set karanawa
    public List<PnlReportItem> getPnlReportData( // data pass kirima sandaha getPnlReportData method eka hadanawa
            @RequestParam("startdate") String startDateStr, // startdate parameter eka string dynamic pass karanawa
            @RequestParam("enddate") String endDateStr, // enddate parameter eka string dynamic pass karanawa
            @RequestParam("type") String type) { // type parameter eka weekly/monthly dynamic pass karanawa

        try { // Exception hadenna puluwan nisa try block ekak use karanawa
            // Start date eka local date ekak lesa parse karagannawa
            LocalDate startDate = LocalDate.parse(startDateStr); // start date eka parse karanawa
            // End date eka local date ekak lesa parse karagannawa
            LocalDate endDate = LocalDate.parse(endDateStr); // end date eka parse karanawa

            // Date range eke patan ganna welawa set karanawa
            LocalDateTime startDateTime = startDate.atStartOfDay(); // local datetime ekak dynamic hadanawa patan ganna welawata
            // Date range eke awasan welawa set karanawa
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59); // local datetime ekak dynamic hadanawa awasan welawata

            // Database eken adala date range eke non-deleted invoice list eka gannawa
            List<Invoice> invoices = invoiceDao.getInvoicesForReport(startDateTime, endDateTime); // invoice details fetch karanawa
            // Database eken adala date range eke non-deleted GRN list eka gannawa
            List<GRN> grns = grnDao.getGrnsForReport(startDateTime, endDateTime); // grn details fetch karanawa

            // Dynamic grouping map ekak hadagannawa pnl data details group karanna (label matha)
            Map<String, PnlGroupedData> groupedData = new LinkedHashMap<>(); // Dynamic label key eken map structure ekak define karanawa

            if ("Weekly".equalsIgnoreCase(type)) { // select type eka weekly nam me block eka run wenawa
                // Week format eka gannawa sadaha WeekFields objects hadanawa
                TemporalField weekOfYear = WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear(); // local week numbers ganna format eka dynamic define karanawa
                
                // Invoice list eka loop karala week number matha group karanawa
                for (Invoice inv : invoices) { // invoices loop karanawa
                    int week = inv.getAddeddatetime().get(weekOfYear); // invoice eke week number eka gannawa
                    String label = "Week " + week; // table/chart display path label name eka construct karanawa
                    BigDecimal netAmount = inv.getNetamount(); // netamount value eka variable ekakata gannawa
                    
                    // map eke data key eka nathnam aluth grouped data object ekak dynamic register karanawa
                    // putIfAbsent - elesa group object ekak nettan aluthan hadanawa
                    groupedData.putIfAbsent(label, new PnlGroupedData()); // map data dynamic set karanawa
                    groupedData.get(label).addIncome(netAmount); // income amount eka label eke target values walata add karanawa
                }

                // GRN list eka loop karala week number matha expense group karanawa
                for (GRN g : grns) { // grn details loop karanawa
                    int week = g.getAddeddatetime().get(weekOfYear); // grn eke week number eka gannawa
                    String label = "Week " + week; // table/chart display path label name eka construct karanawa
                    BigDecimal netAmount = g.getNetamount(); // netamount value eka variable ekakata gannawa
                    
                    // map eke data key eka nathnam aluth grouped data object ekak dynamic register karanawa
                    groupedData.putIfAbsent(label, new PnlGroupedData()); // map data dynamic set karanawa
                    groupedData.get(label).addExpense(netAmount); // expense amount eka label eke target values walata add karanawa
                }
            } else if ("Monthly".equalsIgnoreCase(type)) { // select type eka monthly nam me block eka run wenawa
                // Invoice list eka loop karala Month description matha group karanawa
                for (Invoice inv : invoices) { // invoices loop karanawa
                    LocalDateTime dt = inv.getAddeddatetime(); // added date time eka gannawa
                    // Month eke number eka saha English nama mix karala label eka hadanawa
                    String label = dt.getMonthValue() + " - " + dt.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH); // month label name eka dynamically format karanawa
                    BigDecimal netAmount = inv.getNetamount(); // netamount value eka variable ekakata gannawa

                    // map eke data key eka nathnam aluth grouped data object ekak dynamic register karanawa
                    groupedData.putIfAbsent(label, new PnlGroupedData()); // map data dynamic set karanawa
                    groupedData.get(label).addIncome(netAmount); // income amount eka label eke target values walata add karanawa
                }

                // GRN list eka loop karala Month description matha group karanawa
                for (GRN g : grns) { // grn details loop karanawa
                    LocalDateTime dt = g.getAddeddatetime(); // added date time eka gannawa
                    // Month eke number eka saha English nama mix karala label eka hadanawa
                    String label = dt.getMonthValue() + " - " + dt.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH); // month label name eka dynamically format karanawa
                    BigDecimal netAmount = g.getNetamount(); // netamount value eka variable ekakata gannawa

                    // map eke data key eka nathnam aluth grouped data object ekak dynamic register karanawa
                    groupedData.putIfAbsent(label, new PnlGroupedData()); // map data dynamic set karanawa
                    groupedData.get(label).addExpense(netAmount); // expense amount eka label eke target values walata add karanawa
                }
            }

            // Client ta yawanna objects array list ekak hadagannawa
            List<PnlReportItem> result = new ArrayList<>(); // return JSON structure object list variable eka hadanawa
            for (Map.Entry<String, PnlGroupedData> entry : groupedData.entrySet()) { // map objects entry list set loop karanawa
                BigDecimal inc = entry.getValue().getIncome(); // total income eka entry object eken illa gannawa
                BigDecimal exp = entry.getValue().getExpense(); // total expense eka entry object eken illa gannawa
                BigDecimal profit = inc.subtract(exp); // profit/loss value eka calculate karagannawa income - expense widiyata ekathu karanna nm + .add()
                result.add(new PnlReportItem(entry.getKey(), inc, exp, profit)); // result set data record ekak dynamic collection ekata save karanawa
            }

            return result; // map format dynamic return karanawa client browser side ekata
        } catch (Exception e) { // exception handler logs error
            // Error ekak thibe nam empty list return karanawa
            return new ArrayList<>(); // errors occur empty collections return details map
        }
    }

    // Dynamic map elements data properties structures build helper class structure
    // database ekaka table ekak waga entity ekak dummy ekak lesa sadanawa
    public static class PnlGroupedData { // grouping helpers details class
        private BigDecimal income = BigDecimal.ZERO; // default income value 0
        private BigDecimal expense = BigDecimal.ZERO; // default expense value 0

        public void addIncome(BigDecimal amount) { // addIncome function eka declare kirima
            if (amount != null) { // amount null newe nam
                this.income = this.income.add(amount); // income ekata ekathu karanawa
            }
        }

        public void addExpense(BigDecimal amount) { // addExpense function eka declare kirima
            if (amount != null) { // amount null newe nam
                this.expense = this.expense.add(amount); // expense ekata ekathu karanawa
            }
        }

        public BigDecimal getIncome() { // getIncome function eka declare kirima
            return income; // income variable return karanawa
        }

        public BigDecimal getExpense() { // getExpense function eka declare kirima
            return expense; // expense variable return karanawa
        }
    }

    // PNL Report item output details mapping objects data class templates
    // database ekaka table ekak waga entity ekak dummy ekak lesa sadanawa
    public static class PnlReportItem { // PnlReportItem representation structure class eka
        private String label; // label parameter eka
        private BigDecimal income; // income parameter eka
        private BigDecimal expense; // expense parameter eka
        private BigDecimal profit; // profit parameter eka

        public PnlReportItem(String label, BigDecimal income, BigDecimal expense, BigDecimal profit) { // constructor initialization fields map
            this.label = label; // label setting
            this.income = income; // income setting
            this.expense = expense; // expense setting
            this.profit = profit; // profit setting
        }

        public String getLabel() { // getLabel function eka declare kirima
            return label; // label variable return karanawa
        }

        public void setLabel(String label) { // setLabel function eka declare kirima
            this.label = label; // value assignment
        }

        public BigDecimal getIncome() { // getIncome function eka declare kirima
            return income; // income variable return karanawa
        }

        public void setIncome(BigDecimal income) { // setIncome function eka declare kirima
            this.income = income; // value assignment
        }

        public BigDecimal getExpense() { // getExpense function eka declare kirima
            return expense; // expense variable return karanawa
        }

        public void setExpense(BigDecimal expense) { // setExpense function eka declare kirima
            this.expense = expense; // value assignment
        }

        public BigDecimal getProfit() { // getProfit function eka declare kirima
            return profit; // profit variable return karanawa
        }

        public void setProfit(BigDecimal profit) { // setProfit function eka declare kirima
            this.profit = profit; // value assignment
        }
    }

    // Trending items report page eka load karana mapping eka
    @GetMapping("/trendingitemsreport") // browser eken /trendingitemsreport request eka awoth meya run wenawa
    public ModelAndView getTrendingItemsReportUI() { // ModelAndView object ekak return karana getTrendingItemsReportUI function eka
        // Log wuna user ge nama security context eken gannawa
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Authentication object eka SecurityContextHolder eken laba gannawa
        
        ModelAndView view = new ModelAndView(); // Aluth ModelAndView instance ekak hadagannawa
        // trendingitemsreport.html file eka render kirimata target name ekak lesa set karanawa
        view.setViewName("trendingitemsreport.html"); // view name eka trendingitemsreport.html widiyata set karanawa
        // loggedusername kiyana name ekata logged user ge username value eka set karanawa html template ekata pass karanna
        view.addObject("loggedusername", auth.getName()); // login una user ge nama page ekata add karanawa
        // Page eke load wena wita browser title eka set karanawa
        view.addObject("title", "Most Trending Items Report | Bright Book Shop"); // page title eka add karanawa
        
        return view; // set karapu model and view eka return karanawa
    }

    // Most trending items report data gena ganima sadaha REST API endpoint eka
    @GetMapping(value = "/trendingitemsreport/data", produces = "application/json") // GET request mapping eka json output labena se set karanawa
    public List<TrendingItem> getTrendingItemsReportData( // data pass kirima sandaha getTrendingItemsReportData method eka hadanawa
            @RequestParam("startdate") String startDateStr, // startdate parameter eka string dynamic pass karanawa
            @RequestParam("enddate") String endDateStr, // enddate parameter eka string dynamic pass karanawa
            @RequestParam(value = "limit", required = false, defaultValue = "10") Integer limit) { // limit parameter eka dynamic pass karanawa, default value eka 10

        try { // Exception hadenna puluwan nisa try block ekak use karanawa
            // Start date eka local date ekak lesa parse karagannawa
            LocalDate startDate = LocalDate.parse(startDateStr); // start date eka parse karanawa
            // End date eka local date ekak lesa parse karagannawa
            LocalDate endDate = LocalDate.parse(endDateStr); // end date eka parse karanawa

            // Date range eke patan ganna welawa set karanawa
            LocalDateTime startDateTime = startDate.atStartOfDay(); // local datetime ekak dynamic hadanawa patan ganna welawata
            // Date range eke awasan welawa set karanawa
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59); // local datetime ekak dynamic hadanawa awasan welawata

            // Database eken trending items query eka run karala items details gannawa
            List<Object[]> queryResult = invoiceDao.getTrendingItems(startDateTime, endDateTime); // invoice details fetch karanawa
            // Client ta yawanna output list object class ekak hadagannawa
            List<TrendingItem> result = new ArrayList<>(); // JSON structure object list variable eka hadanawa

            // fetch wena limit eka count limit ekak widiyata select karagannawa
            int countLimit = (limit != null && limit > 0) ? limit : queryResult.size(); // limit limit check karanawa
            // Query results loop karala result array list ekata add karagannawa limit matha
            for (int i = 0; i < Math.min(queryResult.size(), countLimit); i++) { // loop sequence start path
                Object[] row = queryResult.get(i); // object row row select karagannawa
                String itemcode = (String) row[0]; // item code column cast karanawa string ekakata
                String itemname = (String) row[1]; // item name column cast karanawa string ekakata
                Long count = (Long) row[2]; // quantity sold column cast karanawa long value ekakata
                result.add(new TrendingItem(itemcode, itemname, count)); // output class model dynamic insert to collection
            }

            return result; // map format dynamic return karanawa client browser side ekata
        } catch (Exception e) { // exception handler logs error
            // Error ekak thibe nam empty list return karanawa
            return new ArrayList<>(); // errors occur empty collections return details map
        }
    }

    // JSON map outputs response parameters define loop helpers static structure template representation class
    public static class TrendingItem { // TrendingItem representation helper class structure
        private String itemcode; // item code property value
        private String itemname; // item name property value
        private Long count; // quantity count property value

        public TrendingItem(String itemcode, String itemname, Long count) { // constructors arguments mapping
            this.itemcode = itemcode; // code setting
            this.itemname = itemname; // name setting
            this.count = count; // count quantity setting
        }

        public String getItemcode() { // getItemcode function eka declare kirima
            return itemcode; // itemcode variable return karanawa
        }

        public void setItemcode(String itemcode) { // setItemcode function eka declare kirima
            this.itemcode = itemcode; // value assignment
        }

        public String getItemname() { // getItemname function eka declare kirima
            return itemname; // itemname variable return karanawa
        }

        public void setItemname(String itemname) { // setItemname function eka declare kirima
            this.itemname = itemname; // value assignment
        }

        public Long getCount() { // getCount function eka declare kirima
            return count; // count variable return karanawa
        }

        public void setCount(Long count) { // setCount function eka declare kirima
            this.count = count; // value assignment
        }
    }

    // Item wise profit report page eka load karana mapping eka
    @GetMapping("/itemwiseprofitreport") // browser eken /itemwiseprofitreport request eka awoth meya run wenawa
    public ModelAndView getItemWiseProfitReportUI() { // ModelAndView object ekak return karana getItemWiseProfitReportUI function eka
        // Log wuna user ge nama security context eken gannawa
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Authentication object eka SecurityContextHolder eken laba gannawa
        
        ModelAndView view = new ModelAndView(); // Aluth ModelAndView instance ekak hadagannawa
        // itemwiseprofitreport.html file eka render kirimata target name ekak lesa set karanawa
        view.setViewName("itemwiseprofitreport.html"); // view name eka itemwiseprofitreport.html widiyata set karanawa
        // loggedusername kiyana name ekata logged user ge username value eka set karanawa html template ekata pass karanna
        view.addObject("loggedusername", auth.getName()); // login una user ge nama page ekata add karanawa
        // Page eke load wena wita browser title eka set karanawa
        view.addObject("title", "Item-wise Profit Report | Bright Book Shop"); // page title eka add karanawa
        
        return view; // set karapu model and view eka return karanawa
    }

    // Item wise profit report data gena ganima sadaha REST API endpoint eka
    @GetMapping(value = "/itemwiseprofitreport/data", produces = "application/json") // GET request mapping eka json output labena se set karanawa
    public List<ItemWiseProfitItem> getItemWiseProfitReportData( // data pass kirima sandaha getItemWiseProfitReportData method eka hadanawa
            @RequestParam("startdate") String startDateStr, // startdate parameter eka string dynamic pass karanawa
            @RequestParam("enddate") String endDateStr) { // enddate parameter eka string dynamic pass karanawa

        try { // Exception hadenna puluwan nisa try block ekak use karanawa
            // Start date eka local date ekak lesa parse karagannawa
            LocalDate startDate = LocalDate.parse(startDateStr); // start date eka parse karanawa
            // End date eka local date ekak lesa parse karagannawa
            LocalDate endDate = LocalDate.parse(endDateStr); // end date eka parse karanawa

            // Date range eke patan ganna welawa set karanawa
            LocalDateTime startDateTime = startDate.atStartOfDay(); // local datetime ekak dynamic hadanawa patan ganna welawata
            // Date range eke awasan welawa set karanawa
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59); // local datetime ekak dynamic hadanawa awasan welawata

            // Database eken item wise profit query eka run karala items details gannawa
            List<Object[]> queryResult = invoiceDao.getItemWiseProfit(startDateTime, endDateTime); // database query query run karala list eka gannawa
            // Client ta yawanna output list object class ekak hadagannawa
            List<ItemWiseProfitItem> result = new ArrayList<>(); // JSON structure object list variable eka hadanawa

            // Query results loop karala result array list ekata add karagannawa
            for (Object[] row : queryResult) { // loop sequence start path
                String itemcode = (String) row[0]; // item code column cast karanawa string ekakata
                String itemname = (String) row[1]; // item name column cast karanawa string ekakata
                
                // Bigdecimal dynamic values safe conversion methods
                BigDecimal qty = new BigDecimal(row[2].toString()); // quantity sold column parse to bigdecimal
                BigDecimal sales = new BigDecimal(row[3].toString()); // total sales value parse to bigdecimal
                BigDecimal cost = new BigDecimal(row[4].toString()); // total cost value parse to bigdecimal
                BigDecimal profit = sales.subtract(cost); // profit = sales - cost calculate karagannawa

                result.add(new ItemWiseProfitItem(itemcode, itemname, qty, sales, cost, profit)); // output class model dynamic insert to collection
            }

            return result; // map format dynamic return karanawa client browser side ekata
        } catch (Exception e) { // exception handler logs error
            // Error ekak thibe nam empty list return karanawa
            return new ArrayList<>(); // errors occur empty collections return details map
        }
    }

    // JSON map outputs response parameters define loop helpers static structure template representation class
    public static class ItemWiseProfitItem { // ItemWiseProfitItem representation helper class structure
        private String itemcode; // item code property value
        private String itemname; // item name property value
        private BigDecimal qty; // quantity sold property value
        private BigDecimal sales; // total sales revenue property value
        private BigDecimal cost; // total purchase cost property value
        private BigDecimal profit; // calculated profit property value

        public ItemWiseProfitItem(String itemcode, String itemname, BigDecimal qty, BigDecimal sales, BigDecimal cost, BigDecimal profit) { // constructors arguments mapping
            this.itemcode = itemcode; // code setting
            this.itemname = itemname; // name setting
            this.qty = qty; // quantity setting
            this.sales = sales; // sales setting
            this.cost = cost; // cost setting
            this.profit = profit; // profit setting
        }

        public String getItemcode() { // getItemcode function eka declare kirima
            return itemcode; // itemcode variable return karanawa
        }

        public void setItemcode(String itemcode) { // setItemcode function eka declare kirima
            this.itemcode = itemcode; // value assignment
        }

        public String getItemname() { // getItemname function eka declare kirima
            return itemname; // itemname variable return karanawa
        }

        public void setItemname(String itemname) { // setItemname function eka declare kirima
            this.itemname = itemname; // value assignment
        }

        public BigDecimal getQty() { // getQty function eka declare kirima
            return qty; // qty variable return karanawa
        }

        public void setQty(BigDecimal qty) { // setQty function eka declare kirima
            this.qty = qty; // value assignment
        }

        public BigDecimal getSales() { // getSales function eka declare kirima
            return sales; // sales variable return karanawa
        }

        public void setSales(BigDecimal sales) { // setSales function eka declare kirima
            this.sales = sales; // value assignment
        }

        public BigDecimal getCost() { // getCost function eka declare kirima
            return cost; // cost variable return karanawa
        }

        public void setCost(BigDecimal cost) { // setCost function eka declare kirima
            this.cost = cost; // value assignment
        }

        public BigDecimal getProfit() { // getProfit function eka declare kirima
            return profit; // profit variable return karanawa
        }

        public void setProfit(BigDecimal profit) { // setProfit function eka declare kirima
            this.profit = profit; // value assignment
        }
    }
}
