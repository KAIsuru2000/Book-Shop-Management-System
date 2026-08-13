//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    refreshPurchaseOrderTable();

    refreshPurchaseOrderForm();

})

//refresh table Area
const refreshPurchaseOrderTable = () => {

    let purchaseOrders = getServiceRequest("/purchaseOrders/alldata");

    let propertyList = [
        { propertyName: "purchaserequestno", dataType: "string" },
        { propertyName: generateSupplierName, dataType: "function" },
        { propertyName: "requireddate", dataType: "string" },
        { propertyName: generateItemList, dataType: "function" },
        { propertyName: "totalamount", dataType: "decimal" },
        { propertyName: getOrderStatus, dataType: "function" },
    ];

    //call filldataintotable function (talebodyId, datalist, column list, editefunctionname, deletefunctionname, printfunctionname, buttonvisibility) 
    fillDataIntoTable(tablePurchaseOrderBody, purchaseOrders, propertyList, purchaseOrderFormRefill, purchaseOrderDelete, purchaseOrderView, "#offcanvasBottom");


    $('#tablePurchaseOrder').DataTable();


}

const generateSupplierName = (dataob) => {
    return dataob.supplier_id.suppliername;
}
const getOrderStatus = (dataob) => {
    if (dataob.purchaserequeststatus_id.name == "Pending") {
        return '<i class="fa-solid fa-spinner fa-spin-pulse fa-xl" style="color: #fcac5c;" data-bs-toggle="tooltip"\n' +
            '                                                title="Pending"></i>'
    }

    if (dataob.purchaserequeststatus_id.name == "Partially Received") {
        return '<i class="fa-solid fa-spinner fa-spin-pulse fa-xl" style="color: #f4eb01;" data-bs-toggle="tooltip"\n' +
            '                                                title="Partially Received"></i>'
    }
    

    if (dataob.purchaserequeststatus_id.name == "Completed") {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;" data-bs-toggle="tooltip"\n' +
            '                                                title="Completed"></i>'
    }

    if (dataob.purchaserequeststatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash-can fa-beat fa-xl" style="color: #fe1616;" data-bs-toggle="tooltip"\n' +
            '                                                title="Deleted"></i>'
    }
    if (dataob.purchaserequeststatus_id.name == "Expired") {
        return '<i class="fa-solid fa-calendar-xmark fa-beat fa-xl" style="color: #f85d02;" data-bs-toggle="tooltip"\n' +
            '                                                title="Expired"></i>'
    }


}
const generateItemList = (dataob) => {
    //ewani awasthawaka wenama veriable ekak hada gani. initially(muladi) string
    let itemList = "";
    // item list ekak ena nisa
    dataob.purchaseOrderHasItemList.forEach((item, index) => {
        if (dataob.purchaseOrderHasItemList.length - 1 == index) {
            //last item eken pasu "," ekak set nokarai
            itemList = itemList + item.item_id.itemname;
        } else {
            //items veriable ekata concatinate kara ganimata item object eke name access karala
            //name athara gap ekak thaba gani
            itemList = itemList + item.item_id.itemname + " , ";
        }

    });
    //awasanaye roles object eka return karanawa
    return itemList;
}
// Edit button eka click kalama form eka refill wena function eka
const purchaseOrderFormRefill = (ob, index) => {
    // console ekata edit karana object eka ha index eka print karanawa
    console.log("Edit", ob, index);

    // pending price lists details server eken request karala gannawa
    let pendingPriceLists = getServiceRequest('/addPriceList/getPendingList');
    // selectSupplier dropdown element ekata options fill fillDataIntoSelectSupplier call karanawa
    fillDataIntoSelectSupplier(selectSupplier, "Select Supplier related to Add Price List..!!", pendingPriceLists);

    // selected add price list options dropdown eke verify karala matches option select checks karanawa
    let optionExists = false;
    // selectSupplier options elements loop karanawa
    for (let option of selectSupplier.options) {
        // option empty index value options skipping check
        if (option.value !== "") {
            // option eke data-addpricelist detail array eka parse objects karanawa
            let addPriceListObj = JSON.parse(option.getAttribute("data-addpricelist"));
            // data matches price list id controls matches check
            if (addPriceListObj && ob.addpricelist_id && addPriceListObj.id === ob.addpricelist_id.id) {
                // matching option found verify dropdown set values
                optionExists = true;
                selectSupplier.value = option.value;
                break;
            }
        }
    }
    // matching option dropdown list table collections eke clear nethnam (ex: status changed to completed)
    if (!optionExists && ob.addpricelist_id) {
        // dynamic option values build element setup
        let option = document.createElement("option");
        // option values assign supplier id JSON
        option.value = JSON.stringify(ob.supplier_id);
        // data object attributes binding data-addpricelist
        option.setAttribute("data-addpricelist", JSON.stringify(ob.addpricelist_id));
        
        // brand list filters template structure collections
        let brands = [];
        // items loop check brands values mapping
        if (ob.addpricelist_id.addPriceListHasItemList) {
            // inner item looping array
            ob.addpricelist_id.addPriceListHasItemList.forEach(hasItem => {
                // item name brand names validation constraints checks
                if (hasItem.item_id && hasItem.item_id.brand_id && hasItem.item_id.brand_id.name) {
                    // brand name assignment
                    const brandName = hasItem.item_id.brand_id.name;
                    // array duplicate checks prevent
                    if (!brands.includes(brandName)) {
                        // brand append array list
                        brands.push(brandName);
                    }
                }
            });
        }
        // brand names string comma separator
        let brandNames = brands.join(", ");
        // option inner display label template details format
        option.innerText = ob.addpricelist_id.addpricelistno + " - " + ob.supplier_id.suppliername + " - " + brandNames;
        // dropdown select component options dynamic addition append
        selectSupplier.appendChild(option);
        // select option values active set selection value
        selectSupplier.value = option.value;
    }

    // required date element values refill set
    dateRequireDate.value = ob.requireddate;
    // total amount float formats value refill set
    textTotalAmount.value = parseFloat(ob.totalamount).toFixed(2);
    // status selection dropdown value refill set
    selectOrderStatus.value = JSON.stringify(ob.purchaserequeststatus_id);

    // valid colors array elements compilation
    let elementsToGreen = [selectSupplier, dateRequireDate, textTotalAmount, selectOrderStatus];
    // loops verification colors setup green styles set
    elementsToGreen.forEach(element => {
        // element bottom border solid green setup
        element.style.borderBottom = "4px solid green";
        // element label blocks background color green setup
        element.previousElementSibling.style.backgroundColor = "green";
        // invalid flags validations class name checks clean
        element.classList.remove("is-invalid");
        // validation green classes names added
        element.classList.add("is-valid");
    });

    // main objects purchaseOrder clone details duplication parse
    purchaseOrder = JSON.parse(JSON.stringify(ob));
    // comparison oldPurchaseOrder clones verification copy values
    oldPurchaseOrder = JSON.parse(JSON.stringify(ob));

    // update details button visible class remove
    btnPurchaseOrderUpdate.classList.remove("d-none");
    // add submissions button hide class add
    btnPurchaseOrderSubmit.classList.add("d-none");

    // offcanvas wrapper layout bootstrap modal components show methods trigger
    $("#offcanvasBottom").offcanvas("show");

    // inner form contents items clear refresh inner table elements call
    refreshPurchaseOrderInnerForm();
}

