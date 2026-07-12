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
const invoiceRowDelete = (ob, index) => {
    console.log("Delete", ob, index);
    if (ob.invoicestatus_id.name === "Canceled") {
        window.alert("This Invoice is already Canceled!");
        return;
    }

    let userConfirm = window.confirm("Are you sure to Cancel the following Invoice?\n" +
        "Invoice No: " + ob.invoiceno + "\n" +
        "Customer: " + (ob.customer_id ? ob.customer_id.fullname : "N/A") + "\n" +
        "Net Amount: Rs. " + ob.netamount
    );
    if (userConfirm) {
        let deleteResponse = getHTTPServiceRequest("/invoice/delete", "DELETE", ob);
        if (deleteResponse === "OK") {
            window.alert("Invoice Canceled successfully!");
            refreshInvoiceTable();
            refreshInvoiceForm();
        } else {
            window.alert("Failed to cancel:\n" + deleteResponse);
        }
    }
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
    let discountPrice = invoiceHasInventory.discountprice;
    // quantity variable eka gannawa
    let quantity = invoiceHasInventory.quentity;

    // discounted price saha quantity select wela thiyeda kiyala check karanawa
    if (discountPrice != null && quantity != null && discountPrice !== "" && quantity !== "") {
        // line price eka calculate karagannawa: linePrice = discountedPrice * quantity
        let linePrice = parseFloat(discountPrice) * parseInt(quantity);
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
    textDiscountPrice.value = "";

    // Reset styles
    setDefault([selectItem, selectUnitPrice, textQuantity, textLinePrice, textDiscountPrice]);

    // Reset buttons
    btnInvoiceItemUpdate.classList.add("d-none");
    btnInvoiceItemSubmit.classList.remove("d-none");

    // Refresh inner table
    let propertyList = [
        { propertyName: generateInnerItemName, dataType: "function" },
        { propertyName: "uniteprice", dataType: "decimal" },
        { propertyName: "discountprice", dataType: "decimal" },
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
    let userConfirm = window.confirm("Are you sure to remove this item?");
    if (userConfirm) {
        invoice.invoiceHasInventoryList.splice(index, 1);
        refreshInvoiceInnerForm();
    }
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
    if (invoiceHasInventory.discountprice == null) {
        errors += "Please enter/calculate a valid Discounted Price!\n";
    }
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
            window.alert("This item has already been added to the list!");
        } else {
            // details conform check karanna dialog confirm box eka display karanawa
            let userConfirm = window.confirm("Are you sure to add following item to invoice...?"
                + "\n Item : " + invoiceHasInventory.inventory_id.item_id.itemname
                + "\n Unit Price : " + invoiceHasInventory.uniteprice
                + "\n Discounted Price : " + invoiceHasInventory.discountprice
                + "\n Quantity : " + invoiceHasInventory.quentity
                + "\n Line Price : " + invoiceHasInventory.lineprice
            );
            
            // confirm kala nam dynamic list ekata push karala form eka refresh karanawa
            if (userConfirm) {
                // item successfully conform alert box eka display karanawa
                window.alert("Item added successfully to invoice...!");
                // main invoice inventory list ekata object eka push karanawa
                invoice.invoiceHasInventoryList.push(invoiceHasInventory);
                // refresh form action eka call karanawa
                refreshInvoiceInnerForm();
            }
        }
    } else {
        // invalid data thiyeda kiyala errors alert box eke display karanawa
        window.alert("Please fill all required fields correctly:\n" + errors);
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
    console.log("Add Invoice", invoice);
    let errors = checkFormError();
    if (errors === "") {
        let userConfirm = window.confirm("Are you sure to add this Invoice?\n" +
            "Customer: " + (invoice.customer_id ? invoice.customer_id.fullname : "N/A") + "\n" +
            "Total Amount: Rs. " + invoice.totalamount + "\n" +
            "Net Amount: Rs. " + invoice.netamount
        );
        if (userConfirm) {
            let postResponse = getHTTPServiceRequest("/invoice/insert", "POST", invoice);
            if (postResponse === "OK") {
                window.alert("Invoice saved successfully!");
                refreshInvoiceTable();
                refreshInvoiceForm();
                $("#offcanvasBottom").offcanvas("hide");
            } else {
                window.alert("Failed to submit:\n" + postResponse);
            }
        }
    } else {
        window.alert("Please fill all required fields correctly:\n" + errors);
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
    let errors = checkFormError();
    if (errors === "") {
        let updates = checkFormUpdate();
        if (updates === "") {
            window.alert("Nothing to update!");
        } else {
            let userConfirm = window.confirm("Are you sure to update this Invoice with following changes?\n" + updates);
            if (userConfirm) {
                let putResponse = getHTTPServiceRequest("/invoice/update", "PUT", invoice);
                if (putResponse === "OK") {
                    window.alert("Invoice updated successfully!");
                    refreshInvoiceTable();
                    refreshInvoiceForm();
                    $("#offcanvasBottom").offcanvas("hide");
                } else {
                    window.alert("Failed to update:\n" + putResponse);
                }
            }
        }
    } else {
        window.alert("Please fill all required fields correctly:\n" + errors);
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
    let userConfirm = window.confirm("Do you want to clear/refresh the form?");
    if (userConfirm) {
        refreshInvoiceForm();
    }
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
const calculateSeasonalDiscount = () => {
    // selectItem eke value ekak thiyeda kiyala check karanawa
    if (selectItem.value !== "" && selectUnitPrice.value !== "") {
        // select karapu item object eka parse karala gannawa
        let selectedInventoryObj = JSON.parse(selectItem.value);
        // item id eka variable ekakata assign karagannawa
        let itemId = selectedInventoryObj.item_id.id;
        // selectUnitPrice element eke value eka float number ekak widiyata gannawa
        let unitPrice = parseFloat(selectUnitPrice.value);
        
        // unit price valid check eka karanawa
        if (!isNaN(unitPrice) && unitPrice > 0) {
            // item id ekata adala active seasonal discount details server eken gannawa
            let activeDiscount = getServiceRequest("/seasonaldiscount/activebyitem/" + itemId);
            // discount rate/value variable eka default 0.00 karagannawa
            let discountAmount = 0.00;
            
            // active discount object ekak thiyeda kiyala check karanawa
            if (activeDiscount && activeDiscount.discount != null) {
                // active discount value eka float type ekata convert karagannawa
                discountAmount = parseFloat(activeDiscount.discount);
            }
            
            // unit price eken seasonal discount amount eka adu karala discounted price eka calculate karanawa
            let discountedPrice = unitPrice - discountAmount;
            // discounted price 0 ta adu nam eka 0 set karanawa
            if (discountedPrice < 0) {
                discountedPrice = 0.00;
            }
            
            // UI text field ekata calculate una discounted price eka decimals 2k widiyata set karanawa
            textDiscountPrice.value = discountedPrice.toFixed(2);
            
            // invoiceHasInventory inner object ekata discounted price eka set karagannawa
            invoiceHasInventory.discountprice = textDiscountPrice.value;
            
            // discounted price box eke color validation border eka valid (green) karanawa
            textDiscountPrice.style.borderBottom = "4px solid green";
            textDiscountPrice.previousElementSibling.style.backgroundColor = "green";
            textDiscountPrice.classList.remove("is-invalid");
            textDiscountPrice.classList.add("is-valid");
            
            // newatha line price eka generate karanna call karanawa
            generateLinePrice();
        } else {
            // unit price value eka invalid nam fields default settings walata reset karanawa
            textDiscountPrice.value = "";
            invoiceHasInventory.discountprice = null;
            setDefault([textDiscountPrice]);
            generateLinePrice();
        }
    } else {
        // select items empty nam fields clear karanawa
        textDiscountPrice.value = "";
        invoiceHasInventory.discountprice = null;
        setDefault([textDiscountPrice]);
        generateLinePrice();
    }
}

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