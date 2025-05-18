//validation function for text element
const textValidator = (element, dataPattern, object, property) => {

    // Navigate to the parent element and then to the associated span
    const prevElement = element.previousElementSibling;

    const elementValue = element.value;
    const regExp = new RegExp(dataPattern);
    // window eken object eka gena acses kirima
    const ob = window[object];

    if (elementValue != "") {
        if (regExp.test(elementValue)) {
            element.style.borderBottom = "4px solid green";
            prevElement.style.backgroundColor = "green";
            element.classList.remove("is-invalid");
            element.classList.add("is-valid");
            //  employee object ekata damima
            ob[property] = elementValue;
        } else {
            element.style.borderBottom = "4px solid red";
            prevElement.style.backgroundColor = "red";
            element.classList.add("is-invalid");
            element.classList.remove("is-valid");
            //employee object ekata null demima
            ob[property] = null;
        }
    } else {
        // ob[property] = null;
        if (element.required) {
            element.style.borderBottom = "4px solid red";
            prevElement.style.backgroundColor = "red";
            element.classList.add("is-invalid");
            element.classList.remove("is-valid");
            //employee object ekata null demima
            ob[property] = null;
        } else {
            element.style.borderBottom = "1px solid #ced4da";
            prevElement.style.backgroundColor = "black";
            element.classList.remove("is-invalid");
            element.classList.remove("is-valid");
            //employee object ekata empty demima
            ob[property] = null;
        }
    }
}



//validation function for static dropdown
const selectStaticElementValidater = (element, object, property) => {
    const elementValue = element.value;

    // Navigate to the parent element and then to the associated span
    const prevElement = element.previousElementSibling;

    // window eken object eka ganima
    const ob = window[object];

    if (elementValue != "") {
        element.style.borderBottom = "4px solid green";
        prevElement.style.backgroundColor = "green";
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");
        // static nisa kalinma value eka ei eya employee object ekata demima 
        ob[property] = elementValue;
    } else {
        element.style.borderBottom = "4px solid red";
        prevElement.style.backgroundColor = "red";
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        // employee object eka null kirima
        ob[property] = null;


    }

}

//validation function for daynamic dropdown
const selectDainamicElementValidater = (element, object, property) => {
    const elementValue = element.value;

    // Navigate to the parent element and then to the associated span
    const prevElement = element.previousElementSibling;

    //object = string ekaki , string ekak object ekak lesa direct use kala noheka window array ekan ema object eka illa gatha yuthuya eya poduwe ob walata dama gani
    const ob = window[object];



    if (elementValue != "") {
        element.style.borderBottom = "4px solid green";
        prevElement.style.backgroundColor = "green";
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");
        // dynamic ekaka value eka java script object ekak bawata change kara gathanyuthuya
        ob[property] = JSON.parse(elementValue); 
    } else {
        element.style.borderBottom = "4px solid red";
        prevElement.style.backgroundColor = "red";
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        //employee object ekata null diima
        ob[property] = null;
    }
}

//create function for validate checkbox
const checkBoxValidator = (element,pattern,object,property,checkValue,uncheckValue,lableId,labelCheckedMsg,labelUncheckedMsg)=>{

    if (element.checked) {
        window[object][property] = checkValue;
        if (lableId != undefined) {
            lableId.innerText = labelCheckedMsg;
        }
       

        
    } else{
        window[object][property] = uncheckValue ;
        if (lableId != undefined) {
            lableId.innerText = labelUncheckedMsg;
        }   
    }
 
}