// purchase order soft delete karana function eka
const purchaseOrderDelete = (ob, index) => {
    // console eke delete karana record id eka print karanawa
    console.log("Delete", ob, index);

    // confirm message eka display karala confirmation eka gannawa
    let userConfirm = window.confirm("Are you sure to delete following purchase order...?\n" +
        "Order No: " + ob.purchaserequestno + "\n" +
        "Supplier: " + (ob.supplier_id ? ob.supplier_id.suppliername : "N/A")
    );
    // confirm kala nam DELETE api mapping call karanawa
    if (userConfirm) {
        // DELETE request eka yawanawa
        let deleteResponse = getHTTPServiceRequest("/purchaseOrders/delete", "DELETE", ob);

        // response eka successfully OK nam table update karanawa
        if (deleteResponse === "OK") {
            // success alert message eka penwanawa
            window.alert("Deleted successfully!");
            // table details and form details refresh clear calls
            refreshPurchaseOrderTable();
            refreshPurchaseOrderForm();
        } else {
            // failed errors warnings alert
            window.alert("Failed to delete:\n" + deleteResponse);
        }
    }
}

//function for view / print purchase order form
const purchaseOrderView = (ob, index) => {
    console.log("View", ob, index);
    //option 1
    //aluth window ekak open kara ganima
    // let newWindow = window.open();
    // //ema window ekata title ekak demima
    // //title eke html code tika venama verible ekakata dama ganima
    // let printView = "<head><title>Print</title></head>"+"<body><table>"+
    //                 "<tr><th> Employee Fullname </th><td>"+ ob.fullname+"</td></tr>"+
    //                 "<tr><th> Employee callingname </th><td>"+ ob.callingname+"</td></tr>"+
    //                 "<tr><th> Employee nic </th><td>"+ ob.nic+"</td></tr>"+
    //                 "<tr><th> Employee designation </th><td>"+ ob.designation_id.name+"</td></tr>"+
    //                 "</table></body>";
    // newWindow.document.write(printView);
    // //open wana tab eka tika welawak open wee thibee print ekata open weema
    // setTimeout(()=>{
    //     newWindow.stop();
    //     newWindow.print();
    //     newWindow.close();
    // }, 1500)

    //option 2
    // html wala athi modal ekak open weema 
    fullNameView.innerText = ob.fullname;
    callingNameView.innerText = ob.callingname;
    nicView.innerText = ob.nic;
    genderView.innerText = ob.gender;
    dobView.innerText = ob.dob;
    emailView.innerText = ob.email;
    mobileView.innerText = ob.mobile;
    if (ob.landno == undefined) {
        landNoView.innerText = "-";
    } else {
        landNoView.innerText = ob.landno;
    }
    addressView.innerText = ob.address
    designationView.innerText = ob.designation_id.name;
    civilStatusView.innerText = ob.civilstatus;
    employeeStatusView.innerText = ob.employeestatus_id.name;

    $("#offcanvasBottomView").offcanvas("show"); // show the offcanvas

}
//print button function
const buttonPrintRow = () => {

    //aluth window ekak open kara ganima
    const newWindow = window.open();
    //ema window ekata title ekak demima
    //title eke html code tika venama verible ekakata dama ganima
    let printView = "<head><title>Bright Book Shop | Employee Details</title><link rel='icon' href='/image/title.png'><link rel='stylesheet' href='/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script><link rel='stylesheet' href='/fontawesome-free-6.4.2/css/all.css'><link rel='stylesheet' href='/Style/common.css'></head>" + "<body style='background-color:white;  justify-content: center; display: flex;'>" + tableView.outerHTML +
        "</body>";
    newWindow.document.write(printView);
    //open wana tab eka tika welawak open wee thibee print ekata open weema
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1500)//1.5 second walata pasuwa block eka run karawai ema pramadaya iilaga piyawarata yaamata pera printView anthargathaya complete wa display kirimata ida salasai
}

