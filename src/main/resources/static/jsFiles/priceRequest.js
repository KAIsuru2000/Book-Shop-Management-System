//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function for refresh table
    refreshPriceRequestTable();

    //Call refresh form function
    refreshPriceRequestForm(); 

});

//create function for refresh table
const refreshPriceRequestTable = () => {

    //controller wala hadapu service eka magin data array eka laba ganima
    const priceRequests = getServiceRequest("/priceRequest/alldata");

    //create display property list
    //data types
    //string => string / data / number
    //function => object / array / boolean
    displayPropertyList = [
        //function name ekak add karai call kirimak sidu nowe

        { dataType: 'string', propertyName: 'requestno' },
        { dataType: 'function', propertyName: getItem },
        { dataType: 'string', propertyName: 'requireddate' },
        { dataType: 'function', propertyName: getPriceRequestStatus }
    ];

    // call tablefill function
    fillDataIntoTable(tablePriceRequestBody, priceRequests, displayPropertyList, rowFormRefill, priceRequestRowDelete, priceRequestRowPrint, "#offcanvasBottom");

    //call jquerry data table
    $('#tablePriceRequest').dataTable();
}

const getItem = (dataob) => {
    //ewani awasthawaka wenama veriable ekak hada gani. initially(muladi) string
    let items = "";
    // role list ekak ena nisa
    dataob.items.forEach((item, index) => {
        if (dataob.items.length - 1 == index) {
            //last item eken pasu "," ekak set nokarai
            items = items + item.itemname;
        } else {
            //items veriable ekata concatinate kara ganimata item object eke name access karala
            //name athara gap ekak thaba gani
            items = items + item.itemname + " , ";
        }

    });
    //awasanaye items object eka return karanawa
    return items;
}

// table ekehi status eka penwimata 
const getPriceRequestStatus = (dataob) => {
    if (dataob.pricelistrequeststatus_id.name == "Active") {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;"></i>'
    } 
    // if (dataob.pricelistrequeststatus_id.name == "pending") {
    //     return '<i class="fa-solid fa-circle-xmark fa-beat fa-xl" style="color:rgb(254, 174, 1);"></i>'
    // }
    if (dataob.pricelistrequeststatus_id.name == "In-Active") {
        return '<i class="fa-solid fa-trash-can fa-beat fa-xl" style="color: #fa0000;"></i>'
    }

}

// inner form button function area start
const addSelectedItems=() => {
    // mehidee selected ekak thibunoth pamanak add wimata sakas karai neththan click kala pasu erros ei >> eya welakwimata if yoda liyai
    if (selectAllItems.value != "") {
       // selected element eka veriable ekakata dama ganima
    let selectedItem =JSON.parse(selectAllItems.value);
    // ema element eka anith list ekata push kirima
    priceRequest.items.push(selectedItem);
    // ema dropdown eka load kirima
    fillDataIntoSelect(selectSelectedItems, "", priceRequest.items, "itemname");
    // ema element eka thibu list eken iwath kirima
    // e sadaha allItem let nowiya yuthuya
    // map eka sadaha allitem.map walin eka item object ekak gena eya ema item eke id eka selected item id ekata samana wiya yuthuya >> elesa samana nam exit wenawa >> exit unoth allItem list eken splice karanna ona selected element eka
    let extIndex = allItem.map(item=>item.id).indexOf(selectedItem.id);
    // extIndex eka asamanai -1 nam allready exit wei
    if (extIndex != -1) {
        // extIndex,1 >> selected element eka idan eka element ekak makanna ona ewita selected eka ayath wei
       allItem.splice(extIndex,1) 
    }
    fillDataIntoSelect(selectAllItems, "", allItem, "itemname");
    }else{
       // error message eka show karanawa
       window.alert("Please select an item to add!");

    }
}
const addAllItems=() => {
    // selected side eke list ekata all side eke siyalla add wiya yuthuya
    // for of ekak dama all side eke list eka read kala yuthuya
    for (const item of allItem) {
        priceRequest.items.push(item);
    }
    fillDataIntoSelect(selectSelectedItems, "", priceRequest.items, "itemname");

    // all side eka empty wiya yuthuya>>all side eke siyallama selected paththata yai
    allItem = [];
    fillDataIntoSelect(selectAllItems, "", allItem, "itemname");
}

