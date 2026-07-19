//browser ekee window object eka load wana wita sidu wimata functoin ekak laba dei
// window.addEventListener(event, function)
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    refreshEmployeeTable();

    refreshEmployeeform();

})

//refresh table Area 
const refreshEmployeeTable = () => {

    // mema functon eka common js eka thula define kara thibee me sadaha controller wala athi alldata service eka magin data laba gani
    let employees = getServiceRequest("/employee/alldata");

    //column list eka sadaa ganima
    //ui ekehi table eka bala meya sadai
    //object,boolean walata function yodagani
    //ui table ekahi column piliwelata property name laba dei
    //string => string / data / number
    //function => object / array / boolean
    let propertyList = [
        { propertyName: "fullname", dataType: "string" },
        { propertyName: "nic", dataType: "string" },
        { propertyName: "mobile", dataType: "string" },
        { propertyName: getDesignation, dataType: "function" },
        { propertyName: getEmployeeStatus, dataType: "function" },
    ];

    //call filldataintotable function (talebodyId, datalist, column list, editefunctionname, deletefunctionname, printfunctionname, buttonvisibility) 
    fillDataIntoTable(tableEmployeeBody, employees, propertyList, employeeRowFormRefill, employeeRowDelete, employeeRowView, "#offcanvasBottom");


    // ui ekehi table eka datatable formate ekata convert kara gannima
    $('#tableEmployee').DataTable();


}

// table eke designation column eka fill wima sadaha function ekak
const getDesignation = (dataob) => {
    return dataob.designation_id.name;
}

// table eke employee status column eka fill wima sadaha function ekak
const getEmployeeStatus = (dataob) => {
    if (dataob.employeestatus_id.name == "working") {
        return '<i class="fa-solid fa-person-circle-check fa-beat fa-xl" style="color: #07f702;" data-bs-toggle="tooltip"\n' +
            '                                                title="Working"></i>'
    }

    if (dataob.employeestatus_id.name == "resign") {
        return '<i class="fa-solid fa-person-circle-minus fa-beat fa-xl" style="color: #f6ee04;" data-bs-toggle="tooltip"\n' +
            '                                                title="Resign"></i>'
    }

    if (dataob.employeestatus_id.name == "delete") {
        return '<i class="fa-solid fa-person-circle-xmark fa-beat fa-xl" style="color: #fa0000;" data-bs-toggle="tooltip"\n' +
            '                                                title="Delete"></i>'
    }

}

//function for re fill employee form
const employeeRowFormRefill = (ob, index) => {
    console.log("Edit", ob, index);

    // refill value in to element -> elementId.value = ob.releventPropertyName
    textFullName.value = ob.fullname;

    textCallingName.value = ob.callingname;

    textNic.value = ob.nic;

    selectGender.value = ob.gender;

    dateDOB.value = ob.dob;

    inputEmail.value = ob.email;

    telMobil.value = ob.mobile;

    // optional field sadaha
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

    // js array eka json string ekakata convert kirima JSON.stringify() magin sidu karai
    selectDesignation.value = JSON.stringify(ob.designation_id);

    selectCivil.value = ob.civilstatus;

    // js array eka json string ekakata convert kirima JSON.stringify() magin sidu karai
    selectEmpStatus.value = JSON.stringify(ob.employeestatus_id);

    //     hide add button
    divButtonAdd.style.display = "none";

//     show update button
    divButtonUpdate.style.display = "flex";



    //employee = ob
    //oldEmployee = ob melesa thibuu wita ob array ekak nisa heap eka thula ekma idehi variable 2 ka ewita ekak wenas kala wita anikath wenas we.
    employee = JSON.parse(JSON.stringify(ob));// string kala wita ram ekehi wena wenama seedi heap ekata giya wita 2k lesa pawathi.
    oldEmployee = JSON.parse(JSON.stringify(ob));
    //json string eka newatha js object ekakata convert kirima JSON.parse() magin sidu karai
    //ewita originam object ekata balapeemak nowana paridi object eka clone ekak sada gatha heka


}

