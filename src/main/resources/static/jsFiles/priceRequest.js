//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function for refresh table
    refreshPriceRequestTable();

    //Call refresh form function
    refreshPriceRequestForm();

});

//create function for refresh table
const refreshPriceRequestTable = () => {

    //controller wala hadapu service eka magin data array eka laba ganima
    const priceRequests = getServiceRequest("/priceRequest/alldata");

    //create display property list
    //data types
    //string => string / data / number
    //function => object / array / boolean
    displayPropertyList = [
        //function name ekak add karai call kirimak sidu nowe

        { dataType: 'string', propertyName: 'requestno' },
        { dataType: 'function', propertyName: getItem },
        { dataType: 'string', propertyName: 'requireddate' },
        { dataType: 'function', propertyName: getPriceRequestStatus }
    ];

    // call tablefill function
    fillDataIntoTable(tablePriceRequestBody, priceRequests, displayPropertyList, rowFormRefill, priceRequestRowDelete, priceRequestRowPrint, "#offcanvasBottom");

    //call jquerry data table
    $('#tablePriceRequest').dataTable();
}

const getItem = (dataob) => {
    //ewani awasthawaka wenama veriable ekak hada gani. initially(muladi) string
    let items = "";
    // role list ekak ena nisa
    dataob.items.forEach((item, index) => {
        if (dataob.items.length - 1 == index) {
            //last item eken pasu "," ekak set nokarai
            items = items + item.itemname;
        } else {
            //items veriable ekata concatinate kara ganimata item object eke name access karala
            //name athara gap ekak thaba gani
            items = items + item.itemname + " , ";
        }

    });
    //awasanaye items object eka return karanawa
    return items;
}

// table ekehi status eka penwimata 
const getPriceRequestStatus = (dataob) => {
    if (dataob.pricelistrequeststatus_id != null) {
        if (dataob.pricelistrequeststatus_id.name == "Completed") {
            return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;" data-bs-toggle="tooltip"\n' +
                '                                                title="Completed"></i>'
        }
        if (dataob.pricelistrequeststatus_id.name == "Pending") {
            return '<i class="fa-solid fa-spinner fa-spin-pulse fa-xl" style="color: #fcac5c;" data-bs-toggle="tooltip"\n' +
                '                                                title="Pending"></i>'
        }
        if (dataob.pricelistrequeststatus_id.name == "Deleted") {
            return '<i class="fa-solid fa-trash-can fa-beat fa-xl" style="color: #fe1616;" data-bs-toggle="tooltip"\n' +
                '                                                title="Deleted"></i>'
        }
        if (dataob.pricelistrequeststatus_id.name == "Partially Added") {
            return '<i class="fa-solid fa-spinner fa-spin-pulse fa-xl" style="color: #f4eb01;" data-bs-toggle="tooltip"\n' +
                '                                                title="Partially Added"></i>'
        }
        if (dataob.pricelistrequeststatus_id.name == "Expired") {
            return '<i class="fa-solid fa-calendar-xmark fa-beat fa-xl" style="color: #f85d02;" data-bs-toggle="tooltip"\n' +
                '                                                title="Expired"></i>'
        }

        return dataob.pricelistrequeststatus_id.name;
    } else {
        return "-";
    }
}

// inner form button function area start
const addSelectedItems = () => {
    // mehidee selected ekak thibunoth pamanak add wimata sakas karai neththan click kala pasu erros ei >> eya welakwimata if yoda liyai
    if (selectAllItems.value != "") {
        // selected element eka veriable ekakata dama ganima
        let selectedItem = JSON.parse(selectAllItems.value);
        // ema element eka anith list ekata push kirima
        priceRequest.items.push(selectedItem);
        // ema dropdown eka load kirima
        fillDataIntoSelect(selectSelectedItems, "", priceRequest.items, "itemname");
        // ema element eka thibu list eken iwath kirima
        // e sadaha allItem let nowiya yuthuya
        // map eka sadaha allitem.map walin eka item object ekak gena eya ema item eke id eka selected item id ekata samana wiya yuthuya >> elesa samana nam exit wenawa >> exit unoth allItem list eken splice karanna ona selected element eka
        let extIndex = allItem.map(item => item.id).indexOf(selectedItem.id);
        // extIndex eka asamanai -1 nam allready exit wei
        if (extIndex != -1) {
            // extIndex,1 >> selected element eka idan eka element ekak makanna ona ewita selected eka ayath wei
            allItem.splice(extIndex, 1)
        }
        fillDataIntoSelect(selectAllItems, "", allItem, "itemname");
    } else {
        // select items empty check error sweetalert warning popup box open check
        Swal.fire({
            title: "Validation Error",
            text: "Please select an item to add!",
            icon: "warning",
            confirmButtonText: '<i class="fa-solid fa-check"></i> OK',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                htmlContainer: 'swal-custom-content',
                confirmButton: 'swal-custom-warning-btn'
            },
            buttonsStyling: false
        });
    }
}
const addAllItems = () => {
    // selected side eke list ekata all side eke siyalla add wiya yuthuya
    // for of ekak dama all side eke list eka read kala yuthuya
    for (const item of allItem) {
        priceRequest.items.push(item);
    }
    fillDataIntoSelect(selectSelectedItems, "", priceRequest.items, "itemname");

    // all side eka empty wiya yuthuya>>all side eke siyallama selected paththata yai
    allItem = [];
    fillDataIntoSelect(selectAllItems, "", allItem, "itemname");
}

