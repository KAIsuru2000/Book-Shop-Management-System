//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function for refresh table
    refreshItemTable();

    //Call refresh form function
    refreshItemForm();

})

//create function for refresh table
const refreshItemTable = () => {

    //controller wala hadapu service eka magin data array eka laba ganima
    const items = getServiceRequest("/item/alldata");

    //create display property list
    //data types
    //string => string / data / number
    //function => object / array / boolean
    displayPropertyList = [
        //function name ekak add karai call kirimak sidu nowe

        // price wala decimal point dekwima sadaha
        // dataType:decimal >> e sadaha decimal nam data type ekak thibiya yuthuya >> tablefunction js ekata gos 

        { dataType: 'string', propertyName: 'itemcode' },
        { dataType: 'string', propertyName: 'itemname' },
        { dataType: 'string', propertyName: 'roq' },
        { dataType: 'string', propertyName: 'rop' },
        { dataType: 'function', propertyName: getItemStatus },
    ];

    // call tablefill function
    fillDataIntoTable(tableItemBody, items, displayPropertyList, rowFormRefill, rowDelete, itemRowView, "#offcanvasBottom");

    //call jquerry data table
    $('#tableItem').dataTable();
}

// table ekehi status eka penwimata 
const getItemStatus = (dataob) => {
    let statusName = dataob.itemstatus_id.name;
    if (statusName == "Active") {
        return '<i class="fa-solid fa-store fa-beat fa-xl" style="color: #00fa11;" data-bs-toggle="tooltip"\n' +
            '                                                title="' + statusName + '"></i>';
    }
    if (statusName == "Inactive") {
        return '<i class="fa-solid fa-store-slash fa-beat fa-xl" style="color:rgb(249, 236, 1);" data-bs-toggle="tooltip"\n' +
            '                                                title="' + statusName + '"></i>';
    }
    if (statusName == "Delete") {
        return '<i class="fa-solid fa-trash-can fa-beat fa-xl" style="color: #fa0000;" data-bs-toggle="tooltip"\n' +
            '                                                title="' + statusName + '"></i>';
    }
    return statusName;
}

// define function for genarate sales price
// const genarateSalesPrice = () => {
//     let profitRatio = textProfitRatio.value;
//     let purchasePrice = textPurchasePrice.value;
//     let salesPrice = parseFloat(purchasePrice) + (parseFloat(purchasePrice) * parseFloat(profitRatio) / 100);
//     textSalesPrice.value = parseFloat(salesPrice).toFixed(2);

//     // validation colour and binding
//     prevElementSalesPrice = textSalesPrice.previousElementSibling;
//     textSalesPrice.style.borderBottom = "4px solid green";
//     prevElementSalesPrice.style.backgroundColor = "green";
//     textSalesPrice.classList.remove("is-invalid");
//     textSalesPrice.classList.add("is-valid");
//     item.salesprice = textSalesPrice.value;
// }