//function for delete employee form
// meya delete button eka click karama call wei
const employeeRowDelete = (ob, index) => {
    console.log("Delete", ob, index);

    // employeewa delete kirima thahawuru kirimata SweetAlert2 modal box ekak open karai
    Swal.fire({
        title: "Confirm Delete", // alert eke title eka set karai
        html: `Are you sure to delete the following employee?<br><br>` +
              `<strong>Full Name:</strong> ${ob.fullname}<br>` +
              `<strong>NIC:</strong> ${ob.nic}<br>` +
              `<strong>Designation:</strong> ${ob.designation_id.name}`, // delete karanna yana employee ge details display karai
        icon: "warning", // warning icon eka pennai
        showCancelButton: true, // cancel button eka active karai
        confirmButtonText: '<i class="fa-solid fa-trash"></i> Delete', // confirm button text eka icon ekath ekka set karai
        cancelButtonText: '<i class="fa-solid fa-xmark"></i> Cancel', // cancel button text eka set karai
        customClass: {
            popup: 'swal-custom-popup', // dark teal background classes set karai
            title: 'swal-custom-title', // custom gradient title style apply karai
            htmlContainer: 'swal-custom-content', // body text style set karai
            confirmButton: 'swal-custom-cancel-btn', // confirm button ekata rathu paata design eka yodai
            cancelButton: 'swal-custom-confirm-btn' // cancel button ekata green paata design eka yodai
        },
        buttonsStyling: false // default buttons style remove karala custom style active karai
    }).then((result) => {
        // user click karapu button eka isConfirmed nam
        if (result.isConfirmed) {
            // employee delete kirime DELETE HTTP request eka service ekata yawai
            let deleteResponce = getHTTPServiceRequest("/employee/delete", "DELETE", ob);

            // server reply eka OK returned unoth
            if (deleteResponce == "OK") {
                // delete successful kiyala modal popup ekak pennai
                Swal.fire({
                    title: "Deleted!",
                    text: "Employee deleted successfully.",
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
                refreshEmployeeTable(); // data table eka refresh karala aluth data load karai
                refreshEmployeeform(); // form eka reset karala clear karai
            } else {
                // error ekak labunoth eya popup message ekin pennai
                Swal.fire({
                    title: "Error!",
                    text: "Delete not successful: " + deleteResponce,
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

//employee table eka thula athi view button eke function eka
// memagin print ekata open wana view eka sadaha data laba dei
const employeeRowView = (dataob, index) => {
    console.log("View", dataob, index);

    fullNameView.innerText = dataob.fullname;
    callingNameView.innerText = dataob.callingname;
    nicView.innerText = dataob.nic;
    genderView.innerText = dataob.gender;
    dobView.innerText = dataob.dob;
    emailView.innerText = dataob.email;
    mobileView.innerText = dataob.mobile;
    if (dataob.landno == undefined) {
        landNoView.innerText = "-";
    } else {
        landNoView.innerText = dataob.landno;
    }
    addressView.innerText = dataob.address
    if (dataob.note == undefined) {
        noteView.innerText = "-";
    } else {
        noteView.innerText = dataob.note;
    }
    designationView.innerText = dataob.designation_id.name;
    civilStatusView.innerText = dataob.civilstatus;
    employeeStatusView.innerText = dataob.employeestatus_id.name;

    $("#offcanvasBottomEmployeeView").offcanvas("show"); // show the offcanvas

}

//print offcanvas model eka thula athi print button eka function eka
const buttonPrintRow = () => {
    
    //aluth window ekak open kara ganima
    // ema window eka newWindow variable ekata dama ganima
    let newWindow = window.open();

    // open kala nawa window ekata content eka write kara gannima
    newWindow.document.write(`
            <html>
            <head>
                <title>Print View - Employee Details</title>
                <!-- link bootstrp min css file -->
    <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">

    <!--link bootstrap js file  -->
    <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
    
                <!-- link css file -->
                    <link rel="stylesheet" href="/Style/printView.css">
            </head>
            <body>
<!--            html file eka thula athi print view ekata sadu view ekehi body eke id eka methanata laba dei-->
                ${document.querySelector('.bodyPrintView').outerHTML}
            </body>
            </html>
        `);
    //open wana tab eka tika welawak open wee thibee print ekata open weema
    setTimeout(() => {
        newWindow.stop();//window loading process eka stop kara gannima
        newWindow.print(); //print dialog box eka open kara gannima
        newWindow.close(); //js walin open karana tab eka close kara gannima
    }, 1500)//1.5 second walata pasuwa block eka run karawai ema pramadaya iilaga piyawarata yaamata pera printView anthargathaya complete wa display kirimata ida salasai
}

//form eke ek ek property check kara values naththan msg ekak return kara ganima sdaha
const checkFormError = () => {
    let errors = "";

    if (employee.fullname == null) {
        errors = errors + "Please Enter valid Full Name...! \n";
    }

    if (employee.callingname == null) {
        errors = errors + "Please Enter valid calling name...! \n";
    }
    if (employee.nic == null) {
        errors = errors + "Please Enter valid nic...! \n";
    }
    if (employee.gender == null) {
        errors = errors + "Please Enter valid gender...! \n";
    }
    if (employee.dob == null) {
        errors = errors + "Please Enter valid Date of birth...! \n";
    }
    if (employee.email == null) {
        errors = errors + "Please Enter valid email...! \n";
    }
    if (employee.mobile == null) {
        errors = errors + "Please Enter valid mobile no...! \n";
    }

    if (employee.address == null) {
        errors = errors + "Please Enter valid address...! \n";
    }

    if (employee.designation_id == null) {
        errors = errors + "Please Enter valid designation...! \n";
    }
    if (employee.civilstatus == null) {
        errors = errors + "Please Enter valid civil status...! \n";
    }
    if (employee.employeestatus_id == null) {
        errors = errors + "Please Enter valid employee status...! \n";
    }

    return errors;
}

//Employee form submit event function
// meya html form ekehi submit button eka click karama call wei
const buttonEmployeeSubmit = () => {
    console.log('Add Employee', employee);

    // checkFormError function eken required data empty da balala error list eka gani
    let errors = checkFormError();

    // errors nomathi nam (form eka valid nam)
    if (errors == "") {
        // employee add karanna thahawuru kirime sweet alert popup dialog eka open karai
        Swal.fire({
            title: "Confirm Submission", // alert eke title eka set karai
            html: `Are you sure to add the following employee?<br><br>` +
                  `<strong>Full Name:</strong> ${employee.fullname}<br>` +
                  `<strong>NIC:</strong> ${employee.nic}<br>` +
                  `<strong>Designation:</strong> ${employee.designation_id.name}`, // employee details dakkwanna html text eka
            icon: "question", // question mark icon eka pennai
            showCancelButton: true, // cancel button eka active karai
            confirmButtonText: '<i class="fa-solid fa-plus"></i> Add', // Add button text set karai
            cancelButtonText: '<i class="fa-solid fa-xmark"></i> Cancel', // cancel button text set karai
            customClass: {
                popup: 'swal-custom-popup', // style custom class set karai
                title: 'swal-custom-title',
                htmlContainer: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-btn', // green confirm style
                cancelButton: 'swal-custom-cancel-btn' // red cancel style
            },
            buttonsStyling: false // custom styling valid kirimata default styles ain karai
        }).then((result) => {
            // confirm click kala nam
            if (result.isConfirmed) {
                // insert service request eka POST method eken database ekata yawai
                let postResponce = getHTTPServiceRequest("/employee/insert", "POST", employee);
                // record eka success saved unoth
                if (postResponce == "OK") {
                    // success message eka sweetalert ekin display karai
                    Swal.fire({
                        title: "Saved!",
                        text: "Employee saved successfully.",
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
                    refreshEmployeeTable(); // data table eka refresh karai
                    refreshEmployeeform(); // form eka clear karai
                    $("#offcanvasBottom").offcanvas("hide"); // employee adding offcanvas form model eka wahanawa (hide offcanvas)
                } else {
                    // post error ekak awoth popup ekin dakkwanna
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
        // required errors thibe nam validation error alert dialog popup eka pennai
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

//check form update function
//me sadaha rowFormRefill function eka thula sadagath object 2ka yoda gani
const checkFormUpdate = () => {
    let updates = "";

    if (employee != null && oldEmployee != null) {
        // mul awasthawe object 2hima data pawathi pasuwa update ekak sidu kala pasu ema update ekata adla property eka employee object eka thula wenas wei
        // employee object eke athi property 1k 1k oldEmployee object eke athi property 1k 1k samana nadda balai

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

// form update event function
// meya html eka thula athi update button eka click karama call wei
const buttonEmployeeUpdate = () => {

    //need to check form errors
    let errors = checkFormError();
    if (errors == "") {
        // need to check form update
        let updates = checkFormUpdate();
        // updates nomathi nam
        if (updates == "") {
            Swal.fire({
                title: "No Changes",
                text: "Nothing to update.",
                icon: "info",
                confirmButtonText: '<i class="fa-solid fa-check"></i> OK',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-content',
                    confirmButton: 'swal-custom-warning-btn' // warning yellow button styling apply karai
                },
                buttonsStyling: false
            });
        } else {
            // wenas weem thibe nam confirmation SweetAlert2 popup box eka open karai
            Swal.fire({
                title: "Confirm Update",
                html: "Are you sure to update the following changes?<br><br>" + updates.replace(/\n/g, "<br>"), // updates check list eka alert box eke display karai
                icon: "question",
                showCancelButton: true,
                confirmButtonText: '<i class="fa-solid fa-pen-to-square"></i> Update',
                cancelButtonText: '<i class="fa-solid fa-xmark"></i> Cancel',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-content',
                    confirmButton: 'swal-custom-warning-btn', // yellow update style
                    cancelButton: 'swal-custom-cancel-btn' // red cancel style
                },
                buttonsStyling: false
            }).then((result) => {
                // updates thahawuru kala nam
                if (result.isConfirmed) {
                    // service update request eka PUT method ekin backend yawai
                    let putResponce = getHTTPServiceRequest("/employee/update", "PUT", employee);
                    // update status success returned unoth
                    if (putResponce == "OK") {
                        // success alert modal pop up box eka design pennanawa
                        Swal.fire({
                            title: "Updated!",
                            text: "Employee details updated successfully.",
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
                        refreshEmployeeTable(); // data table reload/refresh karai
                        refreshEmployeeform(); // form clear refresh karai
                        $("#offcanvasBottom").offcanvas("hide"); // form offcanvas slide eka hide karai
                    } else {
                        // error alert check popup eka display karai
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to update: " + putResponce,
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
        // required items validation errors popup window dialog ekin dakkwana
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

//full name validation
//browser ekee textFullName element eka   wana wita sidu wimata functoin ekak laba dei
//window.addEventListener(event, function)
textFullName.addEventListener("keyup", () => {

    // Navigate to the parent element and then to the associated span
    spanElementFullName = textFullName.previousElementSibling;
    // Navigate to the parent element and then to the associated span
    spanElementCalName = textCallingName.previousElementSibling;

    // valid da nadda balima
    const fullNameValue = textFullName.value;
    if (fullNameValue != "") {
        if (new RegExp("^([A-Z][a-z]{1,20}[\\s])+([A-Z][a-z]{1,20})$").test(fullNameValue)) {
            //valid full name
            employee.fullname = fullNameValue; //value add to employee object

            textFullName.style.borderBottom = "4px solid green";
            spanElementFullName.style.backgroundColor = "green";
            textFullName.classList.remove("is-invalid");
            textFullName.classList.add("is-valid");

            // Navigate to the parent element and then to the associated span
            spanElementCalName = textCallingName.previousElementSibling;

            //genarate calling name
            let fullNamePart = fullNameValue.split(" ");
            dlCallingName.innerHTML = "";
            textCallingName.value = fullNamePart[0];
            textCallingName.style.borderBottom = "4px solid green";
            spanElementCalName.style.backgroundColor = "green";
            textCallingName.classList.remove("is-invalid");
            textCallingName.classList.add("is-valid");
            employee.callingname = textCallingName.value;  //value add to employee object
            fullNamePart.forEach(element => {
                let option = document.createElement("option");
                option.value = element;
                if (element.length > 2) {
                    dlCallingName.appendChild(option);
                }

            });



        } else {
            //invalid fullname
            textFullName.style.borderBottom = "4px solid red";
            spanElementFullName.style.backgroundColor = "red";
            textFullName.classList.add("is-invalid");
            textFullName.classList.remove("is-valid");
            employee.fullname = null; //employee object add to value null
        }
    } else {
        //invalid fullname
        textFullName.style.borderBottom = "4px solid red";
        spanElementFullName.style.backgroundColor = "red";
        textCallingName.style.borderBottom = "4px solid red";
        spanElementCalName.style.backgroundColor = "red";
        textFullName.classList.add("is-invalid");
        textFullName.classList.remove("is-valid");
        textCallingName.classList.add("is-invalid");
        textCallingName.classList.remove("is-valid");
        textCallingName.value = "";
        employee.fullname = null; //employee object add to value null
    }
});

textFullName.addEventListener("click", () => {

    // Navigate to the parent element and then to the associated span
    spanElementFullName = textFullName.previousElementSibling;
    // Navigate to the parent element and then to the associated span
    spanElementCalName = textCallingName.previousElementSibling;

    // valid da nadda balima
    const fullNameValue = textFullName.value;
    if (fullNameValue != "") {
        if (new RegExp("^([A-Z][a-z]{1,20}[\\s])+([A-Z][a-z]{1,20})$").test(fullNameValue)) {
            //valid full name
            employee.fullname = fullNameValue; //value add to employee object

            textFullName.style.borderBottom = "4px solid green";
            spanElementFullName.style.backgroundColor = "green";
            textFullName.classList.remove("is-invalid");
            textFullName.classList.add("is-valid");



            //genarate calling name
            let fullNamePart = fullNameValue.split(" ");
            dlCallingName.innerHTML = "";
            textCallingName.value = fullNamePart[0];
            textCallingName.style.borderBottom = "4px solid green";
            spanElementCalName.style.backgroundColor = "green";
            textCallingName.classList.remove("is-invalid");
            textCallingName.classList.add("is-valid");
            employee.callingname = textCallingName.value; //value add to employee object
            fullNamePart.forEach(element => {
                let option = document.createElement("option");
                option.value = element;
                if (element.length > 2) {
                    dlCallingName.appendChild(option);
                }

            });



        } else {
            //invalid fullname
            textFullName.style.borderBottom = "4px solid red";
            spanElementFullName.style.backgroundColor = "red";
            textFullName.classList.add("is-invalid");
            textFullName.classList.remove("is-valid");
            employee.fullname = null; //employee object this value null
        }
    } else {
        //invalid fullname
        textFullName.style.borderBottom = "4px solid red";
        spanElementFullName.style.backgroundColor = "red";
        textCallingName.style.borderBottom = "4px solid red";
        spanElementCalName.style.backgroundColor = "red";
        textFullName.classList.add("is-invalid");
        textFullName.classList.remove("is-valid");
        textCallingName.classList.add("is-invalid");
        textCallingName.classList.remove("is-valid");
        textCallingName.value = "";
        employee.fullname = null; //employee object this value null
    }
});



const callingNameValidator = (callingNameElement) => {

    // Navigate to the parent element and then to the associated span
    // validation wala colour eka laba deema sadaha
    spanElement = textCallingName.previousElementSibling
    const callingNameValue = callingNameElement.value;
    const fullNameValue = textFullName.value;
    let fullNameParts = fullNameValue.split(" ");
    let extIndex = fullNameParts.map(fullNamePart => fullNamePart).indexOf(callingNameValue);
    if (callingNameValue != "") {
        if (extIndex != -1) {
            textCallingName.style.borderBottom = "4px solid green";
            spanElement.style.backgroundColor = "green";
            textCallingName.classList.remove("is-invalid");
            textCallingName.classList.add("is-valid");
            employee.callingname = textCallingName.value; //value add to employee object
        } else {
            textCallingName.style.borderBottom = "4px solid red";
            spanElement.style.backgroundColor = "red";
            textCallingName.classList.add("is-invalid");
            textCallingName.classList.remove("is-valid");
            employee.callingname = null; //employee object add to value null
        }
    } else {
        textCallingName.style.borderBottom = "4px solid red";
        spanElement.style.backgroundColor = "red";
        textCallingName.classList.add("is-invalid");
        textCallingName.classList.remove("is-valid");
        employee.callingname = null; //employee object add to value null
    }

}

//nic validate check kirima
textNic.addEventListener("keyup", () => {

    // inputfield ekata pera athi lable box eka colour kirima sadaha
    prevElementNic = textNic.previousElementSibling;
    prevElementGender = selectGender.previousElementSibling;
    prevElementDob = dateDOB.previousElementSibling;

    // input karana nic value eka ganima
    const nicValue = textNic.value;

    // lenth eka niweradi nm
    if (nicValue.length == 10 || nicValue.length == 12) {

        //nic value eka empty nethi nm
        if (nicValue != "") {
            // pattern ekata match nm
            if (new RegExp("^([0-9]{9}[VvXx])|([0-9]{12})$").test(nicValue)) {
                //valid nic name , input field ekata colours and icon add kirima
                textNic.style.borderBottom = "4px solid green";
                prevElementNic.style.backgroundColor = "green";
                textNic.classList.remove("is-invalid");
                textNic.classList.add("is-valid");
                employee.nic = nicValue; //value add kirima employee object ekata
                // gender , DOB generate kirima
                let year, days, month, date, dob;
                if (nicValue.length == 10) {
                    days = nicValue.substring(2, 5);
                    year = "19" + nicValue.substring(0, 2);
                }
                if (nicValue.length == 12) {
                    days = nicValue.substring(4, 7);
                    year = nicValue.substring(0, 4);
                }

                if (parseInt(days) > 500) {
                    selectGender.value = 'Female';
                    employee.gender = selectGender.value; //value add to employee object
                    //valid gender
                    selectGender.style.borderBottom = "4px solid green";
                    prevElementGender.style.backgroundColor = "green";
                    selectGender.classList.remove("is-invalid");
                    selectGender.classList.add("is-valid");
                    days = days - 500;
                } else {
                    selectGender.value = 'Male';
                    //valid gender
                    selectGender.style.borderBottom = "4px solid green";
                    prevElementGender.style.backgroundColor = "green";
                    selectGender.classList.remove("is-invalid");
                    selectGender.classList.add("is-valid");
                    employee.gender = selectGender.value; //value add to employee object

                }

                let dobDate = new Date(year);

                if (year % 4 != 0) {
                    dobDate.setDate(days - 1);
                } else {
                    dobDate.setDate(days);
                }

                month = dobDate.getMonth() + 1;
                if (month < 10) {
                    month = "0" + month;
                }

                date = dobDate.getDate();
                if (date < 10) {
                    date = "0" + date;
                }

                dob = year + "-" + month + "-" + date;
                dateDOB.value = dob;
                //valid dob
                dateDOB.style.borderBottom = "4px solid green";
                prevElementDob.style.backgroundColor = "green";
                dateDOB.classList.remove("is-invalid");
                dateDOB.classList.add("is-valid");
                employee.dob = dateDOB.value; //value add to employee object


            } else {
                //invalid nic
                textNic.style.borderBottom = "4px solid red";
                prevElementNic.style.backgroundColor = "red";
                textNic.classList.add("is-invalid");
                textNic.classList.remove("is-valid");
                employee.nic = null; //employee object add to value null


                //invalid gender
                selectGender.style.borderBottom = "4px solid red";
                prevElementGender.style.backgroundColor = "red";
                selectGender.classList.add("is-invalid");
                selectGender.classList.remove("is-valid");
                employee.gender = null; //employee object add to value null
                //invalid dob
                dateDOB.style.borderBottom = "4px solid red";
                prevElementDob.style.backgroundColor = "red";
                dateDOB.classList.add("is-invalid");
                dateDOB.classList.remove("is-valid");
                employee.dob = null; //employee object add to value null


            }



        } else {
            //empty nic field
            textNic.style.borderBottom = "4px solid red";
            prevElementNic.style.backgroundColor = "red";
            textNic.classList.add("is-invalid");
            textNic.classList.remove("is-valid");
            employee.nic = null; //employee object add to value null

            //empty dob field
            dateDOB.style.borderBottom = "4px solid red";
            prevElementDob.style.backgroundColor = "red";
            dateDOB.classList.add("is-invalid");
            dateDOB.classList.remove("is-valid");
            dateDOB.value = "";
            employee.dob = null; //employee object add to value null

            //empty gender field
            selectGender.style.borderBottom = "4px solid red";
            prevElementGender.style.backgroundColor = "red";
            selectGender.classList.add("is-invalid");
            selectGender.classList.remove("is-valid");
            employee.gender = null; //employee object add to value null
        }
    } else {

        //empty nic field
        textNic.style.borderBottom = "4px solid red";
        prevElementNic.style.backgroundColor = "red";
        textNic.classList.add("is-invalid");
        textNic.classList.remove("is-valid");
        employee.nic = null; //employee object add to value null

        //empty dob field
        dateDOB.style.borderBottom = "4px solid red";
        prevElementDob.style.backgroundColor = "red";
        dateDOB.classList.add("is-invalid");
        dateDOB.classList.remove("is-valid");
        dateDOB.value = "";
        employee.dob = null; //employee object add to value null

        //empty gender field
        selectGender.style.borderBottom = "4px solid red";
        prevElementGender.style.backgroundColor = "red";
        selectGender.classList.add("is-invalid");
        selectGender.classList.remove("is-valid");
        employee.gender = null; //employee object add to value null
    }





});

textNic.addEventListener("click", () => {

    // Navigate to the parent element and then to the associated tag
    prevElementNic = textNic.previousElementSibling;
    prevElementGender = selectGender.previousElementSibling;
    prevElementDob = dateDOB.previousElementSibling;

    const nicValue = textNic.value;

    if (nicValue.length == 10 || nicValue.length == 12) {

        if (nicValue != "") {
            if (new RegExp("^([0-9]{9}[VvXx])|([0-9]{12})$").test(nicValue)) {
                //valid nic name
                textNic.style.borderBottom = "4px solid green";
                prevElementNic.style.backgroundColor = "green";
                employee.nic = nicValue; //value add to employee object
                //generate gender , DOB
                let year, days, month, date, dob;
                if (nicValue.length == 10) {
                    days = nicValue.substring(2, 5);
                    year = "19" + nicValue.substring(0, 2);
                }
                if (nicValue.length == 12) {
                    days = nicValue.substring(4, 7);
                    year = nicValue.substring(0, 4);
                }

                if (parseInt(days) > 500) {
                    selectGender.value = 'Female';
                    employee.gender = selectGender.value; //value add to employee object
                    //valid gender
                    selectGender.style.borderBottom = "4px solid green";
                    prevElementGender.style.backgroundColor = "green";
                    days = days - 500;
                } else {
                    selectGender.value = 'Male';
                    //valid gender
                    selectGender.style.borderBottom = "4px solid green";
                    prevElementGender.style.backgroundColor = "green";
                    employee.gender = selectGender.value; //value add to employee object

                }

                let dobDate = new Date(year);

                if (year % 4 != 0) {
                    dobDate.setDate(days - 1);
                } else {
                    dobDate.setDate(days);
                }

                month = dobDate.getMonth() + 1;
                if (month < 10) {
                    month = "0" + month;
                }

                date = dobDate.getDate();
                if (date < 10) {
                    date = "0" + date;
                }

                dob = year + "-" + month + "-" + date;
                dateDOB.value = dob;
                //valid dob
                dateDOB.style.borderBottom = "4px solid green";
                prevElementDob.style.backgroundColor = "green";
                employee.dob = dateDOB.value; //value add to employee object


            } else {
                //invalid nic
                textNic.style.borderBottom = "4px solid red";
                prevElementNic.style.backgroundColor = "red";
                employee.nic = null; //employee object this value null
                employee.dob = null; //employee object this value null
                employee.gender = null; //employee object this value null
                //invalid gender
                selectGender.style.borderBottom = "4px solid red";
                prevElementGender.style.backgroundColor = "red";
                //invalid dob
                dateDOB.style.borderBottom = "4px solid red";
                prevElementDob.style.backgroundColor = "red";

            }



        } else {
            //empty nic field
            textNic.style.borderBottom = "4px solid red";
            prevElementNic.style.backgroundColor = "red";
            employee.nic = null; //employee object this value null

            //empty dob field
            dateDOB.style.borderBottom = "4px solid red";
            prevElementDob.style.backgroundColor = "red";
            dateDOB.value = "";
            employee.dob = null; //employee object this value null

            //empty gender field
            selectGender.style.borderBottom = "4px solid red";
            prevElementGender.style.backgroundColor = "red";
            employee.gender = null; //employee object this value null
        }
    } else {

        //empty nic field
        textNic.style.borderBottom = "4px solid red";
        prevElementNic.style.backgroundColor = "red";
        textNic.classList.add("is-invalid");
        textNic.classList.remove("is-valid");
        employee.nic = null; //employee object this value null

        //empty dob field
        dateDOB.style.borderBottom = "4px solid red";
        prevElementDob.style.backgroundColor = "red";
        dateDOB.classList.add("is-invalid");
        dateDOB.classList.remove("is-valid");
        dateDOB.value = "";
        employee.dob = null; //employee object this value null

        //empty gender field
        selectGender.style.borderBottom = "4px solid red";
        prevElementGender.style.backgroundColor = "red";
        selectGender.classList.add("is-invalid");
        selectGender.classList.remove("is-valid");
        employee.gender = null; //employee object this value null
    }





});

const refreshEmployeeform = () => {
    employee = new Object();

    formEmployee.reset();

    //validation colors iwath kirima
    setDefault([textFullName, textCallingName, textNic, selectGender, dateDOB, inputEmail, telMobil, telLand, textAddress, textNote, selectDesignation, selectCivil, selectEmpStatus]);

    // dynamic element refill kala yuthuya
    let designation = getServiceRequest('/designation/alldata')
    fillDataIntoSelect(selectDesignation, "Please Select Designation..!!", designation, "name");

    let employeeStatues = getServiceRequest('/employeeStatues/alldata');
    fillDataIntoSelect(selectEmpStatus, "Please Select Status..!!", employeeStatues, "name");
    // status eka form eka load wana wita select wi thibimata
    // selected value eka string walin ena nisa stringify kara gani
    selectEmpStatus.value = JSON.stringify(employeeStatues[0]);
    // ema value eka newatha object ekata set kala yuththa object format ekeni
    employee.employeestatus_id = JSON.parse(selectEmpStatus.value);
    // status field eka sadaha validation colour eka laba deema
    prevElementEmpStatus = selectEmpStatus.previousElementSibling;
    selectEmpStatus.style.borderBottom = "4px solid green";
    prevElementEmpStatus.style.backgroundColor = "green";
    selectEmpStatus.classList.remove("is-invalid");
    selectEmpStatus.classList.add("is-valid");

//     hide update button
    divButtonUpdate.style.display = "none";

//     show add button
    divButtonAdd.style.display = "flex";
}

// form eke clear button eka sadaha
const clearEmployeeForm = () => {
    // form clear thahawuru karanna sweetalert confirmation popup dialog eka active karai
    Swal.fire({
        title: "Confirm Refresh", // dialog title set
        text: "Do you need to refresh form...?", // dialog text confirmation set
        icon: "question", // question mark logo set
        showCancelButton: true, // cancel button dakkwanawa
        confirmButtonText: '<i class="fa-solid fa-check"></i> Yes', // yes confirm button
        cancelButtonText: '<i class="fa-solid fa-xmark"></i> No', // no cancel button
        customClass: {
            popup: 'swal-custom-popup', // local styling parameters
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-content',
            confirmButton: 'swal-custom-confirm-btn', // green style confirm button
            cancelButton: 'swal-custom-cancel-btn' // red style cancel button
        },
        buttonsStyling: false // custom classes implement karanna buttonsStyling disable karai
    }).then((result) => {
        // user 'Yes' button click kala nam
        if (result.isConfirmed) {
            refreshEmployeeform(); // employee form fields default refresh value set karala clear karai
        }
    });
}

// function to preview employee photo
const previewEmployeePhoto = () => {
    const fileEmployeePhoto = document.getElementById('fileEmployeePhoto');
    const imgEmployeePhotoPreview = document.getElementById('imgEmployeePhotoPreview');
    
    if (fileEmployeePhoto.files && fileEmployeePhoto.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imgEmployeePhotoPreview.src = e.target.result;
            if(typeof employee !== 'undefined' && employee !== null) {
                // optionally store the photo data into the employee object if the backend requires it later
                employee.employeephoto = e.target.result; 
            }
        }
        
        reader.readAsDataURL(fileEmployeePhoto.files[0]);
    }
}

// function to clear employee photo
const clearEmployeePhoto = () => {
    const fileEmployeePhoto = document.getElementById('fileEmployeePhoto');
    const imgEmployeePhotoPreview = document.getElementById('imgEmployeePhotoPreview');
    
    fileEmployeePhoto.value = ''; // clear the file input
    imgEmployeePhotoPreview.src = '/images/images.jpeg'; // set to default image
    
    if(typeof employee !== 'undefined' && employee !== null) {
        employee.employeephoto = null;
    }
}