//form eke ek ek property check kara values naththan msg ekak return kara ganima sdaha
const checkFormError = () => {
    let errors = "";

    if (purchaseOrder.supplier_id == null) {
        errors = errors + "Please Enter valid Supplier Name...! \n";
    }

    if (purchaseOrder.requireddate == null) {
        errors = errors + "Please Enter valid Required Date...! \n";
    }

    if (purchaseOrder.totalamount == null) {
        errors = errors + "Please Enter valid Total Amount...! \n";
    }

    if (purchaseOrder.purchaseOrderHasItemList.length == 0) {
        errors = errors + "Please Enter valid Purchase Order Items...! \n";
    }

    return errors;
}


//Purchase Order form submit event function 
const buttonPurchaseOrderSubmit = () => {
    console.log('Add Purchase Order', purchaseOrder);

    //check form error for required element
    let errors = checkFormError();
    if (errors === "") {
        //no errors get user confirmation
        let userConfirm = window.confirm("Are you sure to add following Purchase Order...?" +
            "\n Supplier name : " + purchaseOrder.supplier_id.suppliername +
            "\n Purchase Order required date : " + purchaseOrder.requireddate +
            "\n Purchase Order total amount : " + purchaseOrder.totalamount
        );
        if (userConfirm) {
            // call post service
            let postResponce = getHTTPServiceRequest("/purchaseOrders/insert", "POST", purchaseOrder);
            if (postResponce == "OK") {
                window.alert("Save successfully ");
                refreshPurchaseOrderTable();
                refreshPurchaseOrderForm();
                $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas
            } else {
                window.alert("Failed to submit \n" + errors + postResponce);
            }
        }
    } else {
        window.alert("Something went wrong...\n" + errors);
    }


}

// update kala properties details verification check check function eka
const checkFormUpdate = () => {
    // updates updates warning collection empty string set
    let updates = "";

    // purchaseOrder object ha oldPurchaseOrder null check validation
    if (purchaseOrder != null && oldPurchaseOrder != null) {
        // supplier id values compare check
        if (purchaseOrder.supplier_id.id != oldPurchaseOrder.supplier_id.id) {
            // updates change message string append
            updates += "Supplier changed from " + oldPurchaseOrder.supplier_id.suppliername + " to " + purchaseOrder.supplier_id.suppliername + "\n";
        }

        // requireddate values compare check
        if (purchaseOrder.requireddate != oldPurchaseOrder.requireddate) {
            // updates change message string append
            updates += "Required Date changed from " + oldPurchaseOrder.requireddate + " to " + purchaseOrder.requireddate + "\n";
        }

        // totalamount values compare check
        if (parseFloat(purchaseOrder.totalamount) != parseFloat(oldPurchaseOrder.totalamount)) {
            // updates change message string append
            updates += "Total Amount changed from Rs. " + parseFloat(oldPurchaseOrder.totalamount).toFixed(2) + " to Rs. " + parseFloat(purchaseOrder.totalamount).toFixed(2) + "\n";
        }

        // purchaserequeststatus id values compare check
        if (purchaseOrder.purchaserequeststatus_id.id != oldPurchaseOrder.purchaserequeststatus_id.id) {
            // updates status message string append
            updates += "Status changed to " + purchaseOrder.purchaserequeststatus_id.name + "\n";
        }

        // inner table items comparison JSON checks
        if (JSON.stringify(purchaseOrder.purchaseOrderHasItemList) !== JSON.stringify(oldPurchaseOrder.purchaseOrderHasItemList)) {
            // updates change message string append
            updates += "Purchase Order items have changed!\n";
        }
    }

    // result differences updates log collection output return
    return updates;
}

