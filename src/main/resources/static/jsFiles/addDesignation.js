// browser onload event
window.addEventListener('load', () => {

    //tool tip active kirima sadaha
    $('[data-bs-toggle="tooltip"]').tooltip();

    
    // call form refresh function
    refreshDesignationForm();

});








   

//     //amployee all data gana meya refill karai inpasu eya disable karai
//     employees = getServiceRequest("/employee/alldata");
//     fillDataIntoSelect(selectEmployee, 'Select Employee...!!!', employees, 'fullname');
//     selectEmployee.disabled = true;
//     selectEmployee.value = JSON.stringify(user.employee_id);

//     //check box eka status eka true nam checked wela lable eke active wi thibiya yuthuya
//     if (user.status) {
//         checkboxUserStatus.checked = "checked";
//         labelStatus.innerText = "User Account is Active";
//     } else {
//         checkboxUserStatus.checked = "";
//         labelStatus.innerText = "User Account is In-Active";
//     }

//     //username penwima
//     textUserName.value = dataob.username;
//     //email penwima
//     emailField.value = dataob.email;
//     //note eka penwima eya optional nisa if else yadimata sidu wei
//     if (dataob.note == null) {
//         textNote.value = "";
//     } else {
//         textNote.value = dataob.note;
//     }
//     //password eka change kirimata nodei
//     passwordField.disabled = true;
//     rePasswordField.disabled = true;
//     //role genarate wena gaman ema genarate wana ek ek role eka userge role ekata samanada balima
//     //user form eke role dropdown ekata enna ona role tika ganima
//     let roles = getServiceRequest("/role/listWithoutAdmin");
//     // role list wala athi roles sadaha check box nirmanaya kirima
//     let divRole = document.querySelector("#divRoles");
//     //html eka athi static data tika clear kirima
//     divRole.innerHTML = "";

//     roles.forEach((role, index) => {

//         //div element eka sada ganima
//         let div = document.createElement("div");
//         //ema div thulata classes add kara ganima
//         div.className = "col-3";
//         //eya loku div ekata append kirima
//         divRole.appendChild(div);

//         //input element eka sada ganima
//         let inputCheck = document.createElement("input");
//         //ema div thulata type add kara ganima
//         inputCheck.type = "checkbox";
//         inputCheck.id = role.id;
//         //input ekata event handler ekak liwima - validation and data binding sadaha
//         inputCheck.onclick = () => {

//             //foreach ekak thula element eka access kirimata hekiyawa athi nisa this wenuwata inputCheck yodai
//             console.log(inputCheck);

//             if (inputCheck.checked) {
//                 //check nam new array ekata push kirima
//                 console.log("cccc");
//                 dataob.roles.push(role);
//             } else {
//                 //array eke role eka thiyana thana soyagena iwath kirima
//                 //user.roles list eka thiyena eka role object ekak gannawa userrole widihata >> eken name eka gena indexOf magin check karanawa click kala role.name ekata samanada balima
//                 //samananam eya extIndexta laba dei
//                 console.log("bbbb");
//                 let extIndex = dataob.roles.map(userrole => userrole.name).indexOf(role.name);
//                 if (extIndex != -1) {
//                     //!= -1 nam eya pawathi
//                     //array.splice(index, count, item1, ....., itemX)
//                     //index - Required.The index (position) to add or remove items.A negative value counts from the end of the array.
//                     //count - Optional.Number of items to be removed.
//                     //item1, ..., - Optional.The new elements(s) to be added.
//                     dataob.roles.splice(extIndex, 1);
//                 }
//             }

//         }
    
//                 let extIndex = dataob.roles.map(userrole => userrole.name).indexOf(role.name);
//                 if (extIndex != -1) {
                    
//                     inputCheck.checked =true;
//                 }
//         //ema div thulata classes add kara ganima
//         //eya podi div ekata append kirima
//         div.appendChild(inputCheck);

