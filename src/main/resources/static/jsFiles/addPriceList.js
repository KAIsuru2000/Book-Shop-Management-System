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
    if (dataob.pricelistrequest_id && dataob.pricelistrequest_id.supplier_id) {
        return dataob.pricelistrequest_id.supplier_id.suppliername;
    }
    return "-";
}
const getAddPriceListStatus = (dataob) => {
    if (dataob.addpriceliststatus_id != null) {
        if (dataob.addpriceliststatus_id.name == "Pending") {
            return '<i class="fa-solid fa-spinner fa-spin-pulse fa-xl" style="color: #fcac5c;" data-bs-toggle="tooltip"\n' +
                '                                                title="Pending"></i>'
        }
        if (dataob.addpriceliststatus_id.name == "Completed") {
            return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;" data-bs-toggle="tooltip"\n' +
                '                                                title="Completed"></i>'
        }
        if (dataob.addpriceliststatus_id.name == "Deleted") {
            return '<i class="fa-solid fa-trash-can fa-beat fa-xl" style="color: #fe1616;" data-bs-toggle="tooltip"\n' +
                '                                                title="Deleted"></i>'
        }
        if (dataob.addpriceliststatus_id.name == "Partially Ordered") {
            return '<i class="fa-solid fa-spinner fa-spin-pulse fa-xl" style="color: #f4eb01;" data-bs-toggle="tooltip"\n' +
                '                                                title="Partially Ordered"></i>'
        }
        return dataob.addpriceliststatus_id.name;
    } else {
        return "-";
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
// Edit button eka click kalama form eka refill wena function eka
const addPriceListFormRefill = (ob, index) => {
    // console ekata edit karana object eka ha index eka print karanawa
    console.log("Edit", ob, index);

    // active suppliers details server eken request karala gannawa
    let suppliers = getServiceRequest('priceRequest/alldata');
    // selectSupplier dropdown element ekata active suppliers fill karanawa
    fillDataIntoSelectSupplier(selectSupplier, "Select Supplier related to price list request..!!", suppliers);

    // selected price list request eka dropdown options athare thiyeda kiyala check karanna variable ekak false karanawa
    let optionExists = false;
    // selectSupplier eke thiyena option loop karanawa
    for (let option of selectSupplier.options) {
        // option eka empty string ekak newe nam
        if (option.value !== "") {
            // value eka parse karala object ekak gannawa
            let optOb = JSON.parse(option.value);
            // object id eka click karapu price list request id ekata samanada balanawa
            if (optOb.id === ob.pricelistrequest_id.id) {
                // samanai nam optionExists true karala dropdown value eka set karanawa
                optionExists = true;
                selectSupplier.value = option.value;
                break;
            }
        }
    }
    // option eka select eke nathnam (status eka completed wage wela filter out unoth)
    if (!optionExists) {
        // aluth option element ekak dynamic create karanawa
        let option = document.createElement("option");
        // option value ekata request object eka stringify karala set karanawa
        option.value = JSON.stringify(ob.pricelistrequest_id);
        // brands details thiyenawanam details ekathu karanna default empty string hadagannawa
        let brands = "";
        // select karapu supplier ta brands thiyeda kiyala check karanawa
        if (ob.pricelistrequest_id.supplier_id && ob.pricelistrequest_id.supplier_id.brands && ob.pricelistrequest_id.supplier_id.brands.length > 0) {
            // brand names lists eka collect karaganna array ekak hadagannawa
            let brandNames = [];
            // brands set eka loop karala brand name eka lists ekata append karanawa
            ob.pricelistrequest_id.supplier_id.brands.forEach(brand => {
                brandNames.push(brand.name);
            });
            // format karala display display string eka hadagannawa
            brands = " - (" + brandNames.join(" , ") + ")";
        }
        // dropdown options eke user ta penwana text name structure eka hadagannawa
        option.innerText = ob.pricelistrequest_id.requestno + " - " + ob.pricelistrequest_id.supplier_id.suppliername + brands;
        // dropdown list select element ekata dynamic option eka append karanawa
        selectSupplier.appendChild(option);
        // select value ekata new option select value eka assign karanawa
        selectSupplier.value = option.value;
    }

    // itemlist text area form value field refill karanawa
    textItemList.value = ob.itemlist;
    // select status dropdown input field eka stringify values walin fill refill karanawa
    selectaddPriceListStatus.value = JSON.stringify(ob.addpriceliststatus_id);

    // valid details check colors green karanna elements elements collection array ekak hadagannawa
    let elementsToGreen = [selectSupplier, textItemList, selectaddPriceListStatus];
    // okkoma elements set eka loop karala border green valid class eka apply karanawa
    elementsToGreen.forEach(element => {
        // element eke bottom border green color karanawa
        element.style.borderBottom = "4px solid green";
        // laginma thiyena label structure block background green color karanawa
        element.previousElementSibling.style.backgroundColor = "green";
        // invalid red border class eka ain karanawa
        element.classList.remove("is-invalid");
        // valid green border class eka add karanawa
        element.classList.add("is-valid");
    });

    // copy main object addPriceList value details parse duplicate clone dynamic
    addPriceList = JSON.parse(JSON.stringify(ob));
    // copy main object oldAddPriceList update comparison check verification details
    oldAddPriceList = JSON.parse(JSON.stringify(ob));

    // update details button visible class remove karanawa
    btnaddPriceListUpdate.classList.remove("d-none");
    // submit details add button display hide class add karanawa
    btnaddPriceListSubmit.classList.add("d-none");

    // offcanvas component modal bootstrap open form show methods
    $("#offcanvasBottom").offcanvas("show");

    // inner form input areas clear refresh inner table elements call
    refreshAddPriceListInnerForm();
}

// Price List record soft delete karana function eka
const addPriceListDelete = (ob, index) => {
    // console logs record check
    console.log("Delete", ob, index);

    // price list delete confirm window check popup sweetalert open karanawa
    Swal.fire({
        title: "Confirm Delete",
        html: `Are you sure to delete the following Price List?<br><br>` +
              `<strong>Price List No:</strong> ${ob.addpricelistno}<br>` +
              `<strong>Supplier:</strong> ${ob.pricelistrequest_id && ob.pricelistrequest_id.supplier_id ? ob.pricelistrequest_id.supplier_id.suppliername : "N/A"}`,
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
        // user confirm verification checks yes kala nam
        if (result.isConfirmed) {
            // delete service request request object details pass delete endpoints call
            let deleteResponse = getHTTPServiceRequest("/addPriceList/delete", "DELETE", ob);

            // server delete request success OK returned check
            if (deleteResponse === "OK") {
                // delete successful modal display check sweetalerts
                Swal.fire({
                    title: "Deleted!",
                    text: "Price List deleted successfully.",
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
                // table dynamic load refresh call
                refreshAddPriceListTable();
                // main form default resets clears reload
                refreshAddPriceListForm();
            } else {
                // delete failed error alert sweetalert dialog displays
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete: " + deleteResponse,
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
//Add Price List form submit event function 
const buttonAddPriceListSubmit = () => {
    // console trace check object values
    console.log('Add Price List', addPriceList);

    // form required fields validation results check call
    let errors = checkFormError();
    // errors kisith neththan
    if (errors == "") {
        // price list submission confirm dialogue box sweetalert open karagannawa
        Swal.fire({
            title: "Confirm Submission",
            html: `Are you sure to add the following Price List?<br><br>` +
                  `<strong>Supplier Name:</strong> ${addPriceList.pricelistrequest_id.supplier_id.suppliername}<br>` +
                  `<strong>Item List:</strong> ${addPriceList.itemlist}<br>` +
                  `<strong>Status:</strong> ${addPriceList.addpriceliststatus_id.name}`,
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
                let postResponce = getHTTPServiceRequest("/addPriceList/insert", "POST", addPriceList);
                // success check responses ok returned check
                if (postResponce == "OK") {
                    // success status informational dialogue sweetalert popup open
                    Swal.fire({
                        title: "Saved!",
                        text: "Price list saved successfully.",
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
                    // table elements reload
                    refreshAddPriceListTable();
                    // form fields data resets clears defaults
                    refreshAddPriceListForm();
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
        // required fields validation errors warning sweetalerts modal display check
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

// update kala properties details verification check check function eka
const checkFormUpdate = () => {
    // updates updates warning collection empty string set
    let updates = "";

    // addPriceList object ha oldAddPriceList null check validation
    if (addPriceList != null && oldAddPriceList != null) {
        // pricelistrequest id values compare dynamic details
        if (addPriceList.pricelistrequest_id.id != oldAddPriceList.pricelistrequest_id.id) {
            // changes collection string append
            updates += "Price List Request No changed from " + oldAddPriceList.pricelistrequest_id.requestno + " to " + addPriceList.pricelistrequest_id.requestno + "\n";
        }

        // status values compare dynamic check
        if (addPriceList.addpriceliststatus_id.id != oldAddPriceList.addpriceliststatus_id.id) {
            // changes status message append
            updates += "Status changed to " + addPriceList.addpriceliststatus_id.name + "\n";
        }

        // inner table has item list list values compare match checks
        if (JSON.stringify(addPriceList.addPriceListHasItemList) !== JSON.stringify(oldAddPriceList.addPriceListHasItemList)) {
            // items contents status modification append message
            updates += "Price List items have changed!\n";
        }
    }

    // result differences updates log collection output return
    return updates;
}

// main form update details button event trigger action function eka
// main form update details button event trigger action function eka
const buttonaddPriceListUpdate = () => {
    // required fields format validations errors list check call
    let errors = checkFormError();
    // errors kisith neththan
    if (errors === "") {
        // updates change status checks comparison call
        let updates = checkFormUpdate();
        // updates string empty nam change kisith natha warning status
        if (updates === "") {
            // no updates warn dialog box sweetalert open check
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
            // modifications user updates confirmation confirm alert sweetalert popup open
            Swal.fire({
                title: "Confirm Update",
                html: "Are you sure to update this Add Price List with following changes?<br><br>" + updates.replace(/\n/g, "<br>"),
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
                // updates actions yes checks
                if (result.isConfirmed) {
                    // PUT service update endpoint query api request send
                    let putResponse = getHTTPServiceRequest("/addPriceList/update", "PUT", addPriceList);
                    // response status checks checks OK response
                    if (putResponse === "OK") {
                        // success status alerts open sweetalerts check
                        Swal.fire({
                            title: "Updated!",
                            text: "Price list updated successfully.",
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
                        // table data list refresh call
                        refreshAddPriceListTable();
                        // form configurations layout reload clean calls
                        refreshAddPriceListForm();
                        // offcanvas layout close hide bootstrap components
                        $("#offcanvasBottom").offcanvas("hide");
                    } else {
                        // update failed error sweetalerts displays checks
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
        // required parameters check error validation modals displays
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

// form delete event function 
const buttonAddPriceListDelete = () => {
    refreshAddPriceListTable();
}


const refreshAddPriceListForm = () => {
    addPriceList = new Object();
    // main object ekata (addPriceList) list ekak (addPriceListHasItemList) add karala thamai inner form eka dewal addd kala gaththaa
    addPriceList.addPriceListHasItemList = new Array();

    // parana object eka comparison walata null karala initialize karanawa
    oldAddPriceList = null;

    // main form eka reset karai
    formAddPriceList.reset();

    //validation colors iwath kirima main form sadaha
    setDefault([selectSupplier, textItemList, selectaddPriceListStatus]);

    // dynamic element refill kala yuthuya
    let suppliers = getServiceRequest('priceRequest/alldata');
    fillDataIntoSelectSupplier(selectSupplier, "Select Supplier related to price list request..!!", suppliers);

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

// Supplier (Price List Request Number) select karama eata adala items drop down ekata filter karaganna function eka
const filterItemByPriceRequest = () => {
    // addPriceList eke pricelistrequest_id eka null newe nam pamanak meya siduwiya yuthuy
    if (addPriceList.pricelistrequest_id != null) {
        // select karapu price list request eke thiyena siyaluma items array ekata gannawa
        let priceRequestItems = addPriceList.pricelistrequest_id.items;

        // Server eken okkoma save karapu price list data gannawa
        let allAddPriceLists = getServiceRequest("/addPriceList/alldata");

        // Danata select karapu request no ekata adala, kalin save karapu items wala id collect karaganna array ekak
        let savedItemIds = [];
        // Siyaluma saved price lists loop karala adala items collect karagannawa
        allAddPriceLists.forEach(savedAPL => {
            // Price list eke status eka Deleted newe nam saha, danata select karala thiyena request id ekatama adala nam
            if ((!savedAPL.addpriceliststatus_id || savedAPL.addpriceliststatus_id.name !== "Deleted") && 
                savedAPL.pricelistrequest_id && savedAPL.pricelistrequest_id.id === addPriceList.pricelistrequest_id.id) {
                // Kalin save karapu price list eke has items list eka thiyeda balala, thiyenam ewaye item id gannawa
                if (savedAPL.addPriceListHasItemList) {
                    // Items loop karala id gannawa
                    savedAPL.addPriceListHasItemList.forEach(aplhi => {
                        // Item object eka valid nam id eka push karanawa
                        if (aplhi.item_id) {
                            // savedItemIds array ekata id eka push karanawa
                            savedItemIds.push(aplhi.item_id.id);
                        }
                    });
                }
            }
        });

        // Inner table ekata eka parak add karapu items dropdown eken ain karanna filter karagannawa
        let availableItems = priceRequestItems.filter(item => {
            // inner table eke (addPriceListHasItemList) danata add karala thiyena item ekaka id eka mema item id ekata samanada balanawa
            let isAddedInForm = addPriceList.addPriceListHasItemList.some(addedItem => addedItem.item_id.id === item.id);
            // Kalin database ekata save karapu (main table eke adala request id eke thiyena) item ekakda balanawa
            let isAlreadySaved = savedItemIds.includes(item.id);
            // Form eke add wela nathi, wagema database eke kalin save wela nathi items pamanak thora gannawa
            return !isAddedInForm && !isAlreadySaved;
        });

        // Aluthin filter karala gaththa availableItems list eka 'selectItem' dropdown ekata fill karanawa
        fillDataIntoSelectTwo(selectItem, "Please Select Item..!!", availableItems, "itemcode", "itemname");
    } else {
        // supplier select karala nethnam empty array ekak list eka widihata pass karala dropdown eka clean karanawa
        let items = [];
        // empty items list eka selectItem dropdown ekata fill karanawa
        fillDataIntoSelectTwo(selectItem, "Please Select Item..!!", items, "itemcode", "itemname");
    }
}

// Unit Price, Min Qu. Unit Price, saha Market Price validate karana function eka
const validateItemPrices = () => {
    // Input fields wala thiyena values gannawa
    const unitPriceValue = textUnitPrice.value;
    const minQuUnitPriceValue = numberMinQuUnitePrice.value;
    const marketPriceValue = numberMarketPrice.value;

    // String values numbers walata convert karagannawa (naththan null gannawa)
    const unitPrice = unitPriceValue !== "" ? parseFloat(unitPriceValue) : null;
    const minQuUnitPrice = minQuUnitPriceValue !== "" ? parseFloat(minQuUnitPriceValue) : null;
    const marketPrice = marketPriceValue !== "" ? parseFloat(marketPriceValue) : null;

    // Element eka valid (green color) karala object ekata value eka danna helper function eka
    const setValid = (element, property, value) => {
        const prevElement = element.previousElementSibling;
        element.style.borderBottom = "4px solid green";
        if (prevElement) prevElement.style.backgroundColor = "green";
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");
        addPricelistHasItem[property] = value;
    };

    // Element eka invalid (red color) karala object property eka null karanna helper function eka
    const setInvalid = (element, property) => {
        const prevElement = element.previousElementSibling;
        element.style.borderBottom = "4px solid red";
        if (prevElement) prevElement.style.backgroundColor = "red";
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        addPricelistHasItem[property] = null;
    };

    // Optional field ekak empty wela thiyeddi normal control style ekata reset karana helper function eka
    const setEmpty = (element, property) => {
        const prevElement = element.previousElementSibling;
        element.style.borderBottom = "1px solid #ced4da";
        if (prevElement) prevElement.style.backgroundColor = "black";
        element.classList.remove("is-invalid");
        element.classList.remove("is-valid");
        addPricelistHasItem[property] = null;
    };

    // 1. Unit Price field eka validate kirima (Kalinma value ekak thiyenna ona, minus wenna ba)
    let isUnitPriceValid = false;
    if (unitPriceValue === "" || isNaN(unitPrice) || unitPrice < 0) {
        setInvalid(textUnitPrice, 'unitprice'); // Valid naththan red color karanawa
    } else {
        setValid(textUnitPrice, 'unitprice', unitPriceValue); // Valid nam green color karanawa
        isUnitPriceValid = true; // Unit price eka valid kiyala mark karagannawa
    }

    // 2. Validate Min Qu. Unit Price (Meya optional, habai dammoth Unit Price ekata wada adu ho saman wenna ona)
    let isMinQuUnitPriceValid = false;
    if (minQuUnitPriceValue === "") {
        setEmpty(numberMinQuUnitePrice, 'minquunitprice'); // Empty nam normal style eka denawa
        isMinQuUnitPriceValid = true; // Empty nisa valid kiyala mark karanawa
    } else if (isNaN(minQuUnitPrice) || minQuUnitPrice < 0) {
        setInvalid(numberMinQuUnitePrice, 'minquunitprice'); // Negative ho number nowena nam invalid
    } else if (isUnitPriceValid && minQuUnitPrice >= unitPrice) {
        setInvalid(numberMinQuUnitePrice, 'minquunitprice'); // Unit Price ekata wada wadi nam invalid (Mehi wadi wuna wita invalid kireema siduwei)
    } else {
        setValid(numberMinQuUnitePrice, 'minquunitprice', minQuUnitPriceValue); // Ethuru kisima prashnayak nathnam valid (green)
        isMinQuUnitPriceValid = true;
    }

    // 3. Market Price field eka validate kirima (Kalinma thiyenna ona, saha Unit Price, Min Qu. Unit Price dekata wada adu wenna ba)
    if (marketPriceValue === "" || isNaN(marketPrice) || marketPrice < 0) {
        setInvalid(numberMarketPrice, 'marketprice'); // Empty ho negative nam invalid
    } else {
        let isMarketPriceValid = true;
        
        // Unit Price valid nam, Market Price eka Unit Price ekata wada adu wenna ba
        if (isUnitPriceValid && marketPrice <= unitPrice) {
            isMarketPriceValid = false; // Unit price ekata wada adu nam invalid karanawa
        }
        // Min Qu. Unit Price ekak daala thiyenawanam, Market Price eka Min Qu. Unit price ekatath wada adu wenna ba
        if (minQuUnitPriceValue !== "" && isMinQuUnitPriceValid && marketPrice < minQuUnitPrice) {
            isMarketPriceValid = false; // Min Qu. Unit price ekata wada adu nam invalid karanawa
        }

        if (isMarketPriceValid) {
            setValid(numberMarketPrice, 'marketprice', marketPriceValue); // Valid nam green color karanawa
        } else {
            setInvalid(numberMarketPrice, 'marketprice'); // Invalid nam red color karanawa
        }
    }
};

// Inner form eke errors thiyeda balana function eka
const checkInnerFormError = () => {
    let errors = "";

    // Item eka select karala neththan error message ekak set karanawa
    if (addPricelistHasItem.item_id == null) {
        errors = errors + "Please select a valid Item...! \n";
    }

    // Unit Price eka invalid nam ho naththan error message ekak set karanawa
    if (addPricelistHasItem.unitprice == null) {
        errors = errors + "Please enter a valid Unit Price...! \n";
    }

    // User input ekak daala thiyeddi Min Qu. Unit Price invalid wela nam, error message ekak set karanawa
    if (numberMinQuUnitePrice.value !== "" && addPricelistHasItem.minquunitprice == null) {
        errors = errors + "Min Qu. Unit Price must be less than or equal to Unit Price...! \n";
    }

    // Market price invalid wela nam (meaning adu wela nam) error message ekak set karanawa
    if (addPricelistHasItem.marketprice == null) {
        errors = errors + "Please enter a valid Market Price (must be greater than or equal to Unit Price and Min Qu. Unit Price)...! \n";
    }

    return errors; // Hadagaththa error message tika return karanawa
};

// define function for refresh inner form
const refreshAddPriceListInnerForm = () => {

    // association eke class name ekata samanawa simple walin start kara gani
    addPricelistHasItem = new Object();


    // mehi form eka reset kala wita main form ekath reset wana nisa esa kala noheka
    // formPurchaseOrder.reset();
    // ema nisa element tika clean kirima sidu karai
    // selectItem dynamic nisa clean nokarai
    // default washayen selectItem eka clear kara thabai ho supplier select kara ethnam eata adala item load kirimata function eka keda wai
    filterItemByPriceRequest();

    textUnitPrice.value = "";
    numberMinQuantity.value = "";
    numberMinQuUnitePrice.value = "";
    numberMarketPrice.value = "";

    // colors wenas kala heka
    setDefault([selectItem, textUnitPrice, numberMinQuantity, numberMinQuUnitePrice, numberMarketPrice]);

    btnaddPriceListItemUpdate.classList.add("d-none");
    btnaddPriceListItemSubmit.classList.remove("d-none");

    // Refresh inner table
    // array eka awashya netha main object ekata array eka gani
    // let addPriceLists = [];
    let propertyList = [
        { propertyName: genareateItemName, dataType: "function" },
        { propertyName: "unitprice", dataType: "decimal" },
        { propertyName: generateMinQuantity, dataType: "function" },
        { propertyName: generateMinQuUnitPrice, dataType: "function" },
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

// Inner table eke min quantity eka nathnam dash (-) ekak return karana function eka
const generateMinQuantity = (dataob) => {
    // dataob eke mincountity property eka null ho empty da kiyala pariksha karanawa
    if (dataob.mincountity != null && dataob.mincountity !== "") {
        // mincountity value eka thiyenam, eya return karanawa
        return dataob.mincountity;
    } else {
        // mincountity value eka nethnam, dash (-) eka return karanawa
        return "-";
    }
}

// Inner table eke min qu. unit price eka nathnam dash (-) ekak return karana function eka
const generateMinQuUnitPrice = (dataob) => {
    // dataob eke minquunitprice property eka null ho empty da kiyala pariksha karanawa
    if (dataob.minquunitprice != null && dataob.minquunitprice !== "") {
        // minquunitprice value eka thiyenam, eka floating number ekak karala decimal sthana 2kata return karanawa
        return parseFloat(dataob.minquunitprice).toFixed(2);
    } else {
        // minquunitprice value eka nethnam, dash (-) eka return karanawa
        return "-";
    }
}

const addPriceListItemFormRefill = (ob, index) => { }
const addPriceListItemDelete = (ob, index) => {
    // console log write
    console.log("Delete Add Price List Item", addPricelistHasItem);

    // item delete confirmation popup box sweetalert open checks
    Swal.fire({
        title: "Confirm Remove",
        text: "Are you sure to remove following item details...?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-trash"></i> Remove',
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
        // confirm checks yes kala nam
        if (result.isConfirmed) {
            // success status updates sweetalert dialogues displays
            Swal.fire({
                title: "Removed!",
                text: "Item removed successfully from add price list.",
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
            // inner ob eka exsistent soyanawa "addPriceList.addPriceListHasItemList" mema object eken
            let extIndex = addPriceList.addPriceListHasItemList.map(addPriceListitem => addPriceListitem.item_id.id).indexOf(ob.item_id.id);
            if (extIndex != -1) {
                addPriceList.addPriceListHasItemList.splice(extIndex, 1);
            }
            // refresh inner forms
            refreshAddPriceListInnerForm();
        }
    });
}

const buttonAddPriceListItemUpdate = (ob, index) => { }
// Inner form eken item detail eka list ekata submit karana function eka
const buttonAddPriceListItemSubmit = (ob, index) => {
    // console trace parameter check logs
    console.log("Add Price List Item", addPricelistHasItem);

    // Inner form eke errors thiyeda kiyala check karagannawa
    let errors = checkInnerFormError();
    // validation error lists checks
    if (errors !== "") {
        // validation alert sweetalert dialog open checks
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
        return;
    }

    // User confirmation eka gannawa sweetalerts popup modes check
    Swal.fire({
        title: "Confirm Add Item",
        html: `Are you sure to add the following item to the price list?<br><br>` +
              `<strong>Item:</strong> ${addPricelistHasItem.item_id.itemname}<br>` +
              `<strong>Unit Price:</strong> Rs. ${addPricelistHasItem.unitprice}<br>` +
              `<strong>Market Price:</strong> Rs. ${addPricelistHasItem.marketprice}`,
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
        // item addition confirm checks yes
        if (result.isConfirmed) {
            // success informational popups alerts open checks
            Swal.fire({
                title: "Added!",
                text: "Item added successfully to price list.",
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
            // Main object eke has list ekata addPricelistHasItem object eka push karanawa
            addPriceList.addPriceListHasItemList.push(addPricelistHasItem);
            // Inner form eka clean karala refresh karanawa
            refreshAddPriceListInnerForm();
        }
    });
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
        // Only include suppliers with Pending or Partially Added price list requests
        if (dataOb.pricelistrequeststatus_id && (dataOb.pricelistrequeststatus_id.name === "Pending" || dataOb.pricelistrequeststatus_id.name === "Partially Added")) {
            const option = document.createElement("option");
            option.value = JSON.stringify(dataOb); // or dataOb.id if needed
            
            let brands = "";
            if (dataOb.supplier_id && dataOb.supplier_id.brands && dataOb.supplier_id.brands.length > 0) {
                let brandNames = [];
                dataOb.supplier_id.brands.forEach(brand => {
                    brandNames.push(brand.name);
                });
                brands = " - (" + brandNames.join(" , ") + ")";
            }

            option.innerText = dataOb.requestno + " - " + dataOb.supplier_id.suppliername + brands;
            parentId.appendChild(option);
        }
    });
};


// add price list clear button eka magin inner form eka clear wimta
const buttonaddPriceListClear = () => {
    refreshAddPriceListInnerForm();
}

// add price list clear button eka magin full form eka clear wimta
const buttonaddPriceListFullFormClear = () => {
    refreshAddPriceListInnerForm();
    refreshAddPriceListForm();
}