// main form update details button event trigger action function eka
const buttonPurchaseOrderUpdate = () => {
    // required fields format validations errors list check call
    let errors = checkFormError();
    // errors kisith neththan
    if (errors === "") {
        // updates change status checks comparison call
        let updates = checkFormUpdate();
        // updates string empty nam change kisith natha warning status
        if (updates === "") {
            // window alert alert empty notifications
            window.alert("Nothing to update!");
        } else {
            // modifications user updates confirmation confirm alert
            let userConfirm = window.confirm("Are you sure to update this Purchase Order with following changes?\n" + updates);
            // user confirm verification ok clicks
            if (userConfirm) {
                // PUT service update endpoint query api request send
                let putResponse = getHTTPServiceRequest("/purchaseOrders/update", "PUT", purchaseOrder);
                // response status checks checks OK response
                if (putResponse === "OK") {
                    // successfully updated alert display messages
                    window.alert("Purchase Order updated successfully!");
                    // table data list refresh call
                    refreshPurchaseOrderTable();
                    // form configurations layout reload clean calls
                    refreshPurchaseOrderForm();
                    // offcanvas layout close hide bootstrap components
                    $("#offcanvasBottom").offcanvas("hide");
                } else {
                    // server side processing fails warn
                    window.alert("Failed to update:\n" + putResponse);
                }
            }
        }
    } else {
        // input fields missing values alert format warnings
        window.alert("Please fill all required fields correctly:\n" + errors);
    }
}

// form delete event function 
const buttonPurchaseOrderDelete = () => {
    refreshPurchaseOrderTable();
}


const refreshPurchaseOrderForm = () => {
    purchaseOrder = new Object();
    // main object ekata (purchaseOrder) list ekak (purchaseOrderHasItemList) add karala thamai inner form eka dewal addd kala gaththaa
    purchaseOrder.purchaseOrderHasItemList = new Array();

    // parana purchase order object eka comparison walata null karala initialize karanawa
    oldPurchaseOrder = null;

    // set min and max value for reqired date
    let minDate = new Date();
    minDate.setDate(minDate.getDate() + 5);

    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 14);


    formPurchaseOrder.reset();

    //validation colors iwath kirima main form sadaha
    setDefault([selectSupplier, dateRequireDate, textTotalAmount, selectOrderStatus]);

    // dynamic element refill kala yuthuya
    let pendingPriceLists = getServiceRequest('/addPriceList/getPendingList');
    fillDataIntoSelectSupplier(selectSupplier, "Select Supplier related to Add Price List..!!", pendingPriceLists);

    let orderStatues = getServiceRequest('/purchaseOrderStatues/alldata');
    fillDataIntoSelect(selectOrderStatus, "Please Select Status..!!", orderStatues, "name");

    // status eka form eka load wana wita select wi thibimata
    // selected value eka string walin ena nisa stringify kara gani
    // database eken data nopathiyanam error ekak ena nisa data array ekehi values thibeda balima (if condition) 
    if (orderStatues.length > 0) {
        selectOrderStatus.value = JSON.stringify(orderStatues[0]);
        // ema value eka newatha object ekata set kala yuththa object format ekeni
        purchaseOrder.purchaserequeststatus_id = JSON.parse(selectOrderStatus.value);
        // status field eka sadaha validation colour eka laba deema
        prevElementOrderStatus = selectOrderStatus.previousElementSibling;
        selectOrderStatus.style.borderBottom = "4px solid green";
        prevElementOrderStatus.style.backgroundColor = "green";
        selectOrderStatus.classList.remove("is-invalid");
        selectOrderStatus.classList.add("is-valid");
    }

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



    // inner form eka refresh karawima
    refreshPurchaseOrderInnerForm();

    btnPurchaseOrderUpdate.classList.add("d-none");
    btnPurchaseOrderSubmit.classList.remove("d-none");
}

