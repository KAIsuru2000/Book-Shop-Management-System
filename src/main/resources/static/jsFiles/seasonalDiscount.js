// browser eka load weddi auto call wena code eka

// window eka load wi gena eddi () athule thiyana function eka call we
window.addEventListener('load', () => {

    // tooltips active kirima htm eke tooltips kiyala dila thiyena ewa active we
    $('[data-bs-toggle="tooltip"]').tooltip();

    //  log unata passe function eka call karaddi user privilege balala wada karana eka hadima
    // page eka refresh karaddi data thiyenawanm refresh wena widiya hadima 
    refreshSeasonalDiscountTable();

    //  page eka refresh karaddi form ekath clear wela refresh wenna one
    refreshSeasonalDiscountForm();
});

// Create refresh form function
const refreshSeasonalDiscountForm = () => {
    // blank object ekak hadima
    seasonalDiscount = new Object();

    // inner form sadaha item list eka blank object ekakata genima
    seasonalDiscount.items = new Array();

    // get old data (database eke athi offer types genima)
    offerTypes = getServiceRequest("/offertype/list");

    // offer type select kirimata
    fillDataIntoSelect(selectOfferType, "Select Offer Type", offerTypes, "name");

    // text fild rathu weela clear karamu 
    // select nowuna ewata clear wenna (bind wenne nathuwa)
    selectOfferType.style.border = '';
    textOfferName.style.border = '';
    dateStartDate.style.border = '';
    dateEndDate.style.border = '';
    // numMaxBillAmount.style.border = '';
    numberDiscountRate.style.border = '';

    // old data form ekata genwa ganimata
    textOfferName.value = '';
    dateStartDate.value = '';
    dateEndDate.value = '';
    // numMaxBillAmount.value = '';
    numberDiscountRate.value = '';

    // update button disabled kirima
    document.getElementById("updateButton").disabled = true;

    // add button enabled kirima
    document.getElementById("submitButton").disabled = false;

    refreshInnerFormAndTable();
}

// Inner form refresh function
const refreshInnerFormAndTable = () => {

    // get item list
    itemsWithoutDiscount = getServiceRequest("/item/alldata");
    // anith peththata giya items adu kirima id eken (filter function)
    let itemsArray = seasonalDiscount.items ? seasonalDiscount.items : [];
    const availableItems = itemsWithoutDiscount.filter(el => !itemsArray.map(b => b.id).includes(el.id));

    // all items set ekata pass kirima (element id, message, list eka, display property)
    fillDataIntoSelect(selectAllItem, "", availableItems, "itemname");

    // slect karapu items set ekata pass kirima
    let selItems = seasonalDiscount.items ? seasonalDiscount.items : [];
    fillDataIntoSelect(selectSelectedItem, "", selItems, "itemname");
}

const addSelectedItem = () => {
    // get select the category array eka gaththa  
    let selectIndex = selectAllItem.selectedIndex;
    if (selectIndex != -1) {
        // eka list eken anith ekata transfer kirima select karapu object eka gaththa thawa temp array ekakata 
        let selectItem = JSON.parse(selectAllItem.value);

        // transfer karamu new user object eke roles liyala ekn select karapu eka athulata damma
        seasonalDiscount.items.push(selectItem);

        refreshInnerFormAndTable();
    } else {
        alert("Please Select item In 'All item' list")
    }
}

const addAllItem = () => {
    if (selectAllItem.options.length == 0) {
        alert("There is no Item to add");
    } else {
        for (let index = 0; index < selectAllItem.options.length; index++) {
            let selectItem = JSON.parse(selectAllItem.options[index].value);
            seasonalDiscount.items.push(selectItem);
        }
        refreshInnerFormAndTable();
    }
}

const removeSelectedItem = () => {
    let selectedRemoveIndex = selectSelectedItem.selectedIndex;

    if (selectedRemoveIndex != -1) {

        seasonalDiscount.items.splice(selectedRemoveIndex, 1);
        refreshInnerFormAndTable();

    } else {
        alert("Please Select Item In 'Selected items' list")
    }

}

const removeAllItem = () => {
    if (selectSelectedItem.options.length == 0) {
        alert("There is no Item to remove");

    } else {
        seasonalDiscount.items.length = 0;
        refreshInnerFormAndTable();
    }
}

