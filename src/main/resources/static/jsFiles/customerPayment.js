//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function for refresh table
    refreshCustomerPaymentTable();

    //Call refresh form function
    refreshCustomerPaymentForm();

})

//create function for refresh table
const refreshCustomerPaymentTable = () => {
    const customerPayments = getServiceRequest("/customerPayment/alldata");

    displayPropertyList = [
        { dataType: 'string', propertyName: 'billno' },
        { dataType: 'function', propertyName: getCustomerName },
        { dataType: 'string', propertyName: 'paymentmethod' },
        { dataType: 'string', propertyName: 'invoiceamount' },
        { dataType: 'string', propertyName: 'paidamount' },
        { dataType: 'string', propertyName: 'balanceamount' },
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
            return '<p>'+dataob.customerpaymentstatus_id.name+'</p>';
        }
    }
    return "-";
}

const customerPaymentRowFormRefill = (dataob, rowIndex) => {}
const customerPaymentRowDelete = (dataob, rowIndex) => {}
const customerPaymentRowPrint = (dataob, rowIndex) => {}

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

const refreshCustomerPaymentForm = () => {

    customerPayment = new Object();

    formCustomerPayment.reset();

    // validation colors iwath kirima
    setDefault([selectCusName, textPaymentMethod, textInvoiceAmount, textPaidAmount, textBalanceAmount, textCardType, textReferenceNo, selectCusPaymentStatus]);

    // get pending invoices
    let pendingInvoices = getServiceRequest('/invoice/pending');
    
    // custom fill data for selectCusName to display customer name and invoice no
    selectCusName.innerHTML = "";
    let optionMsgEs = document.createElement("option");
    optionMsgEs.value = "";
    optionMsgEs.selected = "selected";
    optionMsgEs.disabled = "disabled";
    optionMsgEs.innerText = "Select Customer Name";
    selectCusName.appendChild(optionMsgEs);

    pendingInvoices.forEach(invoice => {
        let option = document.createElement("option");
        option.value = JSON.stringify(invoice);
        // show customer name + invoice no
        option.innerText = invoice.customer_id.fullname + " (" + invoice.invoiceno + ")";
        selectCusName.appendChild(option);
    });

    // dynamic element refill kala yuthuya
    let customerPaymentStatus = getServiceRequest('/customerPaymentStatus/alldata')
    if(customerPaymentStatus != null && customerPaymentStatus.length > 0) {
        fillDataIntoSelect(selectCusPaymentStatus, "Please Select Customer Payment Status..!", customerPaymentStatus, "name");
    }
}

//form eke ek ek property check kara values naththan msg ekak return kara ganima sdaha
//form eke ek ek property check kara values naththan msg ekak return kara ganima sdaha
const checkFormError = () => {
    let errors = "";

    if (customerPayment.invoice_id == null) {
        errors = errors + "Please Select a Customer/Invoice...! \n";
    }
    if (customerPayment.paymentmethod == null) {
        errors = errors + "Please Enter Payment Method...! \n";
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
    if (customerPayment.cardtype == null) {
        errors = errors + "Please Enter Card Type...! \n";
    }
    if (customerPayment.referenceno == null) {
        errors = errors + "Please Enter Reference No...! \n";
    }
    if (customerPayment.customerpaymentstatus_id == null) {
        errors = errors + "Please Select Customer Payment Status...! \n";
    }

    return errors;
}

//form submit event function 
const buttonCusSubmit = () => {
    console.log('Add Customer Payment', customerPayment);

    //check form error for required element
    let errors = checkFormError();
    if (errors == "") {
        //no errors get user confirmation
        let userConfirm = window.confirm("Are you sure to add following customer payment...?" +
            "\n Customer : " + customerPayment.invoice_id.customer_id.fullname +
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

    