// define function for get selected AddPriceList
const getSelectedAddPriceList = () => {
    if (selectSupplier.value === "" || selectSupplier.selectedIndex <= 0) {
        return null;
    }
    const selectedOption = selectSupplier.options[selectSupplier.selectedIndex];
    const addPriceListJson = selectedOption.getAttribute("data-addpricelist");
    return addPriceListJson ? JSON.parse(addPriceListJson) : null;
};

// Supplier (Price List Request / Add Price List) select karama eata adala brand dropdown ekata filter karaganna function eka
const filterBrandBySupplier = () => {
    // select karala thiyena Add Price List object eka gannawa
    const addPriceList = getSelectedAddPriceList();
    // addPriceList object eka null newe nam, brand select filter karanawa
    if (addPriceList) {
        // select karapu addPriceList object eka purchaseOrder object ekata assign karanawa
        purchaseOrder.addpricelist_id = addPriceList;
    } else {
        // addPriceList object eka null karanawa
        purchaseOrder.addpricelist_id = null;
    }

    // addPriceList and hasItemList valid nam brands collect karagannawa
    if (addPriceList && addPriceList.addPriceListHasItemList) {
        // dynamic set ekak hadala brand names repeat wena eka nawatthanawa
        const brands = [];
        // repeat wena brand id check karaganna set ekak
        const brandIds = new Set();
        // hasItemList loop karala brands gannawa
        addPriceList.addPriceListHasItemList.forEach(hasItem => {
            // item_id and brand_id valid nam brand list ekata danna check karanawa
            if (hasItem.item_id && hasItem.item_id.brand_id) {
                // brand object eka gannawa
                const brand = hasItem.item_id.brand_id;
                // brandIds set eke me brand id eka nethnam list ekata add karanawa
                if (!brandIds.has(brand.id)) {
                    // set ekata brand id eka add karanawa
                    brandIds.add(brand.id);
                    // brands list ekata brand object eka add karanawa
                    brands.push(brand);
                }
            }
        });
        // filter karala gaththa brand list selectBrand dropdown ekata fill karanawa
        fillDataIntoSelect(selectBrand, "Please Select Brand..!!", brands, "name");
    } else {
        // lists empty karala dropdown empty karanawa
        fillDataIntoSelect(selectBrand, "Please Select Brand..!!", [], "name");
    }

    // selectBrand value reset karanawa
    selectBrand.value = "";
    // selectItem value reset karanawa
    selectItem.value = "";
    // textUnitPrice value reset karanawa
    textUnitPrice.value = "";
    // textQuantity value reset karanawa
    textQuantity.value = "";
    // textLinePrice value reset karanawa
    textLinePrice.value = "";
    
    // field classes design border set default karanawa
    setDefault([selectBrand, selectItem, textUnitPrice, textQuantity, textLinePrice]);
    
    // hasItem object values reset karanawa
    if (typeof purchaseOrderHasItem !== 'undefined') {
        // brand id object null karanawa
        purchaseOrderHasItem.brand_id = null;
        // item id object null karanawa
        purchaseOrderHasItem.item_id = null;
        // unit price null karanawa
        purchaseOrderHasItem.uniteprice = null;
        // quantity null karanawa
        purchaseOrderHasItem.quentity = null;
        // line price null karanawa
        purchaseOrderHasItem.lineprice = null;
    }
}

