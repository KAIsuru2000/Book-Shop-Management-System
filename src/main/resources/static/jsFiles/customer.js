//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function for refresh table
    refreshCustomerTable();

    //Call refresh form function
    refreshCustomerForm();

})

//create function for refresh table
const refreshCustomerTable = () => {

    //controller wala hadapu service eka magin data array eka laba ganima
    const customers = getServiceRequest("/customer/alldata");

    //create display property list
    //data types
    //string => string / data / number
    //function => object / array / boolean
    displayPropertyList = [
        //function name ekak add karai call kirimak sidu nowe
        
        { dataType: 'string', propertyName: 'regno' },
        { dataType: 'string', propertyName: 'fullname' },
        { dataType: 'string', propertyName: 'mobileno' },
        { dataType: 'string', propertyName: 'email' },
        { dataType: 'function', propertyName: getCustomerStatus }
    ];

    // call tablefill function
    fillDataIntoTable(tableCustomerBody, customers, displayPropertyList, customerRowFormRefill, customerRowDelete, customerRowPrint, "#offcanvasBottom");

    //call jquerry data table
    $('#tableCustomer').dataTable();
}

// table ekehi status eka penwimata 
const getCustomerStatus = (dataob) => {
    if (dataob.customerstatus_id.name == "Active") {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;"></i>'
    } else {
        return '<i class="fa-solid fa-circle-xmark fa-beat fa-xl" style="color: #fe0101;"></i>'
    }

}

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

const refreshCustomerForm = () => {

    customer = new Object();

    formCustomer.reset();

    //validation colors iwath kirima
    setDefault([textFullName, telMobil, inputEmail, selectCusStatus, textNote]);

    // dynamic element refill kala yuthuya
    let customerStatus = getServiceRequest('/customerStatus/alldata')
    
    fillDataIntoSelect(selectCusStatus, "Please Select Customer Status..!", customerStatus, "name");
    // status eka form eka load wana wita select wi thibimata
    // selected value eka string walin ena nisa stringify kara gani
    selectCusStatus.value = JSON.stringify(customerStatus[0]);
    // ema value eka newatha object ekata set kala yuththa object format ekeni
    customer.customerstatus_id = JSON.parse(selectCusStatus.value);
    // status field eka sadaha validation colour eka laba deema
    prevElementCusStatus = selectCusStatus.previousElementSibling;
    selectCusStatus.style.borderBottom = "4px solid green";
    prevElementCusStatus.style.backgroundColor = "green";
    selectCusStatus.classList.remove("is-invalid");
    selectCusStatus.classList.add("is-valid");
}

//form eke ek ek property check kara values naththan msg ekak return kara ganima sdaha
const checkFormError = () => {
    let errors = "";

    if (customer.fullname == null) {
        errors = errors + "Please Enter valid Full Name...! \n";
    }

    if (customer.email == null) {
        errors = errors + "Please Enter valid email...! \n";
    }
    if (customer.mobileno == null) {
        errors = errors + "Please Enter valid mobile no...! \n";
    }
    if (customer.customerstatus_id == null) {
        errors = errors + "Please Enter valid customer status...! \n";
    }

    return errors;
}

//form submit event function 
const buttonCusSubmit = () => {
    console.log('Add Customer', customer);

    //check form error for required element
    let errors = checkFormError();
    if (errors == "") {
        //no errors get user confirmation
        let userConfirm = window.confirm("Are you sure to add following customer...?" +
            "\n Customer full name : " + customer.fullname +
            "\n Customer email : " + customer.email +
            "\n Customer mobileno : " + customer.mobileno +
            "\n Customer status : " + customer.customerstatus_id.name
        );
        if (userConfirm) {
            // call post service
            let postResponce = getHTTPServiceRequest("/customer/insert", "POST", customer);
            if (postResponce == "OK") {
                window.alert("Save successfully ");
                refreshCustomerTable();
                refreshCustomerForm();
                $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas
            } else {
                window.alert("Failed to submit \n" + errors + postResponce);
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
        refreshCustomerForm();
    }
}

    