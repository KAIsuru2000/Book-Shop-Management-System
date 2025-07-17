//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function for refresh table
    refreshSupplierTable();

    //Call refresh form function
    refreshSupplierForm();

});

//create function for refresh table
const refreshSupplierTable = () => {

    //controller wala hadapu service eka magin data array eka laba ganima
    const suppliers = getServiceRequest("/supplier/alldata");

    //create display property list
    //data types
    //string => string / data / number
    //function => object / array / boolean
    displayPropertyList = [
        //function name ekak add karai call kirimak sidu nowe

        { dataType: 'string', propertyName: 'suppliername' },
        { dataType: 'string', propertyName: 'contactno' },
        { dataType: 'string', propertyName: 'email' },
        { dataType: 'function', propertyName: getBrand },
        { dataType: 'function', propertyName: getSupplierStatus }
    ];

    // call tablefill function
    fillDataIntoTable(tableSupplierBody, suppliers, displayPropertyList, rowFormRefill, supplierRowDelete, supplierRowPrint, "#offcanvasBottom");

    //call jquerry data table
    $('#tableCustomer').dataTable();
}

const getBrand = (dataob) => {
    //ewani awasthawaka wenama veriable ekak hada gani. initially(muladi) string
    let brands = "";
    // role list ekak ena nisa
    dataob.brands.forEach((brand, index) => {
        if (dataob.brands.length - 1 == index) {
            //last brand eken pasu "," ekak set nokarai
            brands = brands + brand.name;
        } else {
            //brands veriable ekata concatinate kara ganimata brand object eke name access karala
            //name athara gap ekak thaba gani
            brands = brands + brand.name + " , ";
        }

    });
    //awasanaye brands object eka return karanawa
    return brands;
}

// table ekehi status eka penwimata 
const getSupplierStatus = (dataob) => {
    if (dataob.supplierstatus_id.name == "Active") {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;"></i>'
    }
    if (dataob.supplierstatus_id.name == "In-Active") {
        return '<i class="fa-solid fa-circle-xmark fa-beat fa-xl" style="color:rgb(254, 174, 1);"></i>'
    }
    if (dataob.supplierstatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash-can fa-beat fa-xl" style="color: #fa0000;"></i>'
    }

}

// inner form button function area start
const addSelectedBrand = () => {
    // mehidee selected ekak thibunoth pamanak add wimata sakas karai neththan click kala pasu erros ei >> eya welakwimata if yoda liyai
    if (selectAllBrand.value != "") {
        // selected element eka veriable ekakata dama ganima
        let selectedBrand = JSON.parse(selectAllBrand.value);
        // ema element eka anith list ekata push kirima
        supplier.brands.push(selectedBrand);
        // ema dropdown eka load kirima
        fillDataIntoSelect(selectSelectedBrand, "", supplier.brands, "name");
        // ema element eka thibu list eken iwath kirima
        // e sadaha allBrand let nowiya yuthuya
        // map eka sadaha allitem.map walin eka item object ekak gena eya ema item eke id eka selected item id ekata samana wiya yuthuya >> elesa samana nam exit wenawa >> exit unoth allBrand list eken splice karanna ona selected element eka
        let extIndex = allBrand.map(brand => brand.id).indexOf(selectedBrand.id);
        // extIndex eka asamanai -1 nam allready exit wei
        if (extIndex != -1) {
            // extIndex,1 >> selected element eka idan eka element ekak makanna ona ewita selected eka ayath wei
            allBrand.splice(extIndex, 1)
        }
        fillDataIntoSelect(selectAllBrand, "", allBrand, "name");
    } else {
        // error message eka show karanawa
        window.alert("Please select a brand to add!");

    }
}
const addAllBrand = () => {
    // selected side eke list ekata all side eke siyalla add wiya yuthuya
    // for of ekak dama all side eke list eka read kala yuthuya
    for (const brand of allBrand) {
        supplier.brands.push(brand);
    }
    fillDataIntoSelect(selectSelectedBrand, "", supplier.brands, "name");

    // all side eka empty wiya yuthuya>>all side eke siyallama selected paththata yai
    allBrand = [];
    fillDataIntoSelect(selectAllBrand, "", allBrand, "name");
}

