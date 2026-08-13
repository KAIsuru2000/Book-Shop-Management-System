//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    refreshGRNTable();

    refreshGRNForm();

})

//refresh table Area
const refreshGRNTable = () => {

    let gRNs = getServiceRequest("/grn/alldata");

    let propertyList = [
        { propertyName: "grnno", dataType: "string" },
        { propertyName: generateSupplierName, dataType: "function" },
        { propertyName: "receivedate", dataType: "string" },
        { propertyName: generateItemList, dataType: "function" },
        { propertyName: "totalamount", dataType: "decimal" },
        { propertyName: getGRNStatus, dataType: "function" },
    ];

    //call filldataintotable function (talebodyId, datalist, column list, editefunctionname, deletefunctionname, printfunctionname, buttonvisibility) 
    fillDataIntoTable(tableGRNBody, gRNs, propertyList, gRNFormRefill, gRNDelete, gRNView, "#offcanvasBottom");


    $('#tableGRN').DataTable();


}

const generateSupplierName = (dataob) => {
    return dataob.purchaserequest_id.supplier_id.suppliername;
}
const getGRNStatus = (dataob) => {

    if (dataob.grnstatus_id.name == "Pending") {
        return '<i class="fa-solid fa-spinner fa-spin-pulse fa-xl" style="color: #fcf45c;" data-bs-toggle="tooltip"\n' +
            '                                                title="Pending"></i>'
    }

    if (dataob.grnstatus_id.name == "Partially Paid") {
        return '<i class="fa-solid fa-circle-half-stroke fa-beat fa-xl" style="color: #f3f702;" data-bs-toggle="tooltip" title="Partially Paid"></i>';
    }

    if (dataob.grnstatus_id.name == "Paid") {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;" data-bs-toggle="tooltip" title="Paid"></i>';
    }

    if (dataob.grnstatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash-can fa-beat fa-xl" style="color: #fe1616;" data-bs-toggle="tooltip"\n' +
            '                                                title="Deleted"></i>'
    }


}
const generateItemList = (dataob) => {
    //ewani awasthawaka wenama veriable ekak hada gani. initially(muladi) string
    let itemList = "";
    // item list ekak ena nisa
    dataob.grnHasItemList.forEach((item, index) => {
        if (dataob.grnHasItemList.length - 1 == index) {
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
const gRNFormRefill = (ob, index) => {
    // console ekata edit karana object eka ha index eka print karanawa
    console.log("Edit", ob, index);

    // pending purchase orders details server eken request karala gannawa
    let pendingPOs = getServiceRequest('/purchaseOrders/getPendingList');
    // selectSupplier dropdown element ekata options fill fillDataIntoSelectSupplier call karanawa
    fillDataIntoSelectSupplier(selectSupplier, "Please Select Purchase Order No..!!", pendingPOs);

    // selected purchase order eka dropdown select box eke active set sets check matching option
    let optionExists = false;
    // selectSupplier options elements loop karanawa
    for (let option of selectSupplier.options) {
        // option empty index value options skipping check
        if (option.value !== "") {
            // option values parse karagannawa purchaseOrder details checks
            let poObj = JSON.parse(option.value);
            // data matches purchase order id controls matches check
            if (poObj && ob.purchaserequest_id && poObj.id === ob.purchaserequest_id.id) {
                // matching option found verify dropdown set values
                optionExists = true;
                selectSupplier.value = option.value;
                break;
            }
        }
    }
    // matching option dropdown list table collections eke clear nethnam
    if (!optionExists && ob.purchaserequest_id) {
        // dynamic option values build element setup
        let option = document.createElement("option");
        // option values assign string format
        option.value = JSON.stringify(ob.purchaserequest_id);
        
        // brand list filters template structure collections
        let brands = [];
        // items loop check brands values mapping
        if (ob.purchaserequest_id.purchaseOrderHasItemList) {
            // inner item looping array
            ob.purchaserequest_id.purchaseOrderHasItemList.forEach(item => {
                // item name brand names validation constraints checks
                if (item.brand_id && item.brand_id.name && !brands.includes(item.brand_id.name)) {
                    // brand append array list
                    brands.push(item.brand_id.name);
                }
            });
        }
        // brand names string comma separator
        let brandNames = brands.join(", ");
        // option inner display label template details format
        option.innerText = ob.purchaserequest_id.purchaserequestno + " - " + ob.purchaserequest_id.supplier_id.suppliername + " - " + brandNames;
        // dropdown select component options dynamic addition append
        selectSupplier.appendChild(option);
        // select option values active set selection value
        selectSupplier.value = option.value;
    }

    // supplier bill no element values refill set
    textSupplierBillNo.value = ob.suplierbillno;
    // received date element values refill set
    dateReceivedDate.value = ob.receivedate;
    // discount rate values details mapping format values set
    textDiscountRate.value = ob.discountrate ? parseFloat(ob.discountrate).toFixed(2) : "";
    // total amount float formats value refill set
    textTotalAmount.value = parseFloat(ob.totalamount).toFixed(2);
    // net amount float formats value refill set
    textNetAmount.value = parseFloat(ob.netamount).toFixed(2);

    // status details database loading calls
    let gRNStatues = getServiceRequest('/grnStatus/alldata');
    // fillDataIntoSelect status setup
    fillDataIntoSelect(selectGRNStatus, "Please Select Status..!!", gRNStatues, "name");
    // status selection dropdown value refill set
    selectGRNStatus.value = JSON.stringify(ob.grnstatus_id);

    // valid colors array elements compilation
    let elementsToGreen = [selectSupplier, textSupplierBillNo, dateReceivedDate, textTotalAmount, textNetAmount, selectGRNStatus];
    // if optional discount rate is present add to validation style changes
    if (ob.discountrate) {
        elementsToGreen.push(textDiscountRate);
    }
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

    // main objects gRN clone details duplication parse
    gRN = JSON.parse(JSON.stringify(ob));
    // comparison oldGRN clones verification copy values
    oldGRN = JSON.parse(JSON.stringify(ob));

    // update details button visible class remove
    btnGRNUpdate.classList.remove("d-none");
    // add submissions button hide class add
    btnGRNSubmit.classList.add("d-none");

    // offcanvas wrapper layout bootstrap modal components show methods trigger
    $("#offcanvasBottom").offcanvas("show");

    // inner form contents items clear refresh inner table elements call
    refreshGRNInnerForm();
}

// GRN soft delete karana function eka
const gRNDelete = (ob, index) => {
    // console eke delete karana record details print karanawa
    console.log("Delete", ob, index);

    // confirm message eka display karala confirmation eka gannawa
    let userConfirm = window.confirm("Are you sure to delete following GRN...?\n" +
        "GRN No: " + ob.grnno + "\n" +
        "Supplier: " + (ob.purchaserequest_id && ob.purchaserequest_id.supplier_id ? ob.purchaserequest_id.supplier_id.suppliername : "N/A")
    );
    // confirm kala nam DELETE api mapping call karanawa
    if (userConfirm) {
        // DELETE request eka yawanawa
        let deleteResponse = getHTTPServiceRequest("/grn/delete", "DELETE", ob);

        // response eka successfully OK nam table update karanawa
        if (deleteResponse === "OK") {
            // success alert message eka penwanawa
            window.alert("Deleted successfully!");
            // table details and form details refresh clear calls
            refreshGRNTable();
            refreshGRNForm();
        } else {
            // failed errors warnings alert
            window.alert("Failed to delete:\n" + deleteResponse);
        }
    }
}

//function for view / print purchase order form
const gRNView = (ob, index) => {
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
    if (ob.note == undefined) {
        noteView.innerText = "-";
    } else {
        noteView.innerText = ob.note;
    }
    designationView.innerText = ob.designation_id.name;
    civilStatusView.innerText = ob.civilstatus;
    employeeStatusView.innerText = ob.employeestatus_id.name;

    $("#offcanvasBottomView").offcanvas("show"); // show the offcanvas

}
//print button function
const buttonPrintRow = () => {

    //aluth window ekak open kara ganima
    let newWindow = window.open();
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

    if (gRN.purchaserequest_id == null) {
        errors = errors + "Please Enter valid Supplier Name...! \n";
    }

    if (gRN.suplierbillno == null) {
        errors = errors + "Please Enter valid Supplier Bill No...! \n";
    }

    if (gRN.receivedate == null) {
        errors = errors + "Please Enter valid Received Date...! \n";
    }

    if (gRN.totalamount == null) {
        errors = errors + "Please Enter valid Total amount...! \n";
    }

    if (gRN.netamount == null) {
        errors = errors + "Please Enter valid Net amount...! \n";
    }

    if (gRN.grnstatus_id == null) {
        errors = errors + "Please Select valid GRN Status...! \n";
    }

    if (gRN.grnHasItemList.length == 0) {
        errors = errors + "Please Enter valid GRN Items...! \n";
    }

    return errors;
}


//GRN form submit event function 
const buttonGRNSubmit = () => {
    console.log('Add GRN', gRN);

    //check form error for required element
    let errors = checkFormError();
    if (errors == "") {
        //no errors get user confirmation
        let userConfirm = window.confirm("Are you sure to add following GRN...?" +
            "\n Supplier name : " + gRN.purchaserequest_id
                .supplier_id.suppliername +
            "\n GRN Receive date : " + gRN.receivedate +
            "\n GRN total amount : " + gRN.totalamount
        );
        if (userConfirm) {
            // call post service
            let postResponce = getHTTPServiceRequest("/grn/insert", "POST", gRN);
            if (postResponce == "OK") {
                window.alert("Save successfully ");
                refreshGRNTable();
                refreshGRNForm();
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

    // gRN object ha oldGRN null check validation
    if (gRN != null && oldGRN != null) {
        // purchase order id values compare check
        if (gRN.purchaserequest_id.id != oldGRN.purchaserequest_id.id) {
            // updates change message string append
            updates += "Purchase Order No changed from " + oldGRN.purchaserequest_id.purchaserequestno + " to " + gRN.purchaserequest_id.purchaserequestno + "\n";
        }

        // supplier bill no values compare check
        if (gRN.suplierbillno != oldGRN.suplierbillno) {
            // updates change message string append
            updates += "Supplier Bill No changed from " + oldGRN.suplierbillno + " to " + gRN.suplierbillno + "\n";
        }

        // receivedate values compare check
        if (gRN.receivedate != oldGRN.receivedate) {
            // updates change message string append
            updates += "Received Date changed from " + oldGRN.receivedate + " to " + gRN.receivedate + "\n";
        }

        // discountrate values compare check (handles null/optional values)
        let oldDiscount = oldGRN.discountrate ? parseFloat(oldGRN.discountrate) : 0;
        let newDiscount = gRN.discountrate ? parseFloat(gRN.discountrate) : 0;
        if (oldDiscount != newDiscount) {
            // updates change message string append
            updates += "Discount Rate changed from " + oldDiscount + "% to " + newDiscount + "%\n";
        }

        // totalamount values compare check
        if (parseFloat(gRN.totalamount) != parseFloat(oldGRN.totalamount)) {
            // updates change message string append
            updates += "Total Amount changed from Rs. " + parseFloat(oldGRN.totalamount).toFixed(2) + " to Rs. " + parseFloat(gRN.totalamount).toFixed(2) + "\n";
        }

        // netamount values compare check
        if (parseFloat(gRN.netamount) != parseFloat(oldGRN.netamount)) {
            // updates change message string append
            updates += "Net Amount changed from Rs. " + parseFloat(oldGRN.netamount).toFixed(2) + " to Rs. " + parseFloat(gRN.netamount).toFixed(2) + "\n";
        }

        // grnstatus id values compare check
        if (gRN.grnstatus_id.id != oldGRN.grnstatus_id.id) {
            // updates status message string append
            updates += "Status changed to " + gRN.grnstatus_id.name + "\n";
        }

        // inner table items comparison JSON checks
        if (JSON.stringify(gRN.grnHasItemList) !== JSON.stringify(oldGRN.grnHasItemList)) {
            // updates change message string append
            updates += "GRN items have changed!\n";
        }
    }

    // result differences updates log collection output return
    return updates;
}

// main form update details button event trigger action function eka
const buttonGRNUpdate = () => {
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
            let userConfirm = window.confirm("Are you sure to update this GRN with following changes?\n" + updates);
            // user confirm verification ok clicks
            if (userConfirm) {
                // PUT service update endpoint query api request send
                let putResponse = getHTTPServiceRequest("/grn/update", "PUT", gRN);
                // response status checks checks OK response
                if (putResponse === "OK") {
                    // successfully updated alert display messages
                    window.alert("GRN updated successfully!");
                    // table data list refresh call
                    refreshGRNTable();
                    // form configurations layout reload clean calls
                    refreshGRNForm();
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
const buttonGRNDelete = () => {
    refreshGRNTable();
}


const refreshGRNForm = () => {
    gRN = new Object();
    // main object ekata (gRN) list ekak (gRNHasItemList) add karala thamai inner form eka dewal addd kala gaththaa
    gRN.grnHasItemList = new Array();

    // parana grn object eka comparison walata null karala initialize karanawa
    oldGRN = null;

    formGRN.reset();

    //validation colors iwath kirima main form sadaha
    setDefault([selectSupplier, textSupplierBillNo, dateReceivedDate, textDiscountRate, textTotalAmount, textNetAmount, selectGRNStatus]);

    // Received Date ekata ada dawase idan dawas 10k pitupalata wenakam dynamic limits hadanawa
    let currentDate = new Date(); // Ada dawasa ganna new Date object ekak hadagannawa
    let maxMonth = currentDate.getMonth() + 1; // Ada mase gannawa (getMonth eka 0-11 labena nisa eya 1-12 karaganna 1k ekathu karanawa)
    if (maxMonth < 10) { // Mase 10ta adu nam (eka digit ekak nam)
        maxMonth = "0" + maxMonth; // Mase issarahata 0k ekathu karanawa format eka hadanna
    }
    let maxDay = currentDate.getDate(); // Ada dawasa gannawa
    if (maxDay < 10) { // Dawasa 10ta adu nam (eka digit ekak nam)
        maxDay = "0" + maxDay; // Dawasa issarahata 0k ekathu karanawa format eka hadanna
    }
    let maxDate = currentDate.getFullYear() + "-" + maxMonth + "-" + maxDay; // Aurudda, mase saha dawasa ekathu karala YYYY-MM-DD format ekata maxDate eka hadagannawa
    dateReceivedDate.max = maxDate; // Calendar eke select karanna puluwan uparima dawasa ada dawasata set karanawa

    currentDate.setDate(currentDate.getDate() - 10); // Ada dawase idan dawas 10k pitupalata date object eka set karanawa
    let minMonth = currentDate.getMonth() + 1; // Min date ekata adala mase gannawa (1k ekathu karala)
    if (minMonth < 10) { // Mase 10ta adu nam
        minMonth = "0" + minMonth; // Mase issarahata 0k ekathu karanawa
    }
    let minDay = currentDate.getDate(); // Min date ekata adala dawasa gannawa
    if (minDay < 10) { // Dawasa 10ta adu nam
        minDay = "0" + minDay; // Dawasa issarahata 0k ekathu karanawa
    }
    let minDate = currentDate.getFullYear() + "-" + minMonth + "-" + minDay; // Min date eka YYYY-MM-DD format ekata hadagannawa
    dateReceivedDate.min = minDate; // Calendar eke select karanna puluwan aduma dawasa (dawas 10k pitupala) set karanawa

    // dynamic element refill kala yuthuya
    let suppliers = getServiceRequest('/purchaseOrders/getPendingList');
    fillDataIntoSelectSupplier(selectSupplier, "Please Select Purchase Order No..!!", suppliers);

    let gRNStatues = getServiceRequest('/grnStatus/alldata');
    fillDataIntoSelect(selectGRNStatus, "Please Select Status..!!", gRNStatues, "name");

    // status eka form eka load wana wita select wi thibimata
    // selected value eka string walin ena nisa stringify kara gani
    selectGRNStatus.value = JSON.stringify(gRNStatues[0]);
    // ema value eka newatha object ekata set kala yuththa object format ekeni
    gRN.grnstatus_id = JSON.parse(selectGRNStatus.value);
    // status field eka sadaha validation colour eka laba deema
    prevElementGRNStatus = selectGRNStatus.previousElementSibling;
    selectGRNStatus.style.borderBottom = "4px solid green";
    prevElementGRNStatus.style.backgroundColor = "green";
    selectGRNStatus.classList.remove("is-invalid");
    selectGRNStatus.classList.add("is-valid");

    // inner form eka refresh karawima
    refreshGRNInnerForm();

    btnGRNUpdate.classList.add("d-none");
    btnGRNSubmit.classList.remove("d-none");
}

// define function for refresh inner form
const refreshGRNInnerForm = () => {

    // association eke class name ekata samanawa simple walin start kara gani
    grnHasItem = new Object();


    // mehi form eka reset kala wita main form ekath reset wana nisa esa kala noheka
    // formPurchaseOrder.reset();
    // ema nisa element tika clean kirima sidu karai
    // selectItem dynamic nisa clean nokarai
    // dynamic element refill kala yuthuya
    // empty items array ekak hadagannawa dropdown select list eka ganna
    let items = [];
    // select karapu purchase order eka and eke items list valid da balanawa
    if (gRN.purchaserequest_id && gRN.purchaserequest_id.purchaseOrderHasItemList) {
        // dynamic set ekak hadagannawa item ids duplicate wena eka nawatthanna
        let itemIds = new Set();
        // purchase order eke items list eka loop karala items collect karanawa
        gRN.purchaserequest_id.purchaseOrderHasItemList.forEach(poHasItem => {
            // item list dynamic set ekata repeat nowi add karaganna check karanawa
            if (poHasItem.item_id && !itemIds.has(poHasItem.item_id.id)) {
                // item id eka set ekata add karanawa duplicate check karaganna
                itemIds.add(poHasItem.item_id.id);
                // items list ekata item structure eka push karanawa
                items.push(poHasItem.item_id);
            }
        });

        // Server eken okkoma save karapu grn data tika gannawa
        let allGRNs = getServiceRequest("/grn/alldata");

        // Danata select karapu purchase order id ekata adala, kalin save karapu items wala id collect karaganna array ekak
        let savedItemIds = [];
        // database eken gaththa grn records loop karala items id collect karanawa
        allGRNs.forEach(savedGRN => {
            // grn status eka Deleted newe nam saha, select karala thiyena purchase order id ekatama adala nam
            if ((!savedGRN.grnstatus_id || savedGRN.grnstatus_id.name !== "Deleted") && 
                savedGRN.purchaserequest_id && savedGRN.purchaserequest_id.id === gRN.purchaserequest_id.id) {
                // grn eke items array eka thiyeda balala, thiyenam loop karala items collect karanawa
                if (savedGRN.grnHasItemList) {
                    // has items loop karanawa
                    savedGRN.grnHasItemList.forEach(grnItem => {
                        // item id property eka valid nam array ekata push karanawa
                        if (grnItem.item_id) {
                            // savedItemIds list ekata id eka collect karanawa
                            savedItemIds.push(grnItem.item_id.id);
                        }
                    });
                }
            }
        });

        // Inner table ekata eka parak add karapu items + database eke kalin save karapu items dropdown eken ain karanna filter karagannawa
        let availableItems = items.filter(item => {
            // inner table eke (gRN.grnHasItemList) danata item eka add wela thiyeda balanawa
            let isAddedInForm = gRN.grnHasItemList.some(addedItem => addedItem.item_id.id === item.id);
            // Kalin database ekata save karapu item ekakda balanawa
            let isAlreadySaved = savedItemIds.includes(item.id);
            // Form eke add wela nathi, database eke save wela nathi items pamanak dropdown ekata gannawa
            return !isAddedInForm && !isAlreadySaved;
        });

        // filter karala gaththa availableItems selectItem dropdown ekata fill karanawa
        fillDataIntoSelectTwo(selectItem, "Please Select Item..!!", availableItems, "itemcode", "itemname");
    } else {
        // selected purchase order ekak nathnam okkoma items database eken gannawa
        items = getServiceRequest('/item/alldata');
        
        // inner table ekata danata add karapu items dropdown eken ain karanna filter karagannawa
        let availableItems = items.filter(item => {
            // inner table eke (gRN.grnHasItemList) danata item eka add wela thiyeda balanawa
            let isAdded = gRN.grnHasItemList.some(addedItem => addedItem.item_id.id === item.id);
            // add wela nathnam pamanak drop down ekata filter karala select karaganna return karanawa
            return !isAdded;
        });

        // code ekai name ekai dekama drop down ekak thula penwa ganima
        fillDataIntoSelectTwo(selectItem, "Please Select Item..!!", availableItems, "itemcode", "itemname");
    }

    textPurchasePrice.value = "";
    textQuantity.value = "";
    textLinePrice.value = "";
    textFreeQuantity.value = "";
    textTotalQuantity.value = "";
    textProfitRatio.value = ""; // Inner form eka refresh weddi Profit Ratio input field eke value eka clear karanawa
    textSalesPrice.value = ""; // Inner form eka refresh weddi Sales Price input field eke value eka clear karanawa

    // colors wenas kala heka. Element wala validations colors (green/red borders) ain karanna setDefault call karanawa
    setDefault([selectItem, textPurchasePrice, textQuantity, textLinePrice, textFreeQuantity, textTotalQuantity, textProfitRatio, textSalesPrice]);

    btnGRNItemUpdate.classList.add("d-none");
    btnGRNItemSubmit.classList.remove("d-none");

    // Reresh inner table
    // array eka awashya netha main object ekata array eka gani
    // let purchaseOrders = [];

    let propertyList = [
        { propertyName: genareateItemName, dataType: "function" },
        { propertyName: "purchaseprice", dataType: "decimal" },
        { propertyName: "totalquentity", dataType: "string" },
        { propertyName: "lineprice", dataType: "decimal" }

    ];

    //call filldataintotable function (talebodyId, datalist, column list, editefunctionname, deletefunctionname, printfunctionname, buttonvisibility) 
    fillDataIntoInnerTable(tableInnerBody, gRN.grnHasItemList, propertyList, gRNItemFormRefill, gRNItemDelete, "#offcanvasBottom");

    $('#tablePurchaseOrder').DataTable();

    // "purchaseOrderHasItemList" mehi data thibunoth line price genarate kara gatha heka

    let totalAmount = 0.00;
    for (const orderitem of gRN.grnHasItemList) {
        totalAmount = parseFloat(totalAmount) + parseFloat(orderitem.lineprice);

    }
    // ui eke athi total amount field ekata value eka set kirima
    // total amount eka 0.00 nowe nam value eka ui ekata set karai
    if (totalAmount != 0.00) {
        textTotalAmount.value = totalAmount.toFixed(2); // textTotalAmount input field ekata decimal sthana 2kata values hadala set karanawa
        // object ekata set karai
        gRN.totalamount = textTotalAmount.value; // gRN object eke totalamount property ekata value eka assign karanawa
        // validation color eka set karai
        prevElementTotalAmount = textTotalAmount.previousElementSibling; // validation borders text input eke hadaganna kalin element eka gannawa
        textTotalAmount.style.borderBottom = "4px solid green"; // Input field border eka green (valid) karanawa
        prevElementTotalAmount.style.backgroundColor = "green"; // Span background eka green karanawa
        textTotalAmount.classList.remove("is-invalid"); // is-invalid color class eka ain karanawa
        textTotalAmount.classList.add("is-valid"); // is-valid color class eka add karanawa
    } else { // totalAmount eka 0.00 nam (items mukuth nathi nam)
        textTotalAmount.value = ""; // totalAmount input field eka clear karanawa
        setDefault([textTotalAmount]); // validation styling default status ekata reset karanawa
        gRN.totalamount = null; // gRN object eke totalamount property eka null karanawa
    }

    calculateNetAmount(); // total amount eka wenas weddi net amount eka dynamically hadaganna call karanawa

}

const calculateLinePrice = () => {
    let purchasePrice = grnHasItem.purchaseprice;
    let quantity = grnHasItem.quentity;

    if (purchasePrice != null && quantity != null && purchasePrice !== "" && quantity !== "") {
        let linePrice = parseFloat(purchasePrice) * parseInt(quantity);
        if (!isNaN(linePrice)) {
            textLinePrice.value = linePrice.toFixed(2);
            textValidator(textLinePrice, '^.*$', 'grnHasItem', 'lineprice');
        } else {
            textLinePrice.value = "";
            setDefault([textLinePrice]);
            grnHasItem.lineprice = null;
        }
    } else {
        textLinePrice.value = "";
        setDefault([textLinePrice]);
        grnHasItem.lineprice = null;
    }
};

const calculateTotalQuantity = () => {
    let quantity = grnHasItem.quentity;
    let freeQuantity = grnHasItem.freequentity;

    if (quantity != null && quantity !== "" && !isNaN(quantity)) {
        let qtyVal = parseInt(quantity);
        let freeQtyVal = 0;
        if (freeQuantity != null && freeQuantity !== "" && !isNaN(freeQuantity)) {
            freeQtyVal = parseInt(freeQuantity);
        } else {
            grnHasItem.freequentity = 0;
        }
        let totalQuantity = qtyVal + freeQtyVal;
        textTotalQuantity.value = totalQuantity;
        textValidator(textTotalQuantity, '^.*$', 'grnHasItem', 'totalquentity');
    } else {
        textTotalQuantity.value = "";
        setDefault([textTotalQuantity]);
        grnHasItem.totalquentity = null;
    }
};

// Sales Price eka calculate karala auto fill karana function eka
const generateSalesPrice = () => {
    let purchasePrice = grnHasItem.purchaseprice; // grnHasItem object eke purchaseprice eka variable ekakata gannawa
    let profitRate = grnHasItem.profitrate; // grnHasItem object eke profitrate eka variable ekakata gannawa

    // Purchase Price saha Profit Rate dekama valid nam (null noyana saha empty nowana nam)
    if (purchasePrice != null && profitRate != null && purchasePrice !== "" && profitRate !== "") {
        // Sales price eka hadagannawa: purchase price + (purchase price * profit rate / 100)
        let salesPrice = parseFloat(purchasePrice) + (parseFloat(purchasePrice) * parseFloat(profitRate) / 100);
        if (!isNaN(salesPrice)) { // Hadagaththa salesPrice eka number ekak nam (NaN nowana nam)
            textSalesPrice.value = salesPrice.toFixed(2); // Eya decimal sthana dekakata hadala Sales Price input eke value ekata set karanawa
            textValidator(textSalesPrice, '^.*$', 'grnHasItem', 'salesprice'); // Sales Price element eka validate karala binding eka karaganna validator eka call karanawa
        } else { // Sales Price number ekak nowana nam
            textSalesPrice.value = ""; // Input value eka clear karanawa
            setDefault([textSalesPrice]); // Validation color styles ain karanawa
            grnHasItem.salesprice = null; // grnHasItem object eke salesprice property eka null karanawa
        }
    } else { // Purchase Price ho Profit Rate dekesta ekak nathnam ho invalid nam
        textSalesPrice.value = ""; // Input value eka clear karanawa
        setDefault([textSalesPrice]); // Validation color styles ain karanawa
        grnHasItem.salesprice = null; // grnHasItem object eke salesprice property eka null karanawa
    }
};

// Net Amount eka calculate karala auto fill karana function eka
const calculateNetAmount = () => {
    let totalAmount = gRN.totalamount; // gRN object eke totalamount property eke value eka variable ekakata gannawa
    let discountRate = gRN.discountrate; // gRN object eke discountrate property eke value eka variable ekakata gannawa

    // Total Amount eka empty nowana, valid number ekak nam
    if (totalAmount != null && totalAmount !== "" && !isNaN(totalAmount)) {
        let discountVal = 0; // discount percentage eka mulinma 0k kiyala dagannawa
        // Discount Rate eka valid number ekak washayen thiyenawanam
        if (discountRate != null && discountRate !== "" && !isNaN(discountRate)) {
            discountVal = parseFloat(discountRate); // discount rate value eka float number ekak karagannawa
        }

        // Net Amount calculate karanawa: Total Amount - (Total Amount * Discount Rate / 100)
        let netAmount = parseFloat(totalAmount) - (parseFloat(totalAmount) * discountVal / 100);
        if (!isNaN(netAmount) && netAmount >= 0) { // netAmount number ekak saha eya 0ta wada wadi nam
            textNetAmount.value = netAmount.toFixed(2); // Net Amount input field ekata decimal sthana 2kata hadala value eka set karanawa
            textValidator(textNetAmount, '^.*$', 'gRN', 'netamount'); // Net amount input field eka validate karala binding eka karaganna validator eka call karanawa
        } else { // calculate una netAmount invalid nam
            textNetAmount.value = ""; // Net Amount field eka clear karanawa
            setDefault([textNetAmount]); // validation color patterns default karanawa
            gRN.netamount = null; // gRN object eke netamount property eka null karanawa
        }
    } else { // totalAmount eka invalid nam
        textNetAmount.value = ""; // Net Amount field eka clear karanawa
        setDefault([textNetAmount]); // validation colors clear karanawa
        gRN.netamount = null; // gRN object eke netamount property eka null karanawa
    }
};

const selectItemChange = () => {
    // purchase order select karala thiyeda saha selectItem dropdown eke value ekak thiyeda balanawa
    if (gRN.purchaserequest_id && selectItem.value !== "") {
        // select karapu item eke details json format eken parse karagannawa
        const selectedItem = JSON.parse(selectItem.value);
        // purchase order eke item list eken select karapu item ekata adala record eka soya gannawa
        const poItem = gRN.purchaserequest_id.purchaseOrderHasItemList.find(
            poi => poi.item_id && poi.item_id.id === selectedItem.id
        );
        // purchase order item eka labila thiyenawanam
        if (poItem) {
            // purchase price field ekata uniteprice value eka decimal sthana dekakata set karanawa
            textPurchasePrice.value = parseFloat(poItem.uniteprice).toFixed(2);
            // purchase price input field eka validate karala binding eka sidu karanawa
            textValidator(textPurchasePrice, '^.*$', 'grnHasItem', 'purchaseprice');
            // line price eka calculate karanna call karanawa
            calculateLinePrice();

            // add price list eken thora gath item ekata adala market price eka soyanna variable ekak mulinma null kiyala gannawa
            let marketPrice = null;
            // purchaserequest_id thule addpricelist_id saha addPriceListHasItemList valid da kiyala pariksha karanawa
            if (gRN.purchaserequest_id.addpricelist_id && gRN.purchaserequest_id.addpricelist_id.addPriceListHasItemList) {
                // select karapu item id ekata match wena price list record eka filter karagannawa
                const priceListItem = gRN.purchaserequest_id.addpricelist_id.addPriceListHasItemList.find(
                    pli => pli.item_id && pli.item_id.id === selectedItem.id
                );
                // eya sidu vee thiyenam market price eka laba gannawa
                if (priceListItem) {
                    marketPrice = priceListItem.marketprice;
                }
            }

            // marketPrice value ekak thiyeda kiyala check karanawa
            if (marketPrice !== null && marketPrice !== undefined) {
                // sales price input field ekata market price value eka decimal sthana dekakata auto fill karanawa
                textSalesPrice.value = parseFloat(marketPrice).toFixed(2);
                // sales price field eka validate karala grnHasItem object ekata bind karanawa
                textValidator(textSalesPrice, '^.*$', 'grnHasItem', 'salesprice');
                
                // purchase price eka variable ekakata assign karagannawa
                let purchasePrice = grnHasItem.purchaseprice;
                // purchase price eka valid number ekak saha 0ta wada wadi nam pamanak profit ratio hadanawa
                if (purchasePrice != null && purchasePrice !== "" && parseFloat(purchasePrice) > 0) {
                    // purchase price value eka float number ekak widiyata gannawa
                    let pPrice = parseFloat(purchasePrice);
                    // market price value eka float number ekak widiyata gannawa
                    let sPrice = parseFloat(marketPrice);
                    // profit ratio calculate karana formula eka (sales price eken purchase price adu karala purchase price eken bedala 100n gunah kireema)
                    let profitRate = ((sPrice - pPrice) / pPrice) * 100;
                    // calculated profit ratio eka textProfitRatio field ekata auto fill karanawa
                    textProfitRatio.value = profitRate.toFixed(2);
                    // profit ratio field eka validate karala grnHasItem object ekata bind karanawa
                    textValidator(textProfitRatio, '^.*$', 'grnHasItem', 'profitrate');
                } else {
                    // purchase price invalid nam profit ratio clear karanawa
                    textProfitRatio.value = "";
                    // profit ratio eke validation border clean karanawa
                    setDefault([textProfitRatio]);
                    // object property eka null karanawa
                    grnHasItem.profitrate = null;
                }
            } else {
                // price list eke market price nathnam sales price field eka clear karanawa
                textSalesPrice.value = "";
                // sales price eke validation border clean karanawa
                setDefault([textSalesPrice]);
                // object property eka null karanawa
                grnHasItem.salesprice = null;
                
                // profit ratio field eka clear karanawa
                textProfitRatio.value = "";
                // validation styling default state ekata reset karanawa
                setDefault([textProfitRatio]);
                // object property eka null karanawa
                grnHasItem.profitrate = null;
            }
        } else {
            // purchase order eke item eka nathi nam purchase price field eka clear karanawa
            textPurchasePrice.value = "";
            // field eke validation styles clean karanawa
            setDefault([textPurchasePrice]);
            // object property eka null karanawa
            grnHasItem.purchaseprice = null;
            // line price calculations update karanawa
            calculateLinePrice();
            
            // sales price clear karanawa
            textSalesPrice.value = "";
            // sales price validation styling default state ekata reset karanawa
            setDefault([textSalesPrice]);
            // object property eka null karanawa
            grnHasItem.salesprice = null;
            
            // profit ratio clear karanawa
            textProfitRatio.value = "";
            // profit ratio validation styling default state ekata reset karanawa
            setDefault([textProfitRatio]);
            // object property eka null karanawa
            grnHasItem.profitrate = null;
        }
    } else {
        // purchase order ho selectItem drop down select state eka clear nam purchase price field eka clear karanawa
        textPurchasePrice.value = "";
        // validation style resets
        setDefault([textPurchasePrice]);
        // object property eka null
        grnHasItem.purchaseprice = null;
        // line price calculations clear
        calculateLinePrice();
        
        // sales price field clear
        textSalesPrice.value = "";
        // validation border styles clear
        setDefault([textSalesPrice]);
        // object property eka null
        grnHasItem.salesprice = null;
        
        // profit ratio field clear
        textProfitRatio.value = "";
        // validation border styles clear
        setDefault([textProfitRatio]);
        // object property eka null
        grnHasItem.profitrate = null;
    }
};

const genareateItemName = (dataob) => {
    // itemcode + " - " + itemname
    return dataob.item_id.itemname;
}

const gRNItemFormRefill = (ob, index) => { }
const gRNItemDelete = (ob, index) => {
    console.log("Delete GRN Item", grnHasItem);
    let userConfirm = window.confirm("Are you sure to remove following item in GRN...?"
        // +
        // "\n Item : " + purchaseOrderHasItem.item_id.itemname +
        // "\n Unit Price : " + purchaseOrderHasItem.uniteprice +
        // "\n Quantity : " + purchaseOrderHasItem.quentity +
        // "\n Line Price : " + purchaseOrderHasItem.lineprice
    );
    if (userConfirm) {
        window.alert("Item removed successfully from GRN...!");
        // inner ob eka exsistent soyanawa "purchaseOrder.purchaseOrderHasItemList" mema object eken
        let extIndex = gRN.grnHasItemList.map(grnitem => grnitem.item_id.id).indexOf(ob.item_id.id);
        if (extIndex != -1) {
            gRN.grnHasItemList.splice(extIndex, 1);
        }
        refreshGRNInnerForm();
    }
}

const buttonGRNItemUpdate = (ob, index) => { }
const buttonGRNItemSubmit = (ob, index) => {
    console.log("GRN Item", grnHasItem);

    let userConfirm = window.confirm("Are you sure to add following item to GRN...?"
        +
        "\n Item : " + grnHasItem.item_id.itemname +
        "\n Purchase Price : " + grnHasItem.purchaseprice +
        "\n Quantity : " + grnHasItem.quentity +
        "\n Line Price : " + grnHasItem.lineprice +
        "\n Free Quantity : " + grnHasItem.freequentity +
        "\n Total Quantity : " + grnHasItem.totalquentity +
        "\n Profit Ratio : " + grnHasItem.profitrate +
        "\n Sales Price : " + grnHasItem.salesprice
    );
    if (userConfirm) {
        window.alert("Item added successfully to GRN...!");
        // main form eke thiyena list ekata ob eka push karai
        // ema nisa table ekehida data atha.
        gRN.grnHasItemList.push(grnHasItem);
        refreshGRNInnerForm();
    }

}

// Define function to fill supplier names into a <select> dropdown
const fillDataIntoSelectSupplier = (parentId, message, dataList) => {
    // Clear existing options
    parentId.innerHTML = "";

    // Add a default disabled placeholder if message is provided
    // if (message !== "") {
    const optionMsg = document.createElement("option");
    optionMsg.value = "";
    optionMsg.selected = true;
    optionMsg.disabled = true;
    optionMsg.innerText = message;
    parentId.appendChild(optionMsg);
    // }

    // Loop through the data and extract supplier names
    dataList.forEach(dataOb => {
        // if (dataOb.supplier_id && dataOb.supplier_id.suppliername) {
        const option = document.createElement("option");
        option.value = JSON.stringify(dataOb); // or dataOb.id if needed
        
        let brands = [];
        if (dataOb.purchaseOrderHasItemList) {
            dataOb.purchaseOrderHasItemList.forEach(item => {
                if (item.brand_id && item.brand_id.name && !brands.includes(item.brand_id.name)) {
                    brands.push(item.brand_id.name);
                }
            });
        }
        let brandNames = brands.join(", ");
        
        option.innerText = dataOb.purchaserequestno + " - " + dataOb.supplier_id.suppliername + " - " + brandNames;
        parentId.appendChild(option);
        // }
    });
};






