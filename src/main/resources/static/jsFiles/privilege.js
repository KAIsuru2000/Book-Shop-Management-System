// browser onload event
window.addEventListener('load', () => {

    //call table refresh function for refresh table
    refreshPrivilegeTable();

    //Call refresh form function
    refreshPrivilegeForm();

});

//create function for refresh table
const refreshPrivilegeTable = () => {

    //creat array for store Privilege data list
    // db ekehi column name walata adalawa properties hede
    //fk sadahada object sede
    let privileges = getServiceRequest("/privilege/alldata");

    //column list eka sadaa ganima
    //ui ekehi table eka bala meya sadai
    //object,boolean walata function yodagani
    //ui table ekahi column piliwelata function sadai 
    displayPropertyList = [{ dataType: 'function', propertyName: getRoleStatus },
    { dataType: 'function', propertyName: getModuleStatus },
    { dataType: 'function', propertyName: getSel },
    { dataType: 'function', propertyName: getInst },
    { dataType: 'function', propertyName: getUpt },
    { dataType: 'function', propertyName: getDel }];

    // call tablefill function
    fillDataIntoTable(tablePrivilegeBody, privileges, displayPropertyList, rowFormRefill, rowDelete, privilegeRowView, "#offcanvasBottom");

    //j querry table ekak bawata path kirima
    $('#tablePrivilege').DataTable();

}

//create property list function

const getRoleStatus = (dataob) => {
    return dataob.role_id.name;
}

const getModuleStatus = (dataob) => {
    return dataob.module_id.name;
}

const getSel = (dataob) => {
    if (dataob.sel) {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;"></i>';

    } else {
        return '<i class="fa-solid fa-circle-xmark fa-beat fa-xl" style="color: #fe0101;"></i>';
    }
}

const getInst = (dataob) => {
    if (dataob.inst) {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;"></i>';

    } else {
        return ' <i class="fa-solid fa-circle-xmark fa-beat fa-xl" style="color: #fe0101;"></i>';
    }
}

const getUpt = (dataob) => {
    if (dataob.upd) {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;"></i>';

    } else {
        return '<i class="fa-solid fa-circle-xmark fa-beat fa-xl" style="color: #fe0101;"></i>';
    }
}

const getDel = (dataob) => {
    if (dataob.del) {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;"></i>';

    } else {
        return ' <i class="fa-solid fa-circle-xmark fa-beat fa-xl" style="color: #fe0101;"></i>';
    }
}

// form refill function
const rowFormRefill = (dataob, rowIndex) => {
    console.log("Update");
    console.log(dataob);

    //update kirima sadaha awashya object 2 sada ganima
    privilege = JSON.parse(JSON.stringify(dataob));
    oldPrivilege = JSON.parse(JSON.stringify(dataob));

    selectRole.value = JSON.stringify(dataob.role_id);
    selectModule.value = JSON.stringify(dataob.module_id);
    // selectDesignation.value = JSON.stringify(ob.designation_id);


    if (dataob.sel) {
        checkSelect.checked = true;
        lblSel.innerText = 'select granted';
    } else {
        checkSelect.checked = false;
        lblSel.innerText = 'select not granted';
    }

    if (dataob.inst) {
        checkInsert.checked = true;
        lblInst.innerText = 'Insert granted';
    } else {
        checkInsert.checked = false;
        lblInst.innerText = 'Insert not granted';
    }

    if (dataob.upd) {
        checkUpdate.checked = true;
        lblUpd.innerText = 'Update granted';
    } else {
        checkUpdate.checked = false;
        lblUpd.innerText = 'Update not granted';
    }

    if (dataob.del) {
        checkDelete.checked = true;
        lblDel.innerText = 'Delete granted';
    } else {
        checkDelete.checked = false;
        lblDel.innerText = 'Delete not granted';
    }

    //disable submit button
     submitButton.style.visibility = "hidden";
     updateButton.style.visibility = "visible";



}

// row delete function
const rowDelete = (dataob, rowIndex) => {
    //browser eke msg box eka yes kaloth veriable ekata true weta no nam false weta. 
    const userResponce = window.confirm('Are you sure to delete following Privilege\n' +
        'Role is : ' + dataob.role_id.name
        + '\nModule is : ' + dataob.module_id.name
    );

    if (userResponce) {
        //sever responce
        const serverResponce = getHTTPServiceRequest("/privilege/delete", "DELETE", dataob);
        if (serverResponce == 'OK') {
            //delete msg eka
            alert('Privilege Delete Successfully...!');
            // table eka refresh kirima
            refreshPrivilegeTable();

        } else {
            alert('Privilege Delete Not Completed, You have following error ..! \n' +
                serverResponce);
        }
    }
}