// table eka refresh kirimata function ekak sadima
const refreshSeasonalDiscountTable = () => {

    // palamu parameter eka wenne call wiya yuthu url eka. deweni eka methode eka wei body eka string walin yawai
    seasonalDiscounts = getServiceRequest("/seasonaldiscount/alldata");


    // display wenna ona column wala thiyana data properties tika array ekakata dala yewanawa
    // table eke thiyana title wala piliewalata meka deela thiyenna oni

    const displayProperty = [
        { dataType: 'string', propertyName: 'discountname' },
        { dataType: 'string', propertyName: 'validfrom' },
        { dataType: 'string', propertyName: 'validto' },
        { dataType: 'decimal', propertyName: 'discount' },
        { dataType: 'function', propertyName: getOfferType }
    ];

    // call the filldataintotable function
    // call the filldataintotable function - pass the tbody not the table to avoid wiping thead
    fillDataIntoTable(tableSeasonalDiscountBody, seasonalDiscounts, displayProperty, refilForm, deleteRow, printRow, "#offcanvasBottom");

    // table eke plugin eka call kirima - properly destroy old instance before recreating
    if ($.fn.DataTable.isDataTable('#tableSeasonalDiscount')) {
        $('#tableSeasonalDiscount').DataTable().destroy();
    }
    $('#tableSeasonalDiscount').dataTable();

}

// offer type func eka
const getOfferType = (ob) => {
    return ob.offertype_id.name;
}

// errors tika pennanna func ekak hadima
const checkErrors = () => {
    let errors = "";
    if (seasonalDiscount.discountname == null) {
        errors = errors + "Offer Name Can not be null \n";
        textOfferName.style.border = '2px solid red';
    }

    if (seasonalDiscount.validfrom == null) {
        errors = errors + "Start Date Can not be null \n";
        dateStartDate.style.border = '2px solid red';
    }

    if (seasonalDiscount.validto == null) {
        errors = errors + "End Date Can not be null \n";
        dateEndDate.style.border = '2px solid red';
    }

    if (seasonalDiscount.maximaldiscount == null) {
        errors = errors + "Max Discount Amount Can not be null \n";
        numMaxBillAmount.style.border = '2px solid red';
    }

    if (seasonalDiscount.discount == null) {
        errors = errors + "Discount Amount Can not be null \n";
        numberDiscountRate.style.border = '2px solid red';
    }

    if (seasonalDiscount.offertype_id == null) {
        errors = errors + "Offer Type Can not be null \n";
        selectOfferType.style.border = '2px solid red';
    }

    if (seasonalDiscount.items.length == 0) {
        errors = errors + "Please select at least one item \n";
    }

    return errors;
}

const buttonSeasonalDiscountSubmit = () => {

    let errors = checkErrors();

    if (errors == "") {

        // let supplierConfirm = confirm("Are you sure to save following Seasonal Discount details ? \n"
        //     + "\n Offer Name Is : " + seasonalDiscount.discountname
        //     + "\n Offer Type Is : " + seasonalDiscount.offertype_id.name);
        
        let confirmMsg = "Are you sure to save following Seasonal Discount details ? \n"
                        + "\n Offer Name Is : " + seasonalDiscount.discountname
                        + "\n Offer Type Is : " + seasonalDiscount.offertype_id.name;

        // sweetalert
        Swal.fire({
            title: "Confirm?",
            text: confirmMsg,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save it!"
          }).then((result) => {
            if (result.isConfirmed) {

                let serverResceveResponce = getHTTPServiceRequest("/seasonaldiscount/insert", "POST", seasonalDiscount);

                if (serverResceveResponce === "OK") {

                    Swal.fire({
                        title: "Done!",
                        text: "Save Successfully.",
                        icon: "success"
                      });

                    //  page eka close wenna 
                    $('#offcanvasBottom').offcanvas('hide');

                    //  page eka refresh karaddi form ekath clear wela refresh wenna one
                    refreshSeasonalDiscountForm();
                    refreshSeasonalDiscountTable();

                } else {

                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: serverResceveResponce,
                        footer: 'Contact Addmin'
                      });
            
                }
            }
          });


    } else {
        alert("form has following errors \n \n" + errors);
    }
}