// Brand select karama eata adala items drop down ekata filter karaganna function eka
const filterItemByBrand = () => {
    // select karala thiyena Add Price List object eka gannawa
    const addPriceList = getSelectedAddPriceList();
    // addPriceList data and brand dropdown selection valid nam items list eka filter karanawa
    if (addPriceList && selectBrand.value !== "") {
        // select karapu brand id eka parse karala gannawa
        const selectedBrandId = JSON.parse(selectBrand.value).id;
        // matching items collect karaganna array ekak
        const items = [];
        // addPriceList eke has items loop karala matching brand items collect karanawa
        addPriceList.addPriceListHasItemList.forEach(hasItem => {
            // brand id and selectBrand id match wena items select karagannawa
            if (hasItem.item_id && hasItem.item_id.brand_id && hasItem.item_id.brand_id.id === selectedBrandId) {
                // items array ekata item object eka add karanawa
                items.push(hasItem.item_id);
            }
        });

        // Server eken okkoma save karapu purchase order data gannawa
        let allPurchaseOrders = getServiceRequest("/purchaseOrders/alldata");

        // Danata select karapu add price list id ekata adala, kalin save karapu items wala id collect karaganna array ekak
        let savedItemIds = [];
        // database eken gaththa purchase orders loop karala items id collect karanawa
        allPurchaseOrders.forEach(savedPO => {
            // status Deleted newe nam saha, select karala thiyena price list id ekatama adala nam
            if ((!savedPO.purchaserequeststatus_id || savedPO.purchaserequeststatus_id.name !== "Deleted") && 
                savedPO.addpricelist_id && savedPO.addpricelist_id.id === addPriceList.id) {
                // poItem list loop karala savedItemIds collect karanawa
                if (savedPO.purchaseOrderHasItemList) {
                    // has items loop karanawa
                    savedPO.purchaseOrderHasItemList.forEach(poItem => {
                        // item id property eka valid nam array ekata push karanawa
                        if (poItem.item_id) {
                            // savedItemIds list ekata id eka collect karanawa
                            savedItemIds.push(poItem.item_id.id);
                        }
                    });
                }
            }
        });

        // Inner table ekata eka parak add karapu items + database eke kalin save karapu items dropdown eken ain karanna filter karagannawa
        let availableItems = items.filter(item => {
            // inner table eke (purchaseOrderHasItemList) danata add karala thiyena item ekaka id eka mema item id ekata samanada balanawa
            let isAddedInForm = purchaseOrder.purchaseOrderHasItemList.some(addedItem => addedItem.item_id.id === item.id);
            // Kalin database ekata save karapu item ekakda balanawa
            let isAlreadySaved = savedItemIds.includes(item.id);
            // Form eke add wela nathi, database eke save wela nathi items pamanak dropdown ekata gannawa
            return !isAddedInForm && !isAlreadySaved;
        });

        // filter karala gaththa availableItems selectItem dropdown ekata fill karanawa
        fillDataIntoSelectTwo(selectItem, "Please Select Item..!!", availableItems, "itemcode", "itemname");
    } else {
        // empty dropdown values fill karanawa
        fillDataIntoSelectTwo(selectItem, "Please Select Item..!!", [], "itemcode", "itemname");
    }

    // selectItem value reset karanawa
    selectItem.value = "";
    // textUnitPrice value reset karanawa
    textUnitPrice.value = "";
    // textQuantity value reset karanawa
    textQuantity.value = "";
    // textLinePrice value reset karanawa
    textLinePrice.value = "";

    // default validation borders colors set karanawa
    setDefault([selectItem, textUnitPrice, textQuantity, textLinePrice]);

    // hasItem object values reset karanawa
    if (typeof purchaseOrderHasItem !== 'undefined') {
        // item object eka null karanawa
        purchaseOrderHasItem.item_id = null;
        // unit price null karanawa
        purchaseOrderHasItem.uniteprice = null;
        // quantity null karanawa
        purchaseOrderHasItem.quentity = null;
        // line price null karanawa
        purchaseOrderHasItem.lineprice = null;
    }
}

// define function for populate unit price when an item is selected
const selectItemChange = () => {
    const addPriceList = getSelectedAddPriceList();
    const divMinQtyNote = document.getElementById("divMinQtyNote");
    const lblMinQty = document.getElementById("lblMinQty");
    const lblMinQtyLimit = document.getElementById("lblMinQtyLimit");
    const lblMinQtyPrice = document.getElementById("lblMinQtyPrice");

    if (addPriceList && selectItem.value !== "") {
        const selectedItem = JSON.parse(selectItem.value);
        const hasItem = addPriceList.addPriceListHasItemList.find(hi => hi.item_id && hi.item_id.id === selectedItem.id);
        if (hasItem) {
            // Auto fill quantity with item's ROQ value
            if (selectedItem.roq) {
                textQuantity.value = selectedItem.roq;
                textValidator(textQuantity, '^.*$', 'purchaseOrderHasItem', 'quentity');
            }

            let finalUnitPrice = parseFloat(hasItem.unitprice);
            
            // Check if min quantity and min quantity price are defined and valid
            if (hasItem.mincountity && parseFloat(hasItem.mincountity) > 0 && hasItem.minquunitprice && parseFloat(hasItem.minquunitprice) > 0) {
                // Show the note
                if (lblMinQty) lblMinQty.innerText = hasItem.mincountity;
                if (lblMinQtyLimit) lblMinQtyLimit.innerText = hasItem.mincountity;
                if (lblMinQtyPrice) lblMinQtyPrice.innerText = parseFloat(hasItem.minquunitprice).toFixed(2);
                if (divMinQtyNote) divMinQtyNote.classList.remove("d-none");

                // If quantity is already filled and >= mincountity, use the minquunitprice
                const currentQty = parseInt(textQuantity.value);
                if (!isNaN(currentQty) && currentQty >= parseInt(hasItem.mincountity)) {
                    finalUnitPrice = parseFloat(hasItem.minquunitprice);
                }
            } else {
                // Hide the note
                if (divMinQtyNote) divMinQtyNote.classList.add("d-none");
            }

            textUnitPrice.value = finalUnitPrice.toFixed(2);
            textValidator(textUnitPrice, '^.*$', 'purchaseOrderHasItem', 'uniteprice');
            
            // If quantity is already filled, calculate line price
            if (textQuantity.value !== "") {
                calculateLinePrice();
            }
        }
    } else {
        textUnitPrice.value = "";
        setDefault([textUnitPrice]);
        purchaseOrderHasItem.uniteprice = null;
        
        textLinePrice.value = "";
        setDefault([textLinePrice]);
        purchaseOrderHasItem.lineprice = null;

        // Hide note
        if (divMinQtyNote) {
            divMinQtyNote.classList.add("d-none");
        }
    }
}

