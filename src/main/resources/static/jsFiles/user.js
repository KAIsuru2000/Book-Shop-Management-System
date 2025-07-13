// browser onload event
window.addEventListener('load', () => {

    //tool tip active kirima sadaha
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function for refresh table
    refreshUserTable();

    // call form refresh function
    refreshUserForm();

});

//create function for refresh table
const refreshUserTable = () => {

    //controller wala hadapu service eka magin data array eka laba ganima
    const users = getServiceRequest("/user/alldata");

    //create display property list
    //data types
    //string => string / data / number
    //function => object / array / boolean
    displayPropertyList = [
        //function name ekak add karai call kirimak sidu nowe
        { dataType: 'function', propertyName: getEmployee },
        { dataType: 'string', propertyName: 'username' },
        { dataType: 'string', propertyName: 'email' },
        { dataType: 'function', propertyName: getRole },
        { dataType: 'function', propertyName: getuserStatus },
    ];

    // call tablefill function
    fillDataIntoTable(tableUserBody, users, displayPropertyList, userRowFormRefill, userRowDelete, userRowView, "#offcanvasBottom");

    //call jquerry data table
    $('#tableUser').dataTable();
}

const getEmployee = (dataob) => {
    if (dataob.employee_id != null) {
        return dataob.employee_id.fullname;
    } else {
        return "-";
    }

}

// table ekehi status eka penwimata 
const getuserStatus = (dataob) => {
    if (dataob.status) {
        return '<i class="fa-solid fa-circle-check fa-beat fa-xl" style="color: #02f707;"></i>'
    } else {
        return '<i class="fa-solid fa-circle-xmark fa-beat fa-xl" style="color: #fe0101;"></i>'
    }

}

//role enna list ekak lesaya ema nisa direct access kala noheka loop ekak yoda gani
//role list eke list eken ekak yanu single object ekak ema nisa property ekak thiyenawa godak unoth access karanna be 
//roles array eka thula object godak thibboth (chasier , manager) direct value ekak gatha noheka

const getRole = (dataob) => {
    //ewani awasthawaka wenama veriable ekak hada gani. initially(muladi) string
    let roles = "";
    // role list ekak ena nisa
    dataob.roles.forEach((role, index) => {
        if (dataob.roles.length - 1 == index) {
            //last role eken pasu "," ekak set nokarai
            roles = roles + role.name;
        } else {
            //roles veriable ekata concatinate kara ganimata role object eke name access karala
            //name athara gap ekak thaba gani
            roles = roles + role.name + " , ";
        }

    });
    //awasanaye roles object eka return karanawa
    return roles;
}