// user object eka olduser ekata copy ekak da gami..update eke cmpare kirima sadaha
//  meka defalut danna ona function eliyen table eka run weema saahada mehi role thibe
let oldSeasonalDiscount;

// update refil form function
// table eke button ekata wada karana refil ekak liyala passe eka pass karanwa
const refilForm = (item, index) => {

    // table line eka click kalama offcamvas ekak open wima sadaha jQuery code ekk
    $('#offcanvasBottom').offcanvas('show');

    // row eka index eken print kirima
    console.log("refill table - > " + item.discountname);

    seasonalDiscount = JSON.parse(JSON.stringify(item));
    oldSeasonalDiscount = JSON.parse(JSON.stringify(item));

    textOfferName.value = seasonalDiscount.discountname;
    dateStartDate.value = seasonalDiscount.validfrom;
    dateEndDate.value = seasonalDiscount.validto;
    // numMaxBillAmount.value = seasonalDiscount.maximaldiscount;
    numberDiscountRate.value = seasonalDiscount.discount;

    fillDataIntoSelect(selectOfferType, "Select Offer Type", offerTypes, "name");

    if (seasonalDiscount.offertype_id) {
        let optElement = Array.from(selectOfferType.options).find(opt => opt.value.includes('"id":' + seasonalDiscount.offertype_id.id));
        if(optElement) {
            selectOfferType.value = optElement.value;
        }
    }


    // valid da kiyala pennanna 
    textOfferName.style.border = '2px solid green';
    dateStartDate.style.border = '2px solid green';
    dateEndDate.style.border = '2px solid green';
    // numMaxBillAmount.style.border = '2px solid green';
    numberDiscountRate.style.border = '2px solid green';
    selectOfferType.style.border = '2px solid green';

    refreshInnerFormAndTable();

    // update button enabled kirima
    document.getElementById("updateButton").disabled = false;

    // add button disabled kirima
    document.getElementById("submitButton").disabled = true;

}

const updateUpdates = () => {

    let updates = "";
    if (seasonalDiscount.discountname != oldSeasonalDiscount.discountname) {
        updates = updates + "Offer Name Is Changed" + "  " + oldSeasonalDiscount.discountname + " into " + seasonalDiscount.discountname + " \n";
    }

    if (seasonalDiscount.validfrom != oldSeasonalDiscount.validfrom) {
        updates = updates + "Start Date Is Changed" + oldSeasonalDiscount.validfrom + " into " + seasonalDiscount.validfrom + " \n";
    }

    if (seasonalDiscount.validto != oldSeasonalDiscount.validto) {
        updates = updates + "End Date Is Changed" + oldSeasonalDiscount.validto + " into " + seasonalDiscount.validto + " \n";
    }

    if (seasonalDiscount.maximaldiscount != oldSeasonalDiscount.maximaldiscount) {
        updates = updates + "Max Discount Amount Is Changed" + oldSeasonalDiscount.maximaldiscount + " into " + seasonalDiscount.maximaldiscount + " \n";
    }

    if (seasonalDiscount.discount != oldSeasonalDiscount.discount) {
        updates = updates + "Discount Rate Is Changed" + oldSeasonalDiscount.discount + " into " + seasonalDiscount.discount + " \n";
    }

    let oldOfferTypeName = oldSeasonalDiscount.offertype_id ? oldSeasonalDiscount.offertype_id.name : "";
    let newOfferTypeName = seasonalDiscount.offertype_id ? seasonalDiscount.offertype_id.name : "";
    if (newOfferTypeName != oldOfferTypeName) {
        updates = updates + "Offer Type Is Changed \n"
    }

    let oldItemsData = oldSeasonalDiscount.items ? oldSeasonalDiscount.items.map(i => i.id).sort().join(',') : "";
    let newItemsData = seasonalDiscount.items ? seasonalDiscount.items.map(i => i.id).sort().join(',') : "";
    if (oldItemsData != newItemsData) {
        updates = updates + "Items changed \n";
    }

    return updates;
}