// define function to calculate line price automatically
const calculateLinePrice = () => {
    // Check if we have min qty price adjustment
    const addPriceList = getSelectedAddPriceList();
    if (addPriceList && selectItem.value !== "") {
        const selectedItem = JSON.parse(selectItem.value);
        const hasItem = addPriceList.addPriceListHasItemList.find(hi => hi.item_id && hi.item_id.id === selectedItem.id);
        if (hasItem) {
            let currentQty = parseInt(textQuantity.value);
            let targetUnitPrice = parseFloat(hasItem.unitprice);

            if (hasItem.mincountity && parseFloat(hasItem.mincountity) > 0 && hasItem.minquunitprice && parseFloat(hasItem.minquunitprice) > 0) {
                if (!isNaN(currentQty) && currentQty >= parseInt(hasItem.mincountity)) {
                    targetUnitPrice = parseFloat(hasItem.minquunitprice);
                }
            }

            textUnitPrice.value = targetUnitPrice.toFixed(2);
            textValidator(textUnitPrice, '^.*$', 'purchaseOrderHasItem', 'uniteprice');
        }
    }

    let unitPrice = purchaseOrderHasItem.uniteprice;
    let quantity = purchaseOrderHasItem.quentity;

    if (unitPrice != null && quantity != null && unitPrice !== "" && quantity !== "") {
        let linePrice = parseFloat(unitPrice) * parseInt(quantity);
        if (!isNaN(linePrice)) {
            textLinePrice.value = linePrice.toFixed(2);
            textValidator(textLinePrice, '^.*$', 'purchaseOrderHasItem', 'lineprice');
        } else {
            textLinePrice.value = "";
            setDefault([textLinePrice]);
            purchaseOrderHasItem.lineprice = null;
        }
    } else {
        textLinePrice.value = "";
        setDefault([textLinePrice]);
        purchaseOrderHasItem.lineprice = null;
    }
}

// define function for refresh inner form
const refreshPurchaseOrderInnerForm = () => {

    // association eke class name ekata samanawa simple walin start kara gani
    purchaseOrderHasItem = new Object();

    // mehi form eka reset kala wita main form ekath reset wana nisa esa kala noheka
    // formPurchaseOrder.reset();
    // ema nisa element tika clean kirima sidu karai
    // selectItem dynamic nisa clean nokarai
    // dynamic element refill kala yuthuya
    // item dropdown ekata load wiya yuththa select karana brand ekata adala item pamani
    // e sadaha item controller ekehi service eka hadai
    selectBrand.value = "";
    fillDataIntoSelectTwo(selectItem, "Please Select Item..!!", [], "itemcode", "itemname");

    textUnitPrice.value = "";
    textQuantity.value = "";
    textLinePrice.value = "";

    // Hide min qty note if exists
    const divMinQtyNote = document.getElementById("divMinQtyNote");
    if (divMinQtyNote) {
        divMinQtyNote.classList.add("d-none");
    }

    // colors wenas kala heka
    setDefault([selectBrand, selectItem, textUnitPrice, textQuantity, textLinePrice]);

    btnPurchaseOrderItemUpdate.classList.add("d-none");
    btnPurchaseOrderItemSubmit.classList.remove("d-none");

    // Reresh inner table
    // array eka awashya netha main object ekata array eka gani
    // let purchaseOrders = [];

    let propertyList = [
        { propertyName: genareateItemName, dataType: "function" },
        { propertyName: "uniteprice", dataType: "decimal" },
        { propertyName: "quentity", dataType: "string" },
        { propertyName: "lineprice", dataType: "decimal" }

    ];

    //call filldataintotable function (talebodyId, datalist, column list, editefunctionname, deletefunctionname, printfunctionname, buttonvisibility) 
    fillDataIntoInnerTable(tableInnerBody, purchaseOrder.purchaseOrderHasItemList, propertyList, purchaseOrderItemFormRefill, purchaseOrderItemDelete, "#offcanvasBottom");

    $('#tablePurchaseOrder').DataTable();

    // "purchaseOrderHasItemList" mehi data thibunoth line price genarate kara gatha heka

    let totalAmount = 0.00;
    for (const orderitem of purchaseOrder.purchaseOrderHasItemList) {
        totalAmount = parseFloat(totalAmount) + parseFloat(orderitem.lineprice);

    }
    // ui eke athi total amount field ekata value eka set kirima
    // total amount eka 0.00 nowe nam value eka ui ekata set karai
    if (totalAmount != 0.00) {
        textTotalAmount.value = totalAmount.toFixed(2);
        // object ekata set karai
        purchaseOrder.totalamount = textTotalAmount.value;
        // validation color eka set karai
        prevElementTotalAmount = textTotalAmount.previousElementSibling;
        textTotalAmount.style.borderBottom = "4px solid green";
        prevElementTotalAmount.style.backgroundColor = "green";
        textTotalAmount.classList.remove("is-invalid");
        textTotalAmount.classList.add("is-valid");
    }

}