//         //label element eka sada ganima
//         let label = document.createElement("label");
//         //ema div thulata classes add kara ganima
//         // label.className = "fw-bold";
//         //label tula text eka add kirima
//         label.innerText = role.name;
//         //eya podi div ekata append kirima
//         div.appendChild(label);




//     });

//     buttonUpdate.classList.remove("d-none");
//     buttonSubmit.classList.add("d-none");

//      //update eka sadaha compair kirimata user and olduser sada ganima
//      user = JSON.parse(JSON.stringify(dataob));
//      oldUser = JSON.parse(JSON.stringify(dataob));


// }


// creat function for refersh user form
//mema function eka browser eka refresh wana thana call karai
//meya browser refresh function eka thula call karai 
const refreshDesignationForm = () => {

    //create object call employee
    // form ekata enter karana value mehi store we
    designation = new Object();

    designationForm.reset();

    //update waladi error check kirimedi olduser null nam pamanak repassword eka check wimata sada atha ehidi old user eka null wima mehidi sidu karai
    oldDesignation = null;

    //validation colors iwath kirima
    setDefault([textDesignationName]);


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
                designation.roles.push(role);
            } else {
                //array eke role eka thiyana thana soyagena iwath kirima
                //user.roles list eka thiyena eka role object ekak gannawa userrole widihata >> eken name eka gena indexOf magin check karanawa click kala role.name ekata samanada balima
                //samananam eya extIndexta laba dei
                console.log("bbbb");
                let extIndex = designation.roles.map(userrole => userrole.name).indexOf(role.name);
                if (extIndex != -1) {
                    //!= -1 nam eya pawathi
                    //array.splice(index, count, item1, ....., itemX)
                    //index - Required.The index (position) to add or remove items.A negative value counts from the end of the array.
                    //count - Optional.Number of items to be removed.
                    //item1, ..., - Optional.The new elements(s) to be added.
                    designation.roles.splice(extIndex, 1);
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


//define function for get user form error
const checkDesignationFormError = () => {
    let errors = "";

    if (designation.name == null) {
        errors = errors + "Please Enter Designation Name...\n";
    }
    if (designation.roles.length == 0) {
        errors = errors + "Please select role...\n";
    }
    if (designation.useraccount == null) {
        errors = errors + "Please select create user account...\n";
    }
    

    return errors;
}

//define function for submit user object
const submitDesignationForm = () => {

    console.log(designation);

    //need to check form error
    let errors = checkDesignationFormError();

    //get user confurmation
    if (errors == "") {
        let designationConfirm = window.confirm("Are you sure to add following designation details"
            + "\n Designation name : " + designation.name
            + "\n Roles :" + designation.roles
        );

        //call post service
        if (designationConfirm) {
            let postResponce = getHTTPServiceRequest("/designation/insert", "POST", designation);
            if (postResponce == "OK") {
                window.alert("Designation Added Successfully...!");
                refreshDesignationForm();
                $("#offcanvasDesignation").offcanvas("hide"); // Close the offcanvas
                $("#offcanvasBottom").offcanvas("show"); // open the main offcanvas

                // designation dropdown eke data eka display kirima
                let designation = getServiceRequest('/designation/alldata')
                fillDataIntoSelect(selectDesignation, "Please Select Designation..!!", designation, "name");
                selectDesignation.value = JSON.stringify(designation[designation.length - 1]);
                employee.designation_id = designation[designation.length - 1];
                // status field eka sadaha validation colour eka laba deema
                prevElementSelectDesignation= selectDesignation.previousElementSibling;
                selectDesignation.style.borderBottom = "4px solid green";
                prevElementSelectDesignation.style.backgroundColor = "green";
                selectDesignation.classList.remove("is-invalid");
                selectDesignation.classList.add("is-valid");


            } else {
                window.alert("Fail to submit has following error\n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors \n" + errors);
    }

}



const clearDesignationForm = () => {

    let designationConfirm = window.confirm("Do you need to refresh form...?");
    if (designationConfirm) {
        refreshDesignationForm();
    }
}






