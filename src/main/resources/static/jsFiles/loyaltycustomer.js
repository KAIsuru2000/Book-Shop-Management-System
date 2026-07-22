window.addEventListener('load', () => {

    $('[data-bs-toggle="tooltip"]').tooltip();
    refreshLoyaltycustomerTable();
    refreshLoyaltycustomerForm();

    // log wela inna user "Cashier" da kiyala check karanna user ge role eka gannawa
    let loggedUserObj = getServiceRequest("/loggeduser/role");
    // loggedUser variable ekata role name eka set karagannawa
    let loggedUser = loggedUserObj.role;

    // user cashier nam pamanak meya apply karanawa
    if (loggedUser === "Cashier") {
        // table ekata udin thiyena Add New button eka select karanawa
        let addBtn = document.querySelector(".offCanvasButton");
        // button element eka thibe nam eya hide karanawa
        if (addBtn) {
            // style display eka none karala button eka nopenena se hadanawa
            addBtn.style.display = "none";
        }
    }

    // table body ekata click event listener ekak add karanawa row ekak click karaddi edit/delete buttons hide karanna
    tableLoyaltycustomerBody.addEventListener("click", () => {
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

});

const refreshLoyaltycustomerForm = () => {
    loyaltycustomer = new Object();
    oldLoyaltycustomer = null;

    textCardName.value = '';
    numStartPoint.value = '';
    numEndPoint.value = '';
    numPointIncrease.value = '';
    numDiscount.value = '';

    textCardName.style.border = '';
    numStartPoint.style.border = '';
    numEndPoint.style.border = '';
    numPointIncrease.style.border = '';
    numDiscount.style.border = '';

    document.getElementById("updateButton").disabled = true;
    document.getElementById("submitButton").disabled = false;
}

const refreshLoyaltycustomerTable = () => {

    loyaltycustomers = getServiceRequest("/loyaltycustomer/alldata");

    const displayProperty = [
        { dataType: 'string', propertyName: 'cardname' },
        { dataType: 'string', propertyName: 'startpoint' },
        { dataType: 'string', propertyName: 'endpoint' },
        { dataType: 'decimal', propertyName: 'pointincreaseamount' },
        { dataType: 'decimal', propertyName: 'discount' }
    ];

    fillDataIntoTable(tableLoyaltycustomerBody, loyaltycustomers, displayProperty, refilForm, deleteRow, printRow, "#offcanvasBottom");
    
    if ($.fn.DataTable.isDataTable('#tableLoyaltycustomer')) {
        $('#tableLoyaltycustomer').DataTable().destroy();
    }
    
    $('#tableLoyaltycustomer').dataTable();
}

const clearLoyaltycustomerForm = () => {
    let confirmMsg = "Are you sure you want to clear form?";
    Swal.fire({
        title: "Confirm?",
        text: confirmMsg,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, clear it!"
      }).then((result) => {
        if (result.isConfirmed) {
            refreshLoyaltycustomerForm();
        }
      });
}

const checkErrors = () => {
    let errors = "";
    if (loyaltycustomer.cardname == null) {
        errors += "Card Name cannot be null\n";
        textCardName.style.border = '2px solid red';
    }
    if (loyaltycustomer.startpoint == null) {
        errors += "Start Point cannot be null\n";
        numStartPoint.style.border = '2px solid red';
    }
    if (loyaltycustomer.endpoint == null) {
        errors += "End Point cannot be null\n";
        numEndPoint.style.border = '2px solid red';
    }
    if (loyaltycustomer.pointincreaseamount == null) {
        errors += "Point Increase Amount cannot be null\n";
        numPointIncrease.style.border = '2px solid red';
    }
    if (loyaltycustomer.discount == null) {
        errors += "Discount cannot be null\n";
        numDiscount.style.border = '2px solid red';
    }
    return errors;
}

const buttonLoyaltycustomerSubmit = () => {
    let errors = checkErrors();
    if (errors == "") {
        let confirmMsg = "Are you sure you want to save following Details?\n"
            + "\nCard Name : " + loyaltycustomer.cardname
            + "\nDiscount : " + loyaltycustomer.discount + "%";

        Swal.fire({
            title: "Confirm?",
            text: confirmMsg,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save it!"
        }).then((result) => {
            if (result.isConfirmed) {
                let serverResponse = getHTTPServiceRequest("/loyaltycustomer/insert", "POST", loyaltycustomer);
                if (serverResponse === "OK") {
                    Swal.fire({ title: "Done!", text: "Save Successfully.", icon: "success" });
                    $('#offcanvasBottom').offcanvas('hide');
                    refreshLoyaltycustomerForm();
                    refreshLoyaltycustomerTable();
                } else {
                    Swal.fire({ icon: "error", title: "Oops...", text: serverResponse });
                }
            }
        });
    } else {
        alert("form has following errors \n \n" + errors);
    }
}

let oldLoyaltycustomer;

const refilForm = (item, index) => {
    $('#offcanvasBottom').offcanvas('show');

    loyaltycustomer = JSON.parse(JSON.stringify(item));
    oldLoyaltycustomer = JSON.parse(JSON.stringify(item));

    textCardName.value = loyaltycustomer.cardname;
    numStartPoint.value = loyaltycustomer.startpoint;
    numEndPoint.value = loyaltycustomer.endpoint;
    numPointIncrease.value = loyaltycustomer.pointincreaseamount;
    numDiscount.value = loyaltycustomer.discount;

    textCardName.style.border = '2px solid green';
    numStartPoint.style.border = '2px solid green';
    numEndPoint.style.border = '2px solid green';
    numPointIncrease.style.border = '2px solid green';
    numDiscount.style.border = '2px solid green';

    document.getElementById("updateButton").disabled = false;
    document.getElementById("submitButton").disabled = true;
}

const updateUpdates = () => {
    let updates = "";
    if (loyaltycustomer.cardname != oldLoyaltycustomer.cardname) {
        updates += "Card Name Is Changed\n";
    }
    if (loyaltycustomer.startpoint != oldLoyaltycustomer.startpoint) {
        updates += "Start Point Is Changed\n";
    }
    if (loyaltycustomer.endpoint != oldLoyaltycustomer.endpoint) {
        updates += "End Point Is Changed\n";
    }
    if (loyaltycustomer.pointincreaseamount != oldLoyaltycustomer.pointincreaseamount) {
        updates += "Point Increase Amount Is Changed\n";
    }
    if (loyaltycustomer.discount != oldLoyaltycustomer.discount) {
        updates += "Discount Is Changed\n";
    }
    return updates;
}

const buttonLoyaltycustomerUpdate = () => {
    let errors = checkErrors();
    if (errors == "") {
        let updates = updateUpdates();
        if (updates == "") {
            alert("No changes are detected..!")
        } else {
            Swal.fire({
                title: "Are you sure update following Details?",
                text: updates,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Update it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    let serverResponse = getHTTPServiceRequest("/loyaltycustomer/update", "PUT", loyaltycustomer);
                    if (serverResponse === "OK") {
                        Swal.fire({ title: "Update!", text: "Update Successfully.", icon: "success" });
                        $('#offcanvasBottom').offcanvas('hide');
                        refreshLoyaltycustomerTable();
                        refreshLoyaltycustomerForm();
                    } else {
                        Swal.fire({ icon: "error", title: "Oops...", text: "Update failed \n " + serverResponse });
                    }
                }
            });            
        }
    } else {
        alert("form has following errors \n \n" + errors);
    }
}

const deleteRow = (item, index) => {
    let confirmMsg = "Are you sure you want to Delete following Tier?\n\nCard Name : " + item.cardname;
    
    Swal.fire({
        title: "Are you sure?",
        text: confirmMsg,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let serverResponse = getHTTPServiceRequest("/loyaltycustomer/delete", "DELETE", item);
            if (serverResponse === "OK") {
                Swal.fire({ title: "Deleted!", text: "Delete Successfully.", icon: "success" });
                refreshLoyaltycustomerTable();
            } else {
                Swal.fire({ icon: "error", title: "Oops...", text: 'Delete failed \n ' + serverResponse });
            }
        }
    });
}

const printRow = (item, index) => {
    let newWindow = window.open();
    newWindow.document.write("<h2>Loyalty Tier Details</h2><p><b>Card Name: </b>" + item.cardname + "</p>");
    newWindow.document.write("<p><b>Start Point: </b>" + item.startpoint + "</p>");
    newWindow.document.write("<p><b>End Point: </b>" + item.endpoint + "</p>");
    newWindow.document.write("<p><b>Discount: </b>" + item.discount + "%</p>");
    setTimeout(function() { newWindow.print(); newWindow.close(); }, 500);
}
