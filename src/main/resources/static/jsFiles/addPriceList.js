//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    refreshAddPriceListTable();

    refreshAddPriceListForm();

})

//refresh table Area 
const refreshAddPriceListTable = () => {

    let addPriceLists = getServiceRequest("/addPriceList/alldata");

    let propertyList = [
        { propertyName: "addpricelistno", dataType: "string" },
        { propertyName: generateSupplierName, dataType: "function" },
        { propertyName: "itemlist", dataType: "string" },
        { propertyName: getAddPriceListStatus, dataType: "function" }
    ];

    //call filldataintotable function (talebodyId, datalist, column list, editefunctionname, deletefunctionname, printfunctionname, buttonvisibility) 
    fillDataIntoTable(tableAddPriceListBody, addPriceLists, propertyList, addPriceListFormRefill, addPriceListDelete, addPriceListView, "#offcanvasBottom");


    $('#tableAddPriceList').DataTable();


}

const generateSupplierName = (dataob) => {
    return dataob.pricelistrequest_id.supplier_id.suppliername;
}
const getAddPriceListStatus = (dataob) => {
    if (dataob.addpriceliststatus_id.name == "Active") {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;"></i>'
    }



    if (dataob.addpriceliststatus_id.name == "In-Active") {
        return '<i class="fa-solid fa-trash-can fa-beat fa-xl" style="color: #fe1616;"></i>'
    }
}