//privilege table eka thula athi view button eke function eka
const privilegeRowView = (ob, index) => {
    console.log("View", ob, index);

    // html wala athi modal ekak open weema 
    privilegeRoleView.innerHTML = getRoleStatus(ob);
    moduleView.innerHTML = getModuleStatus(ob);
    selectView.innerHTML = getSel(ob);
    insertView.innerHTML = getInst(ob);
    updateView.innerHTML = getUpt(ob);
    deleteView.innerHTML = getDel(ob);
    $("#offcanvasBottomPrivilegeView").offcanvas("show");

}
//print offcanvas model eka thula athi print button eka function eka
const buttonPrintRow = () => {
    //aluth window ekak open kara ganima
    let newWindow = window.open();

    newWindow.document.write(`
            <html>
            <head>
                <title>Print View - Privilege Details</title>
                <!-- link bootstrp min css file -->
    <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">

    <!--link bootstrap js file  -->
    <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
    
                <!-- link css file -->
                    <link rel="stylesheet" href="/Style/printView.css">
                    
                    <!-- link Fontawasome css file -->
    <link rel="stylesheet" href="/fontawesome-free-6.4.2/css/all.css">
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

// creat function for refersh employee form
const refreshPrivilegeForm = () => {
    //Object ekak sada gena eyata form eka athi value add kirima
    privilege = new Object();

    role = getServiceRequest("/role/alldata");
    fillDataIntoSelect(selectRole, 'Select Role....!!', role, "name");

    module = getServiceRequest("/module/alldata");
    fillDataIntoSelect(selectModule, 'Select Module....!!', module, "name");






    checkSelect.checked = false;
    privilege.sel = false;
    lblSel.innerText = "Select privilege not Granted";

    checkInsert.checked = false;
    privilege.inst = false;
    lblInst.innerText = "Insert privilege not Granted";

    checkUpdate.checked = false;
    privilege.upd = false;
    lblUpd.innerText = "Update privilege not Granted";

    checkDelete.checked = false;
    privilege.del = false;
    lblDel.innerText = "Delete privilege not Granted";

    //Initilize dropdown color
    //meya for each ekak ha sambandawa define we athi nisa array ekaka data yewiya yuthuya
    setDefault([selectRole, selectModule]);

    //disable update button
    updateButton.style.visibility = "hidden";
    submitButton.style.visibility = "visible";

}

// creat function for check form error
const getPrivilegeFormError = () => {
    // need to check all requried field (property)
    let errors = '';

    if (privilege.role_id == null) {
        errors = errors + "Please Select role ...!\n";

    }

    if (privilege.module_id == null) {
        errors = errors + "Please Select module ...!\n";

    }

    return errors;

}

//create function from submit
const buttonPrivilageSubmit = () => {
    console.log('Add Privilege', privilege);
    //console.log(window['Privilege']);

    // need to check error
    // alert( getPrivilegeFormError() );
    const formErrors = getPrivilegeFormError();
    if (formErrors == '') {
        // need to get user confirmation

        // window confirmation msg eke select field ekata awashya value eka laba dema
        let selectStatus;
        if (privilege.sel) {
            selectStatus = "select granted";
        } else {
            selectStatus = "select not granted";
        }

        // window confirmation msg eke Insert field ekata awashya value eka laba dema
        let insertStatus;
        if (privilege.inst) {
            insertStatus = "Insert granted";
        } else {
            insertStatus = "Insert not granted";
        }

        // window confirmation msg eke Update field ekata awashya value eka laba dema
        let updateStatus;
        if (privilege.upd) {
            updateStatus = "Update granted";
        } else {
            updateStatus = "Update not granted";
        }

        // window confirmation msg eke Delete field ekata awashya value eka laba dema
        let deleteStatus;
        if (privilege.del) {
            deleteStatus = "Delete granted";
        } else {
            deleteStatus = "Delete not granted";
        }
        const confirmMsg = window.confirm('Are you sure to add following Privilege\n'
            + '\n Role is :' + privilege.role_id.name
            + '\n Module is :' + privilege.module_id.name
            + '\n Select is :' + selectStatus
            + '\n Insert is :' + insertStatus
            + '\n Update is :' + updateStatus
            + '\n Delete is :' + deleteStatus
        );

        //  const userConfirm = confirm(confirmMsg);

        if (confirmMsg) {
            // pass data into backend
            // check server respond
            const postServiceResponce = getHTTPServiceRequest("/privilege/insert", "POST", privilege);
            if (postServiceResponce == 'OK') {
                alert("Save Successfully....!");
                refreshPrivilegeTable();
                // refersh table

                // PrivilegeForm.reset();
                // reset form
                refreshPrivilegeForm();
                //refersh form

                $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas

            } else {
                alert('Save Not Completed..You have following error \n' + postServiceResponce);
            }

        }



    } else {

        //form has errors
        alert("Form has following errors \n" + formErrors);
    }







}

const checkFormUpdates = () => {
    let updates = "";
    // update check kirima sadaha object 2 k awashyai

    if (privilege != null && oldPrivilege != null) {
        if (privilege.role_id.name != oldPrivilege.role_id.name) {
            updates = updates + "Role is changed...! \n";
        }

        if (privilege.module_id.name != oldPrivilege.module_id.name) {
            updates = updates + "Module is changed...! \n";
        }

        if (privilege.sel != oldPrivilege.sel) {
            updates = updates + "Select privilege is changed...! \n";
        }

        if (privilege.inst != oldPrivilege.inst) {
            updates = updates + "Insert privilege is changed...! \n";
        }

        if (privilege.upd != oldPrivilege.upd) {
            updates = updates + "Update privilege is changed...! \n";
        }

        if (privilege.del != oldPrivilege.del) {
            updates = updates + "Delete privilege is changed...! \n";
        }

    }

    return updates;
}

const buttonPrivilageUpdate = () => {
    //check errors

    let errors = getPrivilegeFormError();
    if (errors == "") {
        let updates = checkFormUpdates();
        if (updates == "") {
            window.alert("Nothing to updat")
        } else {
            let userConfirm = window.confirm("Are you sure to update privilege..." + updates);
            if (userConfirm) {
                let pustServiceResponce = getHTTPServiceRequest("/privilege/update", "PUT", privilege);
                if (pustServiceResponce == "OK") {
                    alert("Update Successfully...!");
                    refreshPrivilegeForm();
                    refreshPrivilegeTable();
                    $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas
                } else {
                    window.alert("Faild to update , form has following error...\n" + pustServiceResponce);
                }
            }
        }
    } else {
        window.alert("Forms has following error...\n" + errors);

    }
}

// clear privilege form
const clearPrivilegeForm = () => {

    let userConfirm = window.confirm("Do you need to refresh form...?");
    if (userConfirm) {
        refreshPrivilegeForm();
    }
}