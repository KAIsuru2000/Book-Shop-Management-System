window.addEventListener("load", () => {

    console.log("browser load Event - Invoice");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    refreshInvoiceTable();

    refreshInvoiceForm();

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
        { propertyName: "totalamount", dataType: "string" },
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
    oldInvoice = null;

    // initialize inner form object
    invoiceHasInventory = new Object();
    oldInvoiceHasInventory = null;

    // get customer data from backend
    let customers = getServiceRequest("/customer/alldata");
    // fill customer data into customer dropdown (mobile no and name)
    fillDataIntoSelectTwo(selectCustomer, "Select Customer", customers, "mobileno", "fullname");

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
    let optionMsg = document.createElement("option");
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
}

// filter sales prices based on selected item
const filterSalesPrices = () => {
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
    
    if(typeof invoiceHasInventory !== 'undefined') {
        invoiceHasInventory.uniteprice = null;
    }
}

// get customer name function
const getCustomerName = (dataob) => {
    if (dataob.customer_id) {
        return dataob.customer_id.fullname;
    } else {
        return "N/A";
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
            itemList += dataob.invoiceHasInventoryList[i].inventory_id.itemname;
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
        if (dataob.invoicestatus_id.name == "Paid") {
            return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #07f702;" data-bs-toggle="tooltip" title="Paid"></i>';
        } else if (dataob.invoicestatus_id.name == "Pending") {
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

// dummy functions to prevent undefined errors in fillDataIntoTable
const invoiceRowFormRefill = (ob, index) => {
    console.log("Edit", ob, index);
}

const invoiceRowDelete = (ob, index) => {
    console.log("Delete", ob, index);
}

const invoiceRowView = (ob, index) => {
    console.log("View", ob, index);
}
