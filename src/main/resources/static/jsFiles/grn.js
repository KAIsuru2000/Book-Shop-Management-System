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
        return '<i class="fa-solid fa-spinner fa-spin-pulse fa-xl" style="color: #f4eb01;"></i>'
    }

    if (dataob.purchaserequeststatus_id.name == "Recived") {
        return '<i class="fa-solid fa-house-circle-check fa-beat fa-xl" style="color: #04f640;"></i>'
    }

    if (dataob.purchaserequeststatus_id.name == "Completed") {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;"></i>'
    }

    if (dataob.purchaserequeststatus_id.name == "Cancelled ") {
        return '<i class="fa-solid fa-person-circle-xmark fa-beat fa-xl" style="color: #fa0000;"></i>'
    }

    if (dataob.purchaserequeststatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash-can fa-beat fa-xl" style="color: #fe1616;"></i>'
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
//function for re fill purchase order form
const purchaseOrderFormRefill = (ob, index) => {
    console.log("Edit", ob, index);

    // refill value in to element -> elementId.value = ob.releventPropertyName
    textFullName.value = ob.fullname;

    textCallingName.value = ob.callingname;

    textNic.value = ob.nic;

    selectGender.value = ob.gender;

    dateDOB.value = ob.dob;

    inputEmail.value = ob.email;

    telMobil.value = ob.mobile;

    if (ob.landno == undefined) {
        telLand.value = "";
    } else {
        telLand.value = ob.landno;
    }

    textAddress.value = ob.address

    if (ob.note == undefined) {
        textNote.value = "";
    } else {
        textNote.value = ob.note;
    }

    selectDesignation.value = JSON.stringify(ob.designation_id);

    selectCivil.value = ob.civilstatus;

    selectEmpStatus.value = JSON.stringify(ob.employeestatus_id);

    buttonEmpAdd.style.display = "none";




    //employee = ob
    //oldEmployee = ob melesa thibuu wita ob array ekak nisa heap eka thula ekma idehi variable 2 ka awita ekak wenas kala wita anikath wenas we.
    employee = JSON.parse(JSON.stringify(ob));// string kala witra ram ekehi wena wenama seedi heap ekata giya wita 2k lesa pawathi.
    oldEmployee = JSON.parse(JSON.stringify(ob));

    //form eka refill wana wita model eka open kara ganima jquary magin
    // $("#staticBackdrop").modal("show");

}

//function for delete purchase order form
const purchaseOrderDelete = (ob, index) => {
    console.log("Delete", ob, index);

    // activeTableRow(tablePurchaseOrderBody, index, "red");


    let userConfirm = window.confirm("Are you sure to delete following purchase order...?" +
        "\n Purchase Order ID : " + ob.id +
        "\n Purchase Order Date : " + ob.date +
        "\n Employee designation : " + ob.designation_id.name
    );
    if (userConfirm) {
        // call post service
        //anthima parameter eka sadaha employeeDelete function eken pass wana name eka yodai
        let deleteResponce = getHTTPServiceRequest("/employee/delete", "DELETE", ob);

        if (deleteResponce == "OK") {
            window.alert("Delete successfully ");
            refreshEmployeeTable();
            refreshEmployeeform();

        } else {
            window.alert("Delete not successfully" + deleteResponce);

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
    if (errors == "") {
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

//check form update function
const checkFormUpdate = () => {
    let updates = "";

    if (employee != null && oldEmployee != null) {

        if (employee.fullname != oldEmployee.fullname) {
            updates = updates + "Full name is changed  ....! \n";
        }

        if (employee.callingname != oldEmployee.callingname) {
            updates = updates + "calling name is changed  ....!   " + oldEmployee.callingname + " into " + employee.callingname + "\n";
        }

        if (employee.mobile != oldEmployee.mobile) {
            updates = updates + "mobile no is changed  ....! \n" + oldEmployee.mobile + " -> " + employee.mobile + "\n";
        }

        if (employee.nic != oldEmployee.nic) {
            updates = updates + "nic is changed  ....! \n";
        }

        if (employee.gender != oldEmployee.gender) {
            updates = updates + "gender is changed  ....! \n";
        }

        if (employee.dob != oldEmployee.dob) {
            updates = updates + "Date of birth is changed  ....! \n";
        }

        if (employee.email != oldEmployee.email) {
            updates = updates + "email is changed  ....! \n";
        }

        if (employee.address != oldEmployee.address) {
            updates = updates + "address is changed  ....! \n";
        }

        if (employee.civilstatus != oldEmployee.civilstatus) {
            updates = updates + "civil status is changed  ....! \n";
        }

        if (employee.designation_id.name != oldEmployee.designation_id.name) {
            updates = updates + "Designation is changed  ....! \n";
        }

        if (employee.employeestatus_id.name != oldEmployee.employeestatus_id.name) {
            updates = updates + "employee status is changed  ....! \n";
        }
    }


    return updates;
}

// // form update event function 
// const buttonPurchaseOrderUpdate = () => {

//     //need to check form errors
//     let errors = checkFormError();
//     if (errors == "") {
//         // need to check form update
//         let updates = checkFormUpdate();
//         if (updates == "") {
//             window.alert("nothing to update..\n");
//         } else {
//             //need to get user confirmation
//             let userConfirm = window.confirm("Are you sure to update following changers.. \n" + updates);
//             if (userConfirm) {
//                 //call put service
//                 let putResponce = getHTTPServiceRequest("/employee/update", "PUT", employee);
//                 if (putResponce == "OK") {
//                     window.alert("Update Successfully...!");
//                     refreshPurchaseOrderTable();
//                     refreshPurchaseOrderform();
//                     $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas
//                 } else {
//                     window.alert("Failed to update...!" + putResponce);
//                 }
//             } else {

//             }
//         }
//     } else {
//         window.alert("something went wrong.. \n" + errors);
//     }

// }

// form delete event function 
const buttonPurchaseOrderDelete = () => {
    refreshPurchaseOrderTable();
}


const refreshPurchaseOrderForm = () => {
    purchaseOrder = new Object();
    // main object ekata (purchaseOrder) list ekak (purchaseOrderHasItemList) add karala thamai inner form eka dewal addd kala gaththaa
    purchaseOrder.purchaseOrderHasItemList = new Array();

    formPurchaseOrder.reset();

    //validation colors iwath kirima main form sadaha
    setDefault([selectSupplier, dateRequireDate, textTotalAmount, textNote, selectOrderStatus]);

    // dynamic element refill kala yuthuya
    let suppliers = getServiceRequest('supplier/alldata');
    fillDataIntoSelect(selectSupplier, "Please Select Supplier..!!", suppliers, "suppliername");

    let orderStatues = getServiceRequest('/purchaseOrderStatues/alldata');
    fillDataIntoSelect(selectOrderStatus, "Please Select Status..!!", orderStatues, "name");

    // status eka form eka load wana wita select wi thibimata
    // selected value eka string walin ena nisa stringify kara gani
    selectOrderStatus.value = JSON.stringify(orderStatues[0]);
    // ema value eka newatha object ekata set kala yuththa object format ekeni
    purchaseOrder.purchaserequeststatus_id = JSON.parse(selectOrderStatus.value);
    // status field eka sadaha validation colour eka laba deema
    prevElementOrderStatus = selectOrderStatus.previousElementSibling;
    selectOrderStatus.style.borderBottom = "4px solid green";
    prevElementOrderStatus.style.backgroundColor = "green";
    selectOrderStatus.classList.remove("is-invalid");
    selectOrderStatus.classList.add("is-valid");

    // inner form eka refresh karawima
    refreshPurchaseOrderInnerForm();

    btnPurchaseOrderUpdate.classList.add("d-none");
    btnPurchaseOrderSubmit.classList.remove("d-none");
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
    let items = getServiceRequest('/item/alldata');
    // code ekai name ekai dekama drop down ekak thula penwa ganima
    fillDataIntoSelectTwo(selectItem, "Please Select Item..!!", items, "itemcode", "itemname");

    textUnitPrice.value = "";
    textQuantity.value = "";
    textLinePrice.value = "";

    // colors wenas kala heka
    setDefault([selectItem, textUnitPrice, textQuantity, textLinePrice]);

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

// // Define function to fill supplier names into a <select> dropdown
// const fillDataIntoSelectSupplier = (parentId, message, dataList) => {
//     // Clear existing options
//     parentId.innerHTML = "";
//
//     // Add a default disabled placeholder if message is provided
//     // if (message !== "") {
//     const optionMsg = document.createElement("option");
//     optionMsg.value = "";
//     optionMsg.selected = true;
//     optionMsg.disabled = true;
//     optionMsg.innerText = message;
//     parentId.appendChild(optionMsg);
//     // }
//
//     // Loop through the data and extract supplier names
//     dataList.forEach(dataOb => {
//         // if (dataOb.supplier_id && dataOb.supplier_id.suppliername) {
//         const option = document.createElement("option");
//         option.value = JSON.stringify(dataOb); // or dataOb.id if needed
//         option.innerText = dataOb.pricelistrequest_id.supplier_id.suppliername;
//         parentId.appendChild(option);
//         // }
//     });
// };