const removeSelectedItems = () => {
    // mehidee selected ekak thibunoth pamanak remove wimata sakas karai neththan click kala pasu erros ei >> eya welakwimata if yoda liyai
    if (selectSelectedItems.value != "") {
        // selected side eken aragena all side ekata add karanawa
        // selected side eken remove kirima
        let selectedItem = JSON.parse(selectSelectedItems.value);
        allItem.push(selectedItem);
        fillDataIntoSelect(selectAllItems, "", allItem, "itemname");

        let extIndex = priceRequest.items.map(item => item.id).indexOf(selectedItem.id);
        if (extIndex != -1) {
            priceRequest.items.splice(extIndex, 1)
        }
        fillDataIntoSelect(selectSelectedItems, "", priceRequest.items, "itemname");
    } else {
        // remove items select empty check validation sweetalert warning modals displays
        Swal.fire({
            title: "Validation Error",
            text: "Please select an item to remove!",
            icon: "warning",
            confirmButtonText: '<i class="fa-solid fa-check"></i> OK',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                htmlContainer: 'swal-custom-content',
                confirmButton: 'swal-custom-warning-btn'
            },
            buttonsStyling: false
        });
    }
}

const removeAllItems = () => {
    // selected side list eka one by one read karala all paththata push kirima
    for (const item of priceRequest.items) {
        allItem.push(item);
    }
    fillDataIntoSelect(selectAllItems, "", allItem, "itemname");
    // selected side eka empty wima
    priceRequest.items = [];
    fillDataIntoSelect(selectSelectedItems, "", priceRequest.items, "itemname");
}
// inner form button function area end

const filterItemsBySupplier = () => {
    if (priceRequest.supplier_id != null) {
        // Clear selected items because they might not belong to the new supplier
        priceRequest.items = [];
        fillDataIntoSelect(selectSelectedItems, "", priceRequest.items, "itemname");

        let supplierItems = getServiceRequest('/item/getListBySupplier/' + priceRequest.supplier_id.id);

        // Exclude items already selected in priceRequest.items
        allItem = supplierItems.filter(item => {
            return !priceRequest.items.some(di => di.id === item.id);
        });

        fillDataIntoSelect(selectAllItems, "", allItem, "itemname");
    } else {
        allItem = [];
        fillDataIntoSelect(selectAllItems, "", allItem, "itemname");

        priceRequest.items = [];
        fillDataIntoSelect(selectSelectedItems, "", priceRequest.items, "itemname");
    }
}


const rowFormRefill = (dataob, rowIndex) => {

    console.log("Edit record", dataob, rowIndex);

    suppliers = getServiceRequest("/supplier/alldata");

    fillDataIntoSelectSupplier(selectSupplier, 'Select Supplier...!!!', suppliers);

    // dataob object eka use karala form fields refill karanna
    selectSupplier.value = JSON.stringify(dataob.supplier_id);
    dateRequireDate.value = dataob.requireddate;
    selectPriceRequestStatus.value = JSON.stringify(dataob.pricelistrequeststatus_id);


    // all side ekata me priceRequest ekata apply karan nethi items tika ganima 
    let supplierItems = getServiceRequest('/item/getListBySupplier/' + dataob.supplier_id.id);
    allItem = supplierItems.filter(item => {
        return !dataob.items.some(di => di.id === item.id);
    });
    fillDataIntoSelect(selectAllItems, "", allItem, "itemname");

    // inner form eka selected paththa fill kara ganima
    fillDataIntoSelect(selectSelectedItems, "", dataob.items, "itemname");

    // inner form eka magin add wana data list eka (entity file ekehi many to many wala Set<Brand> brands) length eka 0 da balai
    if (dataob.items && dataob.items.length > 0) {
        priceRequest.items = dataob.items;
    }

    //update kirima sadaha awashya object 2 sada ganima
    priceRequest = JSON.parse(JSON.stringify(dataob));
    oldPriceRequest = JSON.parse(JSON.stringify(dataob));

    console.log("priceRequest", priceRequest);
    console.log("oldPriceRequest", oldPriceRequest);

    ///     hide add button
    divButtonAdd.style.display = "none";

//     show update button
    divButtonUpdate.style.display = "flex";
}