// form refill function
// form refill karana functions eka update liyanawa
const rowFormRefill = (dataob, rowIndex) => {
    // console log print liyanawa refill start eka check karanna
    console.log("Update", dataob);

    // category object value eka element drop down ekata fill karanawa
    selectItemCategory.value = JSON.stringify(dataob.subcategory_id.category_id);
    // validation color success green add karanawa
    selectItemCategory.style.borderBottom = "4px solid green";
    selectItemCategory.previousElementSibling.style.backgroundColor = "green";

    // subcategories list check request aragena dynamic element fill block call karanawa
    let subcategoriesByCategory = getServiceRequest('/subcategory/bycategory?categoryid=' + dataob.subcategory_id.category_id.id);
    // subcategory drop down list fill block method execution
    fillDataIntoSelect(selectItemSubcategory, "Please Select subcategories..!!", subcategoriesByCategory, "name");
    // saved subcategory reference selection active set block
    selectItemSubcategory.value = JSON.stringify(dataob.subcategory_id);
    selectItemSubcategory.style.borderBottom = "4px solid green";
    selectItemSubcategory.previousElementSibling.style.backgroundColor = "green";

    // brand elements matches category select list aragena fill settings
    let brandByCategory = getServiceRequest('/brand/bycategory/' + dataob.subcategory_id.category_id.id);
    // brand selection dropdown details update map
    fillDataIntoSelect(selectItemBrand, "Please Select Brand..!!", brandByCategory, "name");
    // brand value set active selection bindings
    selectItemBrand.value = JSON.stringify(dataob.brand_id);
    selectItemBrand.style.borderBottom = "4px solid green";
    selectItemBrand.previousElementSibling.style.backgroundColor = "green";

    // status check dropdown values selection restore settings
    selectItemStatus.value = JSON.stringify(dataob.itemstatus_id);
    selectItemStatus.style.borderBottom = "4px solid green";
    selectItemStatus.previousElementSibling.style.backgroundColor = "green";

    // name configurations map text values
    textItemName.value = dataob.itemname;
    textItemName.style.borderBottom = "4px solid green";
    textItemName.previousElementSibling.style.backgroundColor = "green";

    // rop details fields values indicators
    textROP.value = dataob.rop;
    textROP.style.borderBottom = "4px solid green";
    textROP.previousElementSibling.style.backgroundColor = "green";

    // roq elements restore value borders
    textROQ.value = dataob.roq;
    textROQ.style.borderBottom = "4px solid green";
    textROQ.previousElementSibling.style.backgroundColor = "green";

    // update models verification configurations sets
    item = JSON.parse(JSON.stringify(dataob));
    oldItem = JSON.parse(JSON.stringify(dataob));

    // Dynamic category attribute list select components render details method calls
    let attributes = getServiceRequest('/categoryAttribute/bysubcategory/' + dataob.subcategory_id.id);
    renderDynamicAttributes(attributes);

    // saved attributes array matches search selections active block
    if (dataob.itemHasAttributeOptionList) {
        // list loop execution start
        dataob.itemHasAttributeOptionList.forEach(savedOption => {
            let opt = savedOption.attribute_option_id;
            let selects = document.querySelectorAll("[id^='selectAttribute']");
            // select components loops
            selects.forEach(select => {
                let attrId = parseInt(select.getAttribute("data-attribute-id"));
                // option targets check mappings
                if (opt.category_attribute_id && opt.category_attribute_id.id === attrId) {
                    for (let i = 0; i < select.options.length; i++) {
                        let optVal = select.options[i].value;
                        if (optVal !== "") {
                            let parsedOpt = JSON.parse(optVal);
                            // option id verify check matching
                            if (parsedOpt.id === opt.id) {
                                select.selectedIndex = i;
                                // success color borders
                                select.style.borderBottom = "4px solid green";
                                select.previousElementSibling.style.backgroundColor = "green";
                                select.classList.remove("is-invalid");
                                select.classList.add("is-valid");
                                break;
                            }
                        }
                    }
                }
            });
        });
    }

    // dynamic parameters mapping validation binding settings updates
    validateAttributeSelect();

    // custom details inputs resolves search trace
    let brandName = dataob.brand_id.name;
    let subcategoryName = dataob.subcategory_id.name;
    let generatedBase = brandName + " " + subcategoryName;
    
    // attributes values map collect lists
    let attributeNamesList = [];
    if (dataob.itemHasAttributeOptionList) {
        dataob.itemHasAttributeOptionList.forEach(savedOption => {
            attributeNamesList.push(savedOption.attribute_option_id.name);
        });
    }
    
    // base combined elements
    let combinedBaseAndAttr = generatedBase;
    if (attributeNamesList.length > 0) {
        combinedBaseAndAttr += " " + attributeNamesList.join(" ");
    }
    
    // custom text difference traces
    let customTextVal = "";
    if (dataob.itemname.startsWith(combinedBaseAndAttr)) {
        customTextVal = dataob.itemname.replace(combinedBaseAndAttr, "").trim();
    }
    
    // custom field updates sets values
    let customInput = document.getElementById("textCustomInput");
    if (customInput) {
        customInput.value = customTextVal;
        customInput.style.borderBottom = "4px solid green";
        customInput.previousElementSibling.style.backgroundColor = "green";
        customInput.classList.remove("is-invalid");
        customInput.classList.add("is-valid");
    }

    // buttons actions toggles
    divButtonAdd.style.display = "none";
    divButtonUpdate.style.display = "flex";
}