const genareateItemName = (dataob) => {
    // itemcode + " - " + itemname
    return dataob.item_id.itemname;
}

const purchaseOrderItemFormRefill = (ob, index) => { }
const purchaseOrderItemDelete = (ob, index) => {
    console.log("Delete Purchase Order Item", purchaseOrderHasItem);
    let userConfirm = window.confirm("Are you sure to remove following item to purchase order...?"
        // +
        // "\n Item : " + purchaseOrderHasItem.item_id.itemname +
        // "\n Unit Price : " + purchaseOrderHasItem.uniteprice +
        // "\n Quantity : " + purchaseOrderHasItem.quentity +
        // "\n Line Price : " + purchaseOrderHasItem.lineprice
    );
    if (userConfirm) {
        window.alert("Item removed successfully from purchase order...!");
        // inner ob eka exsistent soyanawa "purchaseOrder.purchaseOrderHasItemList" mema object eken
        let extIndex = purchaseOrder.purchaseOrderHasItemList.map(orderitem => orderitem.item_id.id).indexOf(ob.item_id.id);
        if (extIndex != -1) {
            purchaseOrder.purchaseOrderHasItemList.splice(extIndex, 1);
        }
        refreshPurchaseOrderInnerForm();
    }
}

const buttonPurchaseOrderItemUpdate = (ob, index) => { }
const buttonPurchaseOrderItemSubmit = (ob, index) => {
    console.log("Purchase Order Item", purchaseOrderHasItem);

    let userConfirm = window.confirm("Are you sure to add following item to purchase order...?"
        +
        "\n Item : " + purchaseOrderHasItem.item_id.itemname +
        "\n Unit Price : " + purchaseOrderHasItem.uniteprice +
        "\n Quantity : " + purchaseOrderHasItem.quentity +
        "\n Line Price : " + purchaseOrderHasItem.lineprice
    );
    if (userConfirm) {
        window.alert("Item added successfully to purchase order...!");
        // main form eke thiyena list ekata ob eka push karai
        // ema nisa table ekehida data atha.
        purchaseOrder.purchaseOrderHasItemList.push(purchaseOrderHasItem);
        refreshPurchaseOrderInnerForm();
    }

}

// Define function to fill supplier names from pending price lists into a <select> dropdown
const fillDataIntoSelectSupplier = (parentId, message, dataList) => {
    // Clear existing options
    parentId.innerHTML = "";

    const optionMsg = document.createElement("option");
    optionMsg.value = "";
    optionMsg.selected = true;
    optionMsg.disabled = true;
    optionMsg.innerText = message;
    parentId.appendChild(optionMsg);

    // Loop through the data and extract supplier names from pending price lists
    dataList.forEach(dataOb => {
        if (dataOb.pricelistrequest_id && dataOb.pricelistrequest_id.supplier_id) {
            const option = document.createElement("option");
            option.value = JSON.stringify(dataOb.pricelistrequest_id.supplier_id);
            option.setAttribute("data-addpricelist", JSON.stringify(dataOb));
            
            let brands = [];
            if (dataOb.addPriceListHasItemList) {
                dataOb.addPriceListHasItemList.forEach(hasItem => {
                    if (hasItem.item_id && hasItem.item_id.brand_id && hasItem.item_id.brand_id.name) {
                        const brandName = hasItem.item_id.brand_id.name;
                        if (!brands.includes(brandName)) {
                            brands.push(brandName);
                        }
                    }
                });
            }
            let brandNames = brands.join(", ");

            option.innerText = dataOb.addpricelistno + " - " + dataOb.pricelistrequest_id.supplier_id.suppliername + " - " + brandNames;
            parentId.appendChild(option);
        }
    });
};






