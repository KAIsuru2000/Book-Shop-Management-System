//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function for refresh table
    refreshCustomerTable();

    //Call refresh form function
    refreshCustomerForm();

})

//create function for refresh table
const refreshCustomerTable = () => {

    //controller wala hadapu service eka magin data array eka laba ganima
    const customers = getServiceRequest("/customer/alldata");

    //create display property list
    //data types
    //string => string / data / number
    //function => object / array / boolean
    displayPropertyList = [
        //function name ekak add karai call kirimak sidu nowe
        
        { dataType: 'string', propertyName: 'regno' },
        { dataType: 'string', propertyName: 'fullname' },
        { dataType: 'string', propertyName: 'mobileno' },
        { dataType: 'string', propertyName: 'email' },
        { dataType: 'function', propertyName: getCustomerStatus }
    ];

    // call tablefill function
    fillDataIntoTable(tableCustomerBody, customers, displayPropertyList, rowFormRefill, rowDelete, rowPrint, "#offcanvasBottom");

    //call jquerry data table
    $('#tableCustomer').dataTable();
}

// table ekehi status eka penwimata 
const getCustomerStatus = (dataob) => {
    if (dataob.customerstatus_id.name == "Active") {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;"></i>'
    } else {
        return '<i class="fa-solid fa-circle-xmark fa-beat fa-xl" style="color: #fe0101;"></i>'
    }

}

const rowFormRefill = (dataob, rowIndex) => {}

const rowDelete = (dataob, rowIndex) => {}
    
const rowPrint = (dataob, rowIndex) => {}

const refreshCustomerForm = () => {

    customer = new Object();

    formCustomer.reset();

    //validation colors iwath kirima
    // setDefault([textFullName, textCallingName, textNic, selectGender, dateDOB, inputEmail, telMobil, telLand, textAddress, textNote, selectDesignation, selectCivil, selectEmpStatus]);

    // dynamic element refill kala yuthuya
    let customerStatus = getServiceRequest('/customerStatus/alldata')
    
    fillDataIntoSelect(selectCusStatus, "Please Select Customer Status..!", customerStatus, "name");
}
    