// form refill function
const userRowFormRefill = (dataob, rowIndex) => {
    console.log("Update");
    console.log(dataob);

   

    //amployee all data gana meya refill karai inpasu eya disable karai
    employees = getServiceRequest("/employee/alldata");
    fillDataIntoSelect(selectEmployee, 'Select Employee...!!!', employees, 'fullname');
    selectEmployee.disabled = true;
    selectEmployee.value = JSON.stringify(user.employee_id);

    //check box eka status eka true nam checked wela lable eke active wi thibiya yuthuya
    if (user.status) {
        checkboxUserStatus.checked = "checked";
        labelStatus.innerText = "User Account is Active";
    } else {
        checkboxUserStatus.checked = "";
        labelStatus.innerText = "User Account is In-Active";
    }

    //username penwima
    textUserName.value = dataob.username;
    //email penwima
    emailField.value = dataob.email;
    //note eka penwima eya optional nisa if else yadimata sidu wei
    if (dataob.note == null) {
        textNote.value = "";
    } else {
        textNote.value = dataob.note;
    }
    //password eka change kirimata nodei
    passwordField.disabled = true;
    rePasswordField.disabled = true;
    //role genarate wena gaman ema genarate wana ek ek role eka userge role ekata samanada balima
    //user form eke role dropdown ekata enna ona role tika ganima
    let roles = getServiceRequest("/role/listWithoutAdmin");
    // role list wala athi roles sadaha check box nirmanaya kirima
    let divRole = document.querySelector("#divRoles");
    //html eka athi static data tika clear kirima
    divRole.innerHTML = "";

    roles.forEach((role, index) => {

        //div element eka sada ganima
        let div = document.createElement("div");
        //ema div thulata classes add kara ganima
        div.className = "col-3";
        //eya loku div ekata append kirima
        divRole.appendChild(div);

        //input element eka sada ganima
        let inputCheck = document.createElement("input");
        //ema div thulata type add kara ganima
        inputCheck.type = "checkbox";
        inputCheck.id = role.id;
        //input ekata event handler ekak liwima - validation and data binding sadaha
        inputCheck.onclick = () => {

            //foreach ekak thula element eka access kirimata hekiyawa athi nisa this wenuwata inputCheck yodai
            console.log(inputCheck);

            if (inputCheck.checked) {
                //check nam new array ekata push kirima
                console.log("cccc");
                dataob.roles.push(role);
            } else {
                //array eke role eka thiyana thana soyagena iwath kirima
                //user.roles list eka thiyena eka role object ekak gannawa userrole widihata >> eken name eka gena indexOf magin check karanawa click kala role.name ekata samanada balima
                //samananam eya extIndexta laba dei
                console.log("bbbb");
                let extIndex = dataob.roles.map(userrole => userrole.name).indexOf(role.name);
                if (extIndex != -1) {
                    //!= -1 nam eya pawathi
                    //array.splice(index, count, item1, ....., itemX)
                    //index - Required.The index (position) to add or remove items.A negative value counts from the end of the array.
                    //count - Optional.Number of items to be removed.
                    //item1, ..., - Optional.The new elements(s) to be added.
                    dataob.roles.splice(extIndex, 1);
                }
            }

        }
    
                let extIndex = dataob.roles.map(userrole => userrole.name).indexOf(role.name);
                if (extIndex != -1) {
                    
                    inputCheck.checked =true;
                }
        //ema div thulata classes add kara ganima
        //eya podi div ekata append kirima
        div.appendChild(inputCheck);

        //label element eka sada ganima
        let label = document.createElement("label");
        //ema div thulata classes add kara ganima
        // label.className = "fw-bold";
        //label tula text eka add kirima
        label.innerText = role.name;
        //eya podi div ekata append kirima
        div.appendChild(label);




    });

    buttonUpdate.classList.remove("d-none");
    buttonSubmit.classList.add("d-none");

     //update eka sadaha compair kirimata user and olduser sada ganima
     user = JSON.parse(JSON.stringify(dataob));
     oldUser = JSON.parse(JSON.stringify(dataob));


}

// row delete function
const userRowDelete = (dataob, rowIndex) => {
    //delete sadaha confirmation ganima
    const userResponce = window.confirm('Are you sure to delete following user\n' +
        'Employee is : ' + dataob.username
        + '\nRole is : ' + getRole(dataob)
    );
    //userResponce veriable eka kohomath boolean ekaki
    if (userResponce) {
        //sever responce
        //common.js wala hadagath service request function eka call kirima 
        const serverResponce = getHTTPServiceRequest("/user/delete", "DELETE", dataob);

        if (serverResponce == "OK") {
            window.alert('User Delete Successfully...!');
            refreshUserTable();

        } else {
            window.alert('User Delete Not Completed, You have following error ..! \n' +
                serverResponce);
        }
    }
}

