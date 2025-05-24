//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function for refresh table
    refreshSupplierTable();

    //Call refresh form function
    refreshSupplierForm();

})

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

const addSelectedBrand=() => {}
const addAllBrand=() => {}
const removeSelectedBrand=() => {}
const removeAllBrand=() => {}

const rowFormRefill = (dataob, rowIndex) => {}

const rowDelete = (dataob, rowIndex) => {}
    
const rowPrint = (dataob, rowIndex) => {}

const refreshSupplierForm = () => {

    supplier = new Object();

    formSupplier.reset();

    //validation colors iwath kirima
    // setDefault([textFullName, textCallingName, textNic, selectGender, dateDOB, inputEmail, telMobil, telLand, textAddress, textNote, selectDesignation, selectCivil, selectEmpStatus]);

    // dynamic element refill kala yuthuya
    // let customerStatus = getServiceRequest('/customerStatus/alldata')
    
    // fillDataIntoSelect(selectCusStatus, "Please Select Customer Status..!", customerStatus, "name");
}
    