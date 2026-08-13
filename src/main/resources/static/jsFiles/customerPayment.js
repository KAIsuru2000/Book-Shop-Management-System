//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function for refresh table
    refreshCustomerPaymentTable();

    //Call refresh form function
    refreshCustomerPaymentForm();

    // table body ekata click event listener ekak add karanawa row ekak click karaddi edit/delete buttons hide karanna
    tableCustomerPaymentBody.addEventListener("click", () => {
        // log wela inna user "Cashier" da kiyala check karanna user ge role eka gannawa
        let loggedUserObj = getServiceRequest("/loggeduser/role");
        // loggedUser variable ekata role name eka set karagannawa
        let loggedUser = loggedUserObj.role;
        // user cashier nam pamanak meya apply karanawa
        if (loggedUser === "Cashier") {
            // buttonrow class eka thiyena element eka select karagannawa (meya tableFunction.js eken click kala row ekata passe hadana row eka)
            let existingButtonRow = document.querySelector(".buttonrow");
            // buttonrow eka thibe nam buttons select karala hide karanawa
            if (existingButtonRow) {
                // edit button eka select karanawa (.btnUpdate class eka thiyena element eka)
                let btnUpdate = existingButtonRow.querySelector(".btnUpdate");
                // delete button eka select karanawa (.btnClear class eka thiyena element eka)
                let btnClear = existingButtonRow.querySelector(".btnClear");
                // edit button eka thibe nam display none karala hide karanawa
                if (btnUpdate) btnUpdate.style.display = "none";
                // delete button eka thibe nam display none karala hide karanawa
                if (btnClear) btnClear.style.display = "none";
            }
        }
    });

})

//create function for refresh table
const refreshCustomerPaymentTable = () => {
    const customerPayments = getServiceRequest("/customerPayment/alldata");

    displayPropertyList = [
        { dataType: 'string', propertyName: 'billno' },
        { dataType: 'function', propertyName: getCustomerName },
        { dataType: 'string', propertyName: 'paymentmethod' },
        { dataType: 'decimal', propertyName: 'invoiceamount' },
        { dataType: 'decimal', propertyName: 'paidamount' },
        { dataType: 'decimal', propertyName: 'balanceamount' },
        { dataType: 'function', propertyName: getCustomerPaymentStatus }
    ];

    fillDataIntoTable(tableCustomerPaymentBody, customerPayments, displayPropertyList, customerPaymentRowFormRefill, customerPaymentRowDelete, customerPaymentRowPrint, "#offcanvasBottom");
    $('#tableCustomerPayment').dataTable();
}

const getCustomerName = (dataob) => {
    if (dataob.invoice_id != null && dataob.invoice_id.customer_id != null) {
        return dataob.invoice_id.customer_id.fullname;
    }
    return "-";
}

const getCustomerPaymentStatus = (dataob) => {
    if (dataob.customerpaymentstatus_id != null) {
        if (dataob.customerpaymentstatus_id.name == "Completed") {
            return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;" data-bs-toggle="tooltip" title="Completed"></i>';
        } else {
            return '<p>' + dataob.customerpaymentstatus_id.name + '</p>';
        }
    }
    return "-";
}

const customerPaymentRowFormRefill = (dataob, rowIndex) => { }
const customerPaymentRowDelete = (dataob, rowIndex) => { }
const customerPaymentRowPrint = (dataob, rowIndex) => { }

const customerRowFormRefill = (dataob, rowIndex) => {

    console.log("Edit", dataob, rowIndex);

    // refill value in to element -> elementId.value = ob.releventPropertyName
    textFullName.value = dataob.fullname;

    telMobil.value = dataob.mobileno;

    inputEmail.value = dataob.email;

    selectCusStatus.value = JSON.stringify(dataob.customerstatus_id);

    if (dataob.note == undefined) {
        textNote.value = "";
    } else {
        textNote.value = dataob.note;
    }


    btnCusSubmit.style.visibility = "hidden";
    btnCusUpdate.style.visibility = "visible";




    //customer = ob
    //oldCustomer = ob melesa thibuu wita ob array ekak nisa heap eka thula ekma idehi variable 2 ka awita ekak wenas kala wita anikath wenas we.
    customer = JSON.parse(JSON.stringify(dataob));// string kala witra ram ekehi wena wenama seedi heap ekata giya wita 2k lesa pawathi.
    oldCustomer = JSON.parse(JSON.stringify(dataob));

    //form eka refill wana wita model eka open kara ganima jquary magin
    // $("#staticBackdrop").modal("show");


}