const removeSelectedBrand = () => {
    // mehidee selected ekak thibunoth pamanak remove wimata sakas karai neththan click kala pasu erros ei >> eya welakwimata if yoda liyai
    if (selectSelectedBrand.value != "") {
        // selected side eken aragena all side ekata add karanawa
        // selected side eken remove kirima
        let selectedBrand = JSON.parse(selectSelectedBrand.value);
        allBrand.push(selectedBrand);
        fillDataIntoSelect(selectAllBrand, "", allBrand, "name");

        let extIndex = supplier.brands.map(item => item.id).indexOf(selectedBrand.id);
        if (extIndex != -1) {
            supplier.brands.splice(extIndex, 1)
        }
        fillDataIntoSelect(selectSelectedBrand, "", supplier.brands, "name");
    } else {
        // error message eka show karanawa
        window.alert("Please select a brand to remove!");

    }
}

const removeAllBrand = () => {
    // selected side list eka one by one read karala all paththata push kirima
    for (const brand of supplier.brands) {
        allBrand.push(brand);
    }
    fillDataIntoSelect(selectAllBrand, "", allBrand, "name");
    // selected side eka empty wima
    supplier.brands = [];
    fillDataIntoSelect(selectSelectedBrand, "", supplier.brands, "name");
}
// inner form button function area end

const rowFormRefill = (dataob, rowIndex) => {

    console.log("Edit record", dataob, rowIndex);

    let supplierStatuses = getServiceRequest('/supplierStatus/alldata');
    fillDataIntoSelect(selectSupplierStatus, "Please select status...!", supplierStatuses, "name");

    // dataob object eka use karala form fields refill karanna
    textSupplierName.value = dataob.suppliername;
    charBRN.value = dataob.brn;
    textConPersonName.value = dataob.contact_person;
    telContactNo.value = dataob.contactno;
    inputEmail.value = dataob.email;
    textAddress.value = dataob.address;
    // selectAllBrand.value = supplier.brands;
    // selectSelectedBrand.value = supplier.brands;
    selectSupplierStatus.value = JSON.stringify(dataob.supplierstatus_id);

    textBankName.value = dataob.bankname;
    textBranchName.value = dataob.branchname;
    telAccountNo.value = dataob.accuntno;
    textHolderName.value = dataob.accuntholdername;

    // all side ekata me supplier supply karan nethi brand tika ganima 
    allBrand = getServiceRequest('/brand/getListWithoutSupply/' + dataob.id);
    fillDataIntoSelect(selectAllBrand, "", allBrand, "name");

    // inner form eka selected paththa fill kara ganima
    fillDataIntoSelect(selectSelectedBrand, "", dataob.brands, "name");

    // inner form eka magin add wana data list eka (entity file ekehi many to many wala Set<Brand> brands) length eka 0 da balai
    if (dataob.brands && dataob.brands.length > 0) {
        supplier.brands = dataob.brands;
    }

    //update kirima sadaha awashya object 2 sada ganima
    supplier = JSON.parse(JSON.stringify(dataob));
    oldSupplier = JSON.parse(JSON.stringify(dataob));

    console.log("supplier", supplier);
    console.log("oldSupplier", oldSupplier);

    //disable submit button
    submitButton.style.visibility = "hidden";
    updateButton.style.visibility = "visible";
}

const supplierRowDelete = (dataob, rowIndex) => {
    console.log("Delete", dataob, rowIndex);

    // activeTableRow(tableEmployeeBody, index, "red");


    let userConfirm = window.confirm("Are you sure to delete following supplier...?" +
        "\n Supplier name : " + dataob.suppliername +
        "\n Supplier email : " + dataob.email +
        "\n Supplier status : " + dataob.supplierstatus_id.name
    );
    if (userConfirm) {
        // call post service
        //anthima parameter eka sadaha employeeDelete function eken pass wana name eka yodai
        let deleteResponce = getHTTPServiceRequest("/supplier/delete", "DELETE", dataob);

        if (deleteResponce == "OK") {
            window.alert("Delete successfully ");
            refreshSupplierTable();
            refreshSupplierForm();

        } else {
            window.alert("Delete not successfully" + deleteResponce);

        }




    }
}
// table eka thula athi view button ekata click kalaama view modal eka open karanawa
const supplierRowPrint = (dataob, rowIndex) => {
    console.log("View", dataob, rowIndex);
    // html wala athi modal ekak open weema
    supplierNameView.innerText = dataob.suppliername;
    bRNView.innerText = dataob.brn;
    personNameView.innerText = dataob.contact_person;
    contactNoView.innerText = dataob.contactno;
    emailView.innerText = dataob.email;
    addressView.innerText = dataob.address;
    bankNameView.innerText = dataob.bankname;
    branchNameView.innerText = dataob.branchname;
    accountNoView.innerText = dataob.accountno;
    holderNameView.innerText = dataob.accuntholdername;

    //ewani awasthawaka wenama veriable ekak hada gani. initially(muladi) string
    let selectedBrands = "";
    // brand list ekak ena nisa
    dataob.brands.forEach((brand, index) => {
        if (dataob.brands.length - 1 == index) {
            //last brand eken pasu "," ekak set nokarai
            selectedBrands = selectedBrands + brand.name;
        } else {
            //brands veriable ekata concatinate kara ganimata brand object eke name access karala
            //name athara gap ekak thaba gani
            selectedBrands = selectedBrands + brand.name + " , ";
        }

    });
    document.getElementById("selectedBrandsView").textContent = selectedBrands;
    supplierStatusView.innerText = dataob.supplierstatus_id.name;
    if (dataob.note == undefined) {
        noteView.innerText = "-";
    } else {
        noteView.innerText = dataob.note;
    }

    $("#offcanvasBottomSupplierView").offcanvas("show"); // show the offcanvas
}