// update form eka update kirimata code liyamu function
const buttonSeasonalDiscountUpdate = () => {
    let errors = checkErrors();
    if (errors == "") {
        let updates = updateUpdates();

        if (updates == "") {
            alert("No changes are detected..!")
        } else {
            // sweetalert eken gaththa 
            Swal.fire({
                title: "Are you sure update following Seasonal Discount Details ?",
                text: updates,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Update it!"
              }).then((result) => {
                if (result.isConfirmed) {
                     // /update apith update waladi denna ona parameter eka update
                    let serverResceveResponceForUpdate = getHTTPServiceRequest("/seasonaldiscount/update", "PUT", seasonalDiscount);
            
                    if (serverResceveResponceForUpdate === "OK") {

                        Swal.fire({
                            title: "Update!",
                            text: "Update Successfully.",
                            icon: "success"
                          });

                        // page eka close wemnata
                        $('#offcanvasBottom').offcanvas('hide');

                        refreshSeasonalDiscountTable();
                        refreshSeasonalDiscountForm();
            
                    } else {

                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Update failed \n " + serverResceveResponceForUpdate,
                            footer: 'Contact Addmin'
                          });
                    }
                }
              });            
        }

    } else {
        alert("form has following errors \n \n" + errors);
    }
}


// create deletRow function 
const deleteRow = (item, index) => {

    console.log("refilled item", item);

    let confirmMsg = "Are you sure you want to Delete following Seasonal Discount : \n \n" +
                        "Discount Name : " + item.discountname + " \n " + 
                        "Offer Type : " + item.offertype_id.name;
    
    // sweetalert
    Swal.fire({
        title: "Are you sure delete following Seasonal Discount Details ?",
        text: confirmMsg,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete it!"
      }).then((result) => {
        if (result.isConfirmed) {

            // server ekata kiyanawa dele kirimata 
            let serverResceveResponceForDelete = getHTTPServiceRequest("/seasonaldiscount/delete", "DELETE", item);

            // server responce eka harida balamu
            if (serverResceveResponceForDelete === "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: item.discountname + " Delete Successfully.",
                    icon: "success"
                  });

                refreshSeasonalDiscountTable();

            } else {

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: 'user Delete failed \n ' + serverResceveResponceForDelete,
                    footer: 'Contact Addmin'
                  });

            }
        }
      });
}

// print form eka print kirimata code liyamu function
// const buttonPrintRow = () => {
function buttonPrintRow() {
    let newWindow = window.open();
    // newWindow.document.write(tableUser.outerHTML); ( meya user table ekama print kirimata)

    newWindow.document.write(
        "<head>" +
        " <link rel='stylesheet' href='/bootstrap-5.2.3/css/bootstrap.min.css'>" +
        "</head>" +

        "<body>" + offcanvasBottomSeasonalDiscountView.outerHTML + "</body>"


    );

    setTimeout(
        function () {
            newWindow.print();
        }, 1000
    )


}

// create printRow function 
const printRow = (item, index) => {

    // table line eka click kalama offcamvas ekak open wima sadaha jQuery code ekk
    $('#offcanvasBottomSeasonalDiscountView').offcanvas('show');

    // row eka index eken print kirima
    console.log("print row - > " + item.discountname);

    discountNameView.innerHTML = item.discountname;
    startDateView.innerHTML = item.validfrom;
    endDateView.innerHTML = item.validto;
    maxDiscountView.innerHTML = item.maximaldiscount;
    discountAmountView.innerHTML = item.discount;
    offerTypeView.innerHTML = item.offertype_id.name;

    // join table valin wada karna widiya
    const itemList = item.items;

    // user role length check kirimata
    if (itemList.length > 0) {
        // null nm nathnm

        // variable ekak hadanna print view eka list eka hadagnn
        let arrayNames = "";

        // role list eke tina values ganna foreach 1k use karnwa arrayNames vble ekta
        itemList.forEach(ob => {
            arrayNames = arrayNames + ob.itemname + " , "
        });
        selectedItemsView.innerHTML = arrayNames;
    } else {
        selectedItemsView.innerHTML = "-";
    }

    addedDateView.innerHTML = "-";
}

// clear function 
const clearSeasonalDiscountForm = () => {
    refreshSeasonalDiscountForm();

}
