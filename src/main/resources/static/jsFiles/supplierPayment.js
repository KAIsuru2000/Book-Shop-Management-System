//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    refreshSupplierPaymentTable();

    refreshSupplierPaymentForm();

})

//refresh table Area
const refreshSupplierPaymentTable = () => {

    let supplierPayments = getServiceRequest("/supplierPayment/alldata");

    let propertyList = [
        { propertyName: "billno", dataType: "string" },
        { propertyName: generateSupplierName, dataType: "function" },
        { propertyName: "totaldueamount", dataType: "decimal" },
        { propertyName: "paidamount", dataType: "decimal" },
        { propertyName: "balanceamount", dataType: "decimal" },
        { propertyName: getSupplierPaymentStatus, dataType: "function" },
    ];

    //call filldataintotable function (talebodyId, datalist, column list, editefunctionname, deletefunctionname, printfunctionname, buttonvisibility) 
    fillDataIntoTable(tableSupplierPaymentBody, supplierPayments, propertyList, supplierPaymentFormRefill, supplierPaymentDelete, supplierPaymentView, "#offcanvasBottom");


    $('#tableSupplierPayment').DataTable();


}

const generateSupplierName = (dataob) => {
    return dataob.supplier_id.suppliername;
}
const getSupplierPaymentStatus = (dataob) => {

    if (dataob.suplierpaymentstatus_id.name == "Pending") {
        return '<i class="fa-solid fa-circle-notch fa-spin fa-xl" style="color: #fa0000;"></i>'
    }

    if (dataob.suplierpaymentstatus_id.name == "Partially Paid") {
        return '<i class="fa-solid fa-circle-half-stroke fa-beat fa-xl" style="color: #f78502;"></i>'
    }

    if (dataob.suplierpaymentstatus_id.name == "Paid") {
        return '<i class="fa-solid fa-circle fa-beat fa-xl" style="color: #1eff00;"></i>'
    }


}
// const generateItemList = (dataob) => {
//     //ewani awasthawaka wenama veriable ekak hada gani. initially(muladi) string
//     let itemList = "";
//     // item list ekak ena nisa
//     dataob.grnHasItemList.forEach((item, index) => {
//         if (dataob.grnHasItemList.length - 1 == index) {
//             //last item eken pasu "," ekak set nokarai
//             itemList = itemList + item.item_id.itemname;
//         } else {
//             //items veriable ekata concatinate kara ganimata item object eke name access karala
//             //name athara gap ekak thaba gani
//             itemList = itemList + item.item_id.itemname + " , ";
//         }

//     });
//     //awasanaye roles object eka return karanawa
//     return itemList;
// }
//function for re fill purchase order form
const supplierPaymentFormRefill = (ob, index) => {
    console.log("Edit", ob, index);



}

//function for delete purchase order form
const supplierPaymentDelete = (ob, index) => {
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
            refreshSupplierPaymentTable();
            refreshSupplierPaymentform();

        } else {
            window.alert("Delete not successfully" + deleteResponce);

        }




    }
}

//function for view / print purchase order form
const supplierPaymentView = (ob, index) => {
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

    if (supplierPayment.balanceamount == null) {
        errors = errors + "Please Enter valid balance amount...! \n";
    }

    if (supplierPayment.paidamount == null) {
        errors = errors + "Please Enter valid paid amount...! \n";
    }

    if (supplierPayment.paymentmethod == null) {
        errors = errors + "Please Enter valid payment method...! \n";
    }

    if (supplierPayment.supplier_id == null) {
        errors = errors + "Please Enter valid supplier...! \n";
    }

    if (supplierPayment.suplierpaymentstatus_id == null) {
        errors = errors + "Please Enter valid supplier payment status...! \n";
    }

    if (supplierPayment.totaldueamount == null) {
        errors = errors + "Please Enter valid total dueamount...! \n";
    }

    return errors;
}