//print offcanvas model eka thula athi print button eka function eka
const buttonPrintRow = () => {

    //aluth window ekak open kara ganima
    let newWindow = window.open();
    //ema window ekata title ekak demima
    //title eke html code tika venama verible ekakata dama ganima
    // let printView = "<head><title>Bright Book Shop | Customer Details</title><link rel='icon' href='/image/title.png'><link rel='stylesheet' href='/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script><link rel='stylesheet' href='/fontawesome-free-6.4.2/css/all.css'><link rel='stylesheet' href='/Style/printView.css'></head>" + "<body>" + bodyView.outerHTML +
    //     "</body>";
    newWindow.document.write(`
            <html>
            <head>
                <title>Print View - Supplier Details</title>
                <!-- link bootstrp min css file -->
    <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">

    <!--link bootstrap js file  -->
    <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
    
                <!-- link css file -->
                    <link rel="stylesheet" href="/Style/printView.css">
            </head>
            <body>
                ${document.querySelector('.bodyPrintView').outerHTML}
            </body>
            </html>
        `);
    //open wana tab eka tika welawak open wee thibee print ekata open weema
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1500)//1.5 second walata pasuwa block eka run karawai ema pramadaya iilaga piyawarata yaamata pera printView anthargathaya complete wa display kirimata ida salasai
}

const refreshSupplierForm = () => {

    supplier = new Object();
    // selected data tika supplier list ekakata yodai
    supplier.brands = new Array();

    formSupplier.reset();

    //validation colors iwath kirima
    setDefault([textSupplierName, telContactNo, inputEmail, selectSupplierStatus]);

    // dynamic element refill kala yuthuya
    allBrand = getServiceRequest('/brand/alldata')
    // allBrandWithoutSupply = getServiceRequest('/brand/getListWithoutSupply/' + dataob.id);
    let supplierStatuses = getServiceRequest('/supplierStatus/alldata')

    fillDataIntoSelect(selectAllBrand, "", allBrand, "name");
    fillDataIntoSelect(selectSelectedBrand, "", supplier.brands, "name");
    fillDataIntoSelect(selectSupplierStatus, "Please select status...!", supplierStatuses, "name");

    // supplier status eka auto active wee thibimata
    selectSupplierStatus.value = JSON.stringify(supplierStatuses[0]);
    supplier.supplierstatus_id = supplierStatuses[0];
    // validation colour eka laba deema
    prevElementSupplierStatus = selectSupplierStatus.previousElementSibling;
    selectSupplierStatus.style.borderBottom = "4px solid green";
    prevElementSupplierStatus.style.backgroundColor = "green";
    selectSupplierStatus.classList.remove("is-invalid");
    selectSupplierStatus.classList.add("is-valid");
}

//form eke ek ek property check kara values naththan msg ekak return kara ganima sdaha
const checkSupplierFormErrors = () => {
    let errors = "";

    if (supplier.suppliername == null) {
        errors = errors + "Please Enter valid Full Name...! \n";
    }

    if (supplier.brn == null) {
        errors = errors + "Please Enter valid Business Registration number...! \n";
    }
    if (supplier.contact_person == null) {
        errors = errors + "Please Enter valid contact person name...! \n";
    }
    if (supplier.contactno == null) {
        errors = errors + "Please Enter valid contact number...! \n";
    }
    if (supplier.email == null) {
        errors = errors + "Please Enter valid Email...! \n";
    }
    if (supplier.address == null) {
        errors = errors + "Please Enter valid Address...! \n";
    }
    if (supplier.brands.length == 0) {
        errors = errors + "Please select brand...\n";
    }
    if (supplier.supplierstatus_id == null) {
        errors = errors + "Please Enter valid Supplier Status...! \n";
    }
    if (supplier.bankname == null) {
        errors = errors + "Please Enter valid Bank Name...! \n";
    }
    if (supplier.branchname == null) {
        errors = errors + "Please Enter valid Branch Name...! \n";
    }
    if (supplier.accuntno == null) {
        errors = errors + "Please Enter valid Account Number...! \n";
    }
    if (supplier.accuntholdername == null) {
        errors = errors + "Please Enter valid Account Holder Name...! \n";
    }

    // inner form eka magin add wana data list eka (entity file ekehi many to many wala Set<Brand> brands) length eka 0 da balai
    if (supplier.brands.length == 0) {
        errors = errors + "Please Enter valid Brand...! \n";
    }
    return errors;
}