const removeSelectedItems=() => {
    // mehidee selected ekak thibunoth pamanak remove wimata sakas karai neththan click kala pasu erros ei >> eya welakwimata if yoda liyai
    if (selectSelectedItems.value != "") {
        // selected side eken aragena all side ekata add karanawa
    // selected side eken remove kirima
    let selectedItem =JSON.parse(selectSelectedItems.value);
    allItem.push(selectedItem);
    fillDataIntoSelect(selectAllItems, "", allItem, "itemname");

    let extIndex = priceRequest.items.map(item=>item.id).indexOf(selectedItem.id);
    if (extIndex != -1) {
        priceRequest.items.splice(extIndex,1) 
    }
    fillDataIntoSelect(selectSelectedItems, "", priceRequest.items, "itemname");
    }else{
       // error message eka show karanawa
       window.alert("Please select an item to remove!");

    }
}

const removeAllItems=() => {
    // selected side list eka one by one read karala all paththata push kirima
    for (const item of priceRequest.items) {
        allItem.push(item);
    }
    fillDataIntoSelect(selectAllItems, "", allItem, "itemname");
    // selected side eka empty wima
    priceRequest.items = [];
    fillDataIntoSelect(selectSelectedItems, "", priceRequest.items, "itemname");
}
// inner form button function area end

const rowFormRefill = (dataob, rowIndex) => {

    console.log("Edit record", dataob, rowIndex);

    suppliers = getServiceRequest("/supplier/alldata");

    fillDataIntoSelect(selectSupplier, 'Select Supplier...!!!', suppliers, 'suppliername');

    // dataob object eka use karala form fields refill karanna
    selectSupplier.value = JSON.stringify(dataob.supplier_id);
    dateRequireDate.value = dataob.requireddate;
    selectPriceRequestStatus.value = JSON.stringify(dataob.pricelistrequeststatus_id);
    textNote.value = dataob.note;
    

    // all side ekata me priceRequest ekata apply karan nethi items tika ganima 
    allItem = getServiceRequest('/items/getListWithoutRequest/' + dataob.id);
    fillDataIntoSelect(selectAllItems, "", allItem, "itemname");

    // inner form eka selected paththa fill kara ganima
    fillDataIntoSelect(selectSelectedItems, "", dataob.items, "itemname");

    // inner form eka magin add wana data list eka (entity file ekehi many to many wala Set<Brand> brands) length eka 0 da balai
    if (dataob.items && dataob.items.length > 0) {
        priceRequest.items = dataob.items;
    }

    //update kirima sadaha awashya object 2 sada ganima
    priceRequest = JSON.parse(JSON.stringify(dataob));
    oldPriceRequest = JSON.parse(JSON.stringify(dataob));

    console.log("priceRequest", priceRequest);
    console.log("oldPriceRequest", oldPriceRequest);

    //disable submit button
     submitButton.style.visibility = "hidden";
     updateButton.style.visibility = "visible";
}


const priceRequestRowDelete = (dataob, rowIndex) => {
    console.log("Delete", dataob, rowIndex);

    // activeTableRow(tableEmployeeBody, index, "red");


    let userConfirm = window.confirm("Are you sure to delete following Price Request...?" +
        "\n Supplier name : " + dataob.supplier_id.suppliername +
        "\n Required date : " + dataob.requireddate +
        "\n Status : " + dataob.pricelistrequeststatus_id.name
    );
    if (userConfirm) {
        // call post service
        //anthima parameter eka sadaha employeeDelete function eken pass wana name eka yodai
        let deleteResponce = getHTTPServiceRequest("/priceRequest/delete", "DELETE", dataob);

        if (deleteResponce == "OK") {
            window.alert("Delete successfully ");
            refreshPriceRequestTable();
            refreshPriceRequestForm();

        } else {
            window.alert("Delete not successfully" + deleteResponce);

        }




    }
}
    
const priceRequestRowPrint = (dataob, rowIndex) => {}

const refreshPriceRequestForm = () => {

    priceRequest = new Object();
    // selected data tika item list ekakata yodai
    priceRequest.items = new Array();

    formPriceRequest.reset();

    //validation colors iwath kirima
    setDefault([selectSupplier,dateRequireDate,selectPriceRequestStatus,textNote]);

    suppliers = getServiceRequest("/supplier/alldata");

    fillDataIntoSelect(selectSupplier, 'Select Supplier...!!!', suppliers, 'suppliername');

    // dynamic element refill kala yuthuya
    allItem = getServiceRequest('/item/alldata')
    let priceRequestStatuses = getServiceRequest('/priceRequestStatus/alldata')

    fillDataIntoSelect(selectAllItems, "", allItem, "itemname");
    fillDataIntoSelect(selectSelectedItems, "", priceRequest.items, "itemname");
    fillDataIntoSelect(selectPriceRequestStatus, "Please select status...!", priceRequestStatuses, "name");

    // supplier status eka auto active wee thibimata
    selectPriceRequestStatus.value = JSON.stringify(priceRequestStatuses[0]);
    priceRequest.pricelistrequeststatus_id = priceRequestStatuses[0];
    // validation colour eka laba deema
    prevElementStatus = selectPriceRequestStatus.previousElementSibling;
    selectPriceRequestStatus.style.borderBottom = "4px solid green";
    prevElementStatus.style.backgroundColor = "green";
    selectPriceRequestStatus.classList.remove("is-invalid");
    selectPriceRequestStatus.classList.add("is-valid");
}