const customerRowDelete = (dataob, rowIndex) => {
    console.log("Delete", dataob, rowIndex);

    // activeTableRow(tableEmployeeBody, index, "red");


    let userConfirm = window.confirm("Are you sure to delete following customer...?" +
        "\n Customer full name : " + dataob.fullname +
        "\n Customer email : " + dataob.email +
        "\n Customer status : " + dataob.customerstatus_id.name
    );
    if (userConfirm) {
        // call post service
        //anthima parameter eka sadaha employeeDelete function eken pass wana name eka yodai
        let deleteResponce = getHTTPServiceRequest("/customer/delete", "DELETE", dataob);

        if (deleteResponce == "OK") {
            window.alert("Delete successfully ");
            refreshCustomerTable();
            refreshCustomerForm();

        } else {
            window.alert("Delete not successfully" + deleteResponce);

        }




    }
}

const customerRowPrint = (dataob, rowIndex) => {
    console.log("View", dataob, rowIndex);
    // html wala athi modal ekak open weema
    fullNameView.innerText = dataob.fullname;
    mobileNoView.innerText = dataob.mobileno;
    emailView.innerText = dataob.email;
    customerStatusView.innerText = dataob.customerstatus_id.name;
    if (dataob.note == undefined) {
        noteView.innerText = "-";
    } else {
        noteView.innerText = dataob.note;
    }

    $("#offcanvasBottomCustomerView").offcanvas("show"); // show the offcanvas
}
//print offcanvas model eka thula athi print button eka function eka
const buttonPrintRow = () => {

    //aluth window ekak open kara ganima
    let newWindow = window.open();
    //ema window ekata title ekak demima
    //title eke html code tika venama verible ekakata dama ganima
    // let printView = "<head><title>Bright Book Shop | Customer Details</title><link rel='icon' href='/image/title.png'><link rel='stylesheet' href='/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script><link rel='stylesheet' href='/fontawesome-free-6.4.2/css/all.css'><link rel='stylesheet' href='/Style/printView.css'></head>" + "<body>" + bodyView.outerHTML +
    //     "</body>";
    newWindow.document.write(`
            <html>
            <head>
                <title>Print View - Customer Details</title>
                <!-- link bootstrp min css file -->
    <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">

    <!--link bootstrap js file  -->
    <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
    
                <!-- link css file -->
                    <link rel="stylesheet" href="/Style/printView.css">
            </head>
            <body>
                ${document.querySelector('.bodyPrintView').outerHTML}
            </body>
            </html>
        `);
    //open wana tab eka tika welawak open wee thibee print ekata open weema
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1500)//1.5 second walata pasuwa block eka run karawai ema pramadaya iilaga piyawarata yaamata pera printView anthargathaya complete wa display kirimata ida salasai
}



//form eke ek ek property check kara values naththan msg ekak return kara ganima sdaha
//form eke ek ek property check kara values naththan msg ekak return kara ganima sdaha
const checkFormError = () => {
    let errors = "";

    if (customerPayment.invoice_id == null) {
        errors = errors + "Please Select a Customer/Invoice...! \n";
    }
    if (customerPayment.paymentmethod == null) {
        errors = errors + "Please Select Payment Method...! \n";
    }
    if (customerPayment.invoiceamount == null) {
        errors = errors + "Please Enter Invoice Amount...! \n";
    }
    if (customerPayment.paidamount == null) {
        errors = errors + "Please Enter Paid Amount...! \n";
    }
    if (customerPayment.balanceamount == null) {
        errors = errors + "Please Enter Balance Amount...! \n";
    }
    if (customerPayment.paymentmethod == "Card") {
        if (customerPayment.cardtype == null) {
            errors = errors + "Please Enter Card Type...! \n";
        }
        if (customerPayment.referenceno == null) {
            errors = errors + "Please Enter Reference No...! \n";
        }
    }
    if (customerPayment.paymentmethod == "Cash & Card") {
        if (customerPayment.cashamount == null) {
            errors = errors + "Please Enter Cash Amount...! \n";
        }
        if (customerPayment.cardamount == null) {
            errors = errors + "Please Enter Card Amount...! \n";
        }
        if (customerPayment.cardtype == null) {
            errors = errors + "Please Enter Card Type...! \n";
        }
        if (customerPayment.referenceno == null) {
            errors = errors + "Please Enter Reference No...! \n";
        }
    }
    if (customerPayment.customerpaymentstatus_id == null) {
        errors = errors + "Please Select Customer Payment Status...! \n";
    }

    return errors;
}

