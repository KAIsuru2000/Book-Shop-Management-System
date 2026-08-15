window.addEventListener("load", () => {

    console.log("browser load Event - Invoice");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    refreshInvoiceTable();

    refreshInvoiceForm();

    // table body ekata click event listener ekak add karanawa row ekak click karaddi edit/delete buttons hide karanna
    tableInvoiceBody.addEventListener("click", () => {
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

//refresh table Area 
const refreshInvoiceTable = () => {

    // mema functon eka common js eka thula define kara thibee me sadaha controller wala athi alldata service eka magin data laba gani
    let invoices = getServiceRequest("/invoice/alldata");

    //column list eka sadaa ganima
    //ui ekehi table eka bala meya sadai
    let propertyList = [
        { propertyName: "invoiceno", dataType: "string" },
        { propertyName: getCustomerName, dataType: "function" },
        { propertyName: getAddedDate, dataType: "function" },
        { propertyName: getItemList, dataType: "function" },
        { propertyName: "totalamount", dataType: "decimal" },
        { propertyName: getInvoiceStatus, dataType: "function" },
    ];

    //call filldataintotable function (talebodyId, datalist, column list, editefunctionname, deletefunctionname, printfunctionname, buttonvisibility) 
    fillDataIntoTable(tableInvoiceBody, invoices, propertyList, invoiceRowFormRefill, invoiceRowDelete, invoiceRowView, "#offcanvasBottom");

    // ui ekehi table eka datatable formate ekata convert kara gannima
    $('#tableInvoice').DataTable();

}

//refresh form Area
const refreshInvoiceForm = () => {
    // create new object for invoice form
    invoice = new Object();
    invoice.invoiceHasInventoryList = new Array();
    oldInvoice = null;

    // initialize inner form object
    invoiceHasInventory = new Object();
    oldInvoiceHasInventory = null;

    // system eke active wela thiyena okkoma loyalty tiers details server eken gannawa
    let loyaltyTiers = getServiceRequest("/loyaltycustomer/alldata");
    // labuna list eka dynamic windows environment variable ekakata assign karagannawa
    window.loyaltyTiersList = loyaltyTiers;

    // active wela thiyena customers details server eken gannawa
    let customers = getServiceRequest("/customer/alldata");
    // selectCustomer dropdown element eka clear karagannawa
    selectCustomer.innerHTML = "";
    // default/placeholder selection message option ekak hadagannawa
    let optionMsg = document.createElement("option");
    // option value eka empty string set karanawa
    optionMsg.value = "";
    // default selection option eka widiyata select karagannawa
    optionMsg.selected = "selected";
    // user ta click karanna bari wenna disabled set karanawa
    optionMsg.disabled = "disabled";
    // option eke display text message set karanawa
    optionMsg.innerText = "Select Customer";
    // dynamic option elements customer dropdown ekata append karagannawa
    selectCustomer.appendChild(optionMsg);

    // loop eka magin customer lists elements ekata data fill karagannawa
    customers.forEach(customer => {
        // dynamic option element ekak hadagannawa
        let option = document.createElement("option");
        // customer object eke value details json parser string karala option value ekata set karanawa
        option.value = JSON.stringify(customer);

        // customer ge wathman points gannawa points null nam eka 0 set karanawa
        let pts = customer.points != null ? customer.points : 0;
        // active card tier details placeholder name set karagannawa
        let card = "No Tier";
        // system loyalty list tiers thiyeda kiyala check karanawa
        if (window.loyaltyTiersList) {
            // customer ge points loop karala card levels map karagannawa check karanawa
            for (let tier of window.loyaltyTiersList) {
                // points limits tier levels limits verify karanawa
                if (pts >= tier.startpoint && pts <= tier.endpoint) {
                    // correct card level name assign karagannawa
                    card = tier.cardname;
                    // loop eken eliyata enawa
                    break;
                }
            }
            // points pramanaya maximum endpoint ekatath wada wadi nam maximum card name select karagannawa
            if (card === "No Tier") {
                // tiers loop eka use karagannawa
                for (let tier of window.loyaltyTiersList) {
                    // points range validation verify check karanawa
                    if (pts >= tier.startpoint) {
                        // highest card name assign karagannawa
                        card = tier.cardname;
                    }
                }
            }
        }

        // display information and template layout string set karagannawa: Name (Points [Card]) - Mobile Number
        option.innerText = customer.mobileno + " - " + customer.fullname + " (" + pts + "pts [" + card + "])";
        // build option elements dropdown ekata append karagannawa
        selectCustomer.appendChild(option);
    });

    // get invoice status data and fill dropdown
    let invoiceStatuses = getServiceRequest("/invoiceStatues/alldata");
    fillDataIntoSelect(selectInvoiceStatus, "Select Invoice Status", invoiceStatuses, "name");
    // status eka form eka load wana wita select wi thibimata
    // selected value eka string walin ena nisa stringify kara gani
    selectInvoiceStatus.value = JSON.stringify(invoiceStatuses[0]);
    // ema value eka newatha object ekata set kala yuththa object format ekeni
    invoice.invoicestatus_id = JSON.parse(selectInvoiceStatus.value);
    // status field eka sadaha validation colour eka laba deema
    prevElementInvoiceStatus = selectInvoiceStatus.previousElementSibling;
    selectInvoiceStatus.style.borderBottom = "4px solid green";
    prevElementInvoiceStatus.style.backgroundColor = "green";
    selectInvoiceStatus.classList.remove("is-invalid");
    selectInvoiceStatus.classList.add("is-valid");

    // get inventory data and fill item dropdown
    let activeInventories = getServiceRequest("/inventory/alldata");
    window.activeInventoriesList = activeInventories;

    selectItem.innerHTML = "";
    // optionMsg variable eka kalin define karala thiyena nisa let keyword eka nathuwa re-assign karanawa
    optionMsg = document.createElement("option");
    optionMsg.value = "";
    optionMsg.selected = "selected";
    optionMsg.disabled = "disabled";
    optionMsg.innerText = "Select Item";
    selectItem.appendChild(optionMsg);

    let addedItemIds = [];
    activeInventories.forEach(inventory => {
        if (!addedItemIds.includes(inventory.item_id.id)) {
            let option = document.createElement("option");
            option.value = JSON.stringify(inventory); // store inventory to match inventory_id binding if needed
            option.innerText = inventory.item_id.itemcode + " - " + inventory.item_id.itemname;
            selectItem.appendChild(option);
            addedItemIds.push(inventory.item_id.id);
        }
    });

    btnInvoiceUpdate.classList.add("d-none");
    btnInvoiceSubmit.classList.remove("d-none");

    refreshInvoiceInnerForm();
}

// filter sales prices based on selected item
const filterSalesPrices = () => {
    // Reset quantity and line price when new item is selected/cleared
    textQuantity.value = "";
    textLinePrice.value = "";
    if (typeof invoiceHasInventory !== 'undefined') {
        invoiceHasInventory.quentity = null;
        invoiceHasInventory.lineprice = null;
    }
    setDefault([textQuantity, textLinePrice]);
    textQuantity.placeholder = "Enter Quantity";

    if (selectItem.value === "") {
        selectUnitPrice.innerHTML = "";
        let optionMsg = document.createElement("option");
        optionMsg.value = "";
        optionMsg.selected = "selected";
        optionMsg.disabled = "disabled";
        optionMsg.innerText = "Select Unit Price";
        selectUnitPrice.appendChild(optionMsg);

        selectUnitPrice.style.borderBottom = "1px solid #ced4da";
        selectUnitPrice.classList.remove("is-valid");
        selectUnitPrice.classList.remove("is-invalid");

        if (typeof invoiceHasInventory !== 'undefined') {
            invoiceHasInventory.uniteprice = null;
        }
        calculateSeasonalDiscount();
        return;
    }

    let selectedInventoryObj = JSON.parse(selectItem.value);
    let selectedItemId = selectedInventoryObj.item_id.id;

    selectUnitPrice.innerHTML = "";
    let optionMsg = document.createElement("option");
    optionMsg.value = "";
    optionMsg.selected = "selected";
    optionMsg.disabled = "disabled";
    optionMsg.innerText = "Select Unit Price";
    selectUnitPrice.appendChild(optionMsg);

    // Get unique sales prices for the selected item
    let addedPrices = [];
    window.activeInventoriesList.forEach(inventory => {
        if (inventory.item_id.id === selectedItemId) {
            if (!addedPrices.includes(inventory.salesprice)) {
                let option = document.createElement("option");
                option.value = inventory.salesprice;
                option.innerText = inventory.salesprice;
                selectUnitPrice.appendChild(option);
                addedPrices.push(inventory.salesprice);
            }
        }
    });

    // Reset unit price validation since a new item was selected
    selectUnitPrice.style.borderBottom = "1px solid #ced4da";
    selectUnitPrice.classList.remove("is-valid");
    selectUnitPrice.classList.remove("is-invalid");

    if (typeof invoiceHasInventory !== 'undefined') {
        invoiceHasInventory.uniteprice = null;
    }
    calculateSeasonalDiscount();
}

// Function to validate quantity against available inventory quantity
const validateQuantity = () => {
    let quantityValue = textQuantity.value;
    let prevElement = textQuantity.previousElementSibling;

    // Check if item dropdown has a selection
    if (selectItem.value === "") {
        textQuantity.placeholder = "Enter Quantity";
        textQuantity.style.borderBottom = "4px solid red";
        prevElement.style.backgroundColor = "red";
        textQuantity.classList.add("is-invalid");
        textQuantity.classList.remove("is-valid");
        invoiceHasInventory.quentity = null;
        generateLinePrice();
        return;
    }

    let selectedInventoryObj = JSON.parse(selectItem.value);
    let selectedItemId = selectedInventoryObj.item_id.id;
    let selectedPrice = selectUnitPrice.value;
    let availableQty = 0;
    let matchingInventory = null;

    if (selectedPrice !== "") {
        // Find matching inventory record with selected unit price and item ID
        matchingInventory = window.activeInventoriesList.find(inventory => 
            inventory.item_id.id === selectedItemId && 
            parseFloat(inventory.salesprice).toFixed(2) === parseFloat(selectedPrice).toFixed(2)
        );
        if (matchingInventory) {
            availableQty = matchingInventory.avalablequantity;
            // Bind the correct inventory_id to invoiceHasInventory
            invoiceHasInventory.inventory_id = matchingInventory;
        } else {
            availableQty = selectedInventoryObj.avalablequantity;
        }
    } else {
        availableQty = selectedInventoryObj.avalablequantity;
    }

    // Set dynamic placeholder to show available quantity
    textQuantity.placeholder = "Enter Quantity (Max: " + availableQty + ")";

    if (quantityValue !== "") {
        let qty = parseInt(quantityValue);
        let regExp = new RegExp("^[1-9][0-9]*$");
        
        // Quantity must be a valid positive integer and less than or equal to available quantity
        if (regExp.test(quantityValue) && qty <= availableQty && qty > 0) {
            textQuantity.style.borderBottom = "4px solid green";
            prevElement.style.backgroundColor = "green";
            textQuantity.classList.remove("is-invalid");
            textQuantity.classList.add("is-valid");
            invoiceHasInventory.quentity = quantityValue;
        } else {
            textQuantity.style.borderBottom = "4px solid red";
            prevElement.style.backgroundColor = "red";
            textQuantity.classList.add("is-invalid");
            textQuantity.classList.remove("is-valid");
            invoiceHasInventory.quentity = null;
        }
    } else {
        if (textQuantity.required) {
            textQuantity.style.borderBottom = "4px solid red";
            prevElement.style.backgroundColor = "red";
            textQuantity.classList.add("is-invalid");
            textQuantity.classList.remove("is-valid");
            invoiceHasInventory.quentity = null;
        } else {
            textQuantity.style.borderBottom = "1px solid #ced4da";
            prevElement.style.backgroundColor = "black";
            textQuantity.classList.remove("is-invalid");
            textQuantity.classList.remove("is-valid");
            invoiceHasInventory.quentity = null;
        }
    }
    generateLinePrice();
}


// get customer name function
const getCustomerName = (dataob) => {
    if (dataob.customer_id) {
        return dataob.customer_id.fullname;
    } else {
        return "-";
    }
}

// get added date function
const getAddedDate = (dataob) => {
    if (dataob.addeddatetime) {
        return dataob.addeddatetime.split("T")[0];
    } else {
        return "-";
    }
}

// get item list function
const getItemList = (dataob) => {
    let itemList = "";
    if (dataob.invoiceHasInventoryList && dataob.invoiceHasInventoryList.length > 0) {
        for (let i = 0; i < dataob.invoiceHasInventoryList.length; i++) {
            const hasInv = dataob.invoiceHasInventoryList[i];
            if (hasInv.inventory_id && hasInv.inventory_id.item_id) {
                itemList += hasInv.inventory_id.item_id.itemname;
            } else {
                itemList += "Unknown Item";
            }
            if (i < dataob.invoiceHasInventoryList.length - 1) {
                itemList += ", ";
            }
        }
    } else {
        itemList = "No Items";
    }
    return itemList;
}

// get invoice status function
const getInvoiceStatus = (dataob) => {
    if (dataob.invoicestatus_id) {
        if (dataob.invoicestatus_id.name == "paid") {
            return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #07f702;" data-bs-toggle="tooltip" title="Paid"></i>';
        } else if (dataob.invoicestatus_id.name == "pending") {
            return '<i class="fa-solid fa-circle-exclamation fa-beat fa-xl" style="color: #f6ee04;" data-bs-toggle="tooltip" title="Pending"></i>';
        } else if (dataob.invoicestatus_id.name == "Canceled") {
            return '<i class="fa-solid fa-circle-xmark fa-beat fa-xl" style="color: #fa0000;" data-bs-toggle="tooltip" title="Canceled"></i>';
        } else {
            return dataob.invoicestatus_id.name;
        }
    } else {
        return "-";
    }
}

// refill form fields with selected row data
const invoiceRowFormRefill = (ob, index) => {
    console.log("Edit", ob, index);

    // refill select customer (optional)
    if (ob.customer_id) {
        selectCustomer.value = JSON.stringify(ob.customer_id);
    } else {
        selectCustomer.value = "";
    }

    // refill values
    textTotalAmount.value = parseFloat(ob.totalamount).toFixed(2);
    textDiscountAmount.value = parseFloat(ob.discountamount).toFixed(2);
    textNetAmount.value = parseFloat(ob.netamount).toFixed(2);
    textNote.value = ob.note ? ob.note : "";

    // refill select invoice status
    selectInvoiceStatus.value = JSON.stringify(ob.invoicestatus_id);

    // show validations as green
    let elementsToGreen = [textTotalAmount, textDiscountAmount, textNetAmount, selectInvoiceStatus];
    if (ob.customer_id) {
        elementsToGreen.push(selectCustomer);
    }
    elementsToGreen.forEach(element => {
        element.style.borderBottom = "4px solid green";
        element.previousElementSibling.style.backgroundColor = "green";
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");
    });

    // populate inner table list
    invoice = JSON.parse(JSON.stringify(ob));
    oldInvoice = JSON.parse(JSON.stringify(ob));

    // show update button, hide add button
    btnInvoiceUpdate.classList.remove("d-none");
    btnInvoiceSubmit.classList.add("d-none");

    // open form offcanvas
    $("#offcanvasBottom").offcanvas("show");

    // refresh inner form and table
    refreshInvoiceInnerForm();
}

// soft delete row by changing status to Canceled
// meya invoice row delete kirime function ekayi
const invoiceRowDelete = (ob, index) => {
    // console log eke delete details pennanawa
    console.log("Delete", ob, index);
    // invoice eka cancel wela thiyedath balanawa
    if (ob.invoicestatus_id.name === "Canceled") {
        // ehenam cancel karanna baha kiyala alert ekak danawa
        Swal.fire({
            title: "Already Canceled",
            text: "This Invoice is already Canceled!",
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
        return;
    }

    // cancel kirima thahawuru karaganna sweetalert pop up eka open karanawa
    Swal.fire({
        title: "Confirm Cancel",
        html: `Are you sure to Cancel the following Invoice?<br><br>` +
              `<strong>Invoice No:</strong> ${ob.invoiceno}<br>` +
              `<strong>Customer:</strong> ${ob.customer_id ? ob.customer_id.fullname : "N/A"}<br>` +
              `<strong>Net Amount:</strong> Rs. ${ob.netamount}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-trash"></i> Cancel',
        cancelButtonText: '<i class="fa-solid fa-xmark"></i> Close',
        customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-content',
            confirmButton: 'swal-custom-cancel-btn',
            cancelButton: 'swal-custom-confirm-btn'
        },
        buttonsStyling: false
    }).then((result) => {
        // user cancel kirima confirm kala nam
        if (result.isConfirmed) {
            // delete request service eka call karanawa
            let deleteResponse = getHTTPServiceRequest("/invoice/delete", "DELETE", ob);
            // server eken OK labunoth
            if (deleteResponse === "OK") {
                // cancel successful modal popup eka open karanawa
                Swal.fire({
                    title: "Canceled!",
                    text: "Invoice Canceled successfully!",
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
                // table reload karanawa
                refreshInvoiceTable();
                // form refresh karanawa
                refreshInvoiceForm();
            } else {
                // failure modal eka open karanawa
                Swal.fire({
                    title: "Error!",
                    text: "Failed to cancel: " + deleteResponse,
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

// view row details dynamically
const invoiceRowView = (ob, index) => {
    let tableHtml = `
        <thead>
            <th colspan="3" style="background-color:white; color:black; border: none; text-align: center; font-size:x-large;">
                Invoice Details
            </th>
        </thead>
        <tbody style="border: none;">
            <tr>
                <th style="color:black; text-align: left; border: none; width: 40%;">Invoice No</th>
                <th style="color: black; border: none; width: 10%;"> :- </th>
                <td style="color:black; text-align: left; font-style: italic; font-weight: 500; border: none;" id="invoiceNoView">${ob.invoiceno}</td>
            </tr>
            <tr>
                <th style="color:black; text-align: left; border: none;">Customer Name</th>
                <th style="color: black; border: none;"> :- </th>
                <td style="color:black; text-align: left; font-style: italic; font-weight: 500; border: none;">${ob.customer_id ? ob.customer_id.fullname : 'N/A'}</td>
            </tr>
            <tr>
                <th style="color:black; text-align: left; border: none;">Added Date</th>
                <th style="color: black; border: none;"> :- </th>
                <td style="color:black; text-align: left; font-style: italic; font-weight: 500; border: none;">${ob.addeddatetime.split('T')[0]}</td>
            </tr>
            <tr>
                <th style="color:black; text-align: left; border: none;">Total Amount</th>
                <th style="color: black; border: none;"> :- </th>
                <td style="color:black; text-align: left; font-style: italic; font-weight: 500; border: none;">Rs. ${parseFloat(ob.totalamount).toFixed(2)}</td>
            </tr>
            <tr>
                <th style="color:black; text-align: left; border: none;">Discount Amount</th>
                <th style="color: black; border: none;"> :- </th>
                <td style="color:black; text-align: left; font-style: italic; font-weight: 500; border: none;">Rs. ${parseFloat(ob.discountamount).toFixed(2)}</td>
            </tr>
            <tr>
                <th style="color:black; text-align: left; border: none;">Net Amount</th>
                <th style="color: black; border: none;"> :- </th>
                <td style="color:black; text-align: left; font-style: italic; font-weight: 500; border: none;">Rs. ${parseFloat(ob.netamount).toFixed(2)}</td>
            </tr>
            <tr>
                <th style="color:black; text-align: left; border: none;">Status</th>
                <th style="color: black; border: none;"> :- </th>
                <td style="color:black; text-align: left; font-style: italic; font-weight: 500; border: none;">${ob.invoicestatus_id.name}</td>
            </tr>
            <tr>
                <th style="color:black; text-align: left; border: none;">Note</th>
                <th style="color: black; border: none;"> :- </th>
                <td style="color:black; text-align: left; font-style: italic; font-weight: 500; border: none;">${ob.note ? ob.note : '-'}</td>
            </tr>
            <tr>
                <th style="color:black; text-align: left; border: none; vertical-align: top;">Items</th>
                <th style="color: black; border: none; vertical-align: top;"> :- </th>
                <td style="color:black; text-align: left; border: none;">
                    <table class="table table-bordered table-sm mt-2">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Unit Price</th>
                                <th>Qty</th>
                                <th>Line Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ob.invoiceHasInventoryList.map(item => `
                                <tr>
                                    <td>${item.inventory_id && item.inventory_id.item_id ? item.inventory_id.item_id.itemname : 'Unknown Item'}</td>
                                    <td>Rs. ${parseFloat(item.uniteprice).toFixed(2)}</td>
                                    <td>${item.quentity}</td>
                                    <td>Rs. ${parseFloat(item.lineprice).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    `;
    tableView.innerHTML = tableHtml;
    $("#offcanvasBottomView").offcanvas("show");
}

// line price eka automatically generate karanna use karana function eka
const generateLinePrice = () => {
    // invoiceHasInventory object eken discounted price eka gannawa
    let unitePrice = invoiceHasInventory.uniteprice;
    // quantity variable eka gannawa
    let quantity = invoiceHasInventory.quentity;

    // discounted price saha quantity select wela thiyeda kiyala check karanawa
    if (unitePrice != null && quantity != null && unitePrice !== "" && quantity !== "") {
        // line price eka calculate karagannawa: linePrice = discountedPrice * quantity
        let linePrice = parseFloat(unitePrice) * parseInt(quantity);
        // linePrice value eka number ekakda kiyala check karanawa
        if (!isNaN(linePrice)) {
            // UI text field ekata line price value eka set karanawa
            textLinePrice.value = linePrice.toFixed(2);
            // textValidator function eka run karala object ekata bind karagannawa
            textValidator(textLinePrice, '^.*$', 'invoiceHasInventory', 'lineprice');
        } else {
            // error ekak thiyeda lines reset karanawa
            textLinePrice.value = "";
            setDefault([textLinePrice]);
            invoiceHasInventory.lineprice = null;
        }
    } else {
        // fields empty nam line price fields clear karanawa
        textLinePrice.value = "";
        setDefault([textLinePrice]);
        invoiceHasInventory.lineprice = null;
    }
}

// define function for refresh inner form and table
const refreshInvoiceInnerForm = () => {
    // re-initialize inner form object
    invoiceHasInventory = new Object();

    // Reset selectItem dropdown
    selectItem.value = "";
    // Reset unit price dropdown to default placeholder
    selectUnitPrice.innerHTML = "";
    let optionMsg = document.createElement("option");
    optionMsg.value = "";
    optionMsg.selected = "selected";
    optionMsg.disabled = "disabled";
    optionMsg.innerText = "Select Unit Price";
    selectUnitPrice.appendChild(optionMsg);

    // Clear quantity and line price fields
    textQuantity.value = "";
    textLinePrice.value = "";
    // textDiscountPrice.value = "";

    // Reset styles
    setDefault([selectItem, selectUnitPrice, textQuantity, textLinePrice]);

    // Reset buttons
    btnInvoiceItemUpdate.classList.add("d-none");
    btnInvoiceItemSubmit.classList.remove("d-none");

    // Refresh inner table
    let propertyList = [
        { propertyName: generateInnerItemName, dataType: "function" },
        { propertyName: "uniteprice", dataType: "decimal" },
        // { propertyName: "discountprice", dataType: "decimal" },
        { propertyName: "quentity", dataType: "string" },
        { propertyName: "lineprice", dataType: "decimal" }
    ];

    fillDataIntoInnerTable(tableInnerBody, invoice.invoiceHasInventoryList, propertyList, invoiceItemFormRefill, invoiceItemDelete, "#offcanvasBottom");

    // Update total amount in the main form
    let totalAmount = 0.00;
    for (const item of invoice.invoiceHasInventoryList) {
        totalAmount = parseFloat(totalAmount) + parseFloat(item.lineprice);
    }

    if (totalAmount != 0.00) {
        textTotalAmount.value = totalAmount.toFixed(2);
        invoice.totalamount = textTotalAmount.value;
        prevElementTotalAmount = textTotalAmount.previousElementSibling;
        textTotalAmount.style.borderBottom = "4px solid green";
        prevElementTotalAmount.style.backgroundColor = "green";
        textTotalAmount.classList.remove("is-invalid");
        textTotalAmount.classList.add("is-valid");
    } else {
        textTotalAmount.value = "";
        invoice.totalamount = null;
        setDefault([textTotalAmount]);
    }

    // new items add/remove una wita dynamic discount eka aye hadaganna loyaltyDiscountCalculate call karanawa
    loyaltyDiscountCalculate();
}

// Generate item name for inner table
const generateInnerItemName = (dataob) => {
    if (dataob.inventory_id && dataob.inventory_id.item_id) {
        return dataob.inventory_id.item_id.itemname;
    }
    return "-";
}

// Inner table row dummy refill/delete
const invoiceItemFormRefill = (ob, index) => {
    // Not needed for now or can leave empty
}

const invoiceItemDelete = (ob, index) => {
    // item eka delete karanna confirm box eka sweetalert walin hadagannawa
    Swal.fire({
        title: "Confirm Remove",
        text: "Are you sure to remove this item?",
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
        // user confirm kala nam
        if (result.isConfirmed) {
            // dynamic list eken item eka remove karanawa
            invoice.invoiceHasInventoryList.splice(index, 1);
            // inner form refresh karanawa
            refreshInvoiceInnerForm();
        }
    });
}

const buttonInvoiceItemSubmit = () => {
    // errors record karaganna patha empty string ekak thiyagannawa
    let errors = "";

    // item select karala thiyeda kiyala check karanawa
    if (invoiceHasInventory.inventory_id == null) {
        errors += "Please select an Item!\n";
    }
    // unit price select karala thiyeda kiyala check karanawa
    if (invoiceHasInventory.uniteprice == null) {
        errors += "Please select a Unit Price!\n";
    }
    // discounted price calculate wela thiyeda kiyala check karanawa
    // if (invoiceHasInventory.discountprice == null) {
    //     errors += "Please enter/calculate a valid Discounted Price!\n";
    // }
    // quantity type karala thiyeda kiyala check karanawa
    if (invoiceHasInventory.quentity == null) {
        errors += "Please enter a valid Quantity!\n";
    }
    // line price calculate wela thiyeda kiyala check karanawa
    if (invoiceHasInventory.lineprice == null) {
        errors += "Please enter a valid Line Price!\n";
    }

    // error mukuth nathnam pamanak confirm box eka penwanawa
    if (errors === "") {
        // e item eka kalin list ekata add karalada kiyala check karanna variable ekak 0 karagannawa
        let isExist = false;
        // list eke thiyena data loop karala check karanawa
        for (const item of invoice.invoiceHasInventoryList) {
            // matches item found check
            if (item.inventory_id.id === invoiceHasInventory.inventory_id.id) {
                // duplicate item kiyala set karanawa
                isExist = true;
                // loop eken eliyata enawa
                break;
            }
        }

        // item eka already check eka true nam alert ekak denawa
        if (isExist) {
            Swal.fire({
                title: "Duplicate Item",
                text: "This item has already been added to the list!",
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
        } else {
            // details conform check karanna dialog confirm box eka display karanawa
            Swal.fire({
                title: "Confirm Add Item",
                html: `Are you sure to add the following item to invoice?<br><br>` +
                      `<strong>Item:</strong> ${invoiceHasInventory.inventory_id.item_id.itemname}<br>` +
                      `<strong>Unit Price:</strong> Rs. ${invoiceHasInventory.uniteprice}<br>` +
                      `<strong>Quantity:</strong> ${invoiceHasInventory.quentity}<br>` +
                      `<strong>Line Price:</strong> Rs. ${invoiceHasInventory.lineprice}`,
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
                // confirm kala nam dynamic list ekata push karala form eka refresh karanawa
                if (result.isConfirmed) {
                    // item successfully conform alert box eka display karanawa
                    Swal.fire({
                        title: "Added!",
                        text: "Item added successfully to invoice!",
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
                    // main invoice inventory list ekata object eka push karanawa
                    invoice.invoiceHasInventoryList.push(invoiceHasInventory);
                    // refresh form action eka call karanawa
                    refreshInvoiceInnerForm();
                }
            });
        }
    } else {
        // invalid data thiyeda kiyala errors alert box eke display karanawa
        Swal.fire({
            title: "Validation Error",
            html: "Please fill all required fields correctly:<br><br>" + errors.replace(/\n/g, "<br>"),
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

const buttonPurchaseOrderItemUpdate = () => {
    // Dummy update function
}

// form error validator
const checkFormError = () => {
    let errors = "";
    if (invoice.totalamount == null) {
        errors += "Please enter a valid Total Amount!\n";
    }
    if (invoice.discountamount == null) {
        errors += "Please enter a valid Discount Amount!\n";
    }
    if (invoice.netamount == null) {
        errors += "Please enter a valid Net Amount!\n";
    }
    if (invoice.invoicestatus_id == null) {
        errors += "Please select an Invoice Status!\n";
    }
    if (invoice.invoiceHasInventoryList.length === 0) {
        errors += "Please add at least one Item to the invoice!\n";
    }
    return errors;
}

// invoice submit action
const buttonInvoiceSubmit = () => {
    // console log eke details check karanawa
    console.log("Add Invoice", invoice);
    // form inputs errors check karagannawa
    let errors = checkFormError();
    // errors kisith nathnam
    if (errors === "") {
        // invoice submit action validation confirm pop up box eka open karanawa
        Swal.fire({
            title: "Confirm Submission",
            html: `Are you sure to add this Invoice?<br><br>` +
                  `<strong>Customer:</strong> ${invoice.customer_id ? invoice.customer_id.fullname : "N/A"}<br>` +
                  `<strong>Total Amount:</strong> Rs. ${invoice.totalamount}<br>` +
                  `<strong>Net Amount:</strong> Rs. ${invoice.netamount}`,
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
            // submit confirmation ok kala nam
            if (result.isConfirmed) {
                // service request post method eken database save kirimata request yawai
                let postResponse = getHTTPServiceRequest("/invoice/insert", "POST", invoice);
                // success return unoth
                if (postResponse === "OK") {
                    // invoice saved success message alert modal box eka pennanawa
                    Swal.fire({
                        title: "Saved!",
                        text: "Invoice saved successfully!",
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
                    // table data refresh karagannawa
                    refreshInvoiceTable();
                    // form fields clear/refresh karagannawa
                    refreshInvoiceForm();
                    // form modal offcanvas eka close karagannawa
                    $("#offcanvasBottom").offcanvas("hide");
                } else {
                    // service submit failed warnings sweetalert modal ekin dakkwanna
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to submit: " + postResponse,
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
        // required fields fill error warning sweetalert popup alert open karanawa
        Swal.fire({
            title: "Validation Error",
            html: "Please fill all required fields correctly:<br><br>" + errors.replace(/\n/g, "<br>"),
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

// check update updates list
const checkFormUpdate = () => {
    let updates = "";
    if (invoice != null && oldInvoice != null) {
        if (invoice.totalamount != oldInvoice.totalamount) {
            updates += "Total Amount changed from Rs. " + oldInvoice.totalamount + " to Rs. " + invoice.totalamount + "\n";
        }
        if (invoice.discountamount != oldInvoice.discountamount) {
            updates += "Discount Amount changed from Rs. " + oldInvoice.discountamount + " to Rs. " + invoice.discountamount + "\n";
        }
        if (invoice.netamount != oldInvoice.netamount) {
            updates += "Net Amount changed from Rs. " + oldInvoice.netamount + " to Rs. " + invoice.netamount + "\n";
        }
        if (invoice.note != oldInvoice.note) {
            updates += "Note changed!\n";
        }
        if (invoice.invoicestatus_id.id != oldInvoice.invoicestatus_id.id) {
            updates += "Status changed to " + invoice.invoicestatus_id.name + "\n";
        }
        if (JSON.stringify(invoice.invoiceHasInventoryList) !== JSON.stringify(oldInvoice.invoiceHasInventoryList)) {
            updates += "Items inside invoice have changed!\n";
        }
    }
    return updates;
}

// invoice update action
const buttonInvoiceUpdate = () => {
    // validation error items checks check karagannawa
    let errors = checkFormError();
    // errors kisith nathnam
    if (errors === "") {
        // dynamic field updates updates values verify checks karagannawa
        let updates = checkFormUpdate();
        // wenas weem kisith sidu wila nathnam
        if (updates === "") {
            // no updates changed information box modal popups dakkwanna
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
        } else {
            // updates confirmaton checking sweetalert dialogue popup box open karagannawa
            Swal.fire({
                title: "Confirm Update",
                html: "Are you sure to update this Invoice with following changes?<br><br>" + updates.replace(/\n/g, "<br>"),
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
                // update confirm action ok kala nam
                if (result.isConfirmed) {
                    // service update request method put method eken database yawai
                    let putResponse = getHTTPServiceRequest("/invoice/update", "PUT", invoice);
                    // update status response success returned unoth
                    if (putResponse === "OK") {
                        // success update information alert popup box open karanawa
                        Swal.fire({
                            title: "Updated!",
                            text: "Invoice updated successfully!",
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
                        // table content refresh karalai
                        refreshInvoiceTable();
                        // form clear refresh settings default fill karanawa
                        refreshInvoiceForm();
                        // input forms offcanvas sheet models hides/close karagannawa
                        $("#offcanvasBottom").offcanvas("hide");
                    } else {
                        // error alerts response sweetalerts modal show karagannawa
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to update: " + putResponse,
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
    } else {
        // required errors check validation warnings sweetalert modal dialogue box dakkwanna
        Swal.fire({
            title: "Validation Error",
            html: "Please fill all required fields correctly:<br><br>" + errors.replace(/\n/g, "<br>"),
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

// invoice row print details
const buttonPrintRow = () => {
    const newWindow = window.open();
    let printView = `
        <head>
            <title>Bright Book Shop | Invoice Details</title>
            <link rel='icon' href='/image/title.png'>
            <link rel='stylesheet' href='/bootstrap-5.2.3/css/bootstrap.min.css'>
            <script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script>
            <link rel='stylesheet' href='/fontawesome-free-6.4.2/css/all.css'>
            <link rel='stylesheet' href='/Style/common.css'>
        </head>
        <body style='background-color:white; justify-content: center; display: flex; padding: 20px;'>
            <div style='width: 100%; max-width: 800px;'>
                ${tableView.outerHTML}
            </div>
        </body>
    `;
    newWindow.document.write(printView);
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1500);
}

// clear invoice form action
const clearInvoiceForm = () => {
    // clear form confirmation popup window sweetalert open karagannawa
    Swal.fire({
        title: "Confirm Refresh",
        text: "Do you want to clear/refresh the form?",
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
        // clear confirm check yes kala nam
        if (result.isConfirmed) {
            // refresh invoice form function call karala form eka reset default settings set karanawa
            refreshInvoiceForm();
        }
    });
}

// invoice item clear button eka magin inner form eka clear wimta
const buttonInvoiceItemClear = () => {
    refreshInvoiceInnerForm();
}

// customer ge loyalty points anuwa discount amount saha net amount calculate karana function eka
const loyaltyDiscountCalculate = () => {
    // total amount eka text field eken read karala float number ekak widiyata gannawa
    let totalAmount = parseFloat(textTotalAmount.value);

    // total amount eka valid number ekakda kiyala check karanawa
    if (!isNaN(totalAmount) && totalAmount > 0) {
        // discount percentage eka default 0.00 widiyata thiyagannawa
        let discountPercent = 0.00;

        // invoice object eke customer_id field ekak saha customer object eke points variable eka thiyeda kiyala check karanawa
        if (invoice.customer_id && invoice.customer_id.points != null) {
            // customer ge points anuwa adala loyalty tier eka server eken Get request ekak magin gannawa
            let loyaltyTier = getServiceRequest("/loyaltycustomer/bycustomerpoints/" + invoice.customer_id.points);
            // labunu loyalty tier eka null neththan saha eke discount percentage ekak thiyeda kiyala check karanawa
            if (loyaltyTier && loyaltyTier.discount != null) {
                // tier eke discount percentage eka discountPercent variable ekata assign karagannawa
                discountPercent = parseFloat(loyaltyTier.discount);
            }
        }

        // customer ge loyalty discount percentage eka total amount eken adu karala discounted amount eka calculate karagannawa
        let discountAmountValue = totalAmount - (totalAmount * (discountPercent / 100));
        // net amount eka discounted amount value ekatama samanawa auto fill karagannawa
        let netAmountValue = discountAmountValue;

        // UI text box walata calculate una values decimals 2k widiyata set karanawa
        textDiscountAmount.value = discountAmountValue.toFixed(2);
        textNetAmount.value = netAmountValue.toFixed(2);

        // invoice object eke properties walata me values set karagannawa
        invoice.discountamount = textDiscountAmount.value;
        invoice.netamount = textNetAmount.value;

        // discount amount field eke border color eka valid green karanawa
        textDiscountAmount.style.borderBottom = "4px solid green";
        textDiscountAmount.previousElementSibling.style.backgroundColor = "green";
        textDiscountAmount.classList.remove("is-invalid");
        textDiscountAmount.classList.add("is-valid");

        // net amount field eke border color eka valid green karanawa
        textNetAmount.style.borderBottom = "4px solid green";
        textNetAmount.previousElementSibling.style.backgroundColor = "green";
        textNetAmount.classList.remove("is-invalid");
        textNetAmount.classList.add("is-valid");
    } else {
        // total amount zero ho empty nam UI fields clear karagannawa
        textDiscountAmount.value = "";
        textNetAmount.value = "";
        // invoice object properties null karanawa
        invoice.discountamount = null;
        invoice.netamount = null;
        // validation border colors normal colors walata default karanawa
        setDefault([textDiscountAmount, textNetAmount]);
    }
}

// select karapu item ekata adala active seasonal discount eka check karala discounted price eka hadana function eka
// const calculateSeasonalDiscount = () => {
//     // selectItem eke value ekak thiyeda kiyala check karanawa
//     if (selectItem.value !== "" && selectUnitPrice.value !== "") {
//         // select karapu item object eka parse karala gannawa
//         let selectedInventoryObj = JSON.parse(selectItem.value);
//         // item id eka variable ekakata assign karagannawa
//         let itemId = selectedInventoryObj.item_id.id;
//         // selectUnitPrice element eke value eka float number ekak widiyata gannawa
//         let unitPrice = parseFloat(selectUnitPrice.value);
//
//         // unit price valid check eka karanawa
//         if (!isNaN(unitPrice) && unitPrice > 0) {
//             // item id ekata adala active seasonal discount details server eken gannawa
//             let activeDiscount = getServiceRequest("/seasonaldiscount/activebyitem/" + itemId);
//             // discount rate/value variable eka default 0.00 karagannawa
//             let discountAmount = 0.00;
//
//             // active discount object ekak thiyeda kiyala check karanawa
//             if (activeDiscount && activeDiscount.discount != null) {
//                 // active discount value eka float type ekata convert karagannawa
//                 discountAmount = parseFloat(activeDiscount.discount);
//             }
//
//             // unit price eken seasonal discount amount eka adu karala discounted price eka calculate karanawa
//             let discountedPrice = unitPrice - discountAmount;
//             // discounted price 0 ta adu nam eka 0 set karanawa
//             if (discountedPrice < 0) {
//                 discountedPrice = 0.00;
//             }
//
//             // UI text field ekata calculate una discounted price eka decimals 2k widiyata set karanawa
//             textDiscountPrice.value = discountedPrice.toFixed(2);
//
//             // invoiceHasInventory inner object ekata discounted price eka set karagannawa
//             invoiceHasInventory.discountprice = textDiscountPrice.value;
//
//             // discounted price box eke color validation border eka valid (green) karanawa
//             textDiscountPrice.style.borderBottom = "4px solid green";
//             textDiscountPrice.previousElementSibling.style.backgroundColor = "green";
//             textDiscountPrice.classList.remove("is-invalid");
//             textDiscountPrice.classList.add("is-valid");
//
//             // newatha line price eka generate karanna call karanawa
//             generateLinePrice();
//         } else {
//             // unit price value eka invalid nam fields default settings walata reset karanawa
//             textDiscountPrice.value = "";
//             invoiceHasInventory.discountprice = null;
//             setDefault([textDiscountPrice]);
//             generateLinePrice();
//         }
//     } else {
//         // select items empty nam fields clear karanawa
//         textDiscountPrice.value = "";
//         invoiceHasInventory.discountprice = null;
//         setDefault([textDiscountPrice]);
//         generateLinePrice();
//     }
// }

// user manually discounted amount wenas karana wita net amount automatic fill karaganna use karana function eka
const updateDiscountAmountField = (element) => {
    // text validation check karagannawa
    textValidator(element, '^.*$', 'invoice', 'discountamount');

    // discount amount value valid number ekakda kiyala check karanawa
    if (invoice.discountamount != null && invoice.discountamount !== "") {
        // net amount text field value set karanawa
        textNetAmount.value = parseFloat(invoice.discountamount).toFixed(2);
        // invoice object netamount bind karagannawa
        invoice.netamount = textNetAmount.value;

        // net amount element styles valid green set karagannawa
        textNetAmount.style.borderBottom = "4px solid green";
        textNetAmount.previousElementSibling.style.backgroundColor = "green";
        textNetAmount.classList.remove("is-invalid");
        textNetAmount.classList.add("is-valid");
    } else {
        // invalid nam fields data clear karanawa
        textNetAmount.value = "";
        invoice.netamount = null;
        setDefault([textNetAmount]);
    }
}