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
    fillDataIntoTable(tableSupplierBody, suppliers, displayPropertyList, rowFormRefill, rowDelete, rowPrint, "#offcanvasBottom");

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
const addSelectedBrand=() => {
    // mehidee selected ekak thibunoth pamanak add wimata sakas karai neththan click kala pasu erros ei >> eya welakwimata if yoda liyai
    if (selectAllBrand.value != "") {
       // selected element eka veriable ekakata dama ganima
    let selectedBrand =JSON.parse(selectAllBrand.value);
    // ema element eka anith list ekata push kirima
    supplier.brands.push(selectedBrand);
    // ema dropdown eka load kirima
    fillDataIntoSelect(selectSelectedBrand, "", supplier.brands, "name");
    // ema element eka thibu list eken iwath kirima
    // e sadaha allBrand let nowiya yuthuya
    // map eka sadaha allitem.map walin eka item object ekak gena eya ema item eke id eka selected item id ekata samana wiya yuthuya >> elesa samana nam exit wenawa >> exit unoth allBrand list eken splice karanna ona selected element eka
    let extIndex = allBrand.map(item=>item.id).indexOf(selectedBrand.id);
    // extIndex eka asamanai -1 nam allready exit wei
    if (extIndex != -1) {
        // extIndex,1 >> selected element eka idan eka element ekak makanna ona ewita selected eka ayath wei
       allBrand.splice(extIndex,1) 
    }
    fillDataIntoSelect(selectAllBrand, "", allBrand, "name");
    }else{
       // error message eka show karanawa
       window.alert("Please select a brand to add!");

    }
}
const addAllBrand=() => {
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

const removeSelectedBrand=() => {
    // mehidee selected ekak thibunoth pamanak remove wimata sakas karai neththan click kala pasu erros ei >> eya welakwimata if yoda liyai
    if (selectSelectedBrand.value != "") {
        // selected side eken aragena all side ekata add karanawa
    // selected side eken remove kirima
    let selectedBrand =JSON.parse(selectSelectedBrand.value);
    allBrand.push(selectedBrand);
    fillDataIntoSelect(selectAllBrand, "", allBrand, "name");
    
    let extIndex = supplier.brands.map(item=>item.id).indexOf(selectedBrand.id);
    if (extIndex != -1) {
        supplier.brands.splice(extIndex,1) 
    }
    fillDataIntoSelect(selectSelectedBrand, "", supplier.brands, "name");
    }else{
       // error message eka show karanawa
       window.alert("Please select a brand to remove!");
       
    }
}

const removeAllBrand=() => {
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

const rowFormRefill = (dataob, rowIndex) => {}

const rowDelete = (dataob, rowIndex) => {}
    
const rowPrint = (dataob, rowIndex) => {}

const refreshSupplierForm = () => {

    supplier = new Object();
    // selected data tika supplier list ekakata yodai
    supplier.brands = new Array();

    formSupplier.reset();

    //validation colors iwath kirima
    setDefault([textSupplierName , telContactNo , inputEmail , selectSupplierStatus]);

    // dynamic element refill kala yuthuya
    allBrand = getServiceRequest('/brand/alldata')
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
// const checkSupplierFormErrors = () =>{
//     let errors = "";

//     if (employee.fullname == null) {
//         errors = errors + "Please Enter valid Full Name...! \n";
//     }

//     if (employee.callingname == null) {
//         errors = errors + "Please Enter valid calling name...! \n";
//     }
//     if (employee.nic == null) {
//         errors = errors + "Please Enter valid nic...! \n";
//     }
//     return errors;
// }