//form submit event function 
const buttonCusSubmit = () => {
    console.log('Add Customer Payment', customerPayment);

    // If payment method is Cash, fill cardtype and referenceno with dummy unique values
    if (customerPayment.paymentmethod == "Cash") {
        customerPayment.cardtype = "-";
        customerPayment.referenceno = "CASH-" + new Date().getTime();
        customerPayment.cashamount = customerPayment.paidamount;
        customerPayment.cardamount = 0;
    }
    if (customerPayment.paymentmethod == "Card") {
        customerPayment.cashamount = 0;
        customerPayment.cardamount = customerPayment.paidamount;
    }

    //check form error for required element
    let errors = checkFormError();
    if (errors == "") {
        //no errors get user confirmation
        let userConfirm = window.confirm("Are you sure to add following customer payment...?" +
            "\n Customer : " + customerPayment.invoice_id.invoiceno +
            "\n Paid Amount : " + customerPayment.paidamount +
            "\n Payment Method : " + customerPayment.paymentmethod
        );
        if (userConfirm) {
            // call post service
            let postResponce = getHTTPServiceRequest("/customerPayment/insert", "POST", customerPayment);
            if (postResponce == "OK") {
                window.alert("Save successfully ");
                refreshCustomerPaymentTable();
                refreshCustomerPaymentForm();
                $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas
            } else {
                window.alert("Failed to submit \n" + postResponce);
            }
        }
    } else {
        window.alert("Something went wrong...\n" + errors);
    }
}

//check form update function
const checkFormUpdate = () => {
    let updates = "";

    if (customer != null && oldCustomer != null) {

        if (customer.fullname != oldCustomer.fullname) {
            updates = updates + "Full name is changed  ....! \n";
        }

        if (customer.mobileno != oldCustomer.mobileno) {
            updates = updates + "mobile no is changed  ....! \n" + oldCustomer.mobileno + " -> " + customer.mobileno + "\n";
        }

        if (customer.email != oldCustomer.email) {
            updates = updates + "email is changed  ....! \n";
        }

        if (customer.customerstatus_id.name != oldCustomer.customerstatus_id.name) {
            updates = updates + "customer status is changed  ....! \n";
        }



    }


    return updates;
}

// form update event function 
const buttonCustomerUpdate = () => {

    //need to check form errors
    let errors = checkFormError();
    if (errors == "") {
        // need to check form update
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("nothing to update..\n");
        } else {
            //need to get user confirmation
            let userConfirm = window.confirm("Are you sure to update following changers.. \n" + updates);
            if (userConfirm) {
                //call put service
                let putResponce = getHTTPServiceRequest("/customer/update", "PUT", customer);
                if (putResponce == "OK") {
                    window.alert("Update Successfully...!");
                    refreshCustomerTable();
                    refreshCustomerForm();
                    $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas
                } else {
                    window.alert("Failed to update...!" + putResponce);
                }
            } else {

            }
        }
    } else {
        window.alert("something went wrong.. \n" + errors);
    }

}

const clearCustomerForm = () => {

    let userConfirm = window.confirm("Do you need to refresh form...?");
    if (userConfirm) {
        refreshCustomerPaymentForm();
    }
}

// create function to get selected invoice netamount
const getCustomerPaymentInvoiceAmount = () => {
    if (customerPayment.invoice_id != null) {
        textInvoiceAmount.value = parseFloat(customerPayment.invoice_id.netamount).toFixed(2);
        textValidator(textInvoiceAmount, '^.*$', 'customerPayment', 'invoiceamount');
    } else {
        textInvoiceAmount.value = "";
        setDefault([textInvoiceAmount]);
        customerPayment.invoiceamount = null;
    }
}