// row eke delete button eka click kalaama delete confirm window popups sweetalert open karanawa
const priceRequestRowDelete = (dataob, rowIndex) => {
    // console trace log check items records
    console.log("Delete", dataob, rowIndex);

    // delete validation checks popup confirmation sweetalert format
    Swal.fire({
        title: "Confirm Delete",
        html: `Are you sure to delete the following Price Request?<br><br>` +
              `<strong>Supplier Name:</strong> ${dataob.supplier_id.suppliername}<br>` +
              `<strong>Required Date:</strong> ${dataob.requireddate}<br>` +
              `<strong>Status:</strong> ${dataob.pricelistrequeststatus_id.name}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-trash"></i> Delete',
        cancelButtonText: '<i class="fa-solid fa-xmark"></i> Cancel',
        customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-content',
            confirmButton: 'swal-custom-cancel-btn',
            cancelButton: 'swal-custom-confirm-btn'
        },
        buttonsStyling: false
    }).then((result) => {
        // delete check yes confirmation trigger
        if (result.isConfirmed) {
            // post request methods endpoints delete service method calls
            let deleteResponce = getHTTPServiceRequest("/priceRequest/delete", "DELETE", dataob);

            // server delete request success returned ok
            if (deleteResponce == "OK") {
                // delete successful modal display check
                Swal.fire({
                    title: "Deleted!",
                    text: "Price Request deleted successfully.",
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
                // data table refresh karagannawa
                refreshPriceRequestTable();
                // input form reset clear configurations reload karanawa
                refreshPriceRequestForm();
            } else {
                // error alerts failed sweetalerts dialog show
                Swal.fire({
                    title: "Error!",
                    text: "Delete not successful: " + deleteResponce,
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
}
// table eka thula athi view button ekata click kalaama view modal eka open karanawa   
const priceRequestRowPrint = (dataob, rowIndex) => {
    console.log("View", dataob, rowIndex);
    // html wala athi modal ekak open weema
    supplierNameView.innerText = dataob.supplier_id.suppliername;
    requireDateView.innerText = dataob.requireddate;
    priceRequestStatusView.innerText = dataob.pricelistrequeststatus_id.name;

    //ewani awasthawaka wenama veriable ekak hada gani. initially(muladi) string
    let selectedItems = "";
    // item list ekak ena nisa
    dataob.items.forEach((item, index) => {
        if (dataob.items.length - 1 == index) {
            //last item eken pasu "," ekak set nokarai
            selectedItems = selectedItems + item.itemname;
        } else {
            //items veriable ekata concatinate kara ganimata item object eke name access karala
            //name athara gap ekak thaba gani
            selectedItems = selectedItems + item.itemname + " , ";
        }

    });
    document.getElementById("selectedItemsView").textContent = selectedItems;

    $("#offcanvasBottomPriceRequestView").offcanvas("show"); // show the offcanvas
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
                <title>Print View - Price Request Details</title>
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
const refreshPriceRequestForm = () => {

    priceRequest = new Object();
    // selected data tika item list ekakata yodai
    priceRequest.items = new Array();

    formPriceRequest.reset();

    //validation colors iwath kirima
    setDefault([selectSupplier, dateRequireDate, selectPriceRequestStatus]);

    suppliers = getServiceRequest("/supplier/alldata");

    fillDataIntoSelectSupplier(selectSupplier, "Select Supplier", suppliers);

    // dynamic element refill kala yuthuya
    allItem = [];
    let priceRequestStatuses = getServiceRequest('/priceRequestStatus/alldata')

    fillDataIntoSelect(selectAllItems, "", allItem, "itemname");
    fillDataIntoSelect(selectSelectedItems, "", priceRequest.items, "itemname");
    fillDataIntoSelect(selectPriceRequestStatus, "Please select status...!", priceRequestStatuses, "name");

    // supplier status eka auto active wee thibimata
    selectPriceRequestStatus.value = JSON.stringify(priceRequestStatuses[0]);
    priceRequest.pricelistrequeststatus_id = priceRequestStatuses[0];
    // validation colour eka laba deema
    prevElementStatus = selectPriceRequestStatus.previousElementSibling;
    selectPriceRequestStatus.style.borderBottom = "4px solid green";
    prevElementStatus.style.backgroundColor = "green";
    selectPriceRequestStatus.classList.remove("is-invalid");
    selectPriceRequestStatus.classList.add("is-valid");

    //     hide update button
    divButtonUpdate.style.display = "none";

//     show add button
    divButtonAdd.style.display = "flex";

    // required date ekata min max add kara ganima
    //min - current date eka
    //max - current date eka + 2 weeks
    //date format eka yyyy-mm-dd
    let currentDate = new Date();
    // get month wala value eka 0-11 wena nisa +1 karai
    let currentMonth = currentDate.getMonth() + 1;
    // 9n pasuwa cracter 2k atha ema nisa 9n pasuwa 0k add kara gannawa
    if (currentMonth < 10) {
        currentMonth = "0" + currentMonth;
    }
    // get date eka 1-31 wena nisa 9n pasuwa cracter 2k atha
    let currentDay = currentDate.getDate();
    if (currentDay < 10) {
        currentDay = "0" + currentDay;
    }
    dateRequireDate.min = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay;

    // max date eka 14 days add kara gannawa
    currentDate.setDate(currentDate.getDate() + 14);
    let maxCurrentMonth = currentDate.getMonth() + 1;
    // 9n pasuwa cracter 2k atha ema nisa 9n pasuwa 0k add kara gannawa
    if (maxCurrentMonth < 10) {
        maxCurrentMonth = "0" + maxCurrentMonth;
    }
    // get date eka 1-31 wena nisa 9n pasuwa cracter 2k atha
    let maxCurrentDay = currentDate.getDate();
    if (maxCurrentDay < 10) {
        maxCurrentDay = "0" + maxCurrentDay;
    }
    dateRequireDate.max = currentDate.getFullYear() + "-" + maxCurrentMonth + "-" + maxCurrentDay;
}

//form eke ek ek property check kara values naththan msg ekak return kara ganima sdaha
const checkPriceRequestFormErrors = () => {
    let errors = "";

    if (priceRequest.supplier_id == null) {
        errors = errors + "Please Enter valid Supplier...! \n";
    }

    if (priceRequest.requireddate == null) {
        errors = errors + "Please Enter valid Required Date...! \n";
    }
    // inner form eka magin add wana data list eka (entity file ekehi many to many wala Set<Item> "items") length eka 0 da balai
    if (priceRequest.items.length == 0) {
        errors = errors + "Please Enter valid Item...! \n";
    }
    return errors;
}

//PriceRequest form submit event function 
//PriceRequest form submit event function 
const buttonPriceRequestSubmit = () => {
    // console print check log updates details
    console.log('Add Price Request', priceRequest);

    // form required validation checks error collection lists
    let errors = checkPriceRequestFormErrors();
    // errors kisith nathnam
    if (errors == "") {
        // price requests submission confirmations sweetalert popups open check
        Swal.fire({
            title: "Confirm Submission",
            html: `Are you sure to add the following price request?<br><br>` +
                  `<strong>Supplier:</strong> ${priceRequest.supplier_id.suppliername}<br>` +
                  `<strong>Required Date:</strong> ${priceRequest.requireddate}`,
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
            // submit confirms check yes kala nam
            if (result.isConfirmed) {
                // post request service method methods trigger sets database
                let postResponce = getHTTPServiceRequest("/priceRequest/insert", "POST", priceRequest);
                // success check responses ok returned unoth
                if (postResponce == "OK") {
                    // success status informational dialogues sweetalerts modal popup open
                    Swal.fire({
                        title: "Saved!",
                        text: "Price request saved successfully.",
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
                    // table metrics reload checks
                    refreshPriceRequestTable();
                    // form fields data clears defaults
                    refreshPriceRequestForm();
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
        // required errors check validation warnings sweetalert modal display check
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

//define function for check item updates
const checkPriceRequestFormUpdate = () => {

    let updates = "";

    //mulinma veriable eka thibeda balima >> item and olditem >> compair kirima sadaha value thibiya yuthuya
    if (priceRequest != null && oldPriceRequest != null) {
        if (priceRequest.requireddate != oldPriceRequest.requireddate) {
            updates = updates + "Required Date is change...! \n";
        }
        if (priceRequest.supplier_id.suppliername != oldPriceRequest.supplier_id.suppliername) {
            updates = updates + "Supplier Name is change...! \n";
        }

        if (priceRequest.pricelistrequeststatus_id.name != oldPriceRequest.pricelistrequeststatus_id.name) {
            updates = updates + "Price List Request Status is change...! \n";
        }

        // update karapu items balanawa kalin tibba items ekka
        if (priceRequest.items.length !== oldPriceRequest.items.length) {
            updates = updates + "Selected items are change...! \n";
        } else {
            let extItemCount = 0;
            for (let element of priceRequest.items) {

                oldPriceRequest.items.forEach(item => {
                    if (element.id == item.id) {
                        extItemCount = extItemCount + 1;
                    }
                });

            }
            if (extItemCount != priceRequest.items.length) {
                updates = updates + "Selected items are change...! \n";
            }
        }

    }
    return updates;

}

//define function for update item
//define function for update item
const buttonPriceRequestUpdate = () => {
    // console check parameters update logs
    console.log("priceRequest", priceRequest);
    console.log("oldPriceRequest", oldPriceRequest);

    // validation forms errors check inputs
    let errors = checkPriceRequestFormErrors();

    // validation errors check verify empty check
    if (errors == "") {
        // changes updates check
        let updates = checkPriceRequestFormUpdate();
        // updates value details differences check
        if (updates != "") {
            // updates validation confirm dialogue box sweetalert open checks
            Swal.fire({
                title: "Confirm Update",
                html: "Are you sure to update the following changes?<br><br>" + updates.replace(/\n/g, "<br>"),
                icon: "question",
                showCancelButton: true,
                confirmButtonText: '<i class="fa-solid fa-pen-to-square"></i> Update',
                cancelButtonText: '<i class="fa-solid fa-xmark"></i> Cancel',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-content',
                    confirmButton: 'swal-custom-warning-btn',
                    cancelButton: 'swal-custom-cancel-btn'
                },
                buttonsStyling: false
            }).then((result) => {
                // updates parameters confirm yes checks
                if (result.isConfirmed) {
                    // PUT method service request call updates database
                    let putResponce = getHTTPServiceRequest("/priceRequest/update", "PUT", priceRequest);
                    // update status success ok returned check
                    if (putResponce == "OK") {
                        // success status updates alerts open checks
                        Swal.fire({
                            title: "Updated!",
                            text: "Price Request details updated successfully.",
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
                        // table content refresh check
                        refreshPriceRequestTable();
                        // input forms default clear fields metrics
                        refreshPriceRequestForm();
                        // close offcanvas forms sheet modes checks
                        $("#offcanvasBottom").offcanvas("hide");
                    } else {
                        // update failed error sweetalerts modal displays checks
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to update: " + putResponce,
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
            // no changes details update popup box open checks
            Swal.fire({
                title: "No Changes",
                text: "Nothing to update.",
                icon: "info",
                confirmButtonText: '<i class="fa-solid fa-check"></i> OK',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-content',
                    confirmButton: 'swal-custom-warning-btn'
                },
                buttonsStyling: false
            });
        }
    } else {
        // required parameters check error validation modals displays
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

const clearPriceRequestForm = () => {
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
            // refresh price request form function call karalai forms inputs values defaults resets karagannawa
            refreshPriceRequestForm();
        }
    });
}

// Define function to fill supplier name along with their brands into select dropdown
const fillDataIntoSelectSupplier = (parentId, message, dataList) => {
    parentId.innerHTML = "";
    if (message != "") {
        let optionMsgEs = document.createElement("option");
        optionMsgEs.value = "";
        optionMsgEs.selected = "selected";
        optionMsgEs.disabled = "disabled";
        optionMsgEs.innerText = message;
        parentId.appendChild(optionMsgEs);
    }

    dataList.forEach(dataOb => {
        let option = document.createElement("option");
        option.value = JSON.stringify(dataOb);

        let brands = "";

        let brandNames = [];
        dataOb.brands.forEach(brand => {
            brandNames.push(brand.name);
        });
        brands = " - (" + brandNames.join(" , ") + ")";


        option.innerText = dataOb.suppliername + brands;
        parentId.appendChild(option);
    });
}

