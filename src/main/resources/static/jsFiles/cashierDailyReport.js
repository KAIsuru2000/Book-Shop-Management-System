//browser ekee window object eka load wana wita sidu wimata functoin ekak laba dei
// window.addEventListener(event, function)
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    // logged user ge role eka ganna backend api ekata request ekak yawala response object eka aragannawa
    let loggedUserObj = getServiceRequest("/loggeduser/role");
    console.log(loggedUserObj)
    // response object eken path eka select karala role eke nama loggedUser variable ekata set karagannawa
    let loggeduserRole = loggedUserObj.role;

    // log userge id ekka gnnawa
    loggeduserId = getServiceRequest("/loggeduser/userid");
    console.log(loggeduserId)
    if (loggeduserRole == "Cashier") {

        const today = new Date().toISOString().split('T')[0];
        console.log(today);
        document.getElementById("startDate").value = today;
        document.getElementById("endDate").value = today;
        document.getElementById("startDate").disabled = true;
        document.getElementById("endDate").disabled = true;

    } else {
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
        document.getElementById("startDate").disabled = false;
        document.getElementById("endDate").disabled = false;
    }

})
const generateReport = () => {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const paymentType = document.getElementById('paymentType').value;
    let loggeduserid = loggeduserId;
    // mema functon eka common js eka thula define kara thibee me sadaha controller wala athi alldata service eka magin data laba gani
    let paymentList = getServiceRequest("/report?loggeduserid=" + loggeduserid +
        "&startdate=" + startDate + "&enddate=" + endDate + "&paymenttype=" + paymentType);
    refreshCashierPaymentTable(paymentList);
}

//refresh table Area
const refreshCashierPaymentTable = (list) => {

    let reportData = []
    let total = 0;
    list.forEach((dataList, index) => {
        console.log(dataList);
        let ob = new Object();
        ob.biilNo = dataList[0];
        ob.paymentType = dataList[1];
        ob.amount = dataList[2];
        reportData.push(ob);

        total = total + parseFloat(ob.amount);
    })
    //column list eka sadaa ganima
    //ui ekehi table eka bala meya sadai
    //object,boolean walata function yodagani
    //ui table ekahi column piliwelata property name laba dei
    //string => string / data / number
    //function => object / array / boolean
    let propertyList = [
        {propertyName: "biilNo", dataType: "string"},
        {propertyName: "paymentType", dataType: "string"},
        {propertyName: "amount", dataType: "string"}
    ];

    //call filldataintotable function (talebodyId, datalist, column list, editefunctionname, deletefunctionname, printfunctionname, buttonvisibility)
    fillDataIntoTable(tableCashierPaymentReportBody, reportData, propertyList, employeeRowFormRefill, employeeRowDelete, employeeRowView, false);

    totalAmount.innerText = total.toLocaleString('en-LK', {style: 'currency', currency: 'LKR'});
    // ui ekehi table eka datatable formate ekata convert kara gannima
    $('#tableCashierPaymentReport').DataTable();


}


//function for re fill employee form
const employeeRowFormRefill = (ob, index) => {


}

//function for delete employee form
// meya delete button eka click karama call wei
const employeeRowDelete = (ob, index) => {

}

//employee table eka thula athi view button eke function eka
// memagin print ekata open wana view eka sadaha data laba dei
const employeeRowView = (dataob, index) => {


}