// const generateItemList = (dataob) => {
//     //ewani awasthawaka wenama veriable ekak hada gani. initially(muladi) string
//     let itemList = "";
//     // role list ekak ena nisa
//     dataob.itemlist.forEach((item, index) => {
//         if (dataob.itemlist.length - 1 == index) {
//             //last item eken pasu "," ekak set nokarai
//             itemList = itemList + item.item_id.itemname;
//         } else {
//             //itemList veriable ekata concatinate kara ganimata item object eke name access karala
//             //name athara gap ekak thaba gani
//             itemList = itemList + item.item_id.itemname + " , ";
//         }
//
//     });
//     //awasanaye roles object eka return karanawa
//     return itemlist;
// }
//function for re fill price list form
const addPriceListFormRefill = (ob, index) => {
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

//function for delete add price list form
const addPriceListDelete = (ob, index) => {
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

//function for view / print add price list form
const addPriceListView = (ob, index) => {
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

    if (addPriceList.pricelistrequest_id == null) {
        errors = errors + "Please Enter valid Supplier Name...! \n";
    }

    if (addPriceList.itemlist == null) {
        errors = errors + "Please Enter valid Items...! \n";
    }

    if (addPriceList.addpriceliststatus_id == null) {
        errors = errors + "Please Enter valid Add Price List status...! \n";
    }

    if (addPriceList.addPriceListHasItemList.length == 0) {
        errors = errors + "Please Enter valid Add Price List Items...! \n";
    }

    return errors;
}


//Add Price List form submit event function 
const buttonAddPriceListSubmit = () => {
    console.log('Add Price List', addPriceList);

    //check form error for required element
    let errors = checkFormError();
    if (errors == "") {
        //no errors get user confirmation
        let userConfirm = window.confirm("Are you sure to add following Add Price List...?" +
            "\n Supplier name : " + addPriceList.pricelistrequest_id.supplier_id.suppliername +
            "\n Item List : " + addPriceList.itemlist +
            "\n Add Price List status : " + addPriceList.addpriceliststatus_id.name
        );
        if (userConfirm) {
            // call post service
            let postResponce = getHTTPServiceRequest("/addPriceList/insert", "POST", addPriceList);
            if (postResponce == "OK") {
                window.alert("Save successfully ");
                refreshAddPriceListTable();
                refreshAddPriceListForm();
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
const buttonAddPriceListDelete = () => {
    refreshAddPriceListTable();
}


const refreshAddPriceListForm = () => {
    addPriceList = new Object();
    // main object ekata (addPriceList) list ekak (addPriceListHasItemList) add karala thamai inner form eka dewal addd kala gaththaa
    addPriceList.addPriceListHasItemList = new Array();

    // main form eka reset karai
    formAddPriceList.reset();

    //validation colors iwath kirima main form sadaha
    setDefault([selectSupplier, textItemList, selectaddPriceListStatus, textNote]);

    // dynamic element refill kala yuthuya
    let suppliers = getServiceRequest('priceRequest/alldata');
    fillDataIntoSelectSupplier(selectSupplier, "Please Select Supplier..!!", suppliers);

    let addPriceListStatues = getServiceRequest('/addPriceListStatus/alldata');
    fillDataIntoSelect(selectaddPriceListStatus, "Please Select Status..!!", addPriceListStatues, "name");

    // status eka form eka load wana wita select wi thibimata
    // selected value eka string walin ena nisa stringify kara gani
    selectaddPriceListStatus.value = JSON.stringify(addPriceListStatues[0]);
    // ema value eka newatha object ekata set kala yuththa object format ekeni
    addPriceList.addpriceliststatus_id = JSON.parse(selectaddPriceListStatus.value);
    // status field eka sadaha validation colour eka laba deema
    prevElementAddPriceListStatus = selectaddPriceListStatus.previousElementSibling;
    selectaddPriceListStatus.style.borderBottom = "4px solid green";
    prevElementAddPriceListStatus.style.backgroundColor = "green";
    selectaddPriceListStatus.classList.remove("is-invalid");
    selectaddPriceListStatus.classList.add("is-valid");

    // inner form eka refresh karawima
    refreshAddPriceListInnerForm();

    btnaddPriceListUpdate.classList.add("d-none");
    btnaddPriceListSubmit.classList.remove("d-none");
}

// define function for refresh inner form
const refreshAddPriceListInnerForm = () => {

    // association eke class name ekata samanawa simple walin start kara gani
    addPricelistHasItem = new Object();


    // mehi form eka reset kala wita main form ekath reset wana nisa esa kala noheka
    // formPurchaseOrder.reset();
    // ema nisa element tika clean kirima sidu karai
    // selectItem dynamic nisa clean nokarai
    // dynamic element refill kala yuthuya
    let items = getServiceRequest('/item/alldata');
    // code ekai name ekai dekama drop down ekak thula penwa ganima
    fillDataIntoSelectTwo(selectItem, "Please Select Item..!!", items, "itemcode", "itemname");

    textUnitPrice.value = "";
    numberMinQuantity.value = "";
    numberLastUnitePrice.value = "";
    numberMarketPrice.value = "";

    // colors wenas kala heka
    setDefault([selectItem, textUnitPrice, numberMinQuantity, numberLastUnitePrice, numberMarketPrice]);

    btnaddPriceListItemUpdate.classList.add("d-none");
    btnaddPriceListItemSubmit.classList.remove("d-none");

    // Refresh inner table
    // array eka awashya netha main object ekata array eka gani
    // let addPriceLists = [];
    let propertyList = [
        { propertyName: genareateItemName, dataType: "function" },
        { propertyName: "unitprice", dataType: "decimal" },
        { propertyName: "mincountity", dataType: "string" },
        { propertyName: "lastunitprice", dataType: "decimal" },
        { propertyName: "marketprice", dataType: "decimal" }

    ];

    //call filldataintotable function (talebodyId, datalist, column list, editefunctionname, deletefunctionname, printfunctionname, buttonvisibility) 
    fillDataIntoInnerTable(tableInnerBody, addPriceList.addPriceListHasItemList, propertyList, addPriceListItemFormRefill, addPriceListItemDelete, "#offcanvasBottom");

    $('#tablePurchaseOrder').DataTable();

    // "addPricelistHasItem" mehi data thibunoth item list genarate kara gatha heka
    //ewani awasthawaka wenama veriable ekak hada gani. initially(muladi) string
    let itemList = "";
    // item list ekak ena nisa
    addPriceList.addPriceListHasItemList.forEach((item, index) => {
        if (addPriceList.addPriceListHasItemList.length - 1 == index) {
            //last item eken pasu "," ekak set nokarai
            itemList = itemList + item.item_id.itemname;
        } else {
            //itemList veriable ekata concatinate kara ganimata item object eke name access karala
            //name athara gap ekak thaba gani
            itemList = itemList + item.item_id.itemname + " , ";
        }

    });
    document.getElementById("textItemList").textContent = itemList;

    if (itemList != "") {
    // object ekata set karai
        addPriceList.itemlist = textItemList.value;
        // validation color eka set karai
        prevElementItemList = textItemList.previousElementSibling;
        textItemList.style.borderBottom = "4px solid green";
        prevElementItemList.style.backgroundColor = "green";
        textItemList.classList.remove("is-invalid");
        textItemList.classList.add("is-valid");
    }

    
}

const genareateItemName = (dataob) => {
    // itemcode + " - " + itemname
    return dataob.item_id.itemname;
}

const addPriceListItemFormRefill = (ob, index) => { }
const addPriceListItemDelete = (ob, index) => {
    console.log("Delete Add Price List Item", addPricelistHasItem);
    let userConfirm = window.confirm("Are you sure to remove following item details...?"
        // +
        // "\n Item : " + purchaseOrderHasItem.item_id.itemname +
        // "\n Unit Price : " + purchaseOrderHasItem.uniteprice +
        // "\n Quantity : " + purchaseOrderHasItem.quentity +
        // "\n Line Price : " + purchaseOrderHasItem.lineprice
    );
    if (userConfirm) {
        window.alert("Item removed successfully from add price list...!");
        // inner ob eka exsistent soyanawa "addPriceList.addPriceListHasItemList" mema object eken
        let extIndex = addPriceList.addPriceListHasItemList.map(addPriceListitem => addPriceListitem.item_id.id).indexOf(ob.item_id.id);
        if (extIndex != -1) {
            addPriceList.addPriceListHasItemList.splice(extIndex, 1);
        }
        refreshAddPriceListInnerForm();
    }
}

const buttonAddPriceListItemUpdate = (ob, index) => { }
const buttonAddPriceListItemSubmit = (ob, index) => {
    console.log("Add Price List Item", addPricelistHasItem);

    let userConfirm = window.confirm("Are you sure to add following item to add price list...?"
        +
        "\n Item : " + addPricelistHasItem.item_id.itemname +
        "\n Unit Price : " + addPricelistHasItem.unitprice +
        "\n Minquantity : " + addPricelistHasItem.mincountity +
        "\n Last Unit Price : " + addPricelistHasItem.lastunitprice +
        "\n Market Price : " + addPricelistHasItem.marketprice
    );
    if (userConfirm) {
        window.alert("Item added successfully to add price list...!");
        // main form eke thiyena list ekata ob eka push karai
        // ema nisa table ekehida data atha.
        addPriceList.addPriceListHasItemList.push(addPricelistHasItem);
        refreshAddPriceListInnerForm();
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
            option.innerText = dataOb.supplier_id.suppliername;
            parentId.appendChild(option);
        // }
    });
};