// rowDelete function eken table eke row ekak delete karaddi SweetAlert2 confirm box eka open karanawa
const rowDelete = (dataob, rowIndex) => {
    // console eke delete karana item details check karanawa
    console.log("Delete", dataob, rowIndex);

    // item delete confirmation popup box sweetalert open karagannawa
    Swal.fire({
        title: "Confirm Delete",
        html: `Are you sure to delete following item?<br><br>` +
              `<strong>Item Code:</strong> ${dataob.itemcode}<br>` +
              `<strong>Item Name:</strong> ${dataob.itemname}<br>` +
              `<strong>ROP:</strong> Rs. ${dataob.rop}<br>` +
              `<strong>ROQ:</strong> ${dataob.roq}`,
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
        // delete validation check yes kala nam
        if (result.isConfirmed) {
            // delete endpoint request method HTTP method call yawai
            let deleteResponce = getHTTPServiceRequest("/item/delete", "DELETE", dataob);

            // server delete request success OK returned unoth
            if (deleteResponce == "OK") {
                // delete successful modal display check
                Swal.fire({
                    title: "Deleted!",
                    text: "Item deleted successfully.",
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
                // data table refresh karanawa
                refreshItemTable();
                // input form reset/clear update set parameters
                refreshItemForm();
            } else {
                // failure response error sweetalert popup displays
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

// view detail row offcanvas popup methods
const itemRowView = (dataob, rowIndex) => {
    // console trace details
    console.log("View", dataob, rowIndex);
    // view modal labels values set mapping blocks
    brandNameView.innerText = dataob.brand_id.name;
    SubcategoryView.innerText = dataob.subcategory_id.name;
    itemNameView.innerText = dataob.itemname;
    statusView.innerText = dataob.itemstatus_id.name;
    rOPView.innerText = dataob.rop
    rOQView.innerText = dataob.roq;

    // view model targets offcanvas trigger
    $("#offcanvasBottomItemView").offcanvas("show");
}

// print options configuration triggers
const buttonPrintRow = () => {
    // print window open actions
    let newWindow = window.open();
    newWindow.document.write(`
            <html>
            <head>
                <title>Print View - Item Details</title>
                <!-- link bootstrp min css file -->
    <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">
    <!--link bootstrap js file  -->
    <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
                <!-- link css file -->
                    <link rel="stylesheet" href="/Style/printView.css">
            </head>
            <body>
<!--            html file eka thula athi print view ekata sadu view ekehi body eke id eka methanata laba dei-->
                ${document.querySelector('.bodyPrintView').outerHTML}
            </body>
            </html>
        `);
    // timeout delay print popup actions
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1500)
}

// form refresh state initialization function
const refreshItemForm = () => {
    // form inputs configurations clear methods calls
    formItem.reset();

    // empty model object maps
    item = new Object();

    // validation colors setDefault helpers lists elements clear
    setDefault([selectItemCategory, selectItemBrand, selectItemSubcategory, selectItemStatus, textItemName, textROP, textROQ]);

    // dynamic drop down components inputs data sets aragannawa
    let categories = getServiceRequest('/Category/alldata');
    let itemStatus = getServiceRequest('/itemStatus/alldata');

    // categories input field data settings fill
    fillDataIntoSelect(selectItemCategory, "Please Select categories..!", categories, "name");
    
    // subcategory clean blank options map
    fillDataIntoSelect(selectItemSubcategory, "Please Select Item Subcategory..!", [], "name");
    
    // brand default empty set configurations mapping
    fillDataIntoSelect(selectItemBrand, "Please Select brand..!", [], "name");

    // item status drop downs values lists fills
    fillDataIntoSelect(selectItemStatus, "Please Select itemStatus..!", itemStatus, "name");
    selectItemStatus.value = JSON.stringify(itemStatus[0]);
    item.itemstatus_id = JSON.parse(selectItemStatus.value);
    
    // state colors set green
    prevElementItemStatus = selectItemStatus.previousElementSibling;
    selectItemStatus.style.borderBottom = "4px solid green";
    prevElementItemStatus.style.backgroundColor = "green";
    selectItemStatus.classList.remove("is-invalid");
    selectItemStatus.classList.add("is-valid");

    // placeholder elements dynamic layout rows resets
    document.getElementById("divDynamicAttributesRow").innerHTML = "";

    // button layouts switches
    divButtonUpdate.style.display = "none";
    divButtonAdd.style.display = "flex";
}

// category change selection trigger mappings event listener liyanawa
let selectCategoryElement = document.getElementById("selectItemCategory");
selectCategoryElement.addEventListener("change", () => {
    let category = JSON.parse(selectCategoryElement.value);

    // category valid border colors states checked
    if (selectCategoryElement.value != "") {
        prevElementItemCategory = selectItemCategory.previousElementSibling;
        selectItemCategory.style.borderBottom = "4px solid green";
        prevElementItemCategory.style.backgroundColor = "green";
        selectItemCategory.classList.remove("is-invalid");
        selectItemCategory.classList.add("is-valid");
    } else {
        prevElementItemCategory = selectItemCategory.previousElementSibling;
        selectItemCategory.style.borderBottom = "4px solid red";
        prevElementItemCategory.style.backgroundColor = "red";
        selectItemCategory.classList.add("is-invalid");
        selectItemCategory.classList.remove("is-valid");
    }

    // category ID pass karala subcategory list filter request eka yawanawa
    let subcategoriesByCategory = getServiceRequest('/subcategory/bycategory?categoryid=' + category.id);
    // subcategory drop down selection data update
    fillDataIntoSelect(selectItemSubcategory, "Please Select subcategories..!!", subcategoriesByCategory, "name");
    item.subcategory_id = null;

    // brand option values clear dynamic category switch parameters maps
    fillDataIntoSelect(selectItemBrand, "Please Select Brand..!!", [], "name");
    item.brand_id = null;

    // dynamic attribute selection rows clears
    document.getElementById("divDynamicAttributesRow").innerHTML = "";

    // indicators validation flags resets red mapping
    spanItemNameElement = textItemName.previousElementSibling;
    spanItemBrandElement = selectItemBrand.previousElementSibling;
    spanItemSubcategoryElement = selectItemSubcategory.previousElementSibling;

    textItemName.value = "";
    textItemName.style.borderBottom = "4px solid red";
    selectItemBrand.style.borderBottom = "4px solid red";
    selectItemSubcategory.style.borderBottom = "4px solid red";
    spanItemNameElement.style.backgroundColor = "red";
    spanItemBrandElement.style.backgroundColor = "red";
    spanItemSubcategoryElement.style.backgroundColor = "red";
    textItemName.classList.add("is-invalid");
    selectItemBrand.classList.add("is-invalid");
    selectItemSubcategory.classList.add("is-invalid");
    textItemName.classList.remove("is-valid");
    selectItemBrand.classList.remove("is-valid");
    selectItemSubcategory.classList.remove("is-valid");
    item.itemname = null; // reset itemname null
});

// subcategory selection event listeners maps details config liyanawa
let selectSubcategoryElement = document.getElementById("selectItemSubcategory");
selectSubcategoryElement.addEventListener("change", () => {
    // subcategory selection blank elements checks
    if (selectSubcategoryElement.value !== "") {
        let subCategory = JSON.parse(selectSubcategoryElement.value);
        let categoryId = subCategory.category_id.id;

        // brand category maps endpoint requests trigger
        let brandByCategory = getServiceRequest('/brand/bycategory/' + categoryId);
        fillDataIntoSelect(selectItemBrand, "Please Select Brand..!!", brandByCategory, "name");
        item.brand_id = null;

        // categoryAttribute end point path variable dynamic variables aragannawa
        let attributes = getServiceRequest('/categoryAttribute/bysubcategory/' + subCategory.id);
        renderDynamicAttributes(attributes);
    } else {
        // subcategory empty selection values checks
        fillDataIntoSelect(selectItemBrand, "Please Select Brand..!!", [], "name");
        item.brand_id = null;
        document.getElementById("divDynamicAttributesRow").innerHTML = "";
    }
    // real-time name changes update triggers
    generateItemName();
});

// brand selection changes trigger logs event listener build
let selectBrandElement = document.getElementById("selectItemBrand");
selectBrandElement.addEventListener("change", () => {
    if (selectBrandElement.value !== "") {
        item.brand_id = JSON.parse(selectBrandElement.value);
    } else {
        item.brand_id = null;
    }

    // dynamic select boxes updates options match brand id selection refresh
    const selects = document.querySelectorAll("[id^='selectAttribute']");
    selects.forEach(select => {
        const attrId = select.getAttribute("data-attribute-id");
        const currentValue = select.value;
        loadAttributeOptions(select, attrId);
        // option check values mapping verification resets
        if (currentValue && currentValue !== "") {
            select.value = currentValue;
        }
    });

    // name changes generate updates
    generateItemName();
});

// dynamic components layouts columns generation template builds liyanawa
const renderDynamicAttributes = (attributes) => {
    const row = document.getElementById("divDynamicAttributesRow");
    row.innerHTML = ""; // target wrapper reset

    // max 3 dynamic elements check mapping slice list
    attributes.slice(0, 3).forEach((attr, index) => {
        const col = document.createElement("div");
        col.className = "col-3";

        const inputGroup = document.createElement("div");
        inputGroup.className = "input-group mb-3";

        const label = document.createElement("span");
        label.className = "input-group-text lablBg";
        label.innerHTML = attr.name + ` : <span class="fw-bold text-danger">*</span>`;

        const select = document.createElement("select");
        select.id = "selectAttribute" + index;
        select.className = "form-select";
        select.setAttribute("data-attribute-id", attr.id);
        select.setAttribute("data-attribute-index", index);

        // input select details event logic triggers
        select.addEventListener("change", () => {
            validateAttributeSelect();
            generateItemName();
        });

        inputGroup.appendChild(label);
        inputGroup.appendChild(select);
        col.appendChild(inputGroup);
        row.appendChild(col);

        // attribute options retrieve triggers
        loadAttributeOptions(select, attr.id);
    });

    // custom text detail column build elements map liyanawa
    const customCol = document.createElement("div");
    customCol.className = "col-3";

    const customInputGroup = document.createElement("div");
    customInputGroup.className = "input-group mb-3";

    const customLabel = document.createElement("span");
    customLabel.className = "input-group-text lablBg";
    customLabel.innerHTML = `Custom Detail : <span class="text-danger">(optional)</span>`;

    const customInput = document.createElement("input");
    customInput.type = "text";
    customInput.id = "textCustomInput";
    customInput.className = "form-control";
    customInput.placeholder = "Enter Custom Detail";
    
    // event changes updates logic binding
    customInput.addEventListener("input", () => {
        if (customInput.value.trim() !== "") {
            customInput.style.borderBottom = "4px solid green";
            customInput.previousElementSibling.style.backgroundColor = "green";
            customInput.classList.remove("is-invalid");
            customInput.classList.add("is-valid");
        } else {
            customInput.style.borderBottom = "1px solid #ced4da";
            customInput.previousElementSibling.style.backgroundColor = "black";
            customInput.classList.remove("is-invalid");
            customInput.classList.remove("is-valid");
        }
        generateItemName();
    });

    customInputGroup.appendChild(customLabel);
    customInputGroup.appendChild(customInput);
    customCol.appendChild(customInputGroup);
    row.appendChild(customCol);
}

// attribute options loading checks triggers
const loadAttributeOptions = (select, attributeId) => {
    let brandId = "";
    if (item.brand_id && item.brand_id.id) {
        brandId = item.brand_id.id;
    }

    let url = `/attributeOption/byAttributeAndBrand?attributeId=${attributeId}`;
    if (brandId !== "") {
        url += `&brandId=${brandId}`;
    }

    const options = getServiceRequest(url);
    fillDataIntoSelect(select, "Select Option", options, "name");
}

// attribute select box binding validation logic liyanawa
const validateAttributeSelect = () => {
    // items list variables check array resets
    item.itemHasAttributeOptionList = [];

    const selects = document.querySelectorAll("[id^='selectAttribute']");
    selects.forEach(select => {
        if (select.value && select.value !== "") {
            try {
                let optionOb = JSON.parse(select.value);
                // attributes updates select array lists pushes
                item.itemHasAttributeOptionList.push({
                    attribute_option_id: optionOb
                });
                
                // validation indicators green
                select.style.borderBottom = "4px solid green";
                select.previousElementSibling.style.backgroundColor = "green";
                select.classList.remove("is-invalid");
                select.classList.add("is-valid");
            } catch (e) {}
        } else {
            // error indicators red border colors
            select.style.borderBottom = "4px solid red";
            select.previousElementSibling.style.backgroundColor = "red";
            select.classList.add("is-invalid");
            select.classList.remove("is-valid");
        }
    });
}

// real-time auto name build calculations liyanawa
const generateItemName = () => {
    console.log("generateItemName", item);

    // spans target label backgrounds reference indicators
    spanElement = textItemName.previousElementSibling;

    let brandName = "";
    if (item.brand_id && item.brand_id.name) {
        brandName = item.brand_id.name;
    }

    let subcategoryName = "";
    if (item.subcategory_id && item.subcategory_id.name) {
        subcategoryName = item.subcategory_id.name;
    }

    // attributes options maps text array builds
    let attributeValues = [];
    const selects = document.querySelectorAll("[id^='selectAttribute']");
    selects.forEach(select => {
        if (select.value && select.value !== "") {
            try {
                let optionOb = JSON.parse(select.value);
                if (optionOb && optionOb.name) {
                    attributeValues.push(optionOb.name);
                }
            } catch (e) {}
        }
    });

    // custom field input details text resolutions
    const customInput = document.getElementById("textCustomInput");
    let customText = "";
    if (customInput && customInput.value) {
        customText = customInput.value.trim();
    }

    // name construct blocks execution
    let nameParts = [];
    if (brandName) nameParts.push(brandName);
    if (subcategoryName) nameParts.push(subcategoryName);
    nameParts = nameParts.concat(attributeValues);
    if (customText) nameParts.push(customText);

    let generatedName = nameParts.join(" ");
    textItemName.value = generatedName;

    // checks validation required options selects parameters logic
    if (brandName && subcategoryName && attributeValues.length === selects.length) {
        // success state style green
        textItemName.style.borderBottom = "4px solid green";
        spanElement.style.backgroundColor = "green";
        textItemName.classList.remove("is-invalid");
        textItemName.classList.add("is-valid");
        item.itemname = generatedName;
    } else {
        // fail state colors styles red
        textItemName.style.borderBottom = "4px solid red";
        spanElement.style.backgroundColor = "red";
        textItemName.classList.add("is-invalid");
        textItemName.classList.remove("is-valid");
        item.itemname = null;
    }
}

// form error messages target collections liyanawa
const checkItemFormError = () => {
    let errors = "";

    // validations select items brand check
    if (item.brand_id == null) {
        errors = errors + "Please select item brand...\n";
    }
    // validation subcategory checks
    if (item.subcategory_id == null) {
        errors = errors + "Please select item subcategory...\n";
    }
    // validation item status selects checks
    if (item.itemstatus_id == null) {
        errors = errors + "Please select item status...\n";
    }
    // validation rop check values
    if (item.rop == null) {
        errors = errors + "Please enter rop...\n";
    }
    // validation roq details check
    if (item.roq == null) {
        errors = errors + "Please enter roq...\n";
    }

    // attributes options select list checks
    const selects = document.querySelectorAll("[id^='selectAttribute']");
    let dynamicAttrErrors = false;
    selects.forEach(select => {
        if (!select.value || select.value === "") {
            dynamicAttrErrors = true;
        }
    });
    if (dynamicAttrErrors) {
        errors = errors + "Please select all dynamic attributes...\n";
    }

    return errors;
}

// form submission handler details mapping liyanawa
// form submission handler details mapping liyanawa
const submitItemForm = () => {
    // console log print check logs
    console.log('Add Item', item);

    // form errors validation results logs check
    let errors = checkItemFormError();

    // check validation errors blank indicators check
    if (errors == "") {
        // item submission confirmations pop up sweetalerts open karagannawa
        Swal.fire({
            title: "Confirm Submission",
            html: `Are you sure to add the following item?<br><br>` +
                  `<strong>Item Name:</strong> ${item.itemname}<br>` +
                  `<strong>ROQ:</strong> ${item.roq}<br>` +
                  `<strong>ROP:</strong> Rs. ${item.rop}`,
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
                // post request service method methods trigger sets database
                let postResponce = getHTTPServiceRequest("/item/insert", "POST", item);
                // success check responses ok returned unoth
                if (postResponce == "OK") {
                    // success status informational dialogues modals opens check
                    Swal.fire({
                        title: "Saved!",
                        text: "Item saved successfully.",
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
                    // table elements reload karagannawa
                    refreshItemTable();
                    // form fields data clears defaults
                    refreshItemForm();
                    // offcanvas sheets panels close karalai hide karanawa
                    $("#offcanvasBottom").offcanvas("hide");
                } else {
                    // submit failed error alert sweetalert dialog open checks
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to submit: " + postResponce,
                        icon: "error",
                        confirmButtonText: '<i class="fa-solid fa-check"></i> OK',
                        customClass: {
                            popup: 'swal-custom-popup',
                            title: 'swal-custom-title',
                            htmlContainer: 'swal-custom-content',
                            confirmButton: 'swal-custom-confirm-btn'
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

// checks updates check log fields differences liyanawa
const checkItemFormUpdate = () => {
    let updates = "";

    // compares items state values old vs new models
    if (item != null && oldItem != null) {
        if (item.subcategory_id.category_id.name != oldItem.subcategory_id.category_id.name) {
            updates = updates + "category is change...! \n";
        }
        if (item.brand_id.name != oldItem.brand_id.name) {
            updates = updates + "brand name is change...! \n";
        }
        if (item.subcategory_id.name != oldItem.subcategory_id.name) {
            updates = updates + "subcategory is change...! \n";
        }
        if (item.itemstatus_id.name != oldItem.itemstatus_id.name) {
            updates = updates + "item status is change...! \n";
        }
        if (item.itemname != oldItem.itemname) {
            updates = updates + "itemname is change...! \n";
        }
        if (item.rop != oldItem.rop) {
            updates = updates + "rop is change...! \n";
        }
        if (item.roq != oldItem.roq) {
            updates = updates + "roq is change...! \n";
        }

        // dynamic attribute changes traces compares
        let dynamicAttrChange = false;
        let oldAttrs = oldItem.itemHasAttributeOptionList || [];
        let currentAttrs = item.itemHasAttributeOptionList || [];
        if (oldAttrs.length !== currentAttrs.length) {
            dynamicAttrChange = true;
        } else {
            for (let i = 0; i < oldAttrs.length; i++) {
                if (oldAttrs[i].attribute_option_id.id !== currentAttrs[i].attribute_option_id.id) {
                    dynamicAttrChange = true;
                    break;
                }
            }
        }
        if (dynamicAttrChange) {
            updates = updates + "attributes is change...! \n";
        }
    }
    return updates;
}

// update buttons action mappings trigger liyanawa
const buttonItemUpdate = () => {
    // console print check logs
    console.log("item", item);
    console.log("oldItem", oldItem);

    // validation forms errors target inputs check
    let errors = checkItemFormError();

    // validation errors checking verify blank indicators checks
    if (errors == "") {
        // changes updates verify configurations checks
        let updates = checkItemFormUpdate();
        // updates value differences checks
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
                // update validation checks yes kala nam
                if (result.isConfirmed) {
                    // PUT method service request call trigger updates database
                    let putResponce = getHTTPServiceRequest("/item/update", "PUT", item);
                    // update status success ok check
                    if (putResponce == "OK") {
                        // success status info alerts open check
                        Swal.fire({
                            title: "Updated!",
                            text: "Item details updated successfully.",
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
                        // table content metrics reload check
                        refreshItemTable();
                        // input forms default clear fields metrics
                        refreshItemForm();
                        // close offcanvas forms sheet modes checks
                        $("#offcanvasBottom").offcanvas("hide");
                    } else {
                        // update failed error sweetalert modal displays checks
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to update: " + putResponce,
                            icon: "error",
                            confirmButtonText: '<i class="fa-solid fa-check"></i> OK',
                            customClass: {
                                popup: 'swal-custom-popup',
                                title: 'swal-custom-title',
                                htmlContainer: 'swal-custom-content',
                                confirmButton: 'swal-custom-confirm-btn'
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
        // required items validation errors check sweetalert modal display check
        Swal.fire({
            title: "Validation Error",
            html: "Something went wrong... Please correct the following errors:<br><br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            confirmButtonText: '<i class="fa-solid fa-check"></i> OK',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                htmlContainer: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-btn'
            },
            buttonsStyling: false
        });
    }
}

// clear button forms action mapping liyanawa
const clearItemForm = () => {
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
            // refresh item form function call karalai forms inputs values defaults resets karagannawa
            refreshItemForm();
        }
    });
}








