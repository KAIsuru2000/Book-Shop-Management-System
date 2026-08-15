// Browser load event eka sidu weddi me function eka run wenawa tooltip enable karanna saha functions refresh karanna
window.addEventListener("load", () => {

    console.log("browser load Event"); // Console eke load event eka check karanna log ekak danawa

    // Tooltip elements run karanna bootstrap tooltips enable karagannawa
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Table refresh function eka call karala data reload karagannawa
    refreshSupplierPaymentTable();

    // Form data reset karala refresh karagන්න form refresh function eka call karanawa
    refreshSupplierPaymentForm();

    // Table body ekata click event listener ekak add karanawa cashier user logged wela inna wita buttons block hide karanna
    tableSupplierPaymentBody.addEventListener("click", () => {
        // Logged user role details check karagannawa servlet access magin
        let loggedUserObj = getServiceRequest("/loggeduser/role");
        let loggedUser = loggedUserObj.role; // Role variable eka set karagannawa

        if (loggedUser === "Cashier") { // Cashier nam pamanak me rules active karanawa
            let existingButtonRow = document.querySelector(".buttonrow"); // Table row selection eka capture karanawa
            if (existingButtonRow) {
                let btnUpdate = existingButtonRow.querySelector(".btnUpdate"); // Update edit action button select check
                let btnClear = existingButtonRow.querySelector(".btnClear"); // Delete action button select check
                if (btnUpdate) btnUpdate.style.display = "none"; // Cashier ta edit permission nathi nisa edit button hide karanawa
                if (btnClear) btnClear.style.display = "none"; // Cashier ta delete permission nathi nisa delete button hide karanawa
            }
        }
    });

})

// Database eken dynamic record set eka load karala table row data insert karana function eka
const refreshSupplierPaymentTable = () => {
    // Controller getMapping api service call karala database data collection dynamic list eka load karagannawa
    const supplierPayments = getServiceRequest("/supplierPayment/alldata");

    // Display list array define columns values binding variables
    displayPropertyList = [
        { dataType: 'string', propertyName: 'billno' }, // Bill Number row parameters
        { dataType: 'function', propertyName: generateSupplierName }, // Supplier details custom display functions maps
        { dataType: 'decimal', propertyName: 'totaldueamount' }, // Total amount details column
        { dataType: 'decimal', propertyName: 'paidamount' }, // Paid amount details column
        { dataType: 'decimal', propertyName: 'balanceamount' }, // Balance amount details column
        { dataType: 'function', propertyName: getSupplierPaymentStatus } // Payment status display check logic function maps
    ];

    // Main tables fill parameters setup check row refills delete and printable modals sets
    fillDataIntoTable(tableSupplierPaymentBody, supplierPayments, displayPropertyList, supplierPaymentFormRefill, supplierPaymentDelete, supplierPaymentView, "#offcanvasBottom");
    
    // Jquery datatable status active setups checks search pagination config
    $('#tableSupplierPayment').dataTable();
}

// Supplier object eken supplier details dynamic strings generate columns logic maps
const generateSupplierName = (dataob) => {
    // Check if supplier_id is directly available on the dataob (SupplierPayment)
    if (dataob.supplier_id != null) {
        return dataob.supplier_id.suppliername;
    }
    // GRN check checks and then nested supplier object references check verification
    if (dataob.grn_id != null && dataob.grn_id.purchaserequest_id != null && dataob.grn_id.purchaserequest_id.supplier_id != null) {
        return dataob.grn_id.purchaserequest_id.supplier_id.suppliername;
    }
    return "-"; // Empty string response checks
}

// Status column data table formats icons custom return checks
const getSupplierPaymentStatus = (dataob) => {
    if (dataob.suplierpaymentstatus_id != null) { // Status references check elements validation
        if (dataob.suplierpaymentstatus_id.name == "Completed" || dataob.suplierpaymentstatus_id.name == "Paid") {
            // Success details completed green tick icon returns
            return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;" data-bs-toggle="tooltip" title="Paid"></i>';
        } else if (dataob.suplierpaymentstatus_id.name == "Partially Paid") {
            // Partially Paid yellow indicator returns
            return '<i class="fa-solid fa-circle-half-stroke fa-beat fa-xl" style="color: #f3f702;" data-bs-toggle="tooltip" title="Partially Paid"></i>';
        } else {
            return '<p>' + dataob.suplierpaymentstatus_id.name + '</p>'; // Default simple status text outputs
        }
    }
    return "-"; // Null checking parameters return
}