//form eke ek ek property check kara values naththan msg ekak return kara ganima sdaha
const checkPriceRequestFormErrors = () =>{
    let errors = "";

    if (priceRequest.supplier_id == null) {
        errors = errors + "Please Enter valid Supplier...! \n";
    }

    if (priceRequest.requireddate == null) {
        errors = errors + "Please Enter valid Required Date...! \n";
    }
    // inner form eka magin add wana data list eka (entity file ekehi many to many wala Set<Item> "items") length eka 0 da balai
    if (priceRequest.items.length == 0) {
        errors = errors + "Please Enter valid Item...! \n";
    }
    return errors;
}

    //PriceRequest form submit event function 
const buttonPriceRequestSubmit = () => {
    console.log('Add Price Request', priceRequest);

    //check form error for required element
    let errors = checkPriceRequestFormErrors();
    if (errors == "") {
        //no errors get user confirmation
        let userConfirm = window.confirm("Are you sure to add following supplier...?" +
            "\n Required date : " + priceRequest.requireddate 
        );
        if (userConfirm) {
            // call post service
            let postResponce = getHTTPServiceRequest("/priceRequest/insert", "POST", priceRequest);
            if (postResponce == "OK") {
                window.alert("Save successfully ");
                refreshPriceRequestTable();
                refreshPriceRequestForm();
                $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas
            } else {
                window.alert("Failed to submit \n" + errors + postResponce);
            }
        }
    } else {
        window.alert("Something went wrong...\n" + errors);
    }
}

//define function for check item updates
const checkPriceRequestFormUpdate = () => {

    let updates = "";

    //mulinma veriable eka thibeda balima >> item and olditem >> compair kirima sadaha value thibiya yuthuya
    if (priceRequest != null && oldPriceRequest != null) {
        if (priceRequest.note != oldPriceRequest.note) {
            updates = updates + "Note is change...! \n";
        }
        if (priceRequest.requireddate != oldPriceRequest.requireddate) {
            updates = updates + "Required Date is change...! \n";
        }
        if (priceRequest.supplier_id.suppliername != oldPriceRequest.supplier_id.suppliername) {
            updates = updates + "Supplier Name is change...! \n";
        }

        if (priceRequest.pricelistrequeststatus_id.name != oldPriceRequest.pricelistrequeststatus_id.name) {
            updates = updates + "Price List Request Status is change...! \n";
        }

        // update karapu items balanawa kalin tibba items ekka
        if (priceRequest.items.length !== oldPriceRequest.items.length) {
            updates = updates + "Selected items are change...! \n";
        } else {
            let extItemCount = 0;
            for (let element of priceRequest.items) {

                oldPriceRequest.items.forEach(item => {
                    if (element.id == item.id) {
                        extItemCount = extItemCount + 1;
                    }
                });

            }
            if (extItemCount != priceRequest.items.length) {
                updates = updates + "Selected items are change...! \n";
            }
        }

    }
    return updates;

}

//define function for update item
const buttonPriceRequestUpdate = () => {

    console.log("priceRequest", priceRequest);
    console.log("oldPriceRequest", oldPriceRequest);

    //need to check form error
    let errors = checkPriceRequestFormErrors();

    //get user confurmation
    if (errors == "") {

        let updates = checkPriceRequestFormUpdate();
        if (updates != "") {
            let userConfirm = window.confirm("Are you sure to update following price request changes \n"
                + updates

            );

            //call post service
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/priceRequest/update", "PUT", priceRequest);
                if (putResponce == "OK") {
                    window.alert("priceRequest updated Successfully...!");
                    refreshPriceRequestTable();
                    refreshPriceRequestForm();
                    $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas

                } else {
                    window.alert("Fail to update has following error\n" + putResponce);
                }
            }
        } else {
            window.alert("Nothing to updated \n" + errors);
        }




    } else {
        window.alert("Form has following error \n" + errors);
    }

}

