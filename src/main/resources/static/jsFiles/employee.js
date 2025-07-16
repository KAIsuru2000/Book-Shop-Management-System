//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    refreshEmployeeTable();

    refreshEmployeeform();

})

//refresh table Area 
const refreshEmployeeTable = () => {

    let employees = getServiceRequest("/employee/alldata");

    let propertyList = [
        { propertyName: "fullname", dataType: "string" },
        { propertyName: "nic", dataType: "string" },
        { propertyName: "mobile", dataType: "string" },
        { propertyName: getDesignation, dataType: "function" },
        { propertyName: getEmployeeStatus, dataType: "function" },
    ];

    //call filldataintotable function (talebodyId, datalist, column list, editefunctionname, deletefunctionname, printfunctionname, buttonvisibility) 
    fillDataIntoTable(tableEmployeeBody, employees, propertyList, employeeRowFormRefill, employeeRowDelete, employeeRowView, "#offcanvasBottom");


    $('#tableEmployee').DataTable();


}

const getDesignation = (dataob) => {
    return dataob.designation_id.name;
}
const getEmployeeStatus = (dataob) => {
    if (dataob.employeestatus_id.name == "working") {
        return '<i class="fa-solid fa-person-circle-check fa-beat fa-xl" style="color: #07f702;"></i>'
    }

    if (dataob.employeestatus_id.name == "resign") {
        return '<i class="fa-solid fa-person-circle-minus fa-beat fa-xl" style="color: #f6ee04;"></i>'
    }

    if (dataob.employeestatus_id.name == "delete") {
        return '<i class="fa-solid fa-person-circle-xmark fa-beat fa-xl" style="color: #fa0000;"></i>'
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

//function for delete employee form
const employeeRowDelete = (ob, index) => {
    console.log("Delete", ob, index);

    // activeTableRow(tableEmployeeBody, index, "red");


    let userConfirm = window.confirm("Are you sure to delete following employee...?" +
        "\n Employee full name : " + ob.fullname +
        "\n Employee nic : " + ob.nic +
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

//employee table eka thula athi view button eke function eka
const employeeRowView = (dataob, index) => {
    console.log("View", dataob, index);
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
    let newWindow = window.open();
    //ema window ekata title ekak demima
    //title eke html code tika venama verible ekakata dama ganima
    // let printView = "<head><title>Bright Book Shop | Employee Details</title><link rel='icon' href='/image/title.png'><link rel='stylesheet' href='/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script><link rel='stylesheet' href='/fontawesome-free-6.4.2/css/all.css'><link rel='stylesheet' href='/Style/printView.css'></head>" + "<body>" + bodyView.outerHTML +
    //     "</body>";
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
const buttonEmployeeSubmit = () => {
    console.log('Add Employee', employee);

    //check form error for required element
    let errors = checkFormError();
    if (errors == "") {
        //no errors get user confirmation
        let userConfirm = window.confirm("Are you sure to add following employee...?" +
            "\n Employee full name : " + employee.fullname +
            "\n Employee nic : " + employee.nic +
            "\n Employee designation : " + employee.designation_id.name
        );
        if (userConfirm) {
            // call post service
            let postResponce = getHTTPServiceRequest("/employee/insert", "POST", employee);
            if (postResponce == "OK") {
                window.alert("Save successfully ");
                refreshEmployeeTable();
                refreshEmployeeform();
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

// form update event function 
const buttonEmployeeUpdate = () => {

    //need to check form errors
    let errors = checkFormError();
    if (errors == "") {
        // need to check form update
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("nothing to update..\n");
        } else {
            //need to get user confirmation
            let userConfirm = window.confirm("Are you sure to update following changers.. \n" + updates);
            if (userConfirm) {
                //call put service
                let putResponce = getHTTPServiceRequest("/employee/update", "PUT", employee);
                if (putResponce == "OK") {
                    window.alert("Update Successfully...!");
                    refreshEmployeeTable();
                    refreshEmployeeform();
                    $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas
                } else {
                    window.alert("Failed to update...!" + putResponce);
                }
            } else {

            }
        }
    } else {
        window.alert("something went wrong.. \n" + errors);
    }

}

// form delete event function 
const buttonEmployeeDelete = () => {
    refreshEmployeeTable();
}

//full name validation
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
    spanElement = textCallingName.previousElementSibl
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

//nic validater
textNic.addEventListener("keyup", () => {

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
                textNic.classList.remove("is-invalid");
                textNic.classList.add("is-valid");
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
}

// form eke clear button eka sadaha
const clearEmployeeForm = () => {

    let userConfirm = window.confirm("Do you need to refresh form...?");
    if (userConfirm) {
        refreshEmployeeform();
    }
}