// create function to handle payment method dropdown changes
const handlePaymentMethodChange = () => {
    let method = selectPaymentMethod.value;
    if (method === "Card") {
        divCardType.style.display = "flex";
        divReferenceNo.style.display = "flex";
        divCashAmount.style.display = "none";
        divCardAmount.style.display = "none";

        // Paid Amount should be editable
        textPaidAmount.readOnly = false;

        // Clear split values
        textCashAmount.value = "";
        textCardAmount.value = "";
        textPaidAmount.value = "";
        textBalanceAmount.value = "";
        setDefault([textCashAmount, textCardAmount, textPaidAmount, textBalanceAmount]);
        customerPayment.cashamount = null;
        customerPayment.cardamount = null;
    } else if (method === "Cash") {
        divCardType.style.display = "none";
        divReferenceNo.style.display = "none";
        divCashAmount.style.display = "none";
        divCardAmount.style.display = "none";

        // Paid Amount should be editable
        textPaidAmount.readOnly = false;

        // Clear card & split values
        textCardType.value = "";
        textReferenceNo.value = "";
        textCashAmount.value = "";
        textCardAmount.value = "";
        textPaidAmount.value = "";
        textBalanceAmount.value = "";
        setDefault([textCardType, textReferenceNo, textCashAmount, textCardAmount, textPaidAmount, textBalanceAmount]);
        customerPayment.cardtype = null;
        customerPayment.referenceno = null;
        customerPayment.cashamount = null;
        customerPayment.cardamount = null;
    } else if (method === "Cash & Card") {
        divCardType.style.display = "flex";
        divReferenceNo.style.display = "flex";
        divCashAmount.style.display = "flex";
        divCardAmount.style.display = "flex";

        // Paid Amount should be read-only since it is calculated
        textPaidAmount.readOnly = true;
        textPaidAmount.value = "";
        textBalanceAmount.value = "";
        textReferenceNo.value = "";
        selectCardType.value = "";
        setDefault([textPaidAmount,textBalanceAmount, textReferenceNo, selectCardType]);
        customerPayment.paidamount = null;

        // Reset Card values
        selectCardType.value = "";
        textReferenceNo.value = "";
        setDefault([textCardType, textReferenceNo]);
        customerPayment.cardtype = null;
        customerPayment.referenceno = null;
    }
}

// balance amount eka auto genarate wima sadaha
const genarateBalanceAmount = () => {

    // validation colour sadaha
    // Navigate to the parent element and then to the associated span
    spanElementBalanceAmount = textBalanceAmount.previousElementSibling;

    let invoiceAmount = customerPayment.invoiceamount;
    let paidAmount = customerPayment.paidamount;

    if (invoiceAmount != null && paidAmount != null && invoiceAmount !== "" && paidAmount !== "") {
        let balanceAmount = parseFloat(paidAmount) - parseFloat(invoiceAmount);
        //isNaN(100) nam false laba dei
        if (balanceAmount >= 0) {
            textBalanceAmount.value = balanceAmount.toFixed(2);
            // trigger validation and bind to customerPayment object
            textValidator(textBalanceAmount, '^.*$', 'customerPayment', 'balanceamount');
        } else {
            textBalanceAmount.value = balanceAmount.toFixed(2);
            textBalanceAmount.style.borderBottom = "4px solid red";
            spanElementBalanceAmount.style.backgroundColor = "red";
            textBalanceAmount.classList.add("is-invalid");
            textBalanceAmount.classList.remove("is-valid");
            customerPayment.balanceamount = null;
        }
    } else {
        textBalanceAmount.value = "";
        setDefault([textBalanceAmount]);
        customerPayment.balanceamount = null;
    }
}

// create function to calculate split total
const calculateSplitTotal = () => {
    let cashAmt = textCashAmount.value;
    let cardAmt = textCardAmount.value;

    let cashVal = parseFloat(cashAmt);
    let cardVal = parseFloat(cardAmt);

    // If both values are valid numbers, calculate total paid amount
    if (!isNaN(cashVal) && !isNaN(cardVal)) {
        let totalPaid = cashVal + cardVal;
        textPaidAmount.value = totalPaid.toFixed(2);

        // Trigger validation and bind to customerPayment object
        textValidator(textPaidAmount, '^.*$', 'customerPayment', 'paidamount');

        // Calculate balance amount
        genarateBalanceAmount();
    } else {
        textPaidAmount.value = "";
        setDefault([textPaidAmount]);
        customerPayment.paidamount = null;

        textBalanceAmount.value = "";
        setDefault([textBalanceAmount]);
        customerPayment.balanceamount = null;
    }
}