//Supplier form submit event function 
const buttonSupplierSubmit = () => {
    console.log('Add Supplier', supplier);

    //check form error for required element
    let errors = checkSupplierFormErrors();
    if (errors == "") {
        //no errors get user confirmation
        let userConfirm = window.confirm("Are you sure to add following supplier...?" +
            "\n Supplier name : " + supplier.suppliername +
            "\n Supplier brn : " + supplier.brn +
            "\n Supplier contact person : " + supplier.contact_person +
            "\n Supplier contact number : " + supplier.contactno +
            "\n Supplier email : " + supplier.email +
            "\n Supplier address : " + supplier.address +
            "\n Supplier status : " + supplier.supplierstatus_id.name
        );
        if (userConfirm) {
            // call post service
            let postResponce = getHTTPServiceRequest("/supplier/insert", "POST", supplier);
            if (postResponce == "OK") {
                window.alert("Save successfully ");
                refreshSupplierTable();
                refreshSupplierForm();
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
const checkSupplierFormUpdate = () => {

    let updates = "";

    //mulinma veriable eka thibeda balima >> item and olditem >> compair kirima sadaha value thibiya yuthuya
    if (supplier != null && oldSupplier != null) {
        if (supplier.suppliername != oldSupplier.suppliername) {
            updates = updates + "supplier name is change...! \n";
        }
        if (supplier.brn != oldSupplier.brn) {
            updates = updates + "Business registration number is change...! \n";
        }
        if (supplier.contact_person != oldSupplier.contact_person) {
            updates = updates + "Contact person is change...! \n";
        }

        if (supplier.contactno != oldSupplier.contactno) {
            updates = updates + "Contact number is change...! \n";
        }
        if (supplier.email != oldSupplier.email) {
            updates = updates + "Email is change...! \n";
        }
        if (supplier.address != oldSupplier.address) {
            updates = updates + "Address is change...! \n";
        }

        // update karapu brands balanawa kalin tibba brands ekka
        if (supplier.brands.length !== oldSupplier.brands.length) {
            updates = updates + "Selected Brands are change...! \n";
        } else {
            let extItemCount = 0;
            for (let element of supplier.brands) {

                oldSupplier.brands.forEach(item => {
                    if (element.id == item.id) {
                        extItemCount = extItemCount + 1;
                    }
                });

            }
            if (extItemCount != supplier.brands.length) {
                updates = updates + "Selected Brands are change...! \n";
            }
        }


        if (supplier.supplierstatus_id.name != oldSupplier.supplierstatus_id.name) {
            updates = updates + "supplier status is changed  ....! \n";
        }

        if (supplier.bankname != oldSupplier.bankname) {
            updates = updates + "Bank name is change...! \n";
        }
        if (supplier.branchname != oldSupplier.branchname) {
            updates = updates + "branch name is change...! \n";
        }
        if (supplier.accuntno != oldSupplier.accuntno) {
            updates = updates + "Account number is change...! \n";
        }
        if (supplier.accuntholdername != oldSupplier.accuntholdername) {
            updates = updates + "Account holder name is change...! \n";
        }

        if (supplier.note != oldSupplier.note) {
            updates = updates + "note is change...! \n";
        }

    }
    return updates;

}


//define function for update item
const buttonSupplierUpdate = () => {

    console.log("supplier", supplier);
    console.log("oldSupplier", oldSupplier);

    //need to check form error
    let errors = checkSupplierFormErrors();

    //get user confurmation
    if (errors == "") {

        let updates = checkSupplierFormUpdate();
        if (updates != "") {
            let userConfirm = window.confirm("Are you sure to update following supplier changes \n"
                + updates

            );

            //call post service
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/supplier/update", "PUT", supplier);
                if (putResponce == "OK") {
                    window.alert("supplier updated Successfully...!");
                    refreshSupplierTable();
                    refreshSupplierForm();
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

const clearSupplierForm = () => {

    let userConfirm = window.confirm("Do you need to refresh form...?");
    if (userConfirm) {
        refreshSupplierForm();
    }
}

    