// Form elements edit features disable maps parameters
const supplierPaymentFormRefill = (dataob, rowIndex) => { }
// Form delete functionality mappings disabled parameters checks
const supplierPaymentDelete = (dataob, rowIndex) => { }

// Offcanvas window display supplier payment details print setup configuration data bind function
const supplierPaymentView = (dataob, rowIndex) => {
    console.log("View Details", dataob, rowIndex); // View logs setup checks

    // Detail view labels ids tags text content assignments sets
    billNoView.innerText = dataob.billno; // Bill no mappings sets
    supplierNameView.innerText = generateSupplierName(dataob); // Supplier custom name calculations sets
    grnNoView.innerText = dataob.grn_id != null ? dataob.grn_id.grnno : "-"; // GRN index properties sets
    paymentMethodView.innerText = dataob.paymentmethod; // Payment options details sets
    totalDueAmountView.innerText = parseFloat(dataob.totaldueamount).toFixed(2); // Total due amount mappings sets
    paidAmountView.innerText = parseFloat(dataob.paidamount).toFixed(2); // Paid amount mappings sets
    balanceAmountView.innerText = parseFloat(dataob.balanceamount).toFixed(2); // Balance amount mappings sets
    statusView.innerText = dataob.suplierpaymentstatus_id != null ? dataob.suplierpaymentstatus_id.name : "-"; // Status details values checks
    noteView.innerText = dataob.note ? dataob.note : "-"; // Description details sets

    // Payment method conditions match row cheque bank details show hide blocks
    if (dataob.paymentmethod == "Card") { // Card options checks
        document.getElementById("rowCardType").style.display = "table-row"; // Card type row visible
        document.getElementById("rowReferenceNo").style.display = "table-row"; // Reference number row visible
        document.getElementById("rowChequeNo").style.display = "none"; // Hide cheque fields
        document.getElementById("rowChequeDate").style.display = "none";
        document.getElementById("rowTransferId").style.display = "none"; // Hide bank transfer fields
        cardTypeView.innerText = dataob.cardtype ? dataob.cardtype : "-"; // Value bind sets
        referenceNoView.innerText = dataob.referanceno ? dataob.referanceno : "-"; // Reference number bind sets
    } else if (dataob.paymentmethod == "Cheque") { // Cheque options checks
        document.getElementById("rowCardType").style.display = "none";
        document.getElementById("rowReferenceNo").style.display = "none";
        document.getElementById("rowChequeNo").style.display = "table-row"; // Cheque number columns visible
        document.getElementById("rowChequeDate").style.display = "table-row"; // Cheque date columns visible
        document.getElementById("rowTransferId").style.display = "none"; // Hide bank transfer fields
        chequeNoView.innerText = dataob.checkno ? dataob.checkno : "-"; // Value bind sets
        chequeDateView.innerText = dataob.checkdate ? dataob.checkdate : "-"; // Date sets
    } else if (dataob.paymentmethod == "Bank Transfer") { // Bank transfer options checks
        document.getElementById("rowCardType").style.display = "none";
        document.getElementById("rowReferenceNo").style.display = "none";
        document.getElementById("rowChequeNo").style.display = "none"; // Hide cheque no
        document.getElementById("rowChequeDate").style.display = "none"; // Hide cheque date
        document.getElementById("rowTransferId").style.display = "table-row"; // Show transfer ID row
        transferIdView.innerText = dataob.transferid ? dataob.transferid : "-"; // Transfer ID value bind
    } else { // Cash options setups checks
        document.getElementById("rowCardType").style.display = "none";
        document.getElementById("rowReferenceNo").style.display = "none";
        document.getElementById("rowChequeNo").style.display = "none"; // Hide cheque rows
        document.getElementById("rowChequeDate").style.display = "none";
        document.getElementById("rowTransferId").style.display = "none"; // Hide transfer rows
    }

    $("#offcanvasBottomView").offcanvas("show"); // Bottom offcanvas modal popups active show settings
}

