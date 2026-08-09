package lk.brightbs.supplierPayment.entity; // Me package eka thula thama supplier payment entity eka thiyenne

import java.math.BigDecimal; // Decimal ganithmayak karanna use karana class eka
import java.time.LocalDate; // Dinaya thaba gannawa (e.g. Cheque Date)
import java.time.LocalDateTime; // Dinaya saha welawa thaba gannawa

import jakarta.persistence.Column; // Database table eke columns map karanna
import jakarta.persistence.Entity; // Persistence entity class ekak widiyata thiyagන්න
import jakarta.persistence.GeneratedValue; // Auto increment karanna
import jakarta.persistence.GenerationType; // Auto increment strategy define karanna
import jakarta.persistence.Id; // Primary key eka identify karanna
import jakarta.persistence.JoinColumn; // Foreign key eka map karanna
import jakarta.persistence.ManyToOne; // Many to one link eka hadanna
import jakarta.persistence.Table; // Database table name map karanna
import jakarta.validation.constraints.NotNull; // Field eka not null wenna rule eka danna
import com.fasterxml.jackson.annotation.JsonProperty; // JSON mapping waladi property name align karanna
import lk.brightbs.supplier.entity.Supplier; // Supplier entity eka use karanna import karagannawa
import lk.brightbs.grn.entity.GRN; // GRN entity eka use karanna import karagannawa
import lombok.AllArgsConstructor; // Default construction with all args build karanna lombok annotation
import lombok.Data; // Getter, setter saha tostring auto build karana lombok annotation
import lombok.NoArgsConstructor; // Default construction with no args build karanna lombok annotation

@Entity // Database entity ekak widiyata map karanawa
@Table(name = "supplierpayment") // Database eke supplierpayment table ekata map karanawa
@Data // Class eke getter, setter, tostring auto generate karanawa
@NoArgsConstructor // Empty constructor eka auto create karanawa
@AllArgsConstructor // All fields constructor eka auto create karanawa
public class SupplierPayment { // SupplierPayment main class eka patan gannawa

    @Id // Primary key ekak widiyata id field eka set karanawa
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto increment set karanawa database eke auto increment widiyata run wenna
    private Integer id ; // id variable eka database auto-generated integer id ekak thaba ganna

    @Column(name = "billno" , unique = true) // Database column name eka set karanawa billno saha eya unique wenna ona
    @NotNull // Me field eka blank/null thiyanna baha
    private String billno ; // Auto generated bill number eka thiyaganna field eka

    @Column(name = "transferid" , unique = true) // Bank transfer details thiyena column mapping check karala unique wenna ona
    private String transferid ; // Bank transfer check id eka set karaganna field eka

    @Column(name = "checkno" , unique = true) // Cheque number details unique checks thiyagena database map karanawa
    private String checkno ; // Cheque payments waladi cheque number record karanna use karana field eka

    @Column(name = "referanceno" , unique = true) // Reference number eka map karanawa database table eke referanceno check eka matha
    private String referanceno ; // Payment referance number eka record karana field eka

    @Column(name = "checkdate") // Cheque date column details mapping checks
    private LocalDate checkdate ; // Cheque eka maru karanna thiyena dinaya thaba gannawa

    @Column(name ="totaldueamount") // Total pay details database columns mappings
    @NotNull // Total amount eka null/blank wenna baha
    private BigDecimal totaldueamount ; // GRN eke mulu mudala (total netamount) thiyaganna field eka

    @Column(name ="paidamount") // Paid amount details database table mappings
    @NotNull // Paid amount not null check status
    private BigDecimal paidamount ; // Gevana mudala (paid amount) thiyaganna field eka

    @Column(name ="Prepaidamount") // Prepaid amount details map column checks
    @NotNull // Prepaid amount null wenna baha default 0.00 sets
    private BigDecimal Prepaidamount ; // Advanced/prepaid mudalak thiyenawa nam record karana field eka

    @Column(name ="balanceamount") // Balance amount maps checks database column
    @NotNull // Balance amount not null check status
    private BigDecimal balanceamount ; // Payment balance amount details thiyaganna field eka

    @Column(name = "note") // Note properties database table column
    private String note ; // Payment details gana small note ekak liyaganna field eka

    @NotNull // Payment method selection eka not null wenna ona
    @Column(name = "paymentmethod") // Payment method columns mappings
    private String paymentmethod ; // Gevanna use karapu payment kramaya (Cash, Cheque, Bank Transfer) thaba ganna field eka

    @Column(name = "cardtype") // Card type maps database column
    private String cardtype ; // Card type details thiyaganna field eka (VISA, MASTER, AMEX)

    @Column(name = "transferdatetime") // Bank transfer datetime maps column
    private LocalDateTime transferdatetime; // Bank transfer kala welawa record karaganna

    @Column(name = "addeddatetime") // Record eka dapu datetime map database column
    @NotNull // Data entry dapu welawa not null wenna ona
    private LocalDateTime addeddatetime; // Payment eka add kala dinaya saha welawa record karana field eka

    private LocalDateTime updatedatetime; // Update kala dinaya saha welawa thaba ganna field eka
   
    private LocalDateTime deletedatetime; // Cancel/Delete kala dinaya saha welawa thaba ganna field eka

    @NotNull // Added user ID record checks
    private Integer addeduserid; // Record eka dapu user id eka check karagන්න field eka

    private Integer updateuserid; // Update karapu user id eka map karaganna field eka

    private Integer deleteuserid; // Cancel/delete details verify map user id field eka
   
    @JsonProperty("suplierpaymentstatus_id") // Front-end eken status id property name align karanna Jackson annotation
    @ManyToOne // Eka payment status ekakata payment godak thiyenna puluwan nisa many-to-one relashionship
    @JoinColumn(name = "suplierpaymentstatus_id" , referencedColumnName = "id") // Foreign key alignment
    private SupplierPaymentStatus suplierpaymentstatus_id ; // Status reference object entity property eka
    
    @JsonProperty("supplier_id") // Front-end eken supplier id properties links sets
    @ManyToOne // Eka supplier ta payment godak karanna puluwan nisa many-to-one relashionship
    @JoinColumn(name = "supplier_id" , referencedColumnName = "id") // Foreign key mapping
    private Supplier supplier_id ; // Supplier reference object details variable eka

    @JsonProperty("grn_id") // Front-end eken grn object details link align settings
    @ManyToOne // Eka GRN record ekakata adala block many to one payment details links
    @JoinColumn(name = "grn_id" , referencedColumnName = "id") // Foreign key mappings database level checks
    private GRN grn_id ; // Associated GRN object reference link details variables
}