// Auto fill card amount when cash amount is entered
const handleCashAmountInput = () => {
    textValidator(textCashAmount, '^.*$', 'customerPayment', 'cashamount');

    let invoiceAmt = parseFloat(customerPayment.invoiceamount);
    let cashAmt = parseFloat(textCashAmount.value);

    if (!isNaN(invoiceAmt)) {
        if (!isNaN(cashAmt)) {
            let cardAmt = invoiceAmt - cashAmt;
            if (cardAmt < 0) {
                cardAmt = 0;
            }
            textCardAmount.value = cardAmt.toFixed(2);
            textValidator(textCardAmount, '^.*$', 'customerPayment', 'cardamount');
        } else {
            textCardAmount.value = "";
            setDefault([textCardAmount]);
            customerPayment.cardamount = null;
        }
    }
    // calculateSplitTotal();
}

// Auto fill cash amount when card amount is entered
const handleCardAmountInput = () => {
    textValidator(textCardAmount, '^.*$', 'customerPayment', 'cardamount');

    let invoiceAmt = parseFloat(customerPayment.invoiceamount);
    let cardAmt = parseFloat(textCardAmount.value);

    if (!isNaN(invoiceAmt)) {
        if (!isNaN(cardAmt)) {
            let cashAmt = invoiceAmt - cardAmt;
            if (cashAmt < 0) {
                cashAmt = 0;
            }
            textCashAmount.value = cashAmt.toFixed(2);
            textValidator(textCashAmount, '^.*$', 'customerPayment', 'cashamount');
        } else {
            textCashAmount.value = "";
            setDefault([textCashAmount]);
            customerPayment.cashamount = null;
        }
    }
    // calculateSplitTotal();
}

const refreshCustomerPaymentForm = () => {

    customerPayment = new Object();

    formCustomerPayment.reset();

    // validation colors iwath kirima
    setDefault([selectInvNo, selectPaymentMethod, textInvoiceAmount, textPaidAmount, textBalanceAmount, selectCardType, textReferenceNo, selectCusPaymentStatus, textCashAmount, textCardAmount]);

    // Hide card and split fields initially
    document.getElementById("divCardType").style.display = "none";
    document.getElementById("divReferenceNo").style.display = "none";
    document.getElementById("divCashAmount").style.display = "none";
    document.getElementById("divCardAmount").style.display = "none";
    document.getElementById("textPaidAmount").readOnly = false;

    // get pending invoices
    let pendingInvoices = getServiceRequest('/invoice/pending');

    // custom fill data for selectInvNo to display customer name and invoice no
    selectInvNo.innerHTML = "";
    let optionMsgEs = document.createElement("option");
    optionMsgEs.value = "";
    optionMsgEs.selected = "selected";
    optionMsgEs.disabled = "disabled";
    optionMsgEs.innerText = "Select Invoice no";
    selectInvNo.appendChild(optionMsgEs);


    pendingInvoices.forEach(invoice => {

        let option = document.createElement("option");
        option.value = JSON.stringify(invoice);

        if (invoice.customer_id != null) {
            // show customer name + invoice no
            option.innerText = invoice.invoiceno + " " + invoice.customer_id.fullname + " " + invoice.customer_id.mobileno;
            selectInvNo.appendChild(option);
        } else {
            option.innerText = invoice.invoiceno;
            selectInvNo.appendChild(option);
        }

    });

    // dynamic element refill kala yuthuya
    let customerPaymentStatus = getServiceRequest('/customerPaymentStatus/alldata')
    fillDataIntoSelect(selectCusPaymentStatus, "Please Select Customer Payment Status..!", customerPaymentStatus, "name");
    // status eka form eka load wana wita select wi thibimata
    // selected value eka string walin ena nisa stringify kara gani
    selectCusPaymentStatus.value = JSON.stringify(customerPaymentStatus[1]);
    // ema value eka newatha object ekata set kala yuththa object format ekeni
    customerPayment.customerpaymentstatus_id = JSON.parse(selectCusPaymentStatus.value);
    // status field eka sadaha validation colour eka laba deema
    prevElementCusPaymentStatus = selectCusPaymentStatus.previousElementSibling;
    selectCusPaymentStatus.style.borderBottom = "4px solid green";
    prevElementCusPaymentStatus.style.backgroundColor = "green";
    selectCusPaymentStatus.classList.remove("is-invalid");
    selectCusPaymentStatus.classList.add("is-valid");

}