// Print layouts print execution helper action
const buttonPrintRow = () => {
    let newWindow = window.open(); // Blank browser window open checks

    // Dynamic document elements structure copy inputs
    newWindow.document.write(`
        <html>
        <head>
            <title>Print View - Supplier Payment Details</title>
            <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">
            <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
            <link rel="stylesheet" href="/Style/printView.css">
        </head>
        <body>
            ${document.querySelector('.bodyPrintView').outerHTML}
        </body>
        </html>
    `);

    // Open print window delays wait assets render checks
    setTimeout(() => {
        newWindow.stop(); // Stop page resource loads
        newWindow.print(); // Display printer modal sets
        newWindow.close(); // Close dynamic window tab checks
    }, 1500) // Delay value milliseconds
}

// Form validation check controls empty null warning outputs
const checkFormError = () => {
    let errors = ""; // Errors warning messages accumulator

    if (supplierPayment.grn_id == null) { // GRN checks properties
        errors = errors + "Please Select a GRN...!\n"; // Add to error messages
    }
    if (supplierPayment.totaldueamount == null) { // Total amount validation checks
        errors = errors + "Total Due Amount is empty. Please select GRN again...!\n";
    }
    if (supplierPayment.paymentmethod == null) { // Payment kramaya checks validation
        errors = errors + "Please Select Payment Method...!\n";
    }
    if (supplierPayment.paidamount == null) { // Gevana mudala check status
        errors = errors + "Please Enter Paid Amount...!\n";
    }
    if (supplierPayment.balanceamount == null) { // Balance check statuses validations
        errors = errors + "Please Check Balance Amount calculations...!\n";
    }
    
    // Card payment configurations validation rules
    if (supplierPayment.paymentmethod == "Card") {
        if (supplierPayment.cardtype == null || supplierPayment.cardtype == "") { // Card type check
            errors = errors + "Please Select Card Type...!\n";
        }
        if (supplierPayment.referanceno == null || supplierPayment.referanceno == "") { // Reference number check
            errors = errors + "Please Enter Reference No...!\n";
        }
    }

    // Cheque payment configurations validation rules
    if (supplierPayment.paymentmethod == "Cheque") {
        if (supplierPayment.checkno == null || supplierPayment.checkno == "") { // Cheque number check
            errors = errors + "Please Enter Cheque No...!\n";
        }
        if (supplierPayment.checkdate == null || supplierPayment.checkdate == "") { // Cheque date check
            errors = errors + "Please Select Cheque Date...!\n";
        }
    }

    // Bank transfer configurations checks validations rules
    if (supplierPayment.paymentmethod == "Bank Transfer") {
        if (supplierPayment.transferid == null || supplierPayment.transferid == "") { // Transfer ID check
            errors = errors + "Please Enter Transfer ID...!\n";
        }
    }

    if (supplierPayment.suplierpaymentstatus_id == null) { // Status dropdown validation rules
        errors = errors + "Please Select Payment Status...!\n";
    }

    return errors; // Accumulated output errors warning returns
}