//GRN form submit event function 
const buttonSupplierPaymentSubmit = () => {
    console.log('Add supplier Payment', supplierPayment);

    //check form error for required element
    let errors = checkFormError();
    if (errors == "") {
        //no errors get user confirmation
        let userConfirm = window.confirm("Are you sure to add following Supplier Payment Details...?" +
            "\n Supplier name : " + supplierPayment.supplier_id.suppliername +
            "\n paid amount : " + supplierPayment.paidamount +
            "\n balance amount : " + supplierPayment.balanceamount
        );
        if (userConfirm) {
            // call post service
            let postResponce = getHTTPServiceRequest("/supplierPayment/insert", "POST", supplierPayment);
            if (postResponce == "OK") {
                window.alert("Save successfully ");
                refreshSupplierPaymentTable();
                refreshSupplierPaymentForm();
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
const buttonSupplierPaymentDelete = () => {
    refreshSupplierPaymentTable();
}


const refreshSupplierPaymentForm = () => {
    supplierPayment = new Object();
    // main object ekata (gRN) list ekak (gRNHasItemList) add karala thamai inner form eka dewal addd kala gaththaa
    supplierPayment.supplierpaymentHasGrnList = new Array();

    formSupplierPayment.reset();

    //validation colors iwath kirima main form sadaha
    setDefault([selectSupplier, textTotalDueAmount, textPaidItemAmount, textBalanceAmount, textPaymentmethod, textChequeNo, textChequeDate, textTransferId, textNote, selectSupplierPaymentStatus]);

    // dynamic element refill kala yuthuya
    let suppliers = getServiceRequest('supplier/alldata');
    fillDataIntoSelect(selectSupplier, "Please Select Supplier..!!", suppliers, "suppliername");

    let supplierPaymentStatues = getServiceRequest('/supplierPaymentStatus/alldata');
    fillDataIntoSelect(selectSupplierPaymentStatus, "Please Select Status..!!", supplierPaymentStatues, "name");

    // status eka form eka load wana wita select wi thibimata
    // selected value eka string walin ena nisa stringify kara gani
    selectSupplierPaymentStatus.value = JSON.stringify(supplierPaymentStatues[0]);
    // ema value eka newatha object ekata set kala yuththa object format ekeni
    supplierPayment.suplierpaymentstatus_id = JSON.parse(selectSupplierPaymentStatus.value);
    // status field eka sadaha validation colour eka laba deema
    prevElementSupplierPaymentStatus = selectSupplierPaymentStatus.previousElementSibling;
    selectSupplierPaymentStatus.style.borderBottom = "4px solid green";
    prevElementSupplierPaymentStatus.style.backgroundColor = "green";
    selectSupplierPaymentStatus.classList.remove("is-invalid");
    selectSupplierPaymentStatus.classList.add("is-valid");

    // inner form eka refresh karawima
    refreshSupplierPaymentInnerForm();

    btnSupplierPaymentUpdate.classList.add("d-none");
    btnSupplierPaymentSubmit.classList.remove("d-none");
}

// define function for refresh inner form
const refreshSupplierPaymentInnerForm = () => {

    // association eke class name ekata samanawa simple walin start kara gani
    supplierpaymentHasGrn = new Object();


    // mehi form eka reset kala wita main form ekath reset wana nisa esa kala noheka
    // formPurchaseOrder.reset();
    // ema nisa element tika clean kirima sidu karai
    // selectItem dynamic nisa clean nokarai
    // dynamic element refill kala yuthuya
    let items = getServiceRequest('/item/alldata');
    // code ekai name ekai dekama drop down ekak thula penwa ganima
    fillDataIntoSelectTwo(selectItem, "Please Select Item..!!", items, "itemcode", "itemname");

    textPreviousDueAmount.value = "";
    textPaidAmount.value = "";
    textAfterDueAmount.value = "";

    // colors wenas kala heka
    setDefault([selectItem, textPreviousDueAmount, textPaidAmount, textAfterDueAmount]);

    btnSupplierPaymentItemUpdate.classList.add("d-none");
    btnSupplierPaymentItemSubmit.classList.remove("d-none");

    // Reresh inner table
    // array eka awashya netha main object ekata array eka gani
    // let purchaseOrders = [];

    let propertyList = [
        { propertyName: genareateItemName, dataType: "function" },
        { propertyName: "previousdueamount", dataType: "decimal" },
        { propertyName: "paidamount", dataType: "decimal" },
        { propertyName: "afterdueamount", dataType: "decimal" }

    ];

    //call filldataintotable function (talebodyId, datalist, column list, editefunctionname, deletefunctionname, printfunctionname, buttonvisibility) 
    fillDataIntoInnerTable(tableInnerBody, supplierPayment.supplierpaymentHasGrnList, propertyList, supplierPaymentItemFormRefill, supplierPaymentItemDelete, "#offcanvasBottom");

    $('#tableInner').DataTable();

    // "grnHasItemList" mehi data thibunoth line price genarate kara gatha heka

    // let totalAmount = 0.00;
    // for (const supplierPaymentItem of supplierPayment.supplierpaymentHasGrnList) {
    //     totalAmount = parseFloat(totalAmount) + parseFloat(supplierPaymentItem.lineprice);

    // }

    // grn wala athi total amount eka 
    // ui eke athi total amount field ekata value eka set kirima
    // total amount eka 0.00 nowe nam value eka ui ekata set karai
    // if (totalAmount != 0.00) {
    //     textTotalAmount.value = totalAmount.toFixed(2);
    //     // object ekata set karai
    //     supplierPayment.totalamount = textTotalAmount.value;
    //     // validation color eka set karai
    //     prevElementTotalAmount = textTotalAmount.previousElementSibling;
    //     textTotalAmount.style.borderBottom = "4px solid green";
    //     prevElementTotalAmount.style.backgroundColor = "green";
    //     textTotalAmount.classList.remove("is-invalid");
    //     textTotalAmount.classList.add("is-valid");
    // }

}

const genareateItemName = (dataob) => {
    // itemcode + " - " + itemname
    return dataob.grn_id.itemname;
}

const supplierPaymentItemFormRefill = (ob, index) => { }
const supplierPaymentItemDelete = (ob, index) => {
    console.log("Delete Supplier Payment Item", supplierpaymentHasGrn);
    let userConfirm = window.confirm("Are you sure to remove following item in Supplier Payment...?"
        // +
        // "\n Item : " + purchaseOrderHasItem.item_id.itemname +
        // "\n Unit Price : " + purchaseOrderHasItem.uniteprice +
        // "\n Quantity : " + purchaseOrderHasItem.quentity +
        // "\n Line Price : " + purchaseOrderHasItem.lineprice
    );
    if (userConfirm) {
        window.alert("Item removed successfully from Supplier Payment...!");
        // inner ob eka exsistent soyanawa "purchaseOrder.purchaseOrderHasItemList" mema object eken
        let extIndex = supplierPayment.supplierpaymentHasGrnList.map(paymentitem => paymentitem.grn_id.id).indexOf(ob.grn_id.id);
        if (extIndex != -1) {
            supplierPayment.supplierpaymentHasGrnList.splice(extIndex, 1);
        }
        refreshSupplierPaymentInnerForm();
    }
}

const buttonGRNItemUpdate = (ob, index) => { }
const buttonSupplierPaymentItemSubmit = (ob, index) => {
    console.log("Supplier Payment Item", supplierpaymentHasGrn);

    let userConfirm = window.confirm("Are you sure to add following item to Supplier Payment...?"
        +
        "\n Item : " + supplierpaymentHasGrn.grn_id.itemname +
        "\n After Due Amount : " + supplierpaymentHasGrn.afterdueamount +
        "\n Paid Amount : " + supplierpaymentHasGrn.paidamount +
        "\n Previous Due Amount : " + supplierpaymentHasGrn.previousdueamount
    );
    if (userConfirm) {
        window.alert("Item added successfully...!");
        // main form eke thiyena list ekata ob eka push karai
        // ema nisa table ekehida data atha.
        supplierPayment.supplierpaymentHasGrnList.push(supplierpaymentHasGrn);
        refreshSupplierPaymentInnerForm();
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
//         option.innerText = dataOb.supplier_id.suppliername;
//         parentId.appendChild(option);
//         // }
//     });
// };

// // supplier select kala pasu ema supplierta adala total amount eka auto fill wima sadaha
// // supplier element eka catch kara ganima
// let selectSupplierElement = document.getElementById("selectSupplier");
// // supplier element eka change una pasu
// selectSupplierElement.addEventListener("change", () => {
// // supplier element eka value eka json parse kara ganima(supplier value eka string format thibena nisa) dan supplier object ekak lebai
// let supplier = JSON.parse(selectSupplierElement.value);
// });