//user table eka thula athi view button eke function eka
const userRowView = (dataob, rowIndex) => {
    console.log("View", dataob, rowIndex);

    

    // html wala athi modal ekak open weema 
    employeeNameView.innerText = dataob.employee_id.fullname;

    //ewani awasthawaka wenama veriable ekak hada gani. initially(muladi) string
    let roles = "";
    // role list ekak ena nisa
    dataob.roles.forEach((role, index) => {
        if (dataob.roles.length - 1 == index) {
            //last role eken pasu "," ekak set nokarai
            roles = roles + role.name;
        } else {
            //roles veriable ekata concatinate kara ganimata role object eke name access karala
            //name athara gap ekak thaba gani
            roles = roles + role.name + " , ";
        }

    });
    document.getElementById("roleView").textContent = roles;

    if (dataob.status == true) {
        userStatusView.innerText = "Active";
    } else {
        userStatusView.innerText = "Inactive";
    }
    userNameView.innerText = dataob.username;
    

    $("#offcanvasBottomUserView").offcanvas("show"); // show the offcanvas
    
}
//print offcanvas model eka thula athi print button eka function eka
const buttonPrintRow = () => {

    //aluth window ekak open kara ganima
    let newWindow = window.open();

    newWindow.document.write(`
            <html>
            <head>
                <title>Print View - User Details</title>
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

// creat function for refersh user form
//mema function eka browser eka refresh wana thana call karai
//meya browser refresh function eka thula call karai 
const refreshUserForm = () => {

    //create object call employee
    // form ekata enter karana value mehi store we
    user = new Object();

    //findall walin ena user object eke athi role array eka new array ekakata dama ganima role validation sadaha
    user.roles = new Array();

    userForm.reset();

    //update waladi error check kirimedi olduser null nam pamanak repassword eka check wimata sada atha ehidi old user eka null wima mehidi sidu karai
    oldUser = null;

    //validation colors iwath kirima
    setDefault([selectEmployee, textUserName, passwordField, rePasswordField, emailField, textNote]);


    //user form eke employee dropdown ekata enna ona user account hedun nethi ayage list eka
    // employee list without user account
    //memagin employee side eka ayata user account sede
    // employee controller wala service eka liyai
    employeeListWithoutUserAccount = getServiceRequest("/employee/employeeListWithoutUserAccount");

    fillDataIntoSelect(selectEmployee, 'Select Employee...!!!', employeeListWithoutUserAccount, 'fullname');

    //status eka auto active wela thibiya yuthuya
    checkboxUserStatus.checked = "checked";

    //lable eke status eka maru wimata
    labelStatus.innerText = "User Account is Active";

    // user object eke property ekath wenas kirima
    user.status = true;

    //user form eke role dropdown ekata enna ona role tika ganima
    let roles = getServiceRequest("/role/listWithoutAdmin");
    // role list wala athi roles sadaha check box nirmanaya kirima
    let divRole = document.querySelector("#divRoles");
    //html eka athi static data tika clear kirima
    divRole.innerHTML = "";

    roles.forEach((role, index) => {

        //div element eka sada ganima
        let div = document.createElement("div");
        //ema div thulata classes add kara ganima
        div.className = "col-3";
        //eya loku div ekata append kirima
        divRole.appendChild(div);

        //input element eka sada ganima
        let inputCheck = document.createElement("input");
        //ema div thulata type add kara ganima
        inputCheck.type = "checkbox";
        //input ekata event handler ekak liwima - validation and data binding sadaha
        inputCheck.onclick = () => {

            //foreach ekak thula element eka access kirimata hekiyawa athi nisa this wenuwata inputCheck yodai
            console.log(inputCheck);

            if (inputCheck.checked) {
                //check nam new array ekata push kirima
                console.log("cccc");
                user.roles.push(role);
            } else {
                //array eke role eka thiyana thana soyagena iwath kirima
                //user.roles list eka thiyena eka role object ekak gannawa userrole widihata >> eken name eka gena indexOf magin check karanawa click kala role.name ekata samanada balima
                //samananam eya extIndexta laba dei
                console.log("bbbb");
                let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
                if (extIndex != -1) {
                    //!= -1 nam eya pawathi
                    //array.splice(index, count, item1, ....., itemX)
                    //index - Required.The index (position) to add or remove items.A negative value counts from the end of the array.
                    //count - Optional.Number of items to be removed.
                    //item1, ..., - Optional.The new elements(s) to be added.
                    user.roles.splice(extIndex, 1);
                }
            }

        }
        //ema div thulata classes add kara ganima
        //eya podi div ekata append kirima
        div.appendChild(inputCheck);

        //label element eka sada ganima
        let label = document.createElement("label");
        //ema div thulata classes add kara ganima
        // label.className = "fw-bold";
        //label tula text eka add kirima
        label.innerText = role.name;
        //eya podi div ekata append kirima
        div.appendChild(label);




    });

    //refill kirimedi disable kala ewa unable kala yuthuya
    selectEmployee.disabled = false;
    passwordField.disabled = false;
    rePasswordField.disabled = false;

    buttonUpdate.classList.add("d-none");
    buttonSubmit.classList.remove("d-none");

}

//define function for check user updates
const checkUserFormUpdate = () => {

    let updates = "";

    //mulinma veriable eka thibeda balima >> user and olduser >> compair kirima sadaha value thibiya yuthuya
    if (user != null && oldUser != null){
        if(user.username != oldUser.username){
            updates = updates + "Username is change...! \n";
        }
        if(user.email != oldUser.email){
            updates = updates + "email is change...! \n";
        }
        if(user.note != oldUser.note){
            updates = updates + "note is change...!! \n";
        }
        if(user.status != oldUser.status){
            updates = updates + "status is change...! \n";
        }
        if (user.roles.length != oldUser.roles.length) {
            updates = updates + "Role is change...! \n"; 
        } else {
            //suplier ekadi kiyala dei
        }
    }
    return updates;

}

//define function for update user
const buttonUserUpdate = () => {

    console.log("user" , user);
    console.log("oldUser" , oldUser);

    //need to check form error
    let errors = checkUserFormError();

    //get user confurmation
    if (errors == "") {

        let updates = checkUserFormUpdate();
        if (updates != "") {
            let userConfirm = window.confirm("Are you sure to update following user changes \n"
                + updates

            );

            //call post service
        if (userConfirm) {
            let putResponce = getHTTPServiceRequest("/user/update", "PUT", user);
            if (putResponce == "OK") {
                window.alert("User Added Successfully...!");
                refreshUserTable();
                refreshUserForm();
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

//define function for get user form error
const checkUserFormError = () => {
    let errors = "";

    if (user.username == null) {
        errors = errors + "Please Enter username...\n";
    }
    if (user.roles.length == 0) {
        errors = errors + "Please select role...\n";
    }
    if (user.password
        == null) {
        errors = errors + "Please enter password...\n";
    }
    if (user.email
        == null) {
        errors = errors + "Please enter email...\n";
    }
    if (oldUser == null) {
        if (rePasswordField.value == "") {
            errors = errors + "Please retype password...\n";
        }
    }
    

    return errors;
}

//define function for submit user object
const submitUserForm = () => {

    console.log(user);

    //need to check form error
    let errors = checkUserFormError();

    //get user confurmation
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add following user details"
            + "\n User name : " + user.username
            + "\n Email :" + user.email
        );

        //call post service
        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/user/insert", "POST", user);
            if (postResponce == "OK") {
                window.alert("User Added Successfully...!");
                refreshUserTable();
                refreshUserForm();
                $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas

            } else {
                window.alert("Fail to submit has following error\n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors \n" + errors);
    }

}

//define function re type validater
const textPasswordReTypeValidator = () => {

    // Navigate to the parent element and then to the associated span
    const prevElement = rePasswordField.previousElementSibling;

    if (passwordField.value == rePasswordField.value && passwordField.value != "") {
        rePasswordField.style.borderBottom = "4px solid green";
        prevElement.style.backgroundColor = "green";
        rePasswordField.classList.remove("is-invalid");
        rePasswordField.classList.add("is-valid");
        user.password = passwordField.value;

    } else {

        rePasswordField.style.borderBottom = "4px solid red";
        prevElement.style.backgroundColor = "red";
        rePasswordField.classList.add("is-invalid");
        rePasswordField.classList.remove("is-valid");
        user.password = null;
    }

}

const clearUserForm = () => {

    let userConfirm = window.confirm("Do you need to refresh form...?");
    if (userConfirm) {
        refreshUserForm();
    }
}