// Submit button handler post details execution
// Submit button handler post details execution
const buttonSupplierPaymentSubmit = () => {
    console.log('Add Supplier Payment object details', supplierPayment); // Details log checks
 
    // Cash, Card, Cheque, Bank Transfer payment types configuration settings checks
    if (supplierPayment.paymentmethod == "Cash") {
        supplierPayment.checkno = null; // Cheque details null configuration checks
        supplierPayment.checkdate = null;
        supplierPayment.transferid = null; // Transfer ID clear maps checks
        supplierPayment.cardtype = null; // Card type clear
        supplierPayment.referanceno = "CASH-" + new Date().getTime(); // CASH reference number calculations sets
    } else if (supplierPayment.paymentmethod == "Card") {
        supplierPayment.checkno = null; // Card payment configurations
        supplierPayment.checkdate = null;
        supplierPayment.transferid = null; // Resets other details null maps checks
    } else if (supplierPayment.paymentmethod == "Cheque") {
        supplierPayment.transferid = null; // Transfer clear sets
        supplierPayment.cardtype = null; // Card type clear
        supplierPayment.referanceno = "CHQ-" + new Date().getTime(); // CHEQUE references checks
    } else if (supplierPayment.paymentmethod == "Bank Transfer") {
        supplierPayment.checkno = null; // Cheque data resets null maps checks
        supplierPayment.checkdate = null;
        supplierPayment.cardtype = null; // Card type clear
        supplierPayment.referanceno = "TXN-" + new Date().getTime(); // Transfer ID reference code settings sets
    }
 
    // Verification errors checklist setups checks
    let errors = checkFormError();
    // validation check errors check blank checks
    if (errors == "") {
        // supplier payment submission confirmations sweetalert popup modals displays check
        Swal.fire({
            title: "Confirm Submission",
            html: `Are you sure to add the following Supplier Payment?<br><br>` +
                  `<strong>GRN No:</strong> ${supplierPayment.grn_id.grnno}<br>` +
                  `<strong>Paid Amount:</strong> Rs. ${parseFloat(supplierPayment.paidamount).toFixed(2)}<br>` +
                  `<strong>Payment Method:</strong> ${supplierPayment.paymentmethod}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-plus"></i> Add',
            cancelButtonText: '<i class="fa-solid fa-xmark"></i> Cancel',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                htmlContainer: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-btn',
                cancelButton: 'swal-custom-cancel-btn'
            },
            buttonsStyling: false
        }).then((result) => {
            // submit confirm check yes kala nam
            if (result.isConfirmed) {
                // API POST save request call execution
                let postResponce = getHTTPServiceRequest("/supplierPayment/insert", "POST", supplierPayment);
                // database success response check OK
                if (postResponce == "OK") {
                    // success status informational dialogue sweetalert modals displays check
                    Swal.fire({
                        title: "Saved!",
                        text: "Supplier payment saved successfully.",
                        icon: "success",
                        confirmButtonText: '<i class="fa-solid fa-check"></i> OK',
                        customClass: {
                            popup: 'swal-custom-popup',
                            title: 'swal-custom-title',
                            htmlContainer: 'swal-custom-content',
                            confirmButton: 'swal-custom-confirm-btn'
                        },
                        buttonsStyling: false
                    });
                    // data table lists metrics refresh call
                    refreshSupplierPaymentTable();
                    // resets forms defaults elements values checks
                    refreshSupplierPaymentForm();
                    // offcanvas sheets panels close karalai hide checks
                    $("#offcanvasBottom").offcanvas("hide");
                } else {
                    // post submit failed alert sweetalert dialog open checks
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to submit: " + postResponce,
                        icon: "error",
                        confirmButtonText: '<i class="fa-solid fa-check"></i> OK',
                        customClass: {
                            popup: 'swal-custom-popup',
                            title: 'swal-custom-title',
                            htmlContainer: 'swal-custom-content',
                            confirmButton: 'swal-custom-cancel-btn'
                        },
                        buttonsStyling: false
                    });
                }
            }
        });
    } else {
        // required parameters check error validation alerts display checks
        Swal.fire({
            title: "Validation Error",
            html: "Something went wrong... Please correct the following errors:<br><br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            confirmButtonText: '<i class="fa-solid fa-check"></i> OK',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                htmlContainer: 'swal-custom-content',
                confirmButton: 'swal-custom-cancel-btn'
            },
            buttonsStyling: false
        });
    }
}

// Edit button functionality placeholder
const buttonSupplierPaymentUpdate = () => { }

// Reset/Clear button trigger setups
const clearSupplierPaymentForm = () => {
    // clear form confirmation popup window sweetalert open karagannawa
    Swal.fire({
        title: "Confirm Refresh",
        text: "Do you need to refresh form...?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Yes',
        cancelButtonText: '<i class="fa-solid fa-xmark"></i> No',
        customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-content',
            confirmButton: 'swal-custom-confirm-btn',
            cancelButton: 'swal-custom-cancel-btn'
        },
        buttonsStyling: false
    }).then((result) => {
        // clear confirm yes checks
        if (result.isConfirmed) {
            // refresh supplier payment form function call karalai forms inputs values defaults resets karagannawa
            refreshSupplierPaymentForm();
        }
    });
}

// Select GRN details automatically total amount read values inject
// Select GRN details automatically total amount read values inject
const getSupplierPaymentGrnAmount = () => {
    if (supplierPayment.grn_id != null) { // Selected GRN is valid
        // GRN net amount value capture and set to input field
        textTotalDueAmount.value = parseFloat(supplierPayment.grn_id.netamount).toFixed(2);
        // Trigger textValidator checks to update object bindings
        textValidator(textTotalDueAmount, '^.*$', 'supplierPayment', 'totaldueamount');

        // GRN eke supplier_id eka supplierPayment object ekata set karagannawa null constraint avoid karanna
        if (supplierPayment.grn_id.purchaserequest_id != null && supplierPayment.grn_id.purchaserequest_id.supplier_id != null) {
            supplierPayment.supplier_id = supplierPayment.grn_id.purchaserequest_id.supplier_id;
        }

        // Partially Paid status eke athi GRN ekak nam prepaidamount load karanawa
        if (supplierPayment.grn_id.grnstatus_id != null && supplierPayment.grn_id.grnstatus_id.name == "Partially Paid") {
            // Backend eken kalin gewapu mudala gannawa
            let alreadyPaid = getServiceRequest("/supplierPayment/totalpaidbygrn/" + supplierPayment.grn_id.id);
            textPrepaidAmount.value = parseFloat(alreadyPaid).toFixed(2);
            textValidator(textPrepaidAmount, '^.*$', 'supplierPayment', 'Prepaidamount');
            document.getElementById("divPrepaidAmount").style.display = "flex"; // Prepaid input field eka show karanawa
        } else {
            // Pending grn ekak nam prepaidamount eka 0.00 widiyata thiyala field eka hide karanawa
            textPrepaidAmount.value = "0.00";
            textValidator(textPrepaidAmount, '^.*$', 'supplierPayment', 'Prepaidamount');
            document.getElementById("divPrepaidAmount").style.display = "none";
        }

        generateBalanceAmount(); // Calculate balance changes status
    } else {
        textTotalDueAmount.value = ""; // Resets values
        setDefault([textTotalDueAmount]); // Resets validators color sets
        supplierPayment.totaldueamount = null; // Object properties updates
        supplierPayment.supplier_id = null; // Supplier properties clear sets
        textPrepaidAmount.value = "0.00";
        setDefault([textPrepaidAmount]);
        supplierPayment.Prepaidamount = null;
        document.getElementById("divPrepaidAmount").style.display = "none"; // Hide prepaid amount area
    }
}

// Payment method changes show hide elements sets
const handlePaymentMethodChange = () => {
    let method = selectPaymentMethod.value; // Selection variable mapping value checks

    if (method === "Card") {
        document.getElementById("divCardType").style.display = "flex"; // Card type dropdown show
        document.getElementById("divReferenceNo").style.display = "flex"; // Reference number input show
        document.getElementById("divChequeNo").style.display = "none"; // Hide Cheque inputs
        document.getElementById("divChequeDate").style.display = "none";
        document.getElementById("divTransferId").style.display = "none"; // Hide transfer input

        // Reset cheque and transfer values
        textChequeNo.value = "";
        textChequeDate.value = "";
        textTransferId.value = "";
        setDefault([textChequeNo, textChequeDate, textTransferId]); // Clear colors validation check indicators
        supplierPayment.checkno = null;
        supplierPayment.checkdate = null;
        supplierPayment.transferid = null;

    } else if (method === "Cheque") {
        document.getElementById("divCardType").style.display = "none"; // Hide Card inputs
        document.getElementById("divReferenceNo").style.display = "none";
        document.getElementById("divChequeNo").style.display = "flex"; // Cheque No input container show
        document.getElementById("divChequeDate").style.display = "flex"; // Cheque Date container show
        document.getElementById("divTransferId").style.display = "none"; // Hide bank details container

        // Reset transfer and card values checks
        textTransferId.value = "";
        selectCardType.value = "";
        textReferenceNo.value = "";
        setDefault([textTransferId, selectCardType, textReferenceNo]); // Validation colors clean
        supplierPayment.transferid = null; // Reset properties
        supplierPayment.cardtype = null;
        supplierPayment.referanceno = null;

    } else if (method === "Bank Transfer") {
        document.getElementById("divCardType").style.display = "none"; // Hide Card inputs
        document.getElementById("divReferenceNo").style.display = "none";
        document.getElementById("divChequeNo").style.display = "none"; // Hide Cheque container
        document.getElementById("divChequeDate").style.display = "none";
        document.getElementById("divTransferId").style.display = "flex"; // Show transfer input container

        // Reset cheque and card details configuration checks
        textChequeNo.value = "";
        textChequeDate.value = "";
        selectCardType.value = "";
        textReferenceNo.value = "";
        setDefault([textChequeNo, textChequeDate, selectCardType, textReferenceNo]); // Clear colors validation check indicators
        supplierPayment.checkno = null;
        supplierPayment.checkdate = null;
        supplierPayment.cardtype = null;
        supplierPayment.referanceno = null;

    } else { // Default Cash methods rules sets
        document.getElementById("divCardType").style.display = "none"; // Hide Card inputs
        document.getElementById("divReferenceNo").style.display = "none";
        document.getElementById("divChequeNo").style.display = "none"; // Hide Cheque inputs
        document.getElementById("divChequeDate").style.display = "none";
        document.getElementById("divTransferId").style.display = "none"; // Hide Transfer details container

        // Clear all additional fields check parameters
        textChequeNo.value = "";
        textChequeDate.value = "";
        textTransferId.value = "";
        selectCardType.value = "";
        textReferenceNo.value = "";
        setDefault([textChequeNo, textChequeDate, textTransferId, selectCardType, textReferenceNo]); // Clear validation style blocks
        supplierPayment.checkno = null;
        supplierPayment.checkdate = null;
        supplierPayment.transferid = null;
        supplierPayment.cardtype = null;
        supplierPayment.referanceno = null;
    }
}

// Balance amount calculations and validators binding sets
const generateBalanceAmount = () => {
    spanElementBalanceAmount = textBalanceAmount.previousElementSibling; // Indicator wrapper style links

    let totalDue = parseFloat(supplierPayment.totaldueamount || 0); // Total amounts capture
    let prepaid = parseFloat(supplierPayment.Prepaidamount || 0); // Prepaid amount capture
    let paidAmt = parseFloat(textPaidAmount.value || 0); // Paid amounts capture from input

    // Check variables validation inputs checks
    if (supplierPayment.totaldueamount != null && textPaidAmount.value !== "") {
        // Gewanna thiyena ithiri mulu mudala (remaining due)
        let remainingDue = totalDue - prepaid;
        // Balance eka = Paid Amount - Remaining Due
        let balanceAmount = paidAmt - remainingDue;

        if (balanceAmount <= 0) { // Balance amount positive wenna baha, negative ho zero pamanak valid
            textBalanceAmount.value = balanceAmount.toFixed(2); // Set values
            textValidator(textBalanceAmount, '^.*$', 'supplierPayment', 'balanceamount'); // Validator bind check update sets

            // Dynamic indicator success colors updates
            textBalanceAmount.style.borderBottom = "4px solid green";
            spanElementBalanceAmount.style.backgroundColor = "green";
            textBalanceAmount.classList.remove("is-invalid");
            textBalanceAmount.classList.add("is-valid");

            // Auto update status based on balance amount
            let supplierPaymentStatus = getServiceRequest('/supplierPaymentStatus/alldata');
            let statusName = (balanceAmount === 0) ? "Paid" : "Partially Paid";
            let matchedStatus = supplierPaymentStatus.find(status => status.name === statusName);
            if (matchedStatus) {
                selectSupplierPaymentStatus.value = JSON.stringify(matchedStatus);
                supplierPayment.suplierpaymentstatus_id = matchedStatus;
                
                // Update status border color
                let prevElementStatus = selectSupplierPaymentStatus.previousElementSibling;
                selectSupplierPaymentStatus.style.borderBottom = "4px solid green";
                prevElementStatus.style.backgroundColor = "green";
                selectSupplierPaymentStatus.classList.remove("is-invalid");
                selectSupplierPaymentStatus.classList.add("is-valid");
            }
        } else { // Invalid balance values checks positive balances (not allowed to overpay)
            textBalanceAmount.value = balanceAmount.toFixed(2); // Set values
            textBalanceAmount.style.borderBottom = "4px solid red"; // Highlight border error reds
            spanElementBalanceAmount.style.backgroundColor = "red"; // Red indicators backgrounds
            textBalanceAmount.classList.add("is-invalid"); // Red alert class active sets
            textBalanceAmount.classList.remove("is-valid");
            supplierPayment.balanceamount = null; // Null configurations object
        }
    } else {
        // Select karapu payment methods updates defaults
        let totalDueVal = parseFloat(supplierPayment.totaldueamount || 0);
        let prepaidVal = parseFloat(supplierPayment.Prepaidamount || 0);
        let remainingDueVal = totalDueVal - prepaidVal;
        textBalanceAmount.value = (-remainingDueVal).toFixed(2); // Paid amount thama gahala nathi nisa, gewanna thiyena mudala minus value ekak widiyata balance eke pennanawa
        setDefault([textBalanceAmount]); // Validation indicators colors reset
        supplierPayment.balanceamount = null;
    }
}

// Main form loading initialization refresh updates setups
const refreshSupplierPaymentForm = () => {
    supplierPayment = new Object(); // Empty payment context mapping object create

    formSupplierPayment.reset(); // Native form resets clear details checks

    // Form inputs validator styles clean colors sets
    setDefault([selectGrn, textTotalDueAmount, textPrepaidAmount, selectPaymentMethod, textPaidAmount, textBalanceAmount, selectCardType, textReferenceNo, textChequeNo, textChequeDate, textTransferId, selectSupplierPaymentStatus]);

    // Additional dynamic containers inputs invisible blocks setups initial load settings
    document.getElementById("divChequeNo").style.display = "none";
    document.getElementById("divChequeDate").style.display = "none";
    document.getElementById("divTransferId").style.display = "none";
    document.getElementById("divCardType").style.display = "none";
    document.getElementById("divReferenceNo").style.display = "none";
    document.getElementById("divPrepaidAmount").style.display = "none";

    // Active pending GRNs select dropdown elements reload loads
    let pendingGrns = getServiceRequest('/grn/getPendingAndPartiallyPaidList');
    
    // Select drop down container setups values items push loops
    selectGrn.innerHTML = ""; // Clean options
    let optionMsgEs = document.createElement("option"); // Disabled warning instructions option select setups
    optionMsgEs.value = "";
    optionMsgEs.selected = "selected";
    optionMsgEs.disabled = "disabled";
    optionMsgEs.innerText = "Select GRN No";
    selectGrn.appendChild(optionMsgEs); // Option adds checks

    pendingGrns.forEach(grn => { // Dynamic elements populate dropdown lists
        let option = document.createElement("option");
        option.value = JSON.stringify(grn); // String json value settings config

        // GRN code displays details checks format
        let brandNamesList = []; // Item check brands names lists
        if (grn.grnHasItemList) {
            grn.grnHasItemList.forEach(grnItem => {
                if (grnItem.item_id && grnItem.item_id.brand_id && grnItem.item_id.brand_id.name && !brandNamesList.includes(grnItem.item_id.brand_id.name)) {
                    brandNamesList.push(grnItem.item_id.brand_id.name); // Add check brands
                }
            });
        }
        let brandsJoined = brandNamesList.join(", "); // Brands joining comma checks
        let supplierName = (grn.purchaserequest_id && grn.purchaserequest_id.supplier_id) ? grn.purchaserequest_id.supplier_id.suppliername : "-";
        
        option.innerText = grn.grnno + " - " + supplierName + " - (" + brandsJoined + ")"; // Title text string formats
        selectGrn.appendChild(option); // Option push select input
    });

    // Payment status details fetch api lists reload
    let supplierPaymentStatus = getServiceRequest('/supplierPaymentStatus/alldata');
    fillDataIntoSelect(selectSupplierPaymentStatus, "Please Select Status..!", supplierPaymentStatus, "name"); // Fill status options values

    // Auto-select standard default status (index 1: completed status or first element depends database entries)
    selectSupplierPaymentStatus.value = JSON.stringify(supplierPaymentStatus[1]);
    supplierPayment.suplierpaymentstatus_id = JSON.parse(selectSupplierPaymentStatus.value); // Set object binding
    
    // Status indicators highlights validates green colors sets
    prevElementSupplierPaymentStatus = selectSupplierPaymentStatus.previousElementSibling;
    selectSupplierPaymentStatus.style.borderBottom = "4px solid green";
    prevElementSupplierPaymentStatus.style.backgroundColor = "green";
    selectSupplierPaymentStatus.classList.remove("is-invalid");
    selectSupplierPaymentStatus.classList.add("is-valid");

    // // Edit functions updating layout hide and inserts layout show active sets
    // btnSupplierPaymentUpdate.style.visibility = "hidden"; // Hide update button
    // btnSupplierPaymentSubmit.style.visibility = "visible"; // Show submit save button

    //     hide update button
    divButtonUpdate.style.display = "none";

//     show add button
    divButtonAdd.style.display = "flex";